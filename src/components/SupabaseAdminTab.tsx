import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Table,
  ShoppingBag,
  Calendar,
  Store,
  Bike,
  User,
  Phone,
  Clock,
  ExternalLink,
  Trash2,
  Receipt,
  MessageSquare,
  IndianRupee,
  TrendingUp,
  Copy,
  Check,
  Filter,
  Users,
  Utensils,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  supabase,
  supabaseUrl,
  getLocalOrders,
  getLocalBookings,
  FoodOrderSubmission,
  BookingSubmission,
  getOrdersSql,
  getAppointmentsSql,
  LOCAL_ORDERS_KEY,
  LOCAL_BOOKINGS_KEY,
} from '../lib/supabaseClient';

export const SupabaseAdminTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'appointments' | 'revenue_breakdown'>('orders');
  const [orders, setOrders] = useState<FoodOrderSubmission[]>([]);
  const [appointments, setAppointments] = useState<BookingSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sqlNotice, setSqlNotice] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');
  const [copiedReport, setCopiedReport] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    setStatusMessage(null);
    setSqlNotice(null);

    // 1. Load local cached orders & bookings first so nothing is ever missed
    const cachedOrders = getLocalOrders();
    const cachedBookings = getLocalBookings();

    // 2. Fetch remote orders from Supabase
    let remoteOrders: FoodOrderSubmission[] = [];
    try {
      const res = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!res.error && res.data) {
        remoteOrders = res.data;
      } else if (res.error) {
        console.log('Supabase orders fetch notice:', res.error.message);
      }
    } catch (e) {
      console.log('Remote orders fetch error:', e);
    }

    // Merge remote orders with cached orders (avoid duplicate order_id)
    const combinedOrdersMap = new Map<string, FoodOrderSubmission>();
    cachedOrders.forEach((o) => combinedOrdersMap.set(o.order_id, o));
    remoteOrders.forEach((o) => combinedOrdersMap.set(o.order_id, o));

    const finalOrders = Array.from(combinedOrdersMap.values()).sort((a, b) => {
      const tA = new Date(a.created_at || '').getTime() || 0;
      const tB = new Date(b.created_at || '').getTime() || 0;
      return tB - tA;
    });
    setOrders(finalOrders);

    // 3. Fetch remote appointments from Supabase
    let remoteAppointments: BookingSubmission[] = [];
    try {
      const resApp = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!resApp.error && resApp.data) {
        remoteAppointments = resApp.data;
      } else {
        const fb = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        if (!fb.error && fb.data) {
          remoteAppointments = fb.data;
        }
      }
    } catch (e) {
      console.log('Remote appointments fetch error:', e);
    }

    const combinedBookingsMap = new Map<string, BookingSubmission>();
    cachedBookings.forEach((b) => {
      const key = `${b.phone}-${b.booking_date}-${b.booking_time}`;
      combinedBookingsMap.set(key, b);
    });
    remoteAppointments.forEach((b) => {
      const key = `${b.phone}-${b.booking_date}-${b.booking_time}`;
      combinedBookingsMap.set(key, b);
    });

    const finalBookings = Array.from(combinedBookingsMap.values()).sort((a, b) => {
      const tA = new Date(a.created_at || '').getTime() || 0;
      const tB = new Date(b.created_at || '').getTime() || 0;
      return tB - tA;
    });
    setAppointments(finalBookings);

    setLoading(false);
    setStatusMessage(
      `Loaded ${finalOrders.length} food orders and ${finalBookings.length} table bookings.`
    );
  };

  useEffect(() => {
    fetchAllData();

    const handleOrderUpdate = () => fetchAllData();
    window.addEventListener('sv_orders_updated', handleOrderUpdate);
    window.addEventListener('sv_bookings_updated', handleOrderUpdate);

    return () => {
      window.removeEventListener('sv_orders_updated', handleOrderUpdate);
      window.removeEventListener('sv_bookings_updated', handleOrderUpdate);
    };
  }, []);

  // Filter orders by time
  const now = new Date();
  const todayStr = now.toDateString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const filteredOrders = orders.filter((ord) => {
    if (timeFilter === 'all') return true;
    const ordDate = new Date(ord.created_at || '');
    if (isNaN(ordDate.getTime())) return true;
    if (timeFilter === 'today') {
      return ordDate.toDateString() === todayStr;
    }
    if (timeFilter === 'week') {
      return ordDate >= sevenDaysAgo;
    }
    return true;
  });

  // Financial & Revenue Metrics Calculations
  const totalRevenueAllTime = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  const filteredRevenue = filteredOrders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);
  
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.created_at || '');
    return !isNaN(d.getTime()) && d.toDateString() === todayStr;
  });
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const deliveryOrders = filteredOrders.filter((o) => o.order_type === 'delivery');
  const takeawayOrders = filteredOrders.filter((o) => o.order_type === 'takeaway');
  const deliveryRevenue = deliveryOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const takeawayRevenue = takeawayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const deliveryPct = filteredRevenue > 0 ? Math.round((deliveryRevenue / filteredRevenue) * 100) : 0;
  const takeawayPct = filteredRevenue > 0 ? 100 - deliveryPct : 0;

  const totalFoodItemsSold = filteredOrders.reduce((sum, ord) => {
    if (Array.isArray(ord.items)) {
      return sum + ord.items.reduce((s: number, it: any) => s + (Number(it.quantity) || 1), 0);
    }
    return sum;
  }, 0);

  const avgOrderValue = filteredOrders.length > 0 ? Math.round(filteredRevenue / filteredOrders.length) : 0;

  // Table bookings metrics
  const totalGuestsBooked = appointments.reduce((sum, a) => sum + (Number(a.guests_count) || 2), 0);

  // Copy Revenue Summary to clipboard
  const handleCopyRevenueReport = () => {
    const reportText = `📊 *SAHYADRI VAIBHAVA - ONLINE REVENUE REPORT*
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL ONLINE REVENUE (Orders Placed):* ₹${totalRevenueAllTime.toLocaleString('en-IN')}
📦 *Total Placed Orders:* ${orders.length}
📅 *Today's Revenue:* ₹${todayRevenue.toLocaleString('en-IN')} (${todayOrders.length} orders)
🛵 *Delivery Revenue:* ₹${deliveryOrders.reduce((s, o) => s + (Number(o.total) || 0), 0).toLocaleString('en-IN')} (${deliveryOrders.length} orders)
🏪 *Takeaway Revenue:* ₹${takeawayOrders.reduce((s, o) => s + (Number(o.total) || 0), 0).toLocaleString('en-IN')} (${takeawayOrders.length} orders)
🍽️ *Average Order Value:* ₹${avgOrderValue}
🍛 *Total Dishes Sold:* ${totalFoodItemsSold} items
🪑 *Table Bookings:* ${appointments.length} reservations (${totalGuestsBooked} dining guests)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated on: ${new Date().toLocaleString('en-IN')}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleClearLocalOrders = () => {
    if (window.confirm('Clear stored local orders list?')) {
      localStorage.removeItem(LOCAL_ORDERS_KEY);
      fetchAllData();
    }
  };

  const handleClearLocalBookings = () => {
    if (window.confirm('Clear stored local bookings list?')) {
      localStorage.removeItem(LOCAL_BOOKINGS_KEY);
      fetchAllData();
    }
  };

  return (
    <div className="space-y-4">
      {/* Backend & Live Sync Status Banner */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-xl space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Live Website Booking & Orders Dashboard</span>
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
              Supabase Project: uweqaagyfuxgqwycxjjm
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Real-time record of all placed website orders, customer contact information, and table appointment bookings.
        </p>
      </div>

      {/* 🌟 HERO TOTAL ONLINE REVENUE CARD 🌟 */}
      <div className="bg-gradient-to-br from-[#183B2B] via-[#143224] to-[#0D2017] text-white p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden border border-emerald-900/40">
        {/* Subtle background radial glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/10 pointer-events-none blur-2xl" />

        <div className="flex flex-wrap items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                <BarChart3 className="w-3 h-3" />
                <span>Total Online Revenue</span>
              </span>
              <span className="text-[11px] text-emerald-200/80">Website Orders Placed</span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                ₹{totalRevenueAllTime.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                across {orders.length} placed order{orders.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRevenueReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 shadow-2xs"
              title="Copy formatted revenue report to send or paste"
            >
              {copiedReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-200">Report Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copy Revenue Report</span>
                </>
              )}
            </button>

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-colors shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Visual Revenue Breakdown Progress Bar */}
        <div className="space-y-1.5 pt-1 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-medium text-emerald-200/90">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Home Delivery: ₹{deliveryRevenue.toLocaleString('en-IN')} ({deliveryPct}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>Takeaway / Pickup: ₹{takeawayRevenue.toLocaleString('en-IN')} ({takeawayPct}%)</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </span>
          </div>

          <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden flex p-0.5 border border-white/10">
            <div
              style={{ width: `${filteredRevenue > 0 ? deliveryPct : 50}%` }}
              className="h-full bg-emerald-400 rounded-l-full transition-all duration-500"
            />
            <div
              style={{ width: `${filteredRevenue > 0 ? takeawayPct : 50}%` }}
              className="h-full bg-amber-400 rounded-r-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* 4 Mini Analytic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Today's Revenue */}
        <div className="bg-white border border-stone-200 p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Today's Revenue
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium">
            {todayOrders.length} order{todayOrders.length === 1 ? '' : 's'} placed today
          </p>
        </div>

        {/* Metric 2: Average Order Value */}
        <div className="bg-white border border-stone-200 p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Avg Order Value
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-700">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium">{totalFoodItemsSold} dishes sold</p>
        </div>

        {/* Metric 3: Delivery Revenue */}
        <div className="bg-white border border-stone-200 p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Delivery Revenue
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Bike className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              ₹{deliveryRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium">{deliveryOrders.length} deliveries</p>
        </div>

        {/* Metric 4: Table Appointments / Guests */}
        <div className="bg-white border border-stone-200 p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Table Reservations
            </span>
            <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center text-purple-700">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {appointments.length}
            </span>
          </div>
          <p className="text-[10px] text-stone-500 font-medium">{totalGuestsBooked} dining guests</p>
        </div>
      </div>

      {/* Subtabs and Time Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-stone-200 pb-2.5">
        {/* Subtabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeSubTab === 'orders'
                ? 'bg-[#183B2B] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Food Orders ({filteredOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeSubTab === 'appointments'
                ? 'bg-[#183B2B] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Table Bookings ({appointments.length})</span>
          </button>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                timeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                timeFilter === 'today'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                timeFilter === 'week'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              7 Days
            </button>
          </div>

          {activeSubTab === 'orders' && orders.length > 0 && (
            <button
              onClick={handleClearLocalOrders}
              className="text-stone-400 hover:text-red-600 p-1.5 rounded transition-colors text-xs flex items-center gap-1"
              title="Clear Local Orders"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {activeSubTab === 'appointments' && appointments.length > 0 && (
            <button
              onClick={handleClearLocalBookings}
              className="text-stone-400 hover:text-red-600 p-1.5 rounded transition-colors text-xs flex items-center gap-1"
              title="Clear Local Bookings"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-2.5 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-700 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* VIEW 1: FOOD ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 bg-stone-50 rounded-xl border border-stone-200 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-200/70 flex items-center justify-center mx-auto text-stone-500">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-800">
                  {timeFilter === 'all'
                    ? 'No Food Orders Received Yet'
                    : `No Food Orders Placed for "${timeFilter === 'today' ? 'Today' : 'Last 7 Days'}"`}
                </p>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  When a customer adds dishes to their cart and clicks <strong>"Place Order"</strong>, their full order details (items, customer phone, address, and total revenue) appear here instantly!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.order_id}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#183B2B]/10 text-[#183B2B] px-2 py-0.5 rounded">
                        {ord.order_id}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                          ord.order_type === 'delivery'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {ord.order_type === 'delivery' ? (
                          <>
                            <Bike className="w-3 h-3" />
                            <span>Home Delivery</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3 h-3" />
                            <span>Takeaway / Pickup</span>
                          </>
                        )}
                      </span>
                      <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Order Placed</span>
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div className="text-xs">
                        <span className="text-stone-400 text-[11px]">Placed on: </span>
                        <span className="font-medium text-stone-700">
                          {ord.created_at
                            ? new Date(ord.created_at).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-[#FAF8F5] p-2.5 rounded-lg border border-stone-200/70">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-semibold text-stone-900">{ord.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <a
                        href={`tel:${ord.mobile_number}`}
                        className="font-mono font-medium text-[#183B2B] hover:underline"
                      >
                        +91 {ord.mobile_number}
                      </a>
                    </div>
                    {ord.address && (
                      <div className="sm:col-span-2 text-[11px] text-stone-600 border-t border-stone-200 pt-1">
                        <span className="font-semibold text-stone-700">Delivery Address: </span>
                        <span>{ord.address}</span>
                        {ord.landmark && (
                          <span className="italic text-stone-500"> (Landmark: {ord.landmark})</span>
                        )}
                      </div>
                    )}
                    {ord.special_instructions && (
                      <div className="sm:col-span-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded">
                        <strong>Notes: </strong>
                        {ord.special_instructions}
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Dishes Ordered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(ord.items) &&
                        ord.items.map((item: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 border border-stone-200"
                          >
                            <span>{item.name}</span>
                            <span className="font-bold text-[#183B2B]">×{item.quantity}</span>
                            <span className="text-stone-400 text-[10px]">
                              (₹{item.price * item.quantity})
                            </span>
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Total Bill Row & Admin Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-medium">Order Total / Revenue:</span>
                      <span className="font-mono text-base font-bold text-[#183B2B] tabular-nums bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ₹{ord.total}
                      </span>
                      <span className="text-[10px] text-stone-400">(Pay on Delivery/Counter)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `🔔 *ORDER UPDATE (${ord.order_id})*\nCustomer: ${ord.customer_name} (+91 ${ord.mobile_number})\nType: ${ord.order_type}\nTotal Revenue: ₹${ord.total}\nItems: ${
                            Array.isArray(ord.items)
                              ? ord.items.map((i: any) => `${i.name} × ${i.quantity}`).join(', ')
                              : ''
                          }`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        <span>Send WhatsApp Details</span>
                      </a>

                      <a
                        href={`tel:${ord.mobile_number}`}
                        className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Phone className="w-3 h-3 text-stone-600" />
                        <span>Call Customer</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: TABLE APPOINTMENTS */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="text-center py-10 bg-stone-50 rounded-xl border border-stone-200 p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-200/70 flex items-center justify-center mx-auto text-stone-500">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-stone-800">No Appointments Recorded Yet</p>
              <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                When customers book a table via the <strong>"Book Table / Visit"</strong> modal or contact form, submissions appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Name</th>
                    <th className="py-2.5 px-3 font-semibold">Phone</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                    <th className="py-2.5 px-3 font-semibold">Guests</th>
                    <th className="py-2.5 px-3 font-semibold">Notes</th>
                    <th className="py-2.5 px-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {appointments.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-medium text-stone-900">{row.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[#183B2B]">
                        <a href={`tel:${row.phone}`} className="hover:underline">
                          +91 {row.phone}
                        </a>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {row.inquiry_type || 'Table'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">
                        {row.booking_date || '-'} {row.booking_time ? `@ ${row.booking_time}` : ''}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold">{row.guests_count || 2} guests</td>
                      <td className="py-2.5 px-3 text-stone-500 max-w-xs truncate">{row.message || '-'}</td>
                      <td className="py-2.5 px-3">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `📅 *TABLE BOOKING CONFIRMATION*\nGuest: ${row.name} (+91 ${row.phone})\nDate: ${row.booking_date} at ${row.booking_time}\nParty: ${row.guests_count || 2} Guests\nSahyadri Vaibhava Vegetarian Restaurant`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Supabase Schema Helper Dropdown */}
      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-[#183B2B]" />
            <span>Supabase Database Schema Setup (Optional)</span>
          </span>
          <button
            onClick={() => setSqlNotice(sqlNotice ? null : 'show')}
            className="text-[11px] text-[#183B2B] font-semibold underline"
          >
            {sqlNotice ? 'Hide SQL Code' : 'View SQL to create Tables'}
          </button>
        </div>

        {sqlNotice && (
          <div className="space-y-3 pt-2">
            <div>
              <p className="text-[11px] font-semibold text-stone-700">1. Orders Table SQL:</p>
              <div className="bg-stone-900 text-stone-100 p-2.5 rounded font-mono text-[10px] overflow-x-auto mt-1 relative">
                <pre>{getOrdersSql()}</pre>
                <button
                  onClick={() => navigator.clipboard.writeText(getOrdersSql())}
                  className="mt-1.5 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded hover:bg-emerald-700"
                >
                  Copy Orders SQL
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-stone-700">2. Appointments Table SQL:</p>
              <div className="bg-stone-900 text-stone-100 p-2.5 rounded font-mono text-[10px] overflow-x-auto mt-1 relative">
                <pre>{getAppointmentsSql()}</pre>
                <button
                  onClick={() => navigator.clipboard.writeText(getAppointmentsSql())}
                  className="mt-1.5 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded hover:bg-emerald-700"
                >
                  Copy Appointments SQL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

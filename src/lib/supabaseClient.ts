import { createClient } from '@supabase/supabase-js';

// Supabase project configurations provided by user
const SUPABASE_PROJECT_ID = 'uweqaagyfuxgqwycxjjm';
const DEFAULT_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_KEY = 'sb_publishable_mqPd5Yha-8I2xHoOPH_BGw_2si7nB8W';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const LOCAL_ORDERS_KEY = 'sv_placed_orders_v1';
export const LOCAL_BOOKINGS_KEY = 'sv_placed_bookings_v1';

export interface BookingSubmission {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  inquiry_type: string;
  message?: string;
  guests_count?: number;
  booking_date?: string;
  booking_time?: string;
  created_at?: string;
}

export interface FoodOrderSubmission {
  id?: string;
  order_id: string;
  customer_name: string;
  mobile_number: string;
  order_type: string;
  address?: string;
  landmark?: string;
  special_instructions?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  packaging_fee: number;
  delivery_fee: number;
  total: number;
  created_at?: string;
  status?: string;
}

/**
 * Local cache helpers so orders and bookings never get lost
 */
export function getLocalOrders(): FoodOrderSubmission[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalOrder(order: FoodOrderSubmission) {
  try {
    const list = getLocalOrders();
    const updated = [order, ...list.filter((o) => o.order_id !== order.order_id)];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
    // Trigger custom event so open dashboards update in real time
    window.dispatchEvent(new Event('sv_orders_updated'));
  } catch (e) {
    console.error('Failed to save order locally', e);
  }
}

export function getLocalBookings(): BookingSubmission[] {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalBooking(booking: BookingSubmission) {
  try {
    const list = getLocalBookings();
    const updated = [booking, ...list];
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sv_bookings_updated'));
  } catch (e) {
    console.error('Failed to save booking locally', e);
  }
}

/**
 * Saves a table reservation / appointment booking form entry to Supabase & Local Cache.
 */
export async function saveAppointmentBooking(booking: BookingSubmission) {
  const payload: BookingSubmission = {
    id: booking.id || `app-${Date.now()}`,
    name: booking.name,
    phone: booking.phone,
    email: booking.email || undefined,
    inquiry_type: booking.inquiry_type || 'Table Reservation',
    message: booking.message || undefined,
    guests_count: booking.guests_count || 2,
    booking_date: booking.booking_date || new Date().toISOString().split('T')[0],
    booking_time: booking.booking_time || '19:00',
    created_at: new Date().toISOString(),
  };

  // 1. Immediately store in local cache so user sees it right away in dashboard
  saveLocalBooking(payload);

  // 2. Insert into Supabase table
  try {
    const primaryAttempt = await supabase.from('appointments').insert([payload]).select();
    if (!primaryAttempt.error) {
      return { success: true, data: primaryAttempt.data, table: 'appointments' };
    }

    // Try fallback table bookings
    const fallbackAttempt = await supabase.from('bookings').insert([payload]).select();
    if (!fallbackAttempt.error) {
      return { success: true, data: fallbackAttempt.data, table: 'bookings' };
    }

    return {
      success: true,
      savedLocally: true,
      error: primaryAttempt.error,
      table: 'local_storage',
      helperSql: getAppointmentsSql(),
    };
  } catch (err: any) {
    return {
      success: true,
      savedLocally: true,
      error: err,
      table: 'local_storage',
      helperSql: getAppointmentsSql(),
    };
  }
}

/**
 * Saves a food order to Supabase orders table & Local cache.
 */
export async function saveFoodOrderToSupabase(order: FoodOrderSubmission) {
  const orderWithTime: FoodOrderSubmission = {
    ...order,
    created_at: order.created_at || new Date().toISOString(),
    status: order.status || 'Received',
  };

  // 1. Save to local storage first so it shows up in dashboard instantly
  saveLocalOrder(orderWithTime);

  // 2. Also send to Supabase 'orders' table
  try {
    const res = await supabase.from('orders').insert([orderWithTime]).select();
    if (!res.error) {
      return { success: true, data: res.data, table: 'orders' };
    }

    console.warn('Supabase orders table notice:', res.error);
    return {
      success: true,
      savedLocally: true,
      error: res.error,
      helperSql: getOrdersSql(),
    };
  } catch (err) {
    console.warn('Supabase order error:', err);
    return { success: true, savedLocally: true, error: err, helperSql: getOrdersSql() };
  }
}

export function getAppointmentsSql() {
  return `CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  inquiry_type TEXT DEFAULT 'Table Reservation',
  message TEXT,
  guests_count INTEGER DEFAULT 2,
  booking_date DATE,
  booking_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insertions" ON appointments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public reads" ON appointments FOR SELECT TO anon USING (true);`;
}

export function getOrdersSql() {
  return `CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  order_type TEXT NOT NULL,
  address TEXT,
  landmark TEXT,
  special_instructions TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC,
  packaging_fee NUMERIC,
  delivery_fee NUMERIC,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Received',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insertions" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public reads" ON orders FOR SELECT TO anon USING (true);`;
}

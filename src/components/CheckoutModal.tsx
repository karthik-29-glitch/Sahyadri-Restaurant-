import React, { useState } from 'react';
import { X, Store, Bike, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem, OrderType, OrderDetails } from '../types';
import { saveFoodOrderToSupabase } from '../lib/supabaseClient';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: OrderType;
  onSetOrderType: (type: OrderType) => void;
  onOrderPlaced: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  onSetOrderType,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );
  const packagingFee = cartItems.length > 0 ? 15 : 0;
  const deliveryFee = orderType === 'delivery' && cartItems.length > 0 ? 30 : 0;
  const total = subtotal + packagingFee + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your full name';
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (orderType === 'delivery') {
      if (!address.trim()) {
        newErrors.address = 'Please provide your delivery address in Chandapura / Iggalur / Anekal area';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SV-${new Date().getFullYear()}-${randomSuffix}`;

    const newOrder: OrderDetails = {
      orderId,
      customerName: customerName.trim(),
      mobileNumber: cleanPhone,
      orderType,
      address: orderType === 'delivery' ? address.trim() : undefined,
      landmark: orderType === 'delivery' && landmark.trim() ? landmark.trim() : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      items: [...cartItems],
      subtotal,
      packagingFee,
      deliveryFee,
      total,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'received',
    };

    // Also send copy to Supabase backend asynchronously
    saveFoodOrderToSupabase({
      order_id: orderId,
      customer_name: newOrder.customerName,
      mobile_number: newOrder.mobileNumber,
      order_type: newOrder.orderType,
      address: newOrder.address,
      landmark: newOrder.landmark,
      special_instructions: newOrder.specialInstructions,
      items: newOrder.items.map((i) => ({
        id: i.item.id,
        name: i.item.name,
        price: i.item.price,
        quantity: i.quantity,
      })),
      subtotal: newOrder.subtotal,
      packaging_fee: newOrder.packagingFee,
      delivery_fee: newOrder.deliveryFee,
      total: newOrder.total,
    }).catch((err) => console.log('Order Supabase sync notice:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-0">
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative z-10 border border-stone-200">
          {/* Header */}
          <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-stone-900">
                Complete Your Order
              </h3>
              <p className="text-xs text-stone-500">
                Sahyadri Vaibhava · Fast Kitchen Preparation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Type Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block">
                How would you like to receive your food?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSetOrderType('takeaway');
                    setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    orderType === 'takeaway'
                      ? 'border-[#183B2B] bg-[#183B2B]/5 text-[#183B2B]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#183B2B]" />
                  <div className="text-left">
                    <span className="block leading-tight">Takeaway / Pickup</span>
                    <span className="text-[10px] font-normal text-stone-500">At restaurant counter</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSetOrderType('delivery')}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all ${
                    orderType === 'delivery'
                      ? 'border-[#183B2B] bg-[#183B2B]/5 text-[#183B2B]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Bike className="w-4 h-4 text-[#183B2B]" />
                  <div className="text-left">
                    <span className="block leading-tight">Delivery</span>
                    <span className="text-[10px] font-normal text-stone-500">To your door</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({ ...errors, customerName: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20 ${
                      errors.customerName
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-stone-200 bg-white'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setMobileNumber(val);
                        if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' });
                      }}
                      className={`w-full pl-11 pr-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20 ${
                        errors.mobileNumber
                          ? 'border-red-400 bg-red-50/30'
                          : 'border-stone-200 bg-white'
                      }`}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address (Conditional) */}
              {orderType === 'delivery' && (
                <div className="space-y-3 pt-1 border-t border-stone-100">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House/Flat No., Building name, Street, Area near Chandapura/Anekal Road"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors({ ...errors, address: '' });
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20 ${
                        errors.address
                          ? 'border-red-400 bg-red-50/30'
                          : 'border-stone-200 bg-white'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Opposite JPM Nursery, Near Iggalur Gate, etc."
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                    />
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medium spice, extra coconut chutney, pack sambar separately"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                />
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-[#183B2B]">{cartItems.length} items</span>
              </h4>

              <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-stone-600 pr-1 divide-y divide-stone-100">
                {cartItems.map(({ item, quantity }) => (
                  <div key={item.id} className="pt-1.5 first:pt-0 flex justify-between">
                    <span className="truncate pr-2">
                      {item.name} <span className="font-semibold">× {quantity}</span>
                    </span>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      ₹{item.price * quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hygienic Packaging</span>
                  <span className="tabular-nums font-medium text-stone-900">₹{packagingFee}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums font-medium text-stone-900">₹{deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="tabular-nums text-[#183B2B] text-base">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Back to Cart
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-lg bg-[#183B2B] hover:bg-[#122A1E] text-white text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Place Order (₹{total})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

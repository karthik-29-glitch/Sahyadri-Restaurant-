import React, { useState } from 'react';
import { CheckCircle2, Phone, MessageSquare, MapPin, ArrowRight, Share2, Receipt, Copy, Check, ExternalLink } from 'lucide-react';
import { OrderDetails, RestaurantConfig } from '../types';

interface OrderConfirmationModalProps {
  order: OrderDetails | null;
  restaurant: RestaurantConfig;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  restaurant,
  onClose,
}) => {
  if (!order) return null;

  const [copied, setCopied] = useState(false);

  // Generate clean, highly-detailed order text
  const generateOrderMessage = () => {
    const itemsList = order.items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.item.name}* × ${i.quantity} = ₹${i.item.price * i.quantity}`
      )
      .join('\n');

    const addressText =
      order.orderType === 'delivery'
        ? `\n📍 *Delivery Address:* ${order.address}${
            order.landmark ? `\n🏷️ *Landmark:* ${order.landmark}` : ''
          }`
        : '\n🏪 *Order Mode:* Takeaway / Counter Pickup';

    const specialInst = order.specialInstructions
      ? `\n📝 *Customer Instructions:* ${order.specialInstructions}`
      : '';

    return `🔔 *NEW FOOD ORDER RECEIVED* 🔔
*Restaurant:* Sahyadri Vaibhava
*Order ID:* ${order.orderId}
*Time:* ${order.createdAt}

👤 *CUSTOMER DETAILS:*
• Name: *${order.customerName}*
• Phone: *+91 ${order.mobileNumber}*${addressText}

🍛 *ITEMS ORDERED:*
${itemsList}

💰 *BILL DETAILS:*
• Items Subtotal: ₹${order.subtotal}
• Packaging: ₹${order.packagingFee}${
      order.orderType === 'delivery' ? `\n• Delivery Fee: ₹${order.deliveryFee}` : ''
    }
*👉 GRAND TOTAL: ₹${order.total}*${specialInst}

_Order placed via Sahyadri Vaibhava Online Portal_`;
  };

  const messageText = generateOrderMessage();
  const whatsappUrl = `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-0">
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" />

        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative z-10 border border-stone-200">
          {/* Top Banner */}
          <div className="bg-[#183B2B] text-white p-6 text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl">Order Received!</h3>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Thank you! Details have been saved & sent to the admin.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* WhatsApp Direct Notification Callout */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                  <span>Admin WhatsApp Notification</span>
                </span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-mono font-semibold">
                  To: +{restaurant.whatsappNumber}
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                A complete description message has been generated with dish details, customer phone, address, and bill.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>Send Message on WhatsApp</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="flex items-center gap-1 py-2 px-3 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Identifiers */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 block uppercase font-medium tracking-wider text-[10px]">
                  Order Reference
                </span>
                <span className="font-mono font-bold text-stone-900 text-sm">{order.orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block uppercase font-medium tracking-wider text-[10px]">
                  Order Mode
                </span>
                <span className="font-semibold text-[#183B2B] capitalize">
                  {order.orderType === 'takeaway' ? 'Takeaway / Pickup' : 'Home Delivery'}
                </span>
              </div>
            </div>

            {/* Customer & Location */}
            <div className="space-y-1.5 text-xs text-stone-600 bg-[#FAF8F5] p-3 rounded-lg border border-stone-200/80">
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-semibold text-stone-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Contact Number:</span>
                <span className="font-semibold text-stone-900 tabular-nums">+91 {order.mobileNumber}</span>
              </div>
              {order.address && (
                <div className="pt-1 border-t border-stone-200 flex flex-col gap-0.5">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="font-medium text-stone-800">{order.address}</span>
                  {order.landmark && (
                    <span className="text-stone-500 italic">Landmark: {order.landmark}</span>
                  )}
                </div>
              )}
              {order.specialInstructions && (
                <div className="pt-1 border-t border-stone-200 flex justify-between">
                  <span className="text-stone-500">Cooking Notes:</span>
                  <span className="font-medium text-stone-800">{order.specialInstructions}</span>
                </div>
              )}
            </div>

            {/* Itemized List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#183B2B]" />
                <span>Items Ordered</span>
              </h4>

              <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs text-stone-700 pr-1 divide-y divide-stone-100">
                {order.items.map(({ item, quantity }) => (
                  <div key={item.id} className="pt-1.5 first:pt-0 flex justify-between items-center">
                    <span className="truncate pr-3">
                      {item.name} <span className="text-stone-500 font-semibold">× {quantity}</span>
                    </span>
                    <span className="tabular-nums font-semibold text-stone-900 shrink-0">
                      ₹{item.price * quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Total */}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
                <span>Grand Total Amount</span>
                <span className="tabular-nums text-lg text-[#183B2B]">₹{order.total}</span>
              </div>
            </div>

            {/* Quick Actions (Call, Directions, Home) */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#183B2B]" />
                  <span>Call Restaurant</span>
                </a>

                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#183B2B]" />
                  <span>Get Directions</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
              >
                Back to Home / Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShoppingBag, ArrowRight, Phone, Utensils } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FloatingMobileBarProps {
  cartCount: number;
  cartTotal: number;
  restaurant: RestaurantConfig;
  onOpenCart: () => void;
  onOpenBookingModal: () => void;
}

export const FloatingMobileBar: React.FC<FloatingMobileBarProps> = ({
  cartCount,
  cartTotal,
  restaurant,
  onOpenCart,
  onOpenBookingModal,
}) => {
  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40">
      {cartCount > 0 ? (
        <button
          onClick={onOpenCart}
          className="w-full bg-[#183B2B] text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between border border-emerald-950/40 active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block leading-none">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-[11px] text-emerald-200 block mt-0.5 font-semibold tabular-nums">
                ₹{cartTotal} + Taxes/Pack
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-lg">
            <span>View Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      ) : (
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg rounded-xl p-2 flex items-center gap-2">
          <a
            href="#menu"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#183B2B] text-white text-xs font-semibold whitespace-nowrap"
          >
            <Utensils className="w-3.5 h-3.5 text-[#C88729]" />
            <span>Order Food</span>
          </a>

          <button
            onClick={onOpenBookingModal}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#FAF8F5] border border-stone-300 text-stone-800 text-xs font-semibold whitespace-nowrap"
          >
            <span>Book Table</span>
          </button>

          <a
            href={`tel:${restaurant.phone}`}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium shrink-0"
            title="Call Restaurant"
          >
            <Phone className="w-3.5 h-3.5 text-[#183B2B]" />
          </a>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Bike, Store } from 'lucide-react';
import { CartItem, OrderType } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: OrderType;
  onSetOrderType: (type: OrderType) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  onSetOrderType,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );
  const packagingFee = cartItems.length > 0 ? 15 : 0;
  const deliveryFee = orderType === 'delivery' && cartItems.length > 0 ? 30 : 0;
  const total = subtotal + packagingFee + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#183B2B]/10 flex items-center justify-center text-[#183B2B]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-stone-900">Your Order</h2>
                <p className="text-xs text-stone-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {cartItems.length === 0 ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-stone-800">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Explore our authentic vegetarian dosas, royal meals, fresh curries and beverages to add your favorites.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#183B2B] text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-[#122A1E] transition-colors"
              >
                Browse Our Menu
              </button>
            </div>
          ) : (
            <>
              {/* Order Mode Selector */}
              <div className="px-5 py-3 bg-stone-50 border-b border-stone-200/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                  Select Order Mode:
                </span>
                <div className="grid grid-cols-2 gap-2 bg-stone-200/60 p-1 rounded-lg">
                  <button
                    onClick={() => onSetOrderType('takeaway')}
                    className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                      orderType === 'takeaway'
                        ? 'bg-white text-[#183B2B] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Takeaway / Pickup</span>
                  </button>
                  <button
                    onClick={() => onSetOrderType('delivery')}
                    className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                      orderType === 'delivery'
                        ? 'bg-white text-[#183B2B] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Local Delivery</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-stone-100">
                {cartItems.map(({ item, quantity }) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>
                          ₹{item.price} × {quantity}
                        </span>
                        <span className="font-semibold text-stone-900 tabular-nums">
                          ₹{item.price * quantity}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums text-stone-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details & Footer */}
              <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF8F5] space-y-3">
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="tabular-nums font-medium text-stone-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hygienic Packaging</span>
                    <span className="tabular-nums font-medium text-stone-900">₹{packagingFee}</span>
                  </div>
                  {orderType === 'delivery' ? (
                    <div className="flex justify-between">
                      <span>Local Delivery Charge</span>
                      <span className="tabular-nums font-medium text-stone-900">₹{deliveryFee}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-emerald-700">
                      <span>Pickup at Counter</span>
                      <span>FREE</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                    <span>Total Bill</span>
                    <span className="tabular-nums text-base text-[#183B2B]">₹{total}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={onClearCart}
                    className="px-3 py-2.5 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onProceedToCheckout}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#183B2B] hover:bg-[#122A1E] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    <span>Proceed to Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

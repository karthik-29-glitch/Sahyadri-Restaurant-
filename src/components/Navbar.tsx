import React, { useState } from 'react';
import { ShoppingBag, Phone, Menu as MenuIcon, X, SlidersHorizontal, MapPin } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface NavbarProps {
  restaurant: RestaurantConfig;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOwnerModal: () => void;
  onOpenBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  restaurant,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenOwnerModal,
  onOpenBookingModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location & Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Banner with Timings & Location */}
      <div className="bg-[#183B2B] text-[#E8F0EA] text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {restaurant.timings}
            </span>
            <span className="hidden sm:inline opacity-60">·</span>
            <span className="hidden sm:inline opacity-90">100% Pure Vegetarian & Family Dining</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D97706]" />
              <span className="tabular-nums">{restaurant.displayPhone}</span>
            </a>
            <button
              onClick={onOpenOwnerModal}
              title="Restaurant Owner Settings"
              className="hidden md:flex items-center gap-1 opacity-80 hover:opacity-100 hover:text-white transition-opacity text-[11px]"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Owner Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a href="#home" className="flex flex-col group">
            <span className="font-display text-2xl sm:text-2xl font-bold tracking-tight text-[#183B2B] group-hover:text-[#122A1E] transition-colors">
              {restaurant.name}
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#C88729]">
              Pure Vegetarian · Family Restaurant
            </span>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#183B2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#183B2B] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            {/* Book Table / Appointment CTA */}
            <button
              onClick={onOpenBookingModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#183B2B] bg-[#183B2B]/10 hover:bg-[#183B2B] hover:text-white rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Book Table</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              aria-label="View Shopping Cart"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-stone-200 text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#183B2B]" />
              <span className="text-xs font-semibold tabular-nums">
                {cartCount > 0 ? (
                  <>
                    <span className="text-[#183B2B]">{cartCount} items</span>
                    <span className="opacity-40">·</span>
                    <span className="text-stone-900">₹{cartTotal}</span>
                  </>
                ) : (
                  <span className="text-stone-600">Cart (0)</span>
                )}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#183B2B] text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now CTA */}
            <a
              href="#menu"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#183B2B] hover:bg-[#122A1E] rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
            >
              Order Now
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-5 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-stone-800 hover:bg-[#FAF7F2] hover:text-[#183B2B] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="text-left px-3 py-2 rounded-md text-sm font-semibold text-[#183B2B] hover:bg-[#FAF7F2] transition-colors"
              >
                📅 Book Table / Appointment (Supabase)
              </button>
            </nav>

            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <a
                href="#menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-[#183B2B] rounded-lg shadow-xs"
              >
                Order Online Now
              </a>
              <div className="flex items-center justify-between text-xs text-stone-600 px-1 pt-1">
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-1.5 text-stone-800 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#183B2B]" />
                  <span>Call {restaurant.displayPhone}</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOwnerModal();
                  }}
                  className="flex items-center gap-1 text-[#C88729] font-medium"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Owner Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

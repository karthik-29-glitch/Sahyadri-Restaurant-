import React from 'react';
import { MapPin, Phone, Clock, Navigation, Heart, ShieldCheck } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FooterProps {
  restaurant: RestaurantConfig;
  onOpenOwnerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ restaurant, onOpenOwnerModal }) => {
  return (
    <footer className="bg-[#191614] text-stone-300 pt-14 pb-20 md:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold tracking-tight text-white block">
                {restaurant.name}
              </span>
              <p className="text-xs uppercase tracking-wider text-[#C88729] font-medium">
                Vegetarian Restaurant • Family Dining
              </p>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Serving freshly prepared South Indian dosas, idlis, royal thali meals, and North Indian curries for breakfast, lunch, and dinner.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-400">
              <div className="w-3.5 h-3.5 border border-emerald-500 rounded-xs flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
              <span>100% Pure Vegetarian Kitchen</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Food Menu & Order
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Restaurant Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Location & Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Orders
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C88729] shrink-0" />
                <a
                  href={`tel:${restaurant.phone}`}
                  className="hover:text-white transition-colors tabular-nums"
                >
                  {restaurant.displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C88729] shrink-0" />
                <span>{restaurant.timings}</span>
              </div>
              <div className="pt-1">
                <button
                  onClick={onOpenOwnerModal}
                  className="text-stone-400 hover:text-stone-200 underline text-[11px]"
                >
                  Restaurant Owner Mode
                </button>
              </div>
            </div>
          </div>

          {/* Address & Google Maps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Restaurant Location
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C88729] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {restaurant.address.line1}, {restaurant.address.landmark}, {restaurant.address.area}, Karnataka {restaurant.address.pincode}
                </p>
              </div>
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C88729] hover:text-[#e09832] transition-colors pt-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© 2026 Sahyadri Vaibhava. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Authentic Vegetarian Dining on Chandapura–Anekal Road</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

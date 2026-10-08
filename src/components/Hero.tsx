import React from 'react';
import { Clock, MapPin, ArrowRight, Utensils, CheckCircle2 } from 'lucide-react';
import { RestaurantConfig } from '../types';
import heroImage from '../assets/images/hero_sahyadri_spread_1790337610845.jpg';

interface HeroProps {
  restaurant: RestaurantConfig;
  onOrderNow: () => void;
  onOpenBookingModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ restaurant, onOrderNow, onOpenBookingModal }) => {
  return (
    <section id="home" className="relative pt-6 pb-14 md:pt-12 md:pb-20 overflow-hidden bg-[#FAF8F5]">
      {/* Subtle background ornamentation */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#183B2B]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#C88729]/8 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Location context - Clean unboxed text as per design constitution */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C88729]">
              <MapPin className="w-4 h-4 text-[#C88729] shrink-0" />
              <span>Chandapura–Anekal Road, Iggalur</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-600">Bengaluru</span>
            </div>

            {/* Main Brand Title & Tagline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#183B2B] tracking-tight leading-[1.12]">
                {restaurant.name}
              </h1>
              <p className="font-display italic text-2xl sm:text-3xl text-stone-800 font-semibold">
                {restaurant.tagline}
              </p>
            </div>

            {/* Supporting description */}
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
              {restaurant.subTagline}
            </p>

            {/* Timings & Highlights bar */}
            <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-2 font-medium text-stone-900">
                  <Clock className="w-4 h-4 text-[#183B2B] shrink-0" />
                  <span>{restaurant.timings}</span>
                </div>
                <span className="hidden sm:inline text-stone-300" aria-hidden="true">|</span>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>100% Pure Vegetarian</span>
                </div>
                <span className="hidden sm:inline text-stone-300" aria-hidden="true">|</span>
                <span className="text-stone-600">Spacious Family Seating & Parking</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOrderNow}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#183B2B] hover:bg-[#122A1E] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBookingModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#183B2B] bg-[#183B2B]/10 hover:bg-[#183B2B]/20 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Book Table / Visit</span>
              </button>

              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-2xs transition-all whitespace-nowrap"
              >
                <Utensils className="w-4 h-4 text-[#C88729]" />
                <span>View Menu</span>
              </a>

              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 text-[#183B2B]" />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Verified highlights list */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Freshly Prepared Daily
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Hygienic Kitchen Standards
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Quick Takeaway & Dine-In
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-white">
                <img
                  src={heroImage}
                  alt="Authentic South Indian vegetarian breakfast spread at Sahyadri Vaibhava"
                  className="w-full h-80 sm:h-96 object-cover transform hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Scrim overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F3C474]">
                      Specialty of the House
                    </span>
                    <h2 className="font-display text-xl font-bold leading-tight">
                      Crisp Dosas, Steaming Idlis & South Indian Filter Coffee
                    </h2>
                    <p className="text-xs text-stone-200/90 line-clamp-1">
                      Prepared using freshly fermented batter, pure ghee, and authentic recipes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highway Landmark Callout Badge */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white p-3.5 rounded-xl border border-stone-200 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#183B2B]/10 flex items-center justify-center text-[#183B2B] font-bold text-lg">
                  SV
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Chandapura–Anekal Main Road</p>
                  <p className="text-[11px] text-stone-500">Opposite JPM Nursery, Iggalur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Leaf, Users, Clock, MapPin, Sparkles, HeartHandshake } from 'lucide-react';
import diningHallImg from '../assets/images/restaurant_family_dining_1790337666423.jpg';

export const AboutSection: React.FC = () => {
  const highlights = [
    {
      icon: Leaf,
      title: '100% Pure Vegetarian',
      desc: 'Dedicated pure vegetarian kitchen preparing wholesome South and North Indian dishes with high hygiene standards.',
    },
    {
      icon: Users,
      title: 'Family Dining Comfort',
      desc: 'Spacious, clean, and welcoming dining hall designed for families, highway travelers, and friendly gatherings.',
    },
    {
      icon: Clock,
      title: 'Freshly Prepared to Order',
      desc: 'From morning tiffins and hot filter coffee to royal afternoon thalis and warm dinner curries, every meal is served fresh.',
    },
    {
      icon: MapPin,
      title: 'Convenient Highway Location',
      desc: 'Easily accessible on Chandapura–Anekal Road, right opposite JPM Nursery in Iggalur, with dedicated customer parking.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with caption */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-[#FAF8F5]">
              <img
                src={diningHallImg}
                alt="Sahyadri Vaibhava family dining hall"
                className="w-full h-80 sm:h-96 object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-stone-900">
                    Sahyadri Vaibhava Family Hall
                  </h4>
                  <p className="text-[11px] text-stone-500">Iggalur, Chandapura–Anekal Road</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Warm Hospitality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#C88729]">
                About Our Restaurant
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#183B2B] tracking-tight">
                Authentic Vegetarian Flavors for the Entire Family
              </h2>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Situated conveniently on <strong>Chandapura–Anekal Road</strong> opposite JPM Nursery,{' '}
              <strong>Sahyadri Vaibhava</strong> is a vegetarian and family restaurant catering to residents,
              local travelers, and commuters across Iggalur, Andapura, Chandapura, and Anekal.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Whether you are stopping by for an early morning crispy Masala Dosa with traditional South Indian
              filter coffee, enjoying an elaborate midday thali with your family, or picking up dinner on your
              way home, we are committed to providing fresh food, clean dining surroundings, and polite service.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-2 hover:border-stone-300 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#183B2B]/10 flex items-center justify-center text-[#183B2B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-stone-900">{h.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{h.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

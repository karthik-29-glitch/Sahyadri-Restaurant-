import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Check, Flame, Sparkles, SlidersHorizontal, Info } from 'lucide-react';
import { MenuItem, CategoryId } from '../types';
import { MENU_CATEGORIES } from '../data/restaurantData';

interface MenuSectionProps {
  menuItems: MenuItem[];
  cartQuantities: Record<string, number>;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onOpenOwnerModal: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onOpenOwnerModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPopular, setOnlyPopular] = useState(false);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Popular filter
      if (onlyPopular && !item.isPopular) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesKannada = item.kannadaName?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesKannada && !matchesDesc && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [menuItems, selectedCategory, onlyPopular, searchQuery]);

  return (
    <section id="menu" className="py-14 sm:py-18 bg-[#F5F2EB]/50 border-t border-b border-stone-200/80 scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#C88729]">
              Freshly Prepared • 100% Vegetarian
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#183B2B] tracking-tight">
              Our Food Menu
            </h2>
            <p className="text-stone-600 text-sm max-w-xl">
              Authentic South Indian tiffins, hearty meals, North Indian specialties, and refreshments prepared with high hygiene standards.
            </p>
          </div>

          {/* Quick Notice & Owner Edit Link */}
          <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-lg border border-stone-200 text-xs text-stone-600 shadow-2xs self-start md:self-auto">
            <Info className="w-4 h-4 text-[#C88729] shrink-0" />
            <span>Sample baseline pricing · Editable by management</span>
            <button
              onClick={onOpenOwnerModal}
              className="text-[#183B2B] font-semibold underline hover:text-[#122A1E] ml-1 flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search dosas, thali meals, paneer, coffee, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20 focus:border-[#183B2B] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Popular Filter Button */}
            <button
              onClick={() => setOnlyPopular(!onlyPopular)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                onlyPopular
                  ? 'bg-[#183B2B] text-white border-[#183B2B]'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>Popular Items Only</span>
            </button>
          </div>

          {/* Category Tabs (Segmented control as allowed by frontend design rules) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryId)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#183B2B] text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8 space-y-3">
            <p className="text-base font-semibold text-stone-800">No dishes match your search.</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try searching for something else like "Dosa", "Meals", "Coffee", or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyPopular(false);
              }}
              className="px-4 py-2 text-xs font-medium text-[#183B2B] bg-[#183B2B]/10 rounded-lg hover:bg-[#183B2B]/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const qty = cartQuantities[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Card Top: Image & Veg Badges */}
                  <div>
                    <div className="relative h-44 sm:h-48 w-full bg-stone-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {/* Veg Indicator Badge (Authentic Indian green dot in green square) */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1 rounded-sm shadow-xs flex items-center justify-center">
                        <div
                          className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center rounded-xs"
                          title="100% Pure Vegetarian"
                        >
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        </div>
                      </div>

                      {/* Popular tag */}
                      {item.isPopular && (
                        <div className="absolute top-3 right-3 bg-[#183B2B]/90 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                          Popular
                        </div>
                      )}

                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
                          <span className="text-white text-xs font-bold uppercase tracking-wider bg-stone-900 px-3 py-1 rounded">
                            Sold Out Today
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-base text-stone-900 group-hover:text-[#183B2B] transition-colors leading-tight">
                            {item.name}
                          </h3>
                          {item.kannadaName && (
                            <span className="text-xs text-[#C88729] font-medium block">
                              {item.kannadaName}
                            </span>
                          )}
                        </div>
                        {item.spicyLevel && item.spicyLevel !== 'mild' && (
                          <div
                            className="flex items-center text-xs text-amber-700 shrink-0"
                            title={`Spiciness: ${item.spicyLevel}`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Price & Add Controls */}
                  <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-stone-500 font-medium">₹</span>
                        <span className="text-lg font-bold text-stone-900 tabular-nums">
                          {item.price}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block -mt-0.5">
                        Sample price
                      </span>
                    </div>

                    {/* Quantity controls or Add button */}
                    <div>
                      {!item.isAvailable ? (
                        <span className="text-xs text-stone-400 font-medium italic">
                          Unavailable
                        </span>
                      ) : qty > 0 ? (
                        <div className="flex items-center gap-2 bg-[#183B2B] text-white rounded-lg p-1 shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(item.id, qty - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/20 active:scale-95 transition-all"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold tabular-nums min-w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, qty + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/20 active:scale-95 transition-all"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#183B2B] bg-[#183B2B]/10 hover:bg-[#183B2B] hover:text-white rounded-lg transition-all active:scale-95 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, CheckCircle2, SlidersHorizontal, Store, Utensils, Database, Download } from 'lucide-react';
import { MenuItem, RestaurantConfig, CategoryId } from '../types';
import { MENU_CATEGORIES } from '../data/restaurantData';
import { SupabaseAdminTab } from './SupabaseAdminTab';

interface OwnerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: RestaurantConfig;
  menuItems: MenuItem[];
  onSaveRestaurant: (config: RestaurantConfig) => void;
  onSaveMenu: (items: MenuItem[]) => void;
  onResetDefaults: () => void;
  initialTab?: 'menu' | 'restaurant' | 'supabase';
}

export const OwnerEditModal: React.FC<OwnerEditModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  menuItems,
  onSaveRestaurant,
  onSaveMenu,
  onResetDefaults,
  initialTab = 'menu',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'menu' | 'restaurant' | 'supabase'>(initialTab);
  const [editableRestaurant, setEditableRestaurant] = useState<RestaurantConfig>({ ...restaurant });
  const [editableItems, setEditableItems] = useState<MenuItem[]>([...menuItems]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync activeTab whenever initialTab changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Dish editing helpers
  const handleItemChange = (index: number, field: keyof MenuItem, value: any) => {
    const updated = [...editableItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditableItems(updated);
  };

  const handleToggleAvailability = (index: number) => {
    const updated = [...editableItems];
    updated[index] = { ...updated[index], isAvailable: !updated[index].isAvailable };
    setEditableItems(updated);
  };

  const handleAddNewItem = () => {
    const newItem: MenuItem = {
      id: `sv-custom-${Date.now()}`,
      name: 'New Dish Item',
      kannadaName: '',
      description: 'Freshly prepared vegetarian dish with authentic spices.',
      price: 100,
      category: 'breakfast',
      image: editableItems[0]?.image || '',
      isVeg: true,
      isAvailable: true,
      isDemoPrice: false,
    };
    setEditableItems([newItem, ...editableItems]);
  };

  const handleDeleteItem = (index: number) => {
    const updated = [...editableItems];
    updated.splice(index, 1);
    setEditableItems(updated);
  };

  const handleSaveAll = () => {
    onSaveRestaurant(editableRestaurant);
    onSaveMenu(editableItems);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-0">
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative z-10 border border-stone-200">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#183B2B]/10 flex items-center justify-center text-[#183B2B]">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Restaurant Owner & Menu Customizer
                </h3>
                <p className="text-xs text-stone-500">
                  Quickly adjust prices, availability, phone numbers, or add new dishes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="px-6 pt-3 border-b border-stone-200 bg-stone-50 flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'border-[#183B2B] text-[#183B2B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Menu Items & Prices ({editableItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('restaurant')}
              className={`flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'restaurant'
                  ? 'border-[#183B2B] text-[#183B2B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Restaurant Details & Contact</span>
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'supabase'
                  ? 'border-[#183B2B] text-[#183B2B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Live Orders & Bookings</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Changes saved successfully to your restaurant database!</span>
              </div>
            )}

            {activeTab === 'supabase' ? (
              <SupabaseAdminTab />
            ) : activeTab === 'menu' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-500">
                    Update dish prices, toggle availability when an item runs out, or add new items.
                  </p>
                  <button
                    onClick={handleAddNewItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#183B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#122A1E] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editableItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      {/* Name & Kannada */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-stone-400">Dish Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-stone-200 bg-white"
                        />
                      </div>

                      {/* Category */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-stone-400">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value as CategoryId)}
                          className="w-full px-2 py-1.5 text-xs rounded border border-stone-200 bg-white"
                        >
                          {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price in ₹ */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-stone-400">Price (₹)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-stone-900 rounded border border-stone-200 bg-white tabular-nums"
                        />
                      </div>

                      {/* Availability Toggle */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-stone-400">Status</label>
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(idx)}
                          className={`w-full py-1.5 px-2 text-xs font-semibold rounded transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </div>

                      {/* Remove Button */}
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-stone-200 transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={editableRestaurant.name}
                      onChange={(e) =>
                        setEditableRestaurant({ ...editableRestaurant, name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Display Phone Number
                    </label>
                    <input
                      type="text"
                      value={editableRestaurant.displayPhone}
                      onChange={(e) =>
                        setEditableRestaurant({
                          ...editableRestaurant,
                          displayPhone: e.target.value,
                          phone: e.target.value.replace(/\s+/g, ''),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      WhatsApp Number (with country code e.g. 918884680461)
                    </label>
                    <input
                      type="text"
                      value={editableRestaurant.whatsappNumber}
                      onChange={(e) =>
                        setEditableRestaurant({
                          ...editableRestaurant,
                          whatsappNumber: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Opening Timings
                    </label>
                    <input
                      type="text"
                      value={editableRestaurant.timings}
                      onChange={(e) =>
                        setEditableRestaurant({ ...editableRestaurant, timings: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={editableRestaurant.address.fullFormatted}
                    onChange={(e) =>
                      setEditableRestaurant({
                        ...editableRestaurant,
                        address: {
                          ...editableRestaurant.address,
                          fullFormatted: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#FAF8F5] border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (window.confirm('Reset all items and details to original defaults?')) {
                    onResetDefaults();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <a
                href="/sahyadri-vaibhava-project.zip"
                download="sahyadri-vaibhava-project.zip"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Project ZIP</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-5 py-2 bg-[#183B2B] hover:bg-[#122A1E] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

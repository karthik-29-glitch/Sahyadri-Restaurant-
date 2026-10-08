import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, OrderType, OrderDetails, RestaurantConfig } from './types';
import { INITIAL_RESTAURANT_CONFIG, INITIAL_MENU_ITEMS } from './data/restaurantData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { LocationContactSection } from './components/LocationContactSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OwnerEditModal } from './components/OwnerEditModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { FloatingMobileBar } from './components/FloatingMobileBar';
import { Footer } from './components/Footer';

const RESTAURANT_STORAGE_KEY = 'sv_restaurant_config_v2';
const MENU_STORAGE_KEY = 'sv_menu_items_v1';
const CART_STORAGE_KEY = 'sv_cart_items_v1';

export default function App() {
  // Restaurant Config state with local persistence
  const [restaurant, setRestaurant] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem(RESTAURANT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored restaurant config', e);
    }
    return INITIAL_RESTAURANT_CONFIG;
  });

  // Menu items state with local persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored menu', e);
    }
    return INITIAL_MENU_ITEMS;
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored cart', e);
    }
    return [];
  });

  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  // Derived cart metrics
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

  // Fast map of item quantities for menu cards
  const cartQuantities = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const ci of cartItems) {
      map[ci.item.id] = ci.quantity;
    }
    return map;
  }, [cartItems]);

  // Cart handlers
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((ci) => ci.item.id !== itemId);
      }
      return prev.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity: newQty } : ci
      );
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: OrderDetails) => {
    setConfirmedOrder(order);
    setIsCheckoutOpen(false);
    setCartItems([]);
  };

  // Owner settings handlers
  const handleSaveRestaurant = (updatedConfig: RestaurantConfig) => {
    setRestaurant(updatedConfig);
    try {
      localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(updatedConfig));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMenu = (updatedMenu: MenuItem[]) => {
    setMenuItems(updatedMenu);
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenu));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDefaults = () => {
    try {
      localStorage.removeItem(RESTAURANT_STORAGE_KEY);
      localStorage.removeItem(MENU_STORAGE_KEY);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setRestaurant(INITIAL_RESTAURANT_CONFIG);
    setMenuItems(INITIAL_MENU_ITEMS);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#183B2B]/20 selection:text-[#183B2B]">
      {/* Navbar with 3-Zone contract */}
      <Navbar
        restaurant={restaurant}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          restaurant={restaurant}
          onOrderNow={() => {
            const el = document.getElementById('menu');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
        />

        {/* Food Menu Section */}
        <MenuSection
          menuItems={menuItems}
          cartQuantities={cartQuantities}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
        />

        {/* About Restaurant Section */}
        <AboutSection />

        {/* Image Gallery Section */}
        <GallerySection />

        {/* Location & Contact Section */}
        <LocationContactSection
          restaurant={restaurant}
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        restaurant={restaurant}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
      />

      {/* Floating Bottom Bar for Mobile Touch Users */}
      <FloatingMobileBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        restaurant={restaurant}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
      />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        onSetOrderType={setOrderType}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        onSetOrderType={setOrderType}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Confirmation Screen */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          restaurant={restaurant}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {/* Appointment / Table Booking Modal (Supabase Integrated) */}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Owner / Manager Customizer Modal */}
      <OwnerEditModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        restaurant={restaurant}
        menuItems={menuItems}
        onSaveRestaurant={handleSaveRestaurant}
        onSaveMenu={handleSaveMenu}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}

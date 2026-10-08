export type CategoryId =
  | 'all'
  | 'breakfast'
  | 'south-indian'
  | 'north-indian'
  | 'rice-meals'
  | 'snacks'
  | 'beverages'
  | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  kannadaName?: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isDemoPrice?: boolean;
  spicyLevel?: 'mild' | 'medium' | 'spicy';
  isPopular?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  instructions?: string;
}

export type OrderType = 'takeaway' | 'delivery';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  mobileNumber: string;
  orderType: OrderType;
  address?: string;
  landmark?: string;
  specialInstructions?: string;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: 'received' | 'preparing' | 'ready';
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  subTagline: string;
  address: {
    line1: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    fullFormatted: string;
  };
  timings: string;
  phone: string;
  displayPhone: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
}

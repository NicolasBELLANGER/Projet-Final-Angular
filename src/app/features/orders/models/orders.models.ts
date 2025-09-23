import { CartItem } from '../../cart/models/cart.models';

export interface Order {
  id: string;
  createdAt: string;
  userId: number;
  client: {
    firstname: string;
    lastname: string;
    email: string;
  };
  deliveryTo: {
    address: string;
    city: string;
    postcode: string;
    estimatedDelivery?: string;
  };
  items: CartItem[];
  pricing: {
    subTotalPrice: number;
    delivery: number;
    taxes: number;
    totalPrice: number;
  };
  status?: 'paid' | 'shipped' | 'cancelled';
}

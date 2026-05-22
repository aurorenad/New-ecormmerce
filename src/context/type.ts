import { createContext } from 'react';

export interface Spec {
  label: string;
  value: string;
}

export interface Device {
  id: number;
  title: string;
  current_price: number;
  original_price: number;
  description: string;
  img: string;
  category: string;
  specs: Spec[];
}

export interface CartItem extends Device {
  quantity: number;
}

export interface ToastState {
  show: boolean;
  message: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (device: Device) => void;
  removeFromCart: (id: number) => void;
  // 🟢 New control signatures:
  updateQuantity: (id: number, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  // 🟢 Toast context signatures:
  toast: ToastState;
  triggerToast: (message: string) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

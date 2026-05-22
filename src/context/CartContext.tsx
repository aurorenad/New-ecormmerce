import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Device, CartItem, ToastState } from './type';
import  { CartContext } from './type';



export function CartProvider({ children }: { children: ReactNode }) {
  // 📦 Local Storage Hydration on Initial Load
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('jaribu_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });

  // 💾 Sync Cart State Changes to LocalStorage Automatically
  useEffect(() => {
    localStorage.setItem('jaribu_cart', JSON.stringify(cart));
  }, [cart]);

  // 🔔 Triggers a 3-second self-dismissing toast animation banner
  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.current_price * item.quantity, 0);

  const addToCart = (device: Device) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === device.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === device.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...device, quantity: 1 }];
    });
    triggerToast(`"${device.title}" added to cart!`);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // ➕/➖ Adjust quantities with a safety limit stopping subtraction below 1 item
  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty >= 1 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        toast,
        triggerToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


import { useContext } from 'react';
import { CartContext } from './type';

export function useCart() {
  const context = useContext(CartContext);
  
  // Guard check ensures you don't accidentally use this outside the Provider wrapper
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}

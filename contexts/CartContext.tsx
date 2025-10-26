
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';
import { useTable } from './TableContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setItemNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { table } = useTable();
  const [cart, setCart] = useState<CartItem[]>([]);

  const getCartStorageKey = () => table ? `cart_${table.id}` : null;

  useEffect(() => {
    const key = getCartStorageKey();
    if (key) {
      try {
        const storedCart = localStorage.getItem(key);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]);
      }
    }
  }, [table]);

  useEffect(() => {
    const key = getCartStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }, [cart, table]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1, note: '' }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const setItemNote = (itemId: string, note: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, note } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setItemNote, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

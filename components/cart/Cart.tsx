
import React from 'react';
import { ShoppingCart, X, Plus, Minus, Send, StickyNote } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../types';
import Button from '../ui/Button';

interface CartProps {
  onClose: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const Cart: React.FC<CartProps> = ({ onClose, onPlaceOrder, isPlacingOrder }) => {
  const { cart, updateQuantity, removeFromCart, total, setItemNote } = useCart();

  const handleNoteChange = (item: CartItem, note: string) => {
    setItemNote(item.id, note);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b bg-primary text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart /> Your Order
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
            <X size={24} />
          </button>
        </header>
        
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
            <ShoppingCart size={64} className="text-neutral/30 mb-4" />
            <p className="text-xl text-neutral">Your cart is empty.</p>
            <p className="text-neutral-light">Add some delicious items from the menu!</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></Button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                     <Button size="sm" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></Button>
                  </div>
                  <div className="relative mt-2">
                      <StickyNote size={16} className="absolute left-2 top-2.5 text-neutral" />
                      <input 
                        type="text"
                        placeholder="Add a note..."
                        value={item.note}
                        onChange={(e) => handleNoteChange(item, e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 border rounded-md text-sm"
                      />
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-danger hover:text-danger/70 self-start">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {cart.length > 0 && (
          <footer className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center text-xl font-bold mb-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button 
              size="lg" 
              className="w-full"
              onClick={onPlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              <Send size={20} />
            </Button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Cart;

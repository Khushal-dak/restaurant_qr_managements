import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Search, Utensils } from 'lucide-react';
import { MenuCategory, MenuItem, Order } from '../types';
import * as api from '../services/api';
import { useTable } from '../contexts/TableContext';
import { useCart } from '../contexts/CartContext';
import Spinner from '../components/ui/Spinner';
import MenuItemCard from '../components/menu/MenuItemCard';
import Cart from '../components/cart/Cart';
import OrderStatusTracker from '../components/order/OrderStatusTracker';

const MenuPage: React.FC = () => {
  const { table, loading: tableLoading, error: tableError } = useTable();
  const { cart, addToCart, clearCart } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrders, setPlacedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsData, categoriesData] = await Promise.all([
          api.getMenuItems({}),
          api.getMenuCategories(),
        ]);
        setMenuItems(itemsData);
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setActiveCategoryId(categoriesData[0].id);
        }
      } catch (err: any) {
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (placedOrders.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updatedOrdersPromises = placedOrders.map(order => api.getOrderById(order.id));
        const resolvedOrders = await Promise.all(updatedOrdersPromises);
        const validUpdatedOrders = resolvedOrders.filter(Boolean) as Order[];
        
        // Only update state if there are actual changes to prevent re-renders
        if (JSON.stringify(validUpdatedOrders) !== JSON.stringify(placedOrders)) {
             setPlacedOrders(validUpdatedOrders);
        }
      } catch (error) {
        console.error("Failed to update order statuses", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [placedOrders]);

  const handlePlaceOrder = async () => {
    if (!table || cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const newOrder = await api.placeOrder({ tableId: table.id, items: cart });
      setPlacedOrders(prevOrders => [...prevOrders, newOrder]);
      setOrderSuccess(true);
      clearCart();
      setIsCartOpen(false);
      setTimeout(() => setOrderSuccess(false), 8000);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategoryId ? item.categoryId === activeCategoryId : true;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategoryId, searchTerm]);

  if (tableLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (tableError) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-xl p-4 text-center">{tableError}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary flex items-center gap-2">
            <Utensils />
            <span>Table {table?.number}</span>
          </div>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search food..."
              className="border rounded-full py-2 px-4 pl-10 w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {orderSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md shadow-lg" role="alert">
            <p className="font-bold">Order Placed!</p>
            <p>Your order has been sent to the kitchen. You can track its status below.</p>
          </div>
        )}
        
        {placedOrders.length > 0 && (
          <div className="mb-8">
            {placedOrders.map(order => (
              <OrderStatusTracker key={order.id} order={order} />
            ))}
          </div>
        )}

        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeCategoryId === cat.id ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner /> : error ? <p className="text-danger text-center">{error}</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />)}
          </div>
        )}
      </main>

      <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 bg-accent text-white rounded-full p-4 shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
        <ShoppingCart size={28} />
        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
      </button>

      {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} onPlaceOrder={handlePlaceOrder} isPlacingOrder={isPlacingOrder} />}
    </div>
  );
};

export default MenuPage;

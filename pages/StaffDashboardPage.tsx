
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import * as api from '../services/api';
import { ORDER_STATUS_CONFIG } from '../constants';
import OrderCard from '../components/order/OrderCard';
import Spinner from '../components/ui/Spinner';

const StaffDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  const fetchOrders = useCallback(async () => {
    try {
      const fetchedOrders = await api.getOrders({});
      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll for new orders every 10 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);
  
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const updatedOrder = await api.updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const orderColumns: { [key in OrderStatus]?: Order[] } = orders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = [];
    }
    acc[order.status]?.push(order);
    return acc;
  }, {});

  const statusOrder: OrderStatus[] = [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.SERVED];

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-neutral-dark">Live Order Queue</h1>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
        {statusOrder.map(status => (
          <div key={status} className="bg-neutral-light rounded-lg p-3 flex flex-col">
            <h2 className={`font-bold text-lg mb-3 px-2 py-1 rounded-md text-white ${ORDER_STATUS_CONFIG[status].color}`}>
              {ORDER_STATUS_CONFIG[status].label} ({orderColumns[status]?.length || 0})
            </h2>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
              {orderColumns[status] && orderColumns[status]!.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                  isUpdating={updatingOrderId === order.id}
                />
              ))}
              {!orderColumns[status]?.length && <p className="text-neutral text-center pt-10">No orders here.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboardPage;

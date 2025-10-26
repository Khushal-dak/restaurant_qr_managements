import React from 'react';
import { CheckCircle, Circle, Utensils, Bell, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../constants';

interface OrderStatusTrackerProps {
  order: Order;
}

const statusSteps: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.SERVED,
];

const getStepIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PLACED:
      return <CheckCircle className="w-6 h-6" />;
    case OrderStatus.PREPARING:
      return <Utensils className="w-6 h-6" />;
    case OrderStatus.READY:
      return <Bell className="w-6 h-6" />;
    case OrderStatus.SERVED:
      return <Truck className="w-6 h-6" />;
    default:
      return <Circle className="w-6 h-6" />;
  }
};

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order }) => {
  const currentStatusIndex = statusSteps.indexOf(order.status);

  if (order.status === OrderStatus.CANCELED) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-md shadow-lg">
        <h3 className="font-bold text-lg">Order Canceled</h3>
        <p>This order was canceled.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg my-4">
      <h3 className="text-xl font-bold text-neutral-dark mb-4">Your Order Status</h3>
      <div className="flex items-center justify-between">
        {statusSteps.map((status, index) => {
          const isActive = index <= currentStatusIndex;
          const config = ORDER_STATUS_CONFIG[status];
          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center text-center w-20">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive ? `${config.color} text-white` : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {getStepIcon(status)}
                </div>
                <p className={`mt-2 text-sm font-semibold ${isActive ? 'text-primary' : 'text-neutral'}`}>
                  {config.label}
                </p>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isActive ? config.color : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
       <div className="mt-4 border-t pt-4">
          <p className="font-semibold">Items:</p>
          <ul className="list-disc list-inside text-sm text-neutral">
            {order.items.map((item, idx) => (
                <li key={idx}>{item.quantity}x {item.name}</li>
            ))}
          </ul>
       </div>
       <div className="mt-6 text-center text-sm text-neutral bg-gray-100 p-3 rounded-lg">
        <p className="font-semibold">Thank you for your order!</p>
        <p>Please pay at the counter when you are ready to leave.</p>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
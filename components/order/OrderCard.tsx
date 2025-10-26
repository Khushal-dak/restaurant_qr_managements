
import React from 'react';
import { Clock, Hash, Utensils, ArrowLeft, ArrowRight, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../constants';
import Button from '../ui/Button';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  isUpdating: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange, isUpdating }) => {
  const config = ORDER_STATUS_CONFIG[order.status];
  const timeAgo = Math.round((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <div className="flex justify-between items-start border-b pb-2 mb-2">
        <div>
          <h3 className="font-bold text-lg text-neutral-dark flex items-center gap-2">
            <Hash size={18} /> Table {order.tableNumber}
          </h3>
          <p className="text-sm text-neutral flex items-center gap-1">
            <Clock size={14} /> {timeAgo} min ago
          </p>
        </div>
        <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${config.color}`}>
          {config.label}
        </span>
      </div>
      
      <div className="flex-grow overflow-y-auto my-2 pr-2">
        <ul className="space-y-1">
          {order.items.map((item, index) => (
            <li key={`${item.menuItemId}-${index}`} className="text-sm">
              <span className="font-semibold">{item.quantity}x</span> {item.name}
              {item.note && <p className="text-xs text-neutral pl-4 italic">- "{item.note}"</p>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-2 border-t flex justify-between items-center">
        <p className="font-bold text-lg text-primary">${order.total.toFixed(2)}</p>
        <div className="flex gap-2">
          {config.prev && (
             <Button size="sm" variant="ghost" onClick={() => onStatusChange(order.id, config.prev!)} disabled={isUpdating}><ArrowLeft size={16}/></Button>
          )}
          {order.status !== OrderStatus.CANCELED && order.status !== OrderStatus.SERVED && (
            <Button size="sm" variant="danger" onClick={() => onStatusChange(order.id, OrderStatus.CANCELED)} disabled={isUpdating}><XCircle size={16}/></Button>
          )}
          {config.next && (
            <Button size="sm" variant="primary" onClick={() => onStatusChange(order.id, config.next!)} disabled={isUpdating}><ArrowRight size={16}/></Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

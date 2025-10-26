
import { OrderStatus } from './types';

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; next?: OrderStatus; prev?: OrderStatus }> = {
  [OrderStatus.PLACED]: { label: 'Placed', color: 'bg-blue-500', next: OrderStatus.PREPARING },
  [OrderStatus.PREPARING]: { label: 'Preparing', color: 'bg-yellow-500', next: OrderStatus.READY, prev: OrderStatus.PLACED },
  [OrderStatus.READY]: { label: 'Ready', color: 'bg-green-500', next: OrderStatus.SERVED, prev: OrderStatus.PREPARING },
  [OrderStatus.SERVED]: { label: 'Served', color: 'bg-purple-500', prev: OrderStatus.READY },
  [OrderStatus.CANCELED]: { label: 'Canceled', color: 'bg-red-500' },
};

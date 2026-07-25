import React from 'react';
import { OrderProduct } from '../../domain/order.types';
import { formatCurrency } from '../../core/utils/formatCurrency';

interface OrderItemProps {
  item: OrderProduct;
}

export const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  const title = item.name || 'Product';
  const image = '/placeholder.jpg'; // Flat structure in DB has no image, fallback to placeholder

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <img
        src={image}
        alt={title}
        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
      />
      <div className="flex-1 min-w-0">
        <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{title}</h5>
        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
      </div>
      <div className="text-right">
        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
};

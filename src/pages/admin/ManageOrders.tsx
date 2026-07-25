import React from 'react';
import { ShoppingBag, RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { useUpdateOrderStatus, useRefundOrder } from '../../hooks/useOrders';
import { OrderStatus, Order } from '../../domain/order.types';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { StatusBadge } from '../../components/order/StatusBadge';
import { OrderItem } from '../../components/order/OrderItem';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const ManageOrders: React.FC = () => {
  const { data: allOrders = [], isLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => orderService.getMyOrders(), // Returns available orders
  });

  const updateStatusMutation = useUpdateOrderStatus();
  const refundOrderMutation = useRefundOrder();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, status });
  };

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-primary-600" /> Manage Customer Orders
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review dispatch progress, modify status, and process refunds</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : allOrders.length === 0 ? (
        <div className="py-20 text-center glass-card rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No orders found</h3>
          <p className="text-xs text-slate-500">Customer orders will appear here for dispatch handling.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allOrders.map((order: Order) => (
            <div
              key={order._id}
              className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/60 dark:border-slate-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      #{order._id}
                    </h4>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
                </div>

                {/* Status Updater Select */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    isLoading={refundOrderMutation.isPending}
                    onClick={() => refundOrderMutation.mutate(order._id)}
                    leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}
                  >
                    Refund
                  </Button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500">Items:</span>
                {order.products?.map((item, idx) => (
                  <OrderItem key={idx} item={item} />
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 text-xs font-bold">
                <span className="text-slate-500">Total Price:</span>
                <span className="text-base text-primary-600 dark:text-primary-400">
                  {formatCurrency(order.finalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

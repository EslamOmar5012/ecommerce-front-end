import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { useMyOrders, useCancelOrder } from '../hooks/useOrders';
import { formatCurrency } from '../core/utils/formatCurrency';
import { formatDate } from '../core/utils/formatDate';
import { StatusBadge } from '../components/order/StatusBadge';
import { OrderItem } from '../components/order/OrderItem';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const MyOrders: React.FC = () => {
  const { data: orders = [], isLoading } = useMyOrders();
  const cancelOrderMutation = useCancelOrder();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Package className="w-7 h-7 text-primary-600" /> My Orders History
        </h1>
        <p className="text-xs text-slate-500 mt-1">Track and manage all your placed orders</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center glass-card rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No orders found</h3>
          <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const canCancel = order.status === 'pending';

            return (
              <div
                key={order._id}
                className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/60 dark:border-slate-800 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                        #{order._id}
                      </h4>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-base text-primary-600 dark:text-primary-400">
                      {formatCurrency(order.finalPrice)}
                    </span>

                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Payment Method</span>
                        <span className="font-bold uppercase text-slate-800 dark:text-slate-200">
                          {order.paymentType}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Shipping Address</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500">Ordered Items:</span>
                      {order.products?.map((item, idx) => (
                        <OrderItem key={idx} item={item} />
                      ))}
                    </div>

                    {canCancel && (
                      <div className="pt-2 flex justify-end">
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={cancelOrderMutation.isPending}
                          leftIcon={<XCircle className="w-4 h-4" />}
                          onClick={() => cancelOrderMutation.mutate(order._id)}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from "react";
import { ShoppingBag, RefreshCcw } from "lucide-react";
import {
  useAllOrders,
  useUpdateOrderStatus,
  useRefundOrder,
} from "../../hooks/useOrders";
import { OrderStatus, Order } from "../../domain/order.types";
import { formatCurrency } from "../../core/utils/formatCurrency";
import { formatDate } from "../../core/utils/formatDate";
import { StatusBadge } from "../../components/order/StatusBadge";
import { OrderItem } from "../../components/order/OrderItem";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";

export const ManageOrders: React.FC = () => {
  const { data: allOrders = [], isLoading } = useAllOrders();

  const updateStatusMutation = useUpdateOrderStatus();
  const refundOrderMutation = useRefundOrder();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, status });
  };

  return (
    <div className="space-y-8 py-6">
      <div className="pb-6 border-slate-200 dark:border-slate-800 border-b">
        <h1 className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-slate-100 text-3xl">
          <ShoppingBag className="w-7 h-7 text-primary-600" /> Manage Customer
          Orders
        </h1>
        <p className="mt-1 text-slate-500 text-xs">
          Review dispatch progress, modify status, and process refunds
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : allOrders.length === 0 ? (
        <div className="space-y-4 mx-auto p-8 py-20 rounded-3xl max-w-md text-center glass-card">
          <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-800 mx-auto rounded-full w-16 h-16 text-slate-400 text-2xl">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
            No orders found
          </h3>
          <p className="text-slate-500 text-xs">
            Customer orders will appear here for dispatch handling.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allOrders.map((order: Order) => (
            <div
              key={order._id}
              className="space-y-4 p-6 border border-slate-200/60 dark:border-slate-800 rounded-3xl glass-card"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-slate-200 dark:border-slate-800 border-b">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                      #{order._id}
                    </h4>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-0.5 text-slate-500 text-xs">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Status Updater Select */}
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-500 text-xs">
                    Update Status:
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value as OrderStatus,
                      )
                    }
                    className="bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none font-bold text-slate-800 dark:text-slate-200 text-xs"
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
                <span className="font-bold text-slate-500 text-xs">Items:</span>
                {order.products?.map((item, idx) => (
                  <OrderItem key={idx} item={item} />
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-xs">
                <span className="text-slate-500">Total Price:</span>
                <span className="text-primary-600 dark:text-primary-400 text-base">
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

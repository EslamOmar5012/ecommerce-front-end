import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Order } from '../domain/order.types';
import { formatCurrency } from '../core/utils/formatCurrency';
import { formatDate } from '../core/utils/formatDate';
import { OrderItem } from '../components/order/OrderItem';
import { StatusBadge } from '../components/order/StatusBadge';
import { Button } from '../components/ui/Button';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 text-center">
      <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-6 border border-slate-200/60 dark:border-slate-800">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thank you for shopping with us. We have received your order and are preparing it for shipment.
          </p>
        </div>

        {order && (
          <div className="text-left bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Order ID</span>
                <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                  #{order._id}
                </h4>
              </div>
              <StatusBadge status={order.status || 'pending'} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold uppercase text-primary-600">{order.paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping Address:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1">
              <span className="text-xs font-bold text-slate-500">Items Ordered:</span>
              {order.products?.map((item, idx) => (
                <OrderItem key={idx} item={item} />
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100">
              <span>Total Paid:</span>
              <span className="text-primary-600 dark:text-primary-400">
                {formatCurrency(order.finalPrice)}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/my-orders">
            <Button variant="primary" leftIcon={<Package className="w-4 h-4" />}>
              View My Orders
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

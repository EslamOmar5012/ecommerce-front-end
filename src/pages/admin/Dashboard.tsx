import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Tag,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Star,
  DollarSign,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCoupons } from '../../hooks/useCoupons';
import { useMyOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { formatDate } from '../../core/utils/formatDate';
import { StatusBadge } from '../../components/order/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Order, OrderStatus } from '../../domain/order.types';

// --- Stat Card ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  trend?: number;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, sub, trend }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
    <div className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</h3>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <TrendingUp className={`w-3.5 h-3.5 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
  </div>
);

// --- Status distribution helper ---
const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  pending:    { icon: <Clock className="w-4 h-4" />,       color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950/50' },
  processing: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950/50' },
  shipped:    { icon: <Truck className="w-4 h-4" />,       color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50' },
  delivered:  { icon: <CheckCircle2 className="w-4 h-4" />,color: 'text-emerald-600',bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
  cancelled:  { icon: <XCircle className="w-4 h-4" />,     color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-950/50' },
  refunded:   { icon: <DollarSign className="w-4 h-4" />,  color: 'text-slate-500',  bg: 'bg-slate-100 dark:bg-slate-800' },
};

export const AdminDashboard: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 6 });
  const { data: coupons = [], isLoading: couponsLoading } = useCoupons();
  const { data: orders = [], isLoading: ordersLoading } = useMyOrders();

  const isLoading = productsLoading || ordersLoading || couponsLoading;

  const totalProducts = productsData?.total || productsData?.data?.length || 0;
  const topProducts = (productsData?.data || []).slice(0, 5);

  const totalRevenue = useMemo(
    () => orders.reduce((sum: number, o: Order) => sum + (o.finalPrice || 0), 0),
    [orders]
  );

  const ordersByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o: Order) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const recentOrders = [...orders].reverse().slice(0, 5);

  const activeCoupons = coupons.filter(c => {
    try { return new Date(c.expireAt) > new Date(); } catch { return true; }
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Store Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Live overview of your store's performance</p>
      </div>

      {/* KPI Stats Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
            color="bg-emerald-50 dark:bg-emerald-950/60"
            sub={`From ${orders.length} orders`}
          />
          <StatCard
            label="Total Orders"
            value={orders.length}
            icon={<ShoppingBag className="w-6 h-6 text-primary-600" />}
            color="bg-primary-50 dark:bg-primary-950/60"
            sub={`${ordersByStatus['pending'] || 0} pending`}
          />
          <StatCard
            label="Total Products"
            value={totalProducts}
            icon={<Package className="w-6 h-6 text-indigo-600" />}
            color="bg-indigo-50 dark:bg-indigo-950/60"
            sub="In active catalog"
          />
          <StatCard
            label="Active Coupons"
            value={activeCoupons.length}
            icon={<Tag className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50 dark:bg-amber-950/60"
            sub={`${coupons.length} total created`}
          />
        </div>
      )}

      {/* Middle Row: Order Status Distribution + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary-500" /> Order Status Breakdown
          </h2>
          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
            </div>
          ) : Object.keys(ordersByStatus).length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No order data yet</p>
          ) : (
            <div className="space-y-2">
              {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
                const count = ordersByStatus[status] || 0;
                const cfg = statusConfig[status];
                const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                return (
                  <div key={status} className={`flex items-center gap-3 p-2.5 rounded-xl ${cfg.bg}`}>
                    <span className={cfg.color}>{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-xs font-bold capitalize ${cfg.color}`}>{status}</span>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cfg.color.replace('text-', 'bg-')}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" /> Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No orders found
            </div>
          ) : (
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-2 pr-4">Order</th>
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((order: Order) => (
                    <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-500 text-[11px]">{formatDate(order.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 text-right font-extrabold text-slate-800 dark:text-slate-200">
                        {formatCurrency(order.finalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Top Products + Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Featured Products
            </h2>
            <Link to="/admin/products" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No products in catalog</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <img
                    src={product.gallery?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{product.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {typeof product.category === 'object' ? product.category.name : '—'} · Stock: {product.stock}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(product.priceAfterDiscount || product.price)}
                    </p>
                    {product.priceAfterDiscount && product.priceAfterDiscount < product.price && (
                      <p className="text-[10px] text-slate-400 line-through">{formatCurrency(product.price)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" /> Quick Actions
          </h2>

          {[
            { to: '/admin/products', label: 'Manage Products', desc: 'Add, edit, soft delete', icon: <Package className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' },
            { to: '/admin/coupons', label: 'Manage Coupons', desc: 'Create promo codes', icon: <Tag className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
            { to: '/admin/orders', label: 'Manage Orders', desc: 'Update status & refunds', icon: <ShoppingBag className="w-5 h-5" />, color: 'text-primary-600 bg-primary-50 dark:bg-primary-950/60' },
          ].map(({ to, label, desc, icon, color }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">{label}</p>
                <p className="text-[11px] text-slate-400">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { useCoupons } from "../../hooks/useCoupons";
import { useAllOrders } from "../../hooks/useOrders";
import { formatCurrency } from "../../core/utils/formatCurrency";
import { formatDate } from "../../core/utils/formatDate";
import { StatusBadge } from "../../components/order/StatusBadge";
import { Skeleton } from "../../components/ui/Skeleton";
import { Order, OrderStatus } from "../../domain/order.types";

// --- Stat Card ---
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  trend?: number;
}
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  sub,
  trend,
}) => (
  <div className="flex justify-between items-start gap-4 bg-white dark:bg-slate-900 shadow-sm p-6 border border-slate-200 dark:border-slate-800 rounded-2xl">
    <div className="space-y-1">
      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">
        {label}
      </p>
      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-3xl">
        {value}
      </h3>
      {sub && <p className="text-slate-500 text-xs">{sub}</p>}
      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}
        >
          <TrendingUp
            className={`w-3.5 h-3.5 ${trend < 0 ? "rotate-180" : ""}`}
          />
          {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      {icon}
    </div>
  </div>
);

// --- Status distribution helper ---
const statusConfig: Record<
  OrderStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/50",
  },
  processing: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/50",
  },
  shipped: {
    icon: <Truck className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/50",
  },
  delivered: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  cancelled: {
    icon: <XCircle className="w-4 h-4" />,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/50",
  },
  refunded: {
    icon: <DollarSign className="w-4 h-4" />,
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
};

export const AdminDashboard: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    limit: 6,
  });
  const { data: coupons = [], isLoading: couponsLoading } = useCoupons();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();

  const isLoading = productsLoading || ordersLoading || couponsLoading;

  const totalProducts = productsData?.total || productsData?.data?.length || 0;
  const topProducts = (productsData?.data || []).slice(0, 5);

  const totalRevenue = useMemo(
    () =>
      orders.reduce((sum: number, o: Order) => sum + (o.finalPrice || 0), 0),
    [orders],
  );

  const ordersByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o: Order) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const recentOrders = [...orders].reverse().slice(0, 5);

  const activeCoupons = coupons.filter((c) => {
    try {
      return new Date(c.expireAt) > new Date();
    } catch {
      return true;
    }
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-extrabold text-slate-900 dark:text-slate-100 text-2xl">
          Store Dashboard
        </h1>
        <p className="mt-1 text-slate-500 text-xs">
          Live overview of your store's performance
        </p>
      </div>

      {/* KPI Stats Row */}
      {isLoading ? (
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="rounded-2xl h-32" />
          ))}
        </div>
      ) : (
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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
            sub={`${ordersByStatus["pending"] || 0} pending`}
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
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 shadow-sm p-6 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <h2 className="flex items-center gap-2 mb-4 font-bold text-slate-800 dark:text-slate-200 text-sm">
            <ShoppingBag className="w-4 h-4 text-primary-500" /> Order Status
            Breakdown
          </h2>
          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="rounded-xl h-10" />
              ))}
            </div>
          ) : Object.keys(ordersByStatus).length === 0 ? (
            <p className="py-6 text-slate-400 text-xs text-center">
              No order data yet
            </p>
          ) : (
            <div className="space-y-2">
              {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
                const count = ordersByStatus[status] || 0;
                const cfg = statusConfig[status];
                const pct =
                  orders.length > 0
                    ? Math.round((count / orders.length) * 100)
                    : 0;
                return (
                  <div
                    key={status}
                    className={`flex items-center gap-3 p-2.5 rounded-xl ${cfg.bg}`}
                  >
                    <span className={cfg.color}>{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span
                          className={`text-xs font-bold capitalize ${cfg.color}`}
                        >
                          {status}
                        </span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs">
                          {count}
                        </span>
                      </div>
                      <div className="bg-black/5 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 font-bold text-[10px] text-slate-400 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 shadow-sm p-6 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <Clock className="w-4 h-4 text-primary-500" /> Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 text-xs hover:underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="rounded-xl h-14" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-slate-400 text-xs text-center">
              <ShoppingBag className="opacity-30 mx-auto mb-2 w-8 h-8" />
              No orders found
            </div>
          ) : (
            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-slate-100 dark:border-slate-800 border-b font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2 pr-4 text-left">Order</th>
                    <th className="py-2 pr-4 text-left">Date</th>
                    <th className="py-2 pr-4 text-left">Status</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((order: Order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 font-extrabold text-slate-800 dark:text-slate-200 text-right">
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
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 shadow-sm p-6 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <Star className="w-4 h-4 text-amber-500" /> Featured Products
            </h2>
            <Link
              to="/admin/products"
              className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 text-xs hover:underline"
            >
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="rounded-xl h-14" />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="py-8 text-slate-400 text-xs text-center">
              No products in catalog
            </p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
                >
                  <img
                    src={product.gallery?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="flex-shrink-0 bg-white border border-slate-200 dark:border-slate-700 rounded-xl w-10 h-10 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {typeof product.category === "object"
                        ? product.category.name
                        : "—"}{" "}
                      · Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                      {formatCurrency(
                        product.priceAfterDiscount || product.price,
                      )}
                    </p>
                    {product.priceAfterDiscount &&
                      product.priceAfterDiscount < product.price && (
                        <p className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
            <Users className="w-4 h-4 text-primary-500" /> Quick Actions
          </h2>

          {[
            {
              to: "/admin/products",
              label: "Manage Products",
              desc: "Add, edit, soft delete",
              icon: <Package className="w-5 h-5" />,
              color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60",
            },
            {
              to: "/admin/coupons",
              label: "Manage Coupons",
              desc: "Create promo codes",
              icon: <Tag className="w-5 h-5" />,
              color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60",
            },
            {
              to: "/admin/orders",
              label: "Manage Orders",
              desc: "Update status & refunds",
              icon: <ShoppingBag className="w-5 h-5" />,
              color: "text-primary-600 bg-primary-50 dark:bg-primary-950/60",
            },
          ].map(({ to, label, desc, icon, color }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 bg-white dark:bg-slate-900 hover:shadow-md p-4 border border-slate-200 hover:border-primary-400 dark:border-slate-800 dark:hover:border-primary-600 rounded-2xl transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 text-sm transition-colors">
                  {label}
                </p>
                <p className="text-[11px] text-slate-400">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

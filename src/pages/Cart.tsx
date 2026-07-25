import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart, useUpdateCartQuantity, useRemoveCartItem, useClearCart } from '../hooks/useCart';
import { formatCurrency } from '../core/utils/formatCurrency';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading } = useCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const cartItems = cartData?.items || [];
  const totalPrice = cartData?.totalPrice || 0;
  const totalPriceAfterDiscount = cartData?.totalPriceAfterDiscount;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center glass-card rounded-3xl p-8 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 flex items-center justify-center mx-auto text-2xl">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h3>
        <p className="text-xs text-slate-500">Add products to your cart to proceed with checkout.</p>
        <Link to="/products" className="inline-block pt-2">
          <Button variant="primary">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-primary-600" /> Shopping Cart
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => clearCartMutation.mutate()}
          leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const productId = item.productId || '';
            const title = item.name || 'Product Item';
            const image = item.gallery?.[0] || '/placeholder.jpg';
            const price = item.price || 0;
            const stock = item.stock ?? 999;

            return (
              <div
                key={productId}
                className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200/60 dark:border-slate-800"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
                  />
                  <div>
                    <Link to={`/products/${productId}`}>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-primary-600 line-clamp-1">
                        {title}
                      </h4>
                    </Link>
                    <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mt-1">
                      {formatCurrency(price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                    <button
                      onClick={() => updateQuantityMutation.mutate({ productId, quantity: item.quantity - 1 })}
                      disabled={item.quantity <= 1}
                      className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantityMutation.mutate({ productId, quantity: item.quantity + 1 })}
                      disabled={item.quantity >= stock}
                      className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-extrabold text-sm text-slate-900 dark:text-white min-w-[80px] text-right">
                    {formatCurrency(price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItemMutation.mutate(productId)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="glass-card rounded-3xl p-6 space-y-6 border border-slate-200/60 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(totalPrice)}</span>
            </div>

            {totalPriceAfterDiscount && totalPriceAfterDiscount < totalPrice && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatCurrency(totalPrice - totalPriceAfterDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100">
              <span>Total Price</span>
              <span className="text-primary-600 dark:text-primary-400">
                {formatCurrency(totalPriceAfterDiscount || totalPrice)}
              </span>
            </div>
          </div>

          <Button
            className="w-full py-3.5"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useCart, useUpdateCartQuantity, useRemoveCartItem, useClearCart } from '../../hooks/useCart';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isCartOpen, closeCart } = useCartStore();
  const { data: cartData, isLoading } = useCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const cartItems = cartData?.items || [];
  const totalPrice = cartData?.totalPrice || 0;
  const totalPriceAfterDiscount = cartData?.totalPriceAfterDiscount;

  const handleQuantityChange = (productId: string, currentQty: number, delta: number, maxStock: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > maxStock) return;
    updateQuantityMutation.mutate({ productId, quantity: newQty });
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full glass-drawer flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Shopping Cart ({cartItems.length})
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="h-full flex items-center justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mb-6">
                    Looks like you haven't added any items to your shopping cart yet.
                  </p>
                  <Button variant="outline" size="sm" onClick={closeCart}>
                    Explore Products
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span>Selected Items</span>
                    <button
                      onClick={() => clearCartMutation.mutate()}
                      className="text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                    </button>
                  </div>

                  {cartItems.map((item) => {
                    const productId = item.productId || '';
                    const title = item.name || 'Product Item';
                    const image = item.gallery?.[0] || '/placeholder.jpg';
                    const itemPrice = item.price || 0;
                    const stock = item.stock ?? 999;

                    return (
                      <div
                        key={productId}
                        className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60"
                      >
                        <img
                          src={image}
                          alt={title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                                {title}
                              </h5>
                              <button
                                onClick={() => removeItemMutation.mutate(productId)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mt-1">
                              {formatCurrency(itemPrice)}
                            </p>
                          </div>

                          {/* Quantity selector */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity, -1, stock)}
                                disabled={item.quantity <= 1}
                                className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity, 1, stock)}
                                disabled={item.quantity >= stock}
                                className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {item.quantity >= stock && (
                              <span className="text-[10px] text-amber-500 font-medium">Max stock limit</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(totalPrice)}</span>
                  </div>
                  {totalPriceAfterDiscount && totalPriceAfterDiscount < totalPrice && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount</span>
                      <span>-{formatCurrency(totalPrice - totalPriceAfterDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
                    <span>Total Amount</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatCurrency(totalPriceAfterDiscount || totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full py-3"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

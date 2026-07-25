import React from 'react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist, useClearWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { useAddToCart } from '../hooks/useCart';
import { formatCurrency } from '../core/utils/formatCurrency';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Link } from 'react-router-dom';

export const Wishlist: React.FC = () => {
  const { data: wishlistData, isLoading } = useWishlist();
  const clearWishlistMutation = useClearWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const products = Array.isArray(wishlistData?.wishlist) ? (wishlistData.wishlist as any[]) : [];

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> My Saved Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {products.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearWishlistMutation.mutate()}
            leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center glass-card rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500">
            Explore our catalog and tap the heart icon on any product to save it here.
          </p>
          <Link to="/products" className="inline-block pt-2">
            <Button variant="primary">Browse Catalog</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const price = product.price || 0;
            const priceAfterDiscount = product.priceAfterDiscount;
            const hasDiscount = priceAfterDiscount && priceAfterDiscount < price;

            return (
              <div
                key={product._id}
                className="glass-card rounded-3xl p-4 flex flex-col justify-between space-y-4 border border-slate-200/60 dark:border-slate-800"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={product.gallery?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFromWishlistMutation.mutate(product._id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-rose-500 shadow-md"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <Link to={`/products/${product._id}`}>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-primary-600 line-clamp-2">
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {formatCurrency(hasDiscount ? priceAfterDiscount! : price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full"
                  leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                  onClick={() => addToCartMutation.mutate({ productId: product._id })}
                >
                  Move to Cart
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

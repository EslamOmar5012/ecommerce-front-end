import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../domain/product.types';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { useAuthStore } from '../../store/useAuthStore';
import { useAddToCart } from '../../hooks/useCart';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../hooks/useWishlist';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addToCartMutation = useAddToCart();
  const { data: wishlistData } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const wishlistItems = Array.isArray(wishlistData?.wishlist) ? wishlistData.wishlist : [];
  const isInWishlist = wishlistItems.some((item) => (typeof item === 'object' && item ? item._id === product._id : item === product._id));

  const price = product.price || 0;
  const priceAfterDiscount = product.priceAfterDiscount;
  const hasDiscount = priceAfterDiscount && priceAfterDiscount < price;
  const discountPercent = product.discount?.discount || (hasDiscount ? Math.round(((price - priceAfterDiscount) / price) * 100) : 0);

  const isOutOfStock = product.stock === 0;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product._id);
    } else {
      addToWishlistMutation.mutate(product._id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({ productId: product._id, quantity: 1 });
  };

  return (
    <div className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Image Container with Hover Zoom */}
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.gallery?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Discount Pill Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md z-10">
            -{discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-slate-900 text-white text-xs font-extrabold uppercase px-3 py-1.5 rounded-xl border border-slate-700 shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-500 transition-colors shadow-sm z-20"
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
              isInWishlist ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-primary-600 dark:text-primary-400">
              {typeof product.category === 'object' ? product.category.name : 'Catalog'}
            </span>

            {/* Ratings */}
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating?.avg ? product.rating.avg.toFixed(1) : '4.5'}</span>
            </div>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatCurrency(price)}
              </span>
            )}
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              {formatCurrency(hasDiscount ? priceAfterDiscount! : price)}
            </span>
          </div>

          <Button
            size="sm"
            disabled={isOutOfStock}
            isLoading={addToCartMutation.isPending}
            onClick={handleAddToCart}
            leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

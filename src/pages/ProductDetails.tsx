import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useAuthStore } from '../store/useAuthStore';
import { useAddToCart } from '../hooks/useCart';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { formatCurrency } from '../core/utils/formatCurrency';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data: product, isLoading } = useProduct(id);
  const addToCartMutation = useAddToCart();
  const { data: wishlistData } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categoryId = typeof product?.category === 'object' ? product.category._id : product?.category;
  const { data: relatedProductsData } = useProducts({ categoryId, limit: 4 });
  const relatedProducts = (relatedProductsData?.data || []).filter((p) => p._id !== id);

  const wishlistItems = Array.isArray(wishlistData?.wishlist) ? wishlistData.wishlist : [];
  const isInWishlist = product ? wishlistItems.some((item) => (typeof item === 'object' && item ? item._id === product._id : item === product._id)) : false;

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : ['/placeholder.jpg'];
  const activeImage = images[activeImageIndex] || '/placeholder.jpg';

  const price = product.price || 0;
  const priceAfterDiscount = product.priceAfterDiscount;
  const hasDiscount = priceAfterDiscount && priceAfterDiscount < price;
  const discountPercent = product.discount?.discount || (hasDiscount ? Math.round(((price - priceAfterDiscount) / price) * 100) : 0);
  const isOutOfStock = product.stock === 0;

  const handleToggleWishlist = () => {
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({ productId: product._id, quantity });
  };

  return (
    <div className="space-y-16 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 bg-white">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                    activeImageIndex === index
                      ? 'border-primary-600 ring-2 ring-primary-500/20'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-3 py-1 rounded-lg">
                {typeof product.category === 'object' ? product.category.name : 'Category'}
              </span>
              {typeof product.brand === 'object' && (
                <span className="text-xs font-bold text-slate-500">Brand: {product.brand.name}</span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating?.avg ? product.rating.avg.toFixed(1) : '4.8'}</span>
                <span className="text-slate-400">({product.rating?.count || 24} reviews)</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={isOutOfStock ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} left)`}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-baseline gap-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(hasDiscount ? priceAfterDiscount! : price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-slate-400 line-through font-medium">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-slate-500">Quantity</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 py-3.5"
                disabled={isOutOfStock}
                isLoading={addToCartMutation.isPending}
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="w-5 h-5" />}
              >
                Add to Shopping Cart
              </Button>

              <button
                onClick={handleToggleWishlist}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isInWishlist
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary-500" />
              <span>Fast Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Authentic Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Related Products</h3>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Product } from '../../domain/product.types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center glass-card rounded-3xl p-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-2xl">
          🔍
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No products found</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          We couldn't find any products matching your search criteria or active filters. Try resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

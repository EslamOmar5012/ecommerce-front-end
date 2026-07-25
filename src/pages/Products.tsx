import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductQuery } from '../domain/product.types';
import { ProductFilter } from '../components/product/ProductFilter';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<ProductQuery>({
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    subCategoryId: searchParams.get('subCategoryId') || undefined,
    brandId: searchParams.get('brandId') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true' || undefined,
  });

  const { data: productsData, isLoading, isFetching } = useProducts(filters);

  const products = productsData?.data || [];
  const totalProducts = productsData?.total || products.length;
  const totalPages = productsData?.totalPages || Math.ceil(totalProducts / 12) || 1;
  const currentPage = filters.page || 1;

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.page && filters.page > 1) params.page = String(filters.page);
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.subCategoryId) params.subCategoryId = filters.subCategoryId;
    if (filters.brandId) params.brandId = filters.brandId;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;
    if (filters.minPrice) params.minPrice = String(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = String(filters.maxPrice);
    if (filters.inStock) params.inStock = 'true';

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters: ProductQuery) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 12 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {totalProducts} products
          </p>
        </div>
      </div>

      {/* Filter Sidebar & Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-24">
          <ProductFilter
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        <div className="lg:col-span-3 space-y-8">
          <ProductGrid products={products} isLoading={isLoading || isFetching} />

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>

              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-4">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

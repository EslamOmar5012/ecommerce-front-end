import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useCategories, useSubcategories, useBrands } from '../../hooks/useProducts';
import { ProductQuery } from '../../domain/product.types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProductFilterProps {
  filters: ProductQuery;
  onChange: (newFilters: ProductQuery) => void;
  onReset: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ filters, onChange, onReset }) => {
  const { data: categoriesData } = useCategories();
  const { data: subcategoriesData } = useSubcategories(filters.categoryId);
  const { data: brandsData } = useBrands();

  const categories = categoriesData?.data || [];
  const subcategories = subcategoriesData?.data || [];
  const brands = brandsData?.data || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value || undefined;
    onChange({ ...filters, categoryId, subCategoryId: undefined, page: 1 });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subCategoryId = e.target.value || undefined;
    onChange({ ...filters, subCategoryId, page: 1 });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value || undefined;
    onChange({ ...filters, brandId, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      onChange({ ...filters, sortBy: undefined, order: undefined });
      return;
    }
    const [sortBy, order] = value.split('-');
    onChange({ ...filters, sortBy, order: order as 'asc' | 'desc' });
  };

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span>Catalog Filters</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset
        </Button>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500 mb-1.5 block">Search</label>
        <Input
          placeholder="Search by name..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined, page: 1 })}
        />
      </div>

      {/* Sort Selector */}
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500 mb-1.5 block">Sort By</label>
        <select
          value={filters.sortBy ? `${filters.sortBy}-${filters.order || 'asc'}` : ''}
          onChange={handleSortChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">Default Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="rating.avg-desc">Highest Rated</option>
        </select>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500 mb-1.5 block">Category</label>
        <select
          value={filters.categoryId || ''}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      {subcategories.length > 0 && (
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500 mb-1.5 block">Subcategory</label>
          <select
            value={filters.subCategoryId || ''}
            onChange={handleSubCategoryChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Subcategories</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Brand Dropdown */}
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500 mb-1.5 block">Brand</label>
        <select
          value={filters.brandId || ''}
          onChange={handleBrandChange}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filters */}
      <div>
        <label className="text-xs font-semibold uppercase text-slate-500 mb-1.5 block">Price Range (EGP)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
          />
        </div>
      </div>

      {/* In Stock Checkbox */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="inStockOnly"
          checked={Boolean(filters.inStock)}
          onChange={(e) => onChange({ ...filters, inStock: e.target.checked || undefined, page: 1 })}
          className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700"
        />
        <label htmlFor="inStockOnly" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          In Stock Only
        </label>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ limit: 8 });
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({ limit: 6 });

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div className="space-y-16 py-6">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden glass-card border border-white/20 dark:border-slate-800/80 p-8 sm:p-12 lg:p-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" /> Premium Shopping Experience
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Discover Curated Quality for Your{' '}
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Modern Lifestyle
            </span>
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore high-grade electronics, fashion, and home essentials. Express shipping nationwide with secure online or cash payment options.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/products">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Shop Full Catalog
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Shop by Category</h2>
            <p className="text-xs text-slate-500">Browse through our top product collections</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            View All →
          </Link>
        </div>

        {isCategoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?categoryId=${cat._id}`}
                className="group glass-card p-4 rounded-2xl text-center hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 border border-slate-200/60 dark:border-slate-800"
              >
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                    {cat.name.charAt(0)}
                  </div>
                )}
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate w-full">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured / Trending Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Trending Products</h2>
            <p className="text-xs text-slate-500">Handpicked items with high popularity and discounts</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Explore All →
          </Link>
        </div>

        <ProductGrid products={products} isLoading={isProductsLoading} />
      </section>

      {/* Highlight Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary-200 bg-white/10 px-3 py-1 rounded-full">
            Limited Time Offer
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight">Save Big on Premium Electronics & Accessories</h3>
          <p className="text-sm text-white/80">
            Use checkout coupons to unlock exclusive discounts and enjoy free nationwide shipping on qualifying orders.
          </p>
        </div>
        <Link to="/products">
          <Button variant="secondary" size="lg" className="whitespace-nowrap shadow-lg">
            Shop Catalog Now
          </Button>
        </Link>
      </section>
    </div>
  );
};

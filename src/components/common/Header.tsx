import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User as UserIcon, Search, Menu, X, LogOut, LayoutDashboard, Package, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlist } from '../../hooks/useWishlist';
import { ThemeToggle } from './ThemeToggle';
import { APP_NAME } from '../../core/config/constants';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cartCount, openCart } = useCartStore();
  const { data: wishlistData } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const wishlistCount = Array.isArray(wishlistData?.wishlist) ? wishlistData.wishlist.length : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* X Logo — pure HTML/CSS, no SVG icon library */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 0 20px rgba(99,102,241,0.45)',
              transition: 'transform 0.25s',
            }}
            className="group-hover:scale-105"
          >
            {/* X made from two crossing bars */}
            <span
              style={{
                position: 'absolute',
                width: 22,
                height: 4,
                borderRadius: 3,
                background: '#fff',
                transform: 'rotate(45deg)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: 22,
                height: 4,
                borderRadius: 3,
                background: '#fff',
                transform: 'rotate(-45deg)',
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-600 dark:from-white dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400 -mt-1">
              Storefront
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-slate-700 dark:text-slate-300">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Products
          </Link>
          {isAuthenticated && (
            <Link to="/my-orders" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> My Orders
            </Link>
          )}
        </nav>

        {/* Action Icons & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Wishlist Button */}
          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 transition-transform hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={openCart}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center justify-center focus:outline-none"
            title="Cart Drawer"
          >
            <ShoppingBag className="w-5 h-5 transition-transform hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-600 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border border-primary-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-300 font-bold flex items-center justify-center text-sm border border-primary-500/30">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" /> My Profile
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <Package className="w-4 h-4 text-slate-400" /> My Orders
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-xl transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="flex flex-col gap-2 font-medium text-slate-700 dark:text-slate-300">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              All Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Wishlist</span>
                  <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">{wishlistCount}</span>
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  My Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

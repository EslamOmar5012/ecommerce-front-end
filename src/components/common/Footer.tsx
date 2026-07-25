import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';
import { APP_NAME } from '../../core/config/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
            <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Express Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fast shipping nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Secure Payments</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Paymob & Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Easy Returns</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">14 days money back guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">24/7 Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dedicated assistance anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              {APP_NAME}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Elevating online shopping with high-grade quality products, seamless checkout, and transparent tracking.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider text-xs">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400">Catalog</Link></li>
              <li><Link to="/cart" className="hover:text-primary-600 dark:hover:text-primary-400">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-600 dark:hover:text-primary-400">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider text-xs">
              Account
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/profile" className="hover:text-primary-600 dark:hover:text-primary-400">Profile</Link></li>
              <li><Link to="/my-orders" className="hover:text-primary-600 dark:hover:text-primary-400">Order History</Link></li>
              <li><Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400">Login</Link></li>
              <li><Link to="/signup" className="hover:text-primary-600 dark:hover:text-primary-400">Register</Link></li>
            </ul>
          </div>

          
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> using React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

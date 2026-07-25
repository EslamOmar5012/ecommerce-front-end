import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Profile } from './pages/Profile';
import { MyOrders } from './pages/MyOrders';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { VerifyOtp } from './pages/VerifyOtp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Admin
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageProducts } from './pages/admin/ManageProducts';
import { ManageCoupons } from './pages/admin/ManageCoupons';
import { ManageOrders } from './pages/admin/ManageOrders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

// Storefront layout wrapper (header + footer)
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <Header />
    <CartDrawer />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Admin routes — full-screen sidebar layout ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products"  element={<ManageProducts />} />
            <Route path="coupons"   element={<ManageCoupons />} />
            <Route path="orders"    element={<ManageOrders />} />
          </Route>

          {/* ── Storefront routes — header + footer layout ── */}
          <Route
            path="/*"
            element={
              <StorefrontLayout>
                <Routes>
                  {/* Public */}
                  <Route path="/"                element={<Home />} />
                  <Route path="/products"        element={<Products />} />
                  <Route path="/products/:id"    element={<ProductDetails />} />
                  <Route path="/login"           element={<Login />} />
                  <Route path="/signup"          element={<Signup />} />
                  <Route path="/verify-otp"      element={<VerifyOtp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password"  element={<ResetPassword />} />

                  {/* Protected User */}
                  <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/wishlist"      element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="/checkout"      element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                  <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/my-orders"     element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                </Routes>
              </StorefrontLayout>
            }
          />
        </Routes>

        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

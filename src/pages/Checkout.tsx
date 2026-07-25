import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Banknote, Tag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart, useClearCart } from '../hooks/useCart';
import { useValidateCoupon } from '../hooks/useCoupons';
import { useCreateCashOrder, useCreatePaymobOrder } from '../hooks/useOrders';
import { formatCurrency } from '../core/utils/formatCurrency';
import { PaymentIframeModal } from '../components/order/PaymentIframeModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const checkoutSchema = z.object({
  street: z.string().min(3, 'Street address must be at least 3 characters'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  postalCode: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { data: cartData } = useCart();
  const validateCouponMutation = useValidateCoupon();
  const createCashOrderMutation = useCreateCashOrder();
  const createPaymobOrderMutation = useCreatePaymobOrder();
  const clearCartMutation = useClearCart();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paymob'>('cash');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  const [paymobIframeUrl, setPaymobIframeUrl] = useState<string | undefined>(undefined);
  const [isPaymobModalOpen, setIsPaymobModalOpen] = useState(false);

  const cartItems = cartData?.items || [];
  const baseTotalPrice = cartData?.totalPrice || 0;

  const discountAmount = appliedDiscount ? (baseTotalPrice * appliedDiscount) / 100 : 0;
  const finalPrice = Math.max(0, baseTotalPrice - discountAmount);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: '',
      city: 'Cairo',
      country: 'Egypt',
      phone: '',
    },
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    validateCouponMutation.mutate(couponCode.trim(), {
      onSuccess: (coupon) => {
        setAppliedDiscount(coupon.discount);
      },
    });
  };

  const onSubmit = (data: CheckoutFormData) => {
    const payload = {
      shippingAddress: {
        street: data.street,
        city: data.city,
        country: data.country,
        phone: data.phone,
        postalCode: data.postalCode,
      },
      phone: data.phone,
      couponCode: appliedDiscount ? couponCode : undefined,
    };

    if (paymentMethod === 'cash') {
      createCashOrderMutation.mutate(payload, {
        onSuccess: (res) => {
          clearCartMutation.mutate();
          navigate('/order-success', { state: { order: res } });
        },
      });
    } else {
      createPaymobOrderMutation.mutate(payload, {
        onSuccess: (res) => {
          clearCartMutation.mutate();
          if (res.paymentUrl) {
            setPaymobIframeUrl(res.paymentUrl);
            setIsPaymobModalOpen(true);
          } else {
            navigate('/order-success', { state: { order: res.order } });
          }
        },
      });
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your shipping address & choose a payment option</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping & Payment Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Form */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">
              1. Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  placeholder="e.g. 123 Nile Corniche, Apt 4B"
                  {...register('street')}
                  error={errors.street?.message}
                />
              </div>

              <Input
                label="City"
                placeholder="e.g. Cairo"
                {...register('city')}
                error={errors.city?.message}
              />

              <Input
                label="Country"
                placeholder="e.g. Egypt"
                {...register('country')}
                error={errors.country?.message}
              />

              <Input
                label="Phone Number"
                placeholder="e.g. +201012345678"
                {...register('phone')}
                error={errors.phone?.message}
              />

              <Input
                label="Postal Code (Optional)"
                placeholder="e.g. 11511"
                {...register('postalCode')}
                error={errors.postalCode?.message}
              />
            </div>
          </div>

          {/* Payment Gateway Options */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  paymentMethod === 'cash'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Cash on Delivery</h4>
                  <p className="text-xs text-slate-500">Pay cash upon receiving your order</p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('paymob')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  paymentMethod === 'paymob'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Paymob Secure Card</h4>
                  <p className="text-xs text-slate-500">Visa / Mastercard via Paymob iframe</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="space-y-6">
          {/* Coupon Input */}
          <div className="glass-card rounded-3xl p-6 space-y-3 border border-slate-200/60 dark:border-slate-800">
            <label className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-500" /> Apply Coupon Code
            </label>

            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                isLoading={validateCouponMutation.isPending}
                onClick={handleApplyCoupon}
              >
                Apply
              </Button>
            </div>

            {appliedDiscount && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> {appliedDiscount}% discount active!
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/60 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal ({cartItems.length})</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(baseTotalPrice)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100">
                <span>Final Price</span>
                <span className="text-primary-600 dark:text-primary-400">{formatCurrency(finalPrice)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-base shadow-lg"
              isLoading={createCashOrderMutation.isPending || createPaymobOrderMutation.isPending}
            >
              {paymentMethod === 'cash' ? 'Place Cash Order' : 'Proceed to Paymob Payment'}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted SSL 256-bit payment security</span>
            </div>
          </div>
        </div>
      </form>

      {/* Paymob Iframe Modal */}
      <PaymentIframeModal
        isOpen={isPaymobModalOpen}
        onClose={() => setIsPaymobModalOpen(false)}
        iframeUrl={paymobIframeUrl}
      />
    </div>
  );
};

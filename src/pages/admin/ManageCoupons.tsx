import React, { useState } from 'react';
import { Tag, Plus, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { useCoupons, useCreateCoupon, useDeleteCoupon } from '../../hooks/useCoupons';
import { formatDate } from '../../core/utils/formatDate';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';

export const ManageCoupons: React.FC = () => {
  const { data: coupons = [], isLoading } = useCoupons();
  const createCouponMutation = useCreateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expires, setExpires] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCouponMutation.mutate(
      {
        code: code.toUpperCase(),
        discount: Number(discount),
        expireAt: new Date(expires).toISOString(),
        type: 'percentage',
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setCode('');
          setDiscount('');
          setExpires('');
        },
      }
    );
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-7 h-7 text-primary-600" /> Manage Store Coupons
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create and manage customer discount promo codes</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="py-20 text-center glass-card rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No coupons active</h3>
          <p className="text-xs text-slate-500">Create promotional codes for store customers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-extrabold text-lg text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-3 py-1 rounded-xl border border-primary-200 dark:border-primary-800">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => deleteCouponMutation.mutate(coupon._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {coupon.discount}% OFF
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Expires: {formatDate(coupon.expireAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active & Valid
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Promo Coupon">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. SUMMER20"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Input
            label="Discount Percentage (%)"
            type="number"
            placeholder="e.g. 20"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
          <Input
            label="Expiration Date"
            type="date"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            required
          />

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createCouponMutation.isPending}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

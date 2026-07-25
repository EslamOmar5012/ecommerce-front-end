import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useProducts, useCategories, useBrands, useCreateProduct, useUpdateProduct, useDeleteProduct, useSubcategories } from '../../hooks/useProducts';
import { Product } from '../../domain/product.types';
import { formatCurrency } from '../../core/utils/formatCurrency';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';

export const ManageProducts: React.FC = () => {
  const [page] = useState(1);
  const { data: productsData, isLoading } = useProducts({ page, limit: 20 });
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceAfterDiscount, setPriceAfterDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [imageCoverFile, setImageCoverFile] = useState<File | null>(null);

  const { data: subcategoriesData } = useSubcategories(categoryId || undefined);
  const subcategories = subcategoriesData?.data || [];

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setPriceAfterDiscount('');
    setQuantity('10');
    setCategoryId(categories[0]?._id || '');
    setSubCategoryId('');
    setBrandId(brands[0]?._id || '');
    setImageCoverFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setPriceAfterDiscount(product.priceAfterDiscount ? String(product.priceAfterDiscount) : '');
    setQuantity(String(product.stock));
    setCategoryId(typeof product.category === 'object' ? product.category._id : product.category || '');
    setSubCategoryId(typeof product.subCategory === 'object' ? product.subCategory._id : product.subCategory || '');
    setBrandId(typeof product.brand === 'object' ? product.brand._id : product.brand || '');
    setImageCoverFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', title);
    formData.append('description', description);
    formData.append('price', price);
    if (priceAfterDiscount) formData.append('priceAfterDiscount', priceAfterDiscount);
    formData.append('stock', quantity);
    if (categoryId) formData.append('category', categoryId);
    if (subCategoryId) formData.append('subCategory', subCategoryId);
    if (brandId) formData.append('brand', brandId);
    if (imageCoverFile) formData.append('gallery', imageCoverFile);

    if (editingProduct) {
      updateProductMutation.mutate(
        { id: editingProduct._id, formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createProductMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-7 h-7 text-primary-600" /> Manage Store Products
          </h1>
          <p className="text-xs text-slate-500 mt-1">Add, update, or soft delete catalog items</p>
        </div>

        <Button onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Product
        </Button>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.gallery?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {product.name}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(product.priceAfterDiscount || product.price)}
                    </td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      {typeof product.category === 'object' ? product.category.name : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProductMutation.mutate(product._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (EGP)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Input
              label="Price After Discount"
              type="number"
              value={priceAfterDiscount}
              onChange={(e) => setPriceAfterDiscount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Input label="Quantity Stock" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Category</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubCategoryId('');
                }}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Subcategory</label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImageCoverFile(e.target.files[0])}
              className="text-xs text-slate-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

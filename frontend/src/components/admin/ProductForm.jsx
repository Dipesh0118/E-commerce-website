// File: frontend/src/components/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createProduct, updateProduct, getProductById } from '../../services/api';
import { toast } from 'sonner';

const ProductForm = ({ onSuccess, isEdit }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
    imageFile: null,
    preview: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Accessories', 'Gaming', 'Laptops', 'Smartphones'];

  // load existing product when editing
  useEffect(() => {
    if (productId) {
      (async () => {
        try {
          const product = await getProductById(productId);
          setFormData({
            name: product.name || '',
            brand: product.brand || '',
            category: product.category || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            countInStock: product.countInStock?.toString() || '',
            imageFile: null,
            preview: product.image || ''
          });
        } catch {
          toast.error('Failed to load product data');
          onSuccess?.();
        }
      })();
    }
  }, [productId, onSuccess]);

  const handleChange = e => {
    const { name, type } = e.target;
    // read actual number for <input type="number">, otherwise a string
    const value = type === 'number'
      ? e.target.valueAsNumber // gives you a Number
      : e.target.value;
  
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      preview: file ? URL.createObjectURL(file) : prev.preview
    }));
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      return toast.error('Name and Price are required');
    }

    setLoading(true);
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('brand', formData.brand);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('countInStock', formData.countInStock);
    if (formData.imageFile) payload.append('image', formData.imageFile);

    try {
      if (productId) {
        await updateProduct(productId, payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct(payload);
        toast.success('Product created successfully');
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-8 bg-base-100 rounded-xl shadow-2xl border border-base-300"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {productId ? 'Edit Product' : 'New Product'}
        </h2>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-outline hover:btn-ghost transition-all"
        >
          ← Dashboard
        </button>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Product Name *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered input-lg focus:ring-2 focus:ring-primary"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Brand */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Brand</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input input-bordered input-lg focus:ring-2 focus:ring-primary"
              placeholder="Brand name"
            />
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Category *</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered select-lg focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Choose Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Price *</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-xl">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input input-bordered input-lg pl-12 focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Stock Count */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-semibold">Stock Count</span>
            </label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className="input input-bordered input-lg focus:ring-2 focus:ring-primary"
              placeholder="Quantity available"
              min="0"
            />
          </div>

          {/* Image Upload */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Product Image</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-lg w-full max-w-md"
              />
              {formData.preview && (
                <div className="avatar">
                  <div className="w-32 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={formData.preview} alt="Preview" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered h-32 focus:ring-2 focus:ring-primary"
            placeholder="Product description"
          />
        </div>

        {/* Submit */}
        <div className="form-control pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`btn btn-lg btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {productId ? 'Update Product' : 'Create Product'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;

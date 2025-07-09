import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { toast } from 'sonner';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ page = 1, limit = 8, keyword = '', categories = [], category = '', sortBy = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (keyword) params.append('keyword', keyword);
      
      // Support both single category and multiple categories
      if (categories && categories.length > 0) {
        categories.forEach(cat => params.append('categories', cat));
      } else if (category && category !== 'All') {
        params.append('category', category);
      }
      
      if (sortBy) params.append('sortBy', sortBy);

      const response = await api.get(`/api/products?${params.toString()}`);

      const totalCount = parseInt(response.headers['x-total-count']) || 0;
      const currentPage = parseInt(response.headers['x-page']) || 1;
      const pageSize = parseInt(response.headers['x-page-size']) || limit;
      const totalPages = parseInt(response.headers['x-total-pages']) || Math.ceil(totalCount / pageSize);

      return {
        products: response.data,
        totalCount,
        currentPage,
        pageSize,
        totalPages
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${id}`);
      return id; // Return the product ID to delete from the store
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/products/categories');
      return response.data; // e.g. ["Laptops", "Smartphones", "Gaming", "Accessories"]
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    currentProduct: null,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 8,
    totalPages: 1,
    // start with just "All" until we fetch real ones
    categories: []
  },
  reducers: {
    // Add reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product._id !== action.payload);
        toast.success('Product deleted successfully');
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete product');
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to fetch product');
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // Don't add "All" here as it'll be handled in the UI
        state.categories = action.payload;
      });
  },
});

export default productSlice.reducer;
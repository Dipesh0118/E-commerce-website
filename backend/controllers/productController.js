import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    // Validate required fields directly from form-data
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    // Build product object
    const productData = {
      name: req.body.name,
      brand: req.body.brand || 'Generic',
      category: req.body.category || 'All',
      description: req.body.description || '',
      price: parseFloat(req.body.price),
      countInStock: parseInt(req.body.countInStock) || 0,
      image: ''
    };
    // Handle image upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
        use_filename: true,
        unique_filename: false
      });
      productData.image = result.secure_url;
      fs.unlinkSync(req.file.path); // Cleanup temp file
    }
    // Create and save product
    const product = new Product(productData);
    const createdProduct = await product.save();
    
    res.status(201).json({
      _id: createdProduct._id,
      ...productData,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all products with pagination, sorting, multi-category
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  // keyword filter
  const keywordFilter = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  // multi-category support
  let categoryFilter = {};
  if (req.query.categories) {
    // Express turns repeated ?categories=a&categories=b into an array
    const cats = Array.isArray(req.query.categories)
      ? req.query.categories
      : [req.query.categories];
    if (cats.length && !cats.includes('All')) {
      categoryFilter = { category: { $in: cats } };
    }
  }

  const filters = { ...keywordFilter, ...categoryFilter };

  // sorting
  let sort = {};
  if (req.query.sortBy) {
    const field = req.query.sortBy.startsWith('-')
      ? req.query.sortBy.substring(1)
      : req.query.sortBy;
    const order = req.query.sortBy.startsWith('-') ? -1 : 1;
    sort[field] = order;
  }

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.set('X-Total-Count', count.toString());
  res.set('X-Page', page.toString());
  res.set('X-Page-Size', pageSize.toString());
  res.set('X-Total-Pages', Math.ceil(count / pageSize).toString());
  res.json(products);
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  const cats = await Product.distinct('category');
  res.json(cats);
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) return res.json(product);
  res.status(404).json({ message: 'Product not found' });
};


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  const {
    name,
    brand,
    category,
    description,
    price,
    countInStock,
    image
  } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // If new image uploaded via file, replace
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products'
    });
    product.image = result.secure_url;
    fs.unlinkSync(req.file.path);
  } else if (image) {
    // If image URL is provided in the body
    product.image = image;
  }
  
  // Update other fields
  product.name = name || product.name;
  product.brand = brand || product.brand;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price !== undefined ? price : product.price;
  product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
  
  const updatedProduct = await product.save();
  res.json(updatedProduct);
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Use deleteOne() (or findByIdAndDelete) instead of remove()
    await product.deleteOne();

    return res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('Error deleting product:', err);
    // include err.message so the client at least sees what went wrong
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
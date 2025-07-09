import Category from '../models/CategoryModel.js';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  
  const category = new Category({ name, description });
  const created = await category.save();
  res.status(201).json(created);
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = name;
    category.description = description;
    const updated = await category.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

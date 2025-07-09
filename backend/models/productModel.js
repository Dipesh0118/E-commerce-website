import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    image: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    // reviews: [
    //   {
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     name: String,
    //     rating: Number,
    //     comment: String,
    //   },
    // ],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

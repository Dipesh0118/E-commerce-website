import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:9009/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 flex flex-col md:flex-row gap-8">
      <img src={product.image} alt={product.name} className="w-full md:w-1/3 rounded-lg shadow" />
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-2">₹ {product.price}</p>
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

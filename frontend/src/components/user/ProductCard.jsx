import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow rounded-lg flex flex-col">
      <figure>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
      </figure>
      <div className="card-body flex flex-col flex-grow">
        <h2 className="card-title">{product.name}</h2>
        <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-600 flex-grow">{product.description?.substring(0, 60)}...</p>
        <div className="card-actions justify-between items-center mt-4">
          <Link to={`/product/${product._id}`} className="btn btn-link p-0">
            View Details
          </Link>
          <button className="btn btn-primary btn-sm" onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

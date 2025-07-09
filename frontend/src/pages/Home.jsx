import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../redux/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/user/ProductCard';
import Pagination from '../components/common/Pagination';

const Home = () => {
  const dispatch = useDispatch();
  const { 
    products, 
    loading, 
    error, 
    totalCount, 
    currentPage, 
    totalPages, 
    categories 
  } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');

  // load categories once
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // load products whenever filters change
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 8,
        keyword: searchTerm,
        categories: selectedCats,
        sortBy,
      })
    );
  }, [dispatch, currentPage, searchTerm, selectedCats, sortBy]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
  };

  const handleSearch = () => {
    dispatch(
      fetchProducts({ 
        page: 1, 
        limit: 8,
        keyword: searchTerm, 
        categories: selectedCats, 
        sortBy 
      })
    );
  };

  const toggleCat = (cat) => {
    setSelectedCats((prev) => {
      const updatedCats = prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat];
  
      // Manually fetch products with new category filter
      dispatch(
        fetchProducts({
          page: 1,
          limit: 8,
          keyword: searchTerm,
          categories: updatedCats,
          sortBy,
        })
      );
  
      return updatedCats;
    });
  };
  

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    dispatch(
      fetchProducts({ 
        page: 1, 
        limit: 8,
        keyword: searchTerm, 
        categories: selectedCats, 
        sortBy: e.target.value 
      })
    );
  };

  const handlePageChange = (page) => {
    dispatch(
      fetchProducts({ 
        page, 
        limit: 8,
        keyword: searchTerm, 
        categories: selectedCats, 
        sortBy 
      })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-center md:text-left">Electronic Products</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Categories multi-checkbox dropdown (DaisyUI) */}
          <div className="dropdown">
            <label tabIndex={0} className="btn m-1">Categories</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li key="all">
                <a onClick={() => setSelectedCats([])} className="cursor-pointer">
                  All
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat)}
                      onChange={() => toggleCat(cat)}
                    />
                    {cat}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="select select-bordered w-full md:w-auto"
          >
            <option value="createdAt">Filters</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>

          {/* Search */}
          <div className="form-control w-full md:w-64">
  <div className="input-group">
    <input
      type="text"
      placeholder="Search products..."
      className="input input-bordered w-full"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button className="btn btn-primary" onClick={handleSearch}>🔍</button>
  </div>
</div>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <div>{error}</div>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <p className="text-center mt-2 text-gray-600">
            Page {currentPage} of {totalPages} • {totalCount} total products
          </p>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl">No products found</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() => {
              setSearchTerm('');
              setSelectedCats([]);
              setSortBy('createdAt');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductList = ({ category, subcategories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/${category}`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
          // Set max price based on actual product prices
          const prices = data.data.map(p => p.price);
          const maxProductPrice = Math.max(...prices);
          setMaxPrice(Math.ceil(maxProductPrice * 1.1)); // Add 10% buffer
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleMinPriceChange = (value) => {
    const numValue = Number(value);
    const newMin = Math.max(0, Math.min(numValue, maxPrice - 1));
    setMinPrice(newMin);
  };

  const handleMaxPriceChange = (value) => {
    const numValue = Number(value);
    const newMax = Math.max(minPrice + 1, Math.min(numValue, 10000));
    setMaxPrice(newMax);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubcategory('all');
    setMinPrice(0);
    // Reset max price to the highest product price or 1000
    const prices = products.map(p => p.price);
    const maxProductPrice = Math.max(...prices, 1000);
    setMaxPrice(Math.ceil(maxProductPrice * 1.1));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate the percentage for the range slider styling
  const minPercent = (minPrice / maxPrice) * 100;
  const maxPercent = 100 - (maxPrice / (maxPrice + 100)) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IoMdClose />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-4 py-2 rounded-lg text-left transition-colors ${selectedSubcategory === 'all'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  All
                </button>
                {subcategories.map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => setSelectedSubcategory(subcat)}
                    className={`px-4 py-2 rounded-lg text-left transition-colors ${selectedSubcategory === subcat
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${minPrice} - ${maxPrice}
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      max={maxPrice - 1}
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      min={minPrice + 1}
                      max="10000"
                    />
                  </div>
                </div>

                {/* Enhanced Range Slider - Now with proper dragging */}
                <div className="relative h-10">
                  {/* Track background */}
                  <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

                  {/* Active range */}
                  <div
                    className="absolute top-1/2 h-1.5 bg-green-500 rounded-full transform -translate-y-1/2"
                    style={{
                      left: `${(minPrice / 10000) * 100}%`,
                      right: `${100 - (maxPrice / 10000) * 100}%`
                    }}
                  ></div>

                  {/* Min price handle */}
                  <div
                    className="absolute top-1/2 w-5 h-5 bg-white border-2 border-green-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-pointer shadow-md z-10"
                    style={{ left: `${(minPrice / 10000) * 100}%` }}
                    onMouseDown={(e) => {
                      const slider = e.currentTarget.parentElement;
                      const startX = e.clientX;
                      const startLeft = minPrice;

                      const handleMouseMove = (moveEvent) => {
                        const sliderWidth = slider.offsetWidth;
                        const diffX = moveEvent.clientX - startX;
                        const diffPercent = (diffX / sliderWidth) * 100;
                        const newValue = Math.max(0, Math.min(
                          startLeft + Math.round((diffPercent / 100) * 10000),
                          maxPrice - 1
                        ));
                        setMinPrice(newValue);
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  ></div>

                  {/* Max price handle */}
                  <div
                    className="absolute top-1/2 w-5 h-5 bg-white border-2 border-green-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-pointer shadow-md z-10"
                    style={{ left: `${(maxPrice / 10000) * 100}%` }}
                    onMouseDown={(e) => {
                      const slider = e.currentTarget.parentElement;
                      const startX = e.clientX;
                      const startRight = maxPrice;

                      const handleMouseMove = (moveEvent) => {
                        const sliderWidth = slider.offsetWidth;
                        const diffX = moveEvent.clientX - startX;
                        const diffPercent = (diffX / sliderWidth) * 100;
                        const newValue = Math.min(10000, Math.max(
                          startRight + Math.round((diffPercent / 100) * 10000),
                          minPrice + 1
                        ));
                        setMaxPrice(newValue);
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <p className="text-gray-600">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600 text-lg mb-4">No products found matching your criteria.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden group">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        to={`/product/${product._id}`}
                        className="px-6 py-3 bg-white text-green-600 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">${product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { FaHeart, FaTrash, FaShoppingCart, FaLeaf, FaTools, FaSeedling, FaFlask } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthProvider';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/users/${user.uid}/wishlist`);
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/users/${user.uid}/wishlist/${productId}`);
      if (response.data.success) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'plants':
        return <FaLeaf className="text-green-600" />;
      case 'tools':
        return <FaTools className="text-blue-600" />;
      case 'soils':
        return <FaSeedling className="text-brown-600" />;
      case 'fertilizers':
        return <FaFlask className="text-purple-600" />;
      default:
        return <FaLeaf className="text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlist.length === 0 
            ? "Your wishlist is empty. Start adding products you love!"
            : `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`
          }
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Start exploring our products and add your favorites to your wishlist!</p>
          <Link
            to="/plants"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaLeaf className="mr-2" />
            Browse Plants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div key={item.productId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <FaTrash className="text-red-500 text-sm" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    {getCategoryIcon(item.productType)}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {item.productType}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-600">
                      ৳{Number(product.price).toFixed(2)}
                    </span>
                    {product.stock > 0 ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 text-center py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                    {product.stock > 0 && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <FaShoppingCart className="text-xs" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 
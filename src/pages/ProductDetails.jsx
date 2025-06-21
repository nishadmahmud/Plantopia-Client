import { useParams, Link } from 'react-router';
import { FaLeaf, FaRuler, FaSun, FaTint, FaInfoCircle, FaHeart, FaShare, FaTruck, FaBox, FaShieldAlt, FaShoppingCart, FaThermometerHalf, FaTools, FaSeedling, FaFlask, FaPaw, FaClock, FaTree, FaWeight, FaRecycle, FaCheck, FaWater, FaComment, FaReply, FaTrash } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../auth/AuthProvider';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // comment._id to reply to
  const [replyText, setReplyText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // comment._id to confirm deletion
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // First, try to fetch from each category endpoint until we find the product
        const categories = ['plants', 'tools', 'soils', 'fertilizers'];
        let productData = null;

        for (const category of categories) {
          try {
            const response = await axios.get(`http://localhost:3000/api/${category}/${id}`);
            if (response.data.success) {
              productData = { ...response.data.data, category };
              break;
            }
          } catch {
            continue; // Try next category
          }
        }

        if (!productData) {
          throw new Error('Product not found');
        }

        setProduct(productData);
        
        // Check if product is in user's wishlist
        if (user) {
          checkWishlistStatus(productData._id);
        }
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user]);

  const checkWishlistStatus = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${user.uid}/wishlist`);
      if (response.data.success) {
        const isWishlisted = response.data.data.some(item => item.productId === productId);
        setIsInWishlist(isWishlisted);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`http://localhost:3000/api/users/${user.uid}/wishlist/${product._id}`);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(`http://localhost:3000/api/users/${user.uid}/wishlist`, {
          productId: product._id,
          productType: product.category
        });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/api/${product.category}/${product._id}/comments`, {
        text: newComment,
        user: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
      });

      if (res.data.success) {
        toast.success('Comment posted!');
        setProduct(prev => ({ ...prev, comments: [res.data.data, ...prev.comments] }));
        setNewComment('');
      }
    } catch (err) {
      toast.error('Failed to post comment.');
      console.error(err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!user) {
      toast.error('You must be logged in to reply.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/api/${product.category}/${product._id}/comments/${commentId}/replies`, {
        text: replyText,
        user: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
      });

      if (res.data.success) {
        toast.success('Reply posted!');
        const updatedComments = product.comments.map(c => {
          if (c._id === commentId) {
            return { ...c, replies: [...(c.replies || []), res.data.data] };
          }
          return c;
        });
        setProduct(prev => ({ ...prev, comments: updatedComments }));
        setReplyTo(null);
        setReplyText('');
      }
    } catch (err) {
      toast.error('Failed to post reply.');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.error('You must be logged in to delete comments.');
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:3000/api/${product.category}/${product._id}/comments/${commentId}`, {
        data: { userUid: user.uid }
      });

      if (res.data.success) {
        toast.success('Comment deleted!');
        setProduct(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c._id !== commentId)
        }));
        setDeleteConfirm(null); // Close confirmation dialog
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('You can only delete your own comments.');
      } else {
        toast.error('Failed to delete comment.');
      }
      console.error(err);
    }
  };

  const renderPlantDetails = (product) => (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-semibold text-gray-900">Plant Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaSun className="text-yellow-500 text-xl" />
            <div>
              <p className="font-medium">Sunlight Needs</p>
              <p className="text-gray-600">{product.sunlightNeeds}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaTint className="text-blue-500 text-xl" />
            <div>
              <p className="font-medium">Watering Frequency</p>
              <p className="text-gray-600">{product.wateringFrequency}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaRuler className="text-gray-500 text-xl" />
            <div>
              <p className="font-medium">Mature Height</p>
              <p className="text-gray-600">{product.matureHeight}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaPaw className="text-purple-500 text-xl" />
            <div>
              <p className="font-medium">Pet Friendly</p>
              <p className="text-gray-600">{product.isPetFriendly ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaClock className="text-orange-500 text-xl" />
            <div>
              <p className="font-medium">Growth Rate</p>
              <p className="text-gray-600">{product.growthRate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaTree className="text-green-600 text-xl" />
            <div>
              <p className="font-medium">Environment</p>
              <p className="text-gray-600">{product.environment}</p>
            </div>
          </div>
        </div>
      </div>
      {product.seasonalCare && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Seasonal Care Instructions</h4>
          <p className="text-gray-600">{product.seasonalCare}</p>
        </div>
      )}
    </div>
  );

  const renderToolDetails = (product) => (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-semibold text-gray-900">Tool Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaTools className="text-gray-600 text-xl" />
            <div>
              <p className="font-medium">Material</p>
              <p className="text-gray-600">{product.material}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaRuler className="text-blue-500 text-xl" />
            <div>
              <p className="font-medium">Dimensions</p>
              <p className="text-gray-600">{product.dimensions}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaWeight className="text-gray-500 text-xl" />
            <div>
              <p className="font-medium">Weight</p>
              <p className="text-gray-600">{product.weight}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-green-500 text-xl" />
            <div>
              <p className="font-medium">Warranty</p>
              <p className="text-gray-600">{product.warranty}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaWater className="text-blue-500 text-xl" />
            <div>
              <p className="font-medium">Weather Resistant</p>
              <p className="text-gray-600">{product.isWeatherResistant ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
      {product.safetyInstructions && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Safety Instructions</h4>
          <p className="text-gray-600">{product.safetyInstructions}</p>
        </div>
      )}
      {product.maintenanceInstructions && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Maintenance Instructions</h4>
          <p className="text-gray-600">{product.maintenanceInstructions}</p>
        </div>
      )}
    </div>
  );

  const renderSoilDetails = (product) => (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-semibold text-gray-900">Soil Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaFlask className="text-purple-500 text-xl" />
            <div>
              <p className="font-medium">pH Level</p>
              <p className="text-gray-600">{product.phLevel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaSeedling className="text-green-500 text-xl" />
            <div>
              <p className="font-medium">Nutrients</p>
              <p className="text-gray-600">{product.nutrients?.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaRecycle className="text-green-600 text-xl" />
            <div>
              <p className="font-medium">Organic Status</p>
              <p className="text-gray-600">{product.isOrganic ? 'Organic' : 'Conventional'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaWater className="text-blue-500 text-xl" />
            <div>
              <p className="font-medium">Water Retention</p>
              <p className="text-gray-600">{product.waterRetention}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaCheck className="text-green-500 text-xl" />
            <div>
              <p className="font-medium">Coverage Area</p>
              <p className="text-gray-600">{product.coverageArea}</p>
            </div>
          </div>
        </div>
      </div>
      {product.applicationInstructions && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Application Instructions</h4>
          <p className="text-gray-600">{product.applicationInstructions}</p>
        </div>
      )}
      {product.storageInstructions && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Storage Instructions</h4>
          <p className="text-gray-600">{product.storageInstructions}</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="space-y-8">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="mt-6 inline-block text-green-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link to={`/${product.category}`} className="hover:text-green-600">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
      </Link>
        <span>/</span>
        <span className="text-green-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain p-4"
            />
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>

            {/* New Comment Form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex items-start space-x-4">
                  <img src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt={user.displayName} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a public comment..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      rows="3"
                    ></textarea>
                    <button type="submit" className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Post Comment</button>
                  </div>
                </div>
              </form>
            )}

            {/* Existing Comments */}
            <div className="space-y-6">
              {(product.comments && product.comments.length > 0) ? product.comments.map(comment => (
                <div key={comment._id} className="flex items-start space-x-4">
                  <img src={comment.user?.photoURL || `https://i.pravatar.cc/150?u=${comment.user?.uid}`} alt={comment.user?.displayName} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p>
                        <span className="font-semibold">{comment.user?.displayName}</span>
                        <span className="text-sm text-gray-500 ml-2">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </p>
                      {user && comment.user?.uid === user.uid && (
                        <div className="flex items-center space-x-2">
                          {deleteConfirm === comment._id ? (
                            <>
                              <span className="text-sm text-gray-600">Delete this comment?</span>
                              <button 
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Yes
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => setDeleteConfirm(comment._id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                              title="Delete comment"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                    <button onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)} className="text-sm text-green-600 hover:underline mt-1">Reply</button>

                    {/* Reply Form */}
                    {replyTo === comment._id && (
                      <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="mt-4 ml-4">
                        <div className="flex items-start space-x-4">
                          <img src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt={user.displayName} className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Replying to ${comment.user?.displayName}...`}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                              rows="2"
                            ></textarea>
                            <button type="submit" className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Post Reply</button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply._id} className="flex items-start space-x-3">
                            <img src={reply.user?.photoURL || `https://i.pravatar.cc/150?u=${reply.user?.uid}`} alt={reply.user?.displayName} className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                              <p>
                                <span className="font-semibold">{reply.user?.displayName}</span>
                                <span className="text-sm text-gray-500 ml-2">{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </p>
                              <p className="text-gray-700">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )) : <p>No comments yet. Be the first to comment!</p>}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600">{product.subcategory}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Share"
                >
                  <FaShare className="text-gray-600 text-xl" />
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist 
                      ? 'text-red-500 hover:bg-red-50' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FaHeart className={`text-xl ${wishlistLoading ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-green-600">৳{product.price}</span>
              {product.stock > 0 ? (
                <span className="ml-4 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="ml-4 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-green max-w-none">
            <p className="text-gray-700 text-lg">{product.description}</p>
          </div>

          {/* Category-specific details */}
          {product.category === 'plants' && renderPlantDetails(product)}
          {product.category === 'tools' && renderToolDetails(product)}
          {(product.category === 'soils' || product.category === 'fertilizers') && renderSoilDetails(product)}

          {/* Care Instructions */}
          {product.careInstructions && product.careInstructions.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <FaLeaf className="text-green-600 flex-shrink-0" />
                    <span>{instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Section */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 py-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 text-gray-600 hover:text-green-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 text-gray-600 hover:text-green-600 disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <FaInfoCircle className="text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <FaTruck className="text-green-600 text-2xl" />
                <div>
                  <p className="font-medium">Fixed Shipping Rate</p>
                  <p className="text-sm text-gray-600">৳100 for all orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaBox className="text-green-600 text-2xl" />
                <div>
                  <p className="font-medium">Secure Packaging</p>
                  <p className="text-sm text-gray-600">Safe delivery guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-green-600 text-2xl" />
                <div>
                  <p className="font-medium">14-Day Returns</p>
                  <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
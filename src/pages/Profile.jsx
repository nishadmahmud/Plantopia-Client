import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaBox, FaShoppingBag, FaTrash, FaCamera, FaUpload } from 'react-icons/fa';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { API_URL } from '../utils/api';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=E0F2F1&color=388E3C&rounded=true';

const Profile = () => {
  const { user, updateUserProfile, loading: authLoading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Form state for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const response = await axios.get(`${API_URL}/api/users/${user.uid}`);
          if (response.data.success) {
            setUserData(response.data.data);
            if (response.data.data.shippingAddress) {
              setShippingAddress(response.data.data.shippingAddress);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhoto(user.photoURL || '');
    }
  }, [user]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

              const response = await axios.post(`${API_URL}/api/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPhoto(response.data.imageUrl);
        setSelectedImage(null);
        setImagePreview(null);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Function to handle order deletion
  const handleOrderDelete = (orderId) => {
    if (userData?.orders) {
      setUserData({
        ...userData,
        orders: userData.orders.filter(order => order._id !== orderId)
      });
    }
  };

  // Function to handle direct order deletion from order cards
  const handleDirectOrderDelete = async (orderId, e) => {
    e.stopPropagation(); // Prevent opening the modal
    
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
              const response = await axios.delete(`${API_URL}/api/orders/${orderId}`, {
        data: { userId: user.uid }
      });

      if (response.data.success) {
        toast.success('Order deleted successfully');
        handleOrderDelete(orderId);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(name, photo);
              await axios.put(`${API_URL}/api/users/${user.uid}`, {
        displayName: name,
        photoURL: photo,
        email: user.email,
        shippingAddress
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ProfileField = ({ label, value, editable = true, type = "text" }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing && editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => {
            if (label === "Display Name") setName(e.target.value);
            if (label === "Photo URL") setPhoto(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      ) : (
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          {label === "Photo URL" ? "" : (value || 'Not set')}
        </div>
      )}
    </div>
  );

  const AddressField = ({ label, name, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
              <input
                type="text"
          name={name}
          value={value}
          onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <div className="px-4 py-2 bg-gray-50 rounded-lg">{value || 'Not set'}</div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-50 p-6 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={imagePreview || photo || defaultAvatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                      }}
                    />
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <FaCamera className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{name || 'User'}</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-green-600 hover:text-green-700"
                >
                  {isEditing ? (
                    <span className="text-gray-600">Cancel</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <ProfileField label="Display Name" value={name} />
                  <ProfileField label="Email" value={user.email} editable={false} />
                  
                  {/* Image Upload Section */}
                  {isEditing && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                      <div className="space-y-4">
                        {/* Image Upload Input */}
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                            <div className="text-center">
                              <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">Upload Image</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                            />
                          </label>
                          
                          {/* Upload Button */}
                          {selectedImage && (
                            <button
                              type="button"
                              onClick={handleImageUpload}
                              disabled={uploadingImage}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                            >
                              {uploadingImage ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <FaUpload className="w-4 h-4" />
                                  <span>Upload</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        
                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                            />
                          </div>
                        )}
                        
                        {/* Current Photo URL Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Or enter photo URL</label>
                          <input
                            type="url"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter photo URL"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddressField label="Street Address" name="address" value={shippingAddress.address} />
                    <AddressField label="City" name="city" value={shippingAddress.city} />
                    <AddressField label="State" name="state" value={shippingAddress.state} />
                    <AddressField label="Postal Code" name="postalCode" value={shippingAddress.postalCode} />
                    <AddressField label="Country" name="country" value={shippingAddress.country} />
                    <AddressField label="Phone" name="phone" value={shippingAddress.phone} />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                      className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                      {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Orders Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-50 p-6 border-b border-green-100">
              <h2 className="text-2xl font-semibold text-gray-900">My Orders</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userData?.orders?.length > 0 ? (
                  userData.orders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 hover:border-green-500 relative"
                    >
                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDirectOrderDelete(order._id, e)}
                        className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete order"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaBox className="text-green-600" />
                          <span>{order.items.length} items</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaShoppingBag className="text-green-600" />
                          <span>Total: ${order.summary.total.toFixed(2)}</span>
                        </div>
                        <div className="text-green-600 hover:text-green-700">
                          View Details →
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg shadow">
                    <FaBox className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start shopping to see your orders here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          isAdmin={false}
          onOrderDelete={handleDirectOrderDelete}
        />
      )}
    </div>
  );
};

export default Profile; 
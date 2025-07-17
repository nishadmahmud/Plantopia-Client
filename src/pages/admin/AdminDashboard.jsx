import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import AddProductForm from './AddProductForm';
import { FaBox, FaUsers, FaShoppingBag, FaPlus, FaEdit, FaTrash, FaTimes, FaLeaf, FaTools, FaSeedling, FaFlask } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddPlantForm from './AddPlantForm';
import AddToolForm from './AddToolForm';
import AddSoilForm from './AddSoilForm';
import AddFertilizerForm from './AddFertilizerForm';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import AddBlogForm from './AddBlogForm';
import { API_URL } from '../../utils/api';

export const productCategories = [
  { id: 'plants', label: 'Plants', subcategories: ['Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Fruit Plants'] },
  { id: 'tools', label: 'Tools', subcategories: ['Gardening Tools', 'Watering Tools', 'Plant Care Tools'] },
  { id: 'soils', label: 'Soils', subcategories: ['Potting Mix', 'Garden Soil', 'Organic Soil'] },
  { id: 'fertilizers', label: 'Fertilizers', subcategories: ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Food'] }
];

const AdminDashboard = () => {
  const [selectedMainTab, setSelectedMainTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, blogsRes, ...productResponses] = await Promise.all([
        axios.get(`${API_URL}/api/orders`),
        axios.get(`${API_URL}/api/users`),
        axios.get(`${API_URL}/api/blogs`),
        ...productCategories.map(category => 
          axios.get(`${API_URL}/api/${category.id}`)
        )
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
      if (blogsRes.data.success) {
        setBlogs(blogsRes.data.data);
      }

      // Combine all products from different categories and add category info
      const allProducts = productResponses.reduce((acc, response, index) => {
        if (response.data.success) {
          const categoryId = productCategories[index].id;
          const productsWithCategory = response.data.data.map(product => ({
            ...product,
            category: categoryId,
            categoryLabel: productCategories[index].label
          }));
          return [...acc, ...productsWithCategory];
        }
        return acc;
      }, []);
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/${product.category}/${product._id}`);
        if (response.data.success) {
          toast.success('Product deleted successfully');
          setProducts(products.filter(p => p._id !== product._id));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setSelectedCategory(product.category);
    setEditingProduct(product);
    setIsEditing(true);
    setShowAddForm(true);
    setSelectedMainTab(4); // Switch to Add Product tab (index 4, not 3)
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setSelectedCategory(null);
    setShowAddForm(false);
    setSelectedMainTab(2); // Switch back to Products list
  };

  const handleUpdateProduct = async (updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/${editingProduct.category}/${editingProduct._id}`,
        updatedData
      );
      
      if (response.data.success) {
        toast.success('Product updated successfully');
        setProducts(products.map(p => 
          p._id === editingProduct._id ? { 
            ...response.data.data, 
            category: editingProduct.category,
            categoryLabel: productCategories.find(cat => cat.id === editingProduct.category)?.label 
          } : p
        ));
        handleCancelEdit(); // Reset all edit-related states
        await fetchData(); // Refresh the products list
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DashboardCard = ({ title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {/* Icon can be added here if needed */}
        </div>
      </div>
    </div>
  );

  const ProductList = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="h-16 w-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.category === 'plants' ? 'bg-green-100 text-green-800' :
                  product.category === 'tools' ? 'bg-blue-100 text-blue-800' :
                  product.category === 'soils' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {product.categoryLabel}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ৳{product.price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                >
                  <FaEdit className="text-lg" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product)}
                  className="text-red-600 hover:text-red-900 ml-4 inline-flex items-center gap-1"
                >
                  <FaTrash className="text-lg" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const getSubcategories = (category) => {
    const categoryObj = productCategories.find(c => c.id === category);
    return categoryObj ? categoryObj.subcategories : [];
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      
      const response = await axios.put(`${API_URL}/api/orders/${orderId}/status`, {
        status: newStatus,
        orderId: orderId // Adding orderId to request body as well
      });
      
      if (response.data.success) {
        // Update orders list with new status
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));

        // Update selected order if it's currently being viewed
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }

        // Show success message
        const message = {
          accepted: 'Order has been accepted',
          shipped: 'Order has been marked as shipped',
          delivered: 'Order has been marked as delivered',
          cancelled: 'Order has been cancelled'
        }[newStatus] || 'Order status updated successfully';

        toast.success(message);
      } else {
        // Handle unsuccessful response
        console.error('Failed to update order status:', response.data);
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      // Detailed error logging
      console.error('Error updating order status:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        orderId,
        newStatus
      });
      
      // More descriptive error message
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Failed to update order status: ${errorMessage}`);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`${API_URL}/api/blogs/${blogId}`);
        toast.success('Blog post deleted successfully');
        setBlogs(blogs.filter(b => b._id !== blogId));
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowBlogModal(true);
  };

  const handleBlogFormSubmit = (updatedBlog) => {
    if (editingBlog) {
      setBlogs(blogs.map(b => (b._id === updatedBlog._id ? updatedBlog : b)));
    } else {
      setBlogs([updatedBlog, ...blogs]);
    }
    setEditingBlog(null);
    setShowBlogModal(false);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your store, orders, and users</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Orders"
            value={loading ? '...' : orders.length}
            color="bg-blue-500"
          />
          <DashboardCard
            title="Total Users"
            value={loading ? '...' : users.length}
            color="bg-green-500"
          />
          <DashboardCard
            title="Total Products"
            value={loading ? '...' : products.length}
            color="bg-purple-500"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <Tab.Group selectedIndex={selectedMainTab} onChange={setSelectedMainTab}>
            <Tab.List className="flex border-b border-gray-200">
              <Tab className={({ selected }) =>
                `px-6 py-3 text-sm font-medium border-b-2 ${
                  selected
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }>
                Orders
              </Tab>
              <Tab className={({ selected }) =>
                `px-6 py-3 text-sm font-medium border-b-2 ${
                  selected
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }>
                Users
              </Tab>
              <Tab className={({ selected }) =>
                `px-6 py-3 text-sm font-medium border-b-2 ${
                  selected
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }>
                Products
              </Tab>
              <Tab className={({ selected }) =>
                `px-6 py-3 text-sm font-medium border-b-2 ${
                  selected
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }>
                Blogs
              </Tab>
              <Tab className={({ selected }) =>
                `px-6 py-3 text-sm font-medium border-b-2 ${
                  selected
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }>
                {showAddForm ? 'Cancel' : isEditing ? 'Edit Product' : 'Add Product'}
              </Tab>
            </Tab.List>

            <Tab.Panels>
              {/* Orders Panel */}
              <Tab.Panel className="p-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <div 
                        key={order._id} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">Order #{order._id.slice(-6)}</span>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Customer: {order.shipping.name}</p>
                          <p className="text-sm text-gray-600">Email: {order.shipping.email}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Items: {order.items.length}</span>
                            <span className="font-medium text-green-600">৳{order.summary.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  )}
                </div>
                
                {/* Order Details Modal */}
                {selectedOrder && (
                  <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    isAdmin={true}
                    onStatusUpdate={handleUpdateOrderStatus}
                  />
                )}
              </Tab.Panel>

              {/* Users Panel */}
              <Tab.Panel className="p-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    </div>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.uid} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={user.photoURL || 'https://ui-avatars.com/api/?name=User&background=E0F2F1&color=388E3C&rounded=true'}
                            alt={user.displayName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{user.displayName || 'Anonymous'}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <p>Orders: {user.orders?.length || 0}</p>
                            </div>
                            <div>
                              <p>Cart Items: {user.cart?.length || 0}</p>
                            </div>
                            <div>
                              <p>Joined: {formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              {/* Products List Panel */}
              <Tab.Panel className="p-6">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                  </div>
                ) : (
                  <ProductList />
                )}
              </Tab.Panel>

              {/* Blogs Panel */}
              <Tab.Panel className="p-6 bg-white rounded-b-lg shadow-inner">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">Blogs</h2>
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setShowBlogModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FaPlus /> Add New Blog Post
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blogs.map((blog) => (
                        <tr key={blog._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(blog.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onClick={() => handleEditBlog(blog)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                            <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>

              {/* Add/Edit Product Panel */}
              <Tab.Panel className="p-6">
                {!selectedCategory && !isEditing ? (
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Product Category</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {productCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowAddForm(true);
                          }}
                          className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                        >
                          {category.id === 'plants' && <FaLeaf className="w-8 h-8 text-green-600 mb-2" />}
                          {category.id === 'tools' && <FaTools className="w-8 h-8 text-green-600 mb-2" />}
                          {category.id === 'soils' && <FaSeedling className="w-8 h-8 text-green-600 mb-2" />}
                          {category.id === 'fertilizers' && <FaFlask className="w-8 h-8 text-green-600 mb-2" />}
                          <span className="text-lg font-medium text-gray-900">{category.label}</span>
                          <span className="text-sm text-gray-500 mt-1">{category.subcategories.length} subcategories</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isEditing ? (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Edit {editingProduct.categoryLabel}
                      </h2>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="h-6 w-6" />
                      </button>
                    </div>

                    {editingProduct.category === 'plants' ? (
                      <AddPlantForm
                        subcategories={getSubcategories(editingProduct.category)}
                        editingProduct={editingProduct}
                        isEditing={true}
                        onUpdate={handleUpdateProduct}
                        onCancel={handleCancelEdit}
                      />
                    ) : editingProduct.category === 'tools' ? (
                      <AddToolForm
                        subcategories={getSubcategories(editingProduct.category)}
                        editingProduct={editingProduct}
                        isEditing={true}
                        onUpdate={handleUpdateProduct}
                        onCancel={handleCancelEdit}
                      />
                    ) : editingProduct.category === 'soils' ? (
                      <AddSoilForm
                        subcategories={getSubcategories(editingProduct.category)}
                        editingProduct={editingProduct}
                        isEditing={true}
                        onUpdate={handleUpdateProduct}
                        onCancel={handleCancelEdit}
                      />
                    ) : editingProduct.category === 'fertilizers' ? (
                      <AddFertilizerForm
                        subcategories={getSubcategories(editingProduct.category)}
                        editingProduct={editingProduct}
                        isEditing={true}
                        onUpdate={handleUpdateProduct}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <div>Unsupported category</div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Add New {productCategories.find(c => c.id === selectedCategory)?.label}
                      </h2>
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setShowAddForm(false);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="h-6 w-6" />
                      </button>
                    </div>

                    {selectedCategory === 'plants' ? (
                      <AddPlantForm
                        subcategories={getSubcategories(selectedCategory)}
                        editingProduct={null}
                        isEditing={false}
                        onUpdate={handleUpdateProduct}
                        onCancel={() => {
                          setSelectedCategory(null);
                          setShowAddForm(false);
                        }}
                      />
                    ) : selectedCategory === 'tools' ? (
                      <AddToolForm
                        subcategories={getSubcategories(selectedCategory)}
                        editingProduct={null}
                        isEditing={false}
                        onUpdate={handleUpdateProduct}
                        onCancel={() => {
                          setSelectedCategory(null);
                          setShowAddForm(false);
                        }}
                      />
                    ) : selectedCategory === 'soils' ? (
                      <AddSoilForm
                        subcategories={getSubcategories(selectedCategory)}
                        editingProduct={null}
                        isEditing={false}
                        onUpdate={handleUpdateProduct}
                        onCancel={() => {
                          setSelectedCategory(null);
                          setShowAddForm(false);
                        }}
                      />
                    ) : selectedCategory === 'fertilizers' ? (
                      <AddFertilizerForm
                        subcategories={getSubcategories(selectedCategory)}
                        editingProduct={null}
                        isEditing={false}
                        onUpdate={handleUpdateProduct}
                        onCancel={() => {
                          setSelectedCategory(null);
                          setShowAddForm(false);
                        }}
                      />
                    ) : (
                      <div>Unsupported category</div>
                    )}
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {showBlogModal && (
        <AddBlogForm
          onSuccess={handleBlogFormSubmit}
          blogData={editingBlog}
          onClose={() => {
            setShowBlogModal(false);
            setEditingBlog(null);
          }}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          isAdmin={true}
          onStatusUpdate={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 
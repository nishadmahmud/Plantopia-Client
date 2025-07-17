import React, { useState } from 'react';
import { FaTimes, FaBox, FaTruck, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaCalendar, FaTrash } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/api';

const OrderDetailsModal = ({ order, onClose, isAdmin = false, onStatusUpdate, onOrderDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!order) return null;

  const getStatusColor = (status) => {
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

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
              const response = await axios.delete(`${API_URL}/api/orders/${order._id}`, {
        data: { userId: order.userId }
      });

      if (response.data.success) {
        toast.success('Order deleted successfully');
        if (onOrderDelete) {
          onOrderDelete(order._id);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error.response?.data?.message || 'Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative z-[70]">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Order Details #{order._id.slice(-6)}</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-4">
            {/* Order Status and Date */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-gray-500" />
                <span className="text-gray-600">
                  Ordered on {formatDate(order.createdAt)}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <FaTruck className="text-green-600" />
                Shipping Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start gap-2">
                    <FaUser className="text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-gray-600">{order.shipping.name}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <FaEnvelope className="text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{order.shipping.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <FaPhone className="text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{order.shipping.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">
                        {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <FaBox className="text-green-600" />
                Order Items
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-12 w-12 object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder.jpg';
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                                <FaBox className="text-gray-400 text-xl" />
                              </div>
                            )}
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-500">
                          ৳{item.price}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-900 font-medium">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-4">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">৳{order.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">৳{order.summary.shipping.toFixed(2)}</span>
                </div>
                {order.summary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-৳{order.summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-600">৳{order.summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="mt-6 flex justify-end space-x-3">
                <select
                  value={order.status}
                  onChange={(e) => {
                    if (window.confirm(`Are you sure you want to update the order status to ${e.target.value}?`)) {
                      onStatusUpdate(order._id, e.target.value);
                    }
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            )}

            {/* User Actions */}
            {!isAdmin && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleDeleteOrder}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 
import { useState } from 'react';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const Cart = () => {
  // Sample cart data - replace with actual cart state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 29.99,
      quantity: 1,
      image: '/plants/monstera.jpg',
      category: 'plants'
    },
    {
      id: 2,
      name: 'Ceramic Plant Pot',
      price: 19.99,
      quantity: 2,
      image: '/pottery/ceramic-pot.jpg',
      category: 'pottery'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-lg mr-6">
                    {/* Add actual image here */}
                    <div className="w-full h-full flex items-center justify-center">
                      <FaShoppingBag className="text-3xl text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart; 
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const formatPrice = (price) => {
  const num = Number(price);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const Cart = () => {
  const [error, setError] = useState(null);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  useEffect(() => {
    console.log('Cart Items:', cartItems);
  }, [cartItems]);

  try {
    if (error) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>Something went wrong: {error.message}</p>
            <Link to="/" className="text-red-600 underline">Return Home</Link>
          </div>
        </div>
      );
    }

    // If cart is empty or undefined, show empty state
    if (!cartItems || cartItems.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
            <Link
              to="/plants"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }

    const shipping = 100; // Fixed shipping cost of 100 Taka
    const subtotal = getCartTotal();
    const total = subtotal + shipping;

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-lg mr-6 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaShoppingBag className="text-3xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">৳{formatPrice(item.price)}</p>
                      <p className="text-sm text-gray-500 capitalize">Category: {item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 min-w-[40px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">৳{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">৳{formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-600">৳{formatPrice(total)}</span>
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
      </div>
    );
  } catch (err) {
    console.error('Error in Cart component:', err);
    // Setting error in a state update and re-rendering is better than trying to recover here
    if (!error) {
      setError(err);
    }
    return null; // Return null and let the next render handle the error display
  }
};

export default Cart; 
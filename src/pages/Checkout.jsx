import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../auth/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getCountryCode } from '../utils/helpers';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ clientSecret, onPaymentSuccess, onPaymentError, stripeLoading, shipping }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    onPaymentError(null);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: shipping.name,
          email: shipping.email,
          phone: shipping.phone,
          address: {
            line1: shipping.address,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.postalCode,
            country: getCountryCode(shipping.country),
          },
        },
      },
    });

    if (error) {
      console.error('[stripe error]', error);
      onPaymentError(error.message || 'An unexpected error occurred.');
    } else {
      if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      }} />
      <button
        type="submit"
        disabled={!stripe || stripeLoading}
        className="w-full mt-6 flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {stripeLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const cartSummary = {
    subtotal: getCartTotal(),
    shipping: 100,
    total: getCartTotal() + 100
  };

  const [shipping, setShipping] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState(null);

  // Fetch user's saved shipping address
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const response = await axios.get(`http://localhost:3000/api/users/${user.uid}`);
          if (response.data.success && response.data.data.shippingAddress) {
            const { shippingAddress } = response.data.data;
            setShipping(prev => ({
              ...prev,
              ...shippingAddress
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const prepareStripePayment = async () => {
    if (cartItems.length === 0) return;
    setStripeLoading(true);
    setPaymentError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/create-payment-intent', {
        amount: Math.round(cartSummary.total * 100),
        currency: 'bdt',
      });
      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
        setShowStripeModal(true);
      } else {
        toast.error('Could not initialize payment.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleOrderSubmission = async (method) => {
    try {
      if (user?.uid) {
        const formattedItems = cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          _id: item._id
        }));

        const orderData = {
          userId: user.uid,
          items: formattedItems,
          shipping,
          summary: cartSummary,
          paymentMethod: method
        };

        const orderResponse = await axios.post('http://localhost:3000/api/orders', orderData);

        if (orderResponse.data.success) {
          await clearCart();
          toast.success('Order placed successfully!');
          navigate('/profile');
        } else {
          throw new Error(orderResponse.data.message || 'Failed to create order');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (paymentMethod === 'card') {
      await prepareStripePayment();
      return;
    }

    setLoading(true);
    await handleOrderSubmission('cod');
    setLoading(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
        <button
          onClick={() => navigate('/plants')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input type="text" name="name" placeholder="Full Name" value={shipping.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div className="md:col-span-2">
              <input type="email" name="email" placeholder="Email" value={shipping.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div className="md:col-span-2">
              <input type="text" name="address" placeholder="Address" value={shipping.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <input type="text" name="city" placeholder="City" value={shipping.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <input type="text" name="state" placeholder="State" value={shipping.state} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <input type="text" name="postalCode" placeholder="Postal Code" value={shipping.postalCode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <input type="text" name="country" placeholder="Country" value={shipping.country} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div className="md:col-span-2">
              <input type="tel" name="phone" placeholder="Phone Number" value={shipping.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
          </div>
        </div>

        {/* Order Summary and Payment */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">৳{cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">৳{cartSummary.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-green-600">৳{cartSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Spacer */}
          <div className="flex-grow"></div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <input type="radio" id="cod" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => handlePaymentMethodChange('cod')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                  <label htmlFor="cod" className="ml-3 flex items-center">
                    <FaMoneyBillWave className="text-green-600 mr-2" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Cash on Delivery</span>
                      <span className="block text-sm text-gray-500">Pay when you receive your order</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <input type="radio" id="card" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => handlePaymentMethodChange('card')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <label htmlFor="card" className="ml-3 flex items-center">
                    <FaCreditCard className="text-blue-600 mr-2" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Credit/Debit Card</span>
                      <span className="block text-sm text-gray-500">Secure payment via Stripe</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading || stripeLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6 disabled:opacity-50">
            {loading || stripeLoading ? 'Processing...' : paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order'}
          </button>
        </div>
      </form>
      {/* Stripe Payment Modal */}
      {showStripeModal && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-auto">
            <h3 className="text-xl font-semibold mb-1 text-gray-900">Secure Card Payment</h3>
            <p className="text-sm text-gray-500 mb-6">Powered by Stripe</p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Billing to:</span>
                <span className="text-sm font-medium text-gray-800">{shipping.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-800">{shipping.email}</span>
              </div>
              <div className="border-t my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                <span className="text-lg font-bold text-blue-600">৳{cartSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm 
                clientSecret={clientSecret}
                stripeLoading={stripeLoading}
                shipping={shipping}
                onPaymentSuccess={() => {
                  toast.success('Payment successful!');
                  handleOrderSubmission('card');
                  setShowStripeModal(false);
                }}
                onPaymentError={(err) => {
                  setPaymentError(err);
                  toast.error(err || 'An unknown payment error occurred.');
                }}
              />
            </Elements>
            {paymentError && <div className="text-red-500 text-sm mt-2 text-center">{paymentError}</div>}
            <button 
              onClick={() => setShowStripeModal(false)} 
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout; 
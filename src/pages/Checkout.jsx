import { useState } from 'react';

const Checkout = () => {
  // Placeholder cart summary
  const cartSummary = {
    subtotal: 69.97,
    shipping: 5.99,
    total: 75.96
  };

  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    postal: '',
    country: ''
  });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add order processing logic here
    alert('Order placed!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shipping.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shipping.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shipping.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="postal"
            placeholder="Postal Code"
            value={shipping.postal}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shipping.country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Place Order
          </button>
        </form>
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${cartSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">${cartSummary.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-green-600">${cartSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
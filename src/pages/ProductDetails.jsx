import { useParams, Link } from 'react-router';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
  // Get product ID from URL params (for future dynamic data)
  const { id } = useParams();

  // Placeholder product data
  const product = {
    id: 1,
    name: 'Monstera Deliciosa',
    price: 29.99,
    image: '/plants/monstera.jpg',
    description: 'Beautiful tropical plant with distinctive leaf holes and splits. Perfect for bright, indirect light and easy to care for.',
    inStock: true
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/plants" className="inline-flex items-center gap-2 text-green-600 hover:underline mb-6">
        <FaArrowLeft /> Back to Plants
      </Link>
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg p-6">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-lg h-72">
          {/* Replace with actual image */}
          <img src={product.image} alt={product.name} className="object-contain h-60" />
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-4">${product.price}</div>
            {product.inStock ? (
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <span className="text-red-500 font-semibold">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
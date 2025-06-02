import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Toaster position="top-right" />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route 
                  path="/plants" 
                  element={<ProductList category="plants" subcategories={['Indoor', 'Outdoor', 'Succulents']} />} 
                />
                <Route 
                  path="/pottery" 
                  element={<ProductList category="pottery" subcategories={['Pots', 'Planters', 'Accessories']} />} 
                />
                <Route 
                  path="/tools" 
                  element={<ProductList category="tools" subcategories={['Hand Tools', 'Power Tools', 'Accessories']} />} 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
};

export default App; 
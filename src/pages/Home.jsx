import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productCategories } from '../config/categories';
import React from 'react';
import { API_URL } from '../utils/api';

const AUTO_SLIDE_INTERVAL = 5000;

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef();

  const getSlideImage = (category) => {
    switch (category.id) {
      case 'plants':
        return 'https://cdn.pixabay.com/photo/2015/04/10/17/03/pots-716579_1280.jpg';
      case 'soils':
        return 'https://cdn.pixabay.com/photo/2015/05/14/02/22/soil-766281_1280.jpg';
      case 'tools':
        return 'https://cdn.pixabay.com/photo/2021/08/03/20/36/plants-6520443_1280.jpg';
      case 'fertilizers':
        return 'https://cdn.pixabay.com/photo/2019/12/28/19/36/garden-4725522_1280.jpg';
      default:
        return `/images/${category.id}-hero.jpg`;
    }
  };

  const nextSlide = () => setCurrent((prev) => (prev + 1) % productCategories.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + productCategories.length) % productCategories.length);

  // Auto-advance logic
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % productCategories.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [current]);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const responses = await Promise.all(
          productCategories.map(category =>
            fetch(`${API_URL}/api/${category.id}`)
              .then(res => res.json())
          )
        );

        const allProducts = responses.flatMap(response => 
          response.success ? response.data : []
        );

        // Filter for featured products only
        const featuredProducts = allProducts.filter(product => product.isFeatured);

        // If we have more than 3 featured products, randomly select 3
        const selectedProducts = featuredProducts.length > 3 
          ? featuredProducts.sort(() => Math.random() - 0.5).slice(0, 3)
          : featuredProducts;

        setFeaturedProducts(selectedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Reset timer on manual navigation
  const handleManualNav = (navFn) => {
    clearTimeout(timerRef.current);
    navFn();
  };

  return (
    <div className="space-y-8">
      {/* Hero Slider Section */}
      <section
        className="relative h-[500px] flex items-center justify-center overflow-hidden rounded-3xl shadow-xl mt-2"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={getSlideImage(productCategories[current])}
              alt={productCategories[current].label}
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${productCategories[current].color} z-10`} />
            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-2xl">
              <div className="mb-4">
                {React.createElement(productCategories[current].icon, {
                  className: "text-5xl text-green-200 drop-shadow"
                })}
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg">
                {productCategories[current].label}
              </h1>
              <p className="text-2xl md:text-3xl text-green-100 mb-8 drop-shadow">
                {productCategories[current].description}
              </p>
              <Link
                to={productCategories[current].path}
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Modern Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30 items-center">
          {productCategories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleManualNav(() => setCurrent(idx))}
              className="relative flex items-center justify-center focus:outline-none"
              aria-label={`Go to slide ${idx + 1}`}
              style={{ outline: 'none' }}
            >
              {current === idx ? (
                <motion.div
                  layoutId="active-dot-pill"
                  className="w-10 h-4 rounded-full bg-green-500 shadow-lg flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-white/80 border border-green-200 shadow-sm hover:scale-125 hover:bg-green-100 transition-all" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.06, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }}
              className="rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg p-8 flex flex-col items-center text-center border border-green-100 transition-all duration-200 hover:bg-white/80"
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-lg">
                {React.createElement(category.icon, {
                  className: "text-3xl text-white"
                })}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.label}</h3>
              <p className="text-gray-600 mb-4 text-sm min-h-[48px]">{category.description}</p>
              <Link
                to={category.path}
                className="inline-block mt-auto px-6 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-colors"
              >
                Shop {category.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">৳{product.price}</span>
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-green-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8">Get the latest updates on new products and special offers!</p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
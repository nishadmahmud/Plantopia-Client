import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaSeedling, FaCube, FaTools, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router';

const slides = [
  {
    title: 'Plants',
    description: 'Discover our lush collection of indoor and outdoor plants to bring life to your space.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    link: '/plants',
    icon: <FaLeaf className="text-5xl text-green-200 drop-shadow" />,
    color: 'from-green-900/80 via-green-800/60 to-green-900/80',
  },
  {
    title: 'Seeds',
    description: 'Grow your own paradise with our premium seeds for flowers, herbs, and vegetables.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
    link: '/seeds',
    icon: <FaSeedling className="text-5xl text-green-200 drop-shadow" />,
    color: 'from-yellow-800/80 via-green-700/60 to-green-900/80',
  },
  {
    title: 'Pottery',
    description: 'Find the perfect home for your plants with our stylish pottery and planters.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
    link: '/pottery',
    icon: <FaCube className="text-5xl text-green-200 drop-shadow" />,
    color: 'from-red-900/80 via-yellow-800/60 to-green-900/80',
  },
  {
    title: 'Tools',
    description: 'Everything you need to cultivate, prune, and care for your garden with ease.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    link: '/tools',
    icon: <FaTools className="text-5xl text-green-200 drop-shadow" />,
    color: 'from-blue-900/80 via-green-700/60 to-green-900/80',
  },
];

const AUTO_SLIDE_INTERVAL = 5000;

const Home = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance logic
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [current]);

  // Reset timer on manual navigation
  const handleManualNav = (navFn) => {
    clearTimeout(timerRef.current);
    navFn();
  };

  return (
    <div className="space-y-16">
      {/* Hero Slider Section */}
      <section
        className="relative h-[600px] flex items-center justify-center overflow-hidden rounded-3xl shadow-xl mt-4"
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
              src={slides[current].image}
              alt={slides[current].title}
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[current].color} z-10`} />
            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-2xl">
              <div className="mb-4">{slides[current].icon}</div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg">
                {slides[current].title}
              </h1>
              <p className="text-2xl md:text-3xl text-green-100 mb-8 drop-shadow">
                {slides[current].description}
              </p>
              <Link
                to={slides[current].link}
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Modern Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30 items-center">
          {slides.map((_, idx) => (
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
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {slides.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.06, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }}
              className="rounded-2xl bg-white/60 backdrop-blur-lg shadow-lg p-8 flex flex-col items-center text-center border border-green-100 transition-all duration-200 hover:bg-white/80"
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-lg">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4 text-sm min-h-[48px]">{category.description}</p>
              <Link
                to={category.link}
                className="inline-block mt-auto px-6 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-colors"
              >
                Shop {category.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured product cards will be added here */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Monstera Deliciosa</h3>
              <p className="text-gray-600 mb-4">Beautiful tropical plant perfect for your home</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">$29.99</span>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          {/* Add more featured product cards */}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-green-50 py-16">
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
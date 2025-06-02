import React, { useContext, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../auth/AuthProvider';
import { FaShoppingCart, FaHome, FaLeaf, FaShoppingBag, FaTools, FaTrash } from 'react-icons/fa';
import { productCategories } from '../config/categories';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Home', path: '/' },
  // Shop dropdown will be inserted here
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=E0F2F1&color=388E3C&rounded=true';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);
  const [shopOpen, setShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const shopRef = useRef();
  const profileRef = useRef();
  const cartRef = useRef();
  const { cartItems, getCartTotal, removeFromCart, updateQuantity } = useCart();
  const cartCount = cartItems.length;
  const cartTotal = getCartTotal();

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    }
    if (shopOpen || profileOpen || cartOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [shopOpen, profileOpen, cartOpen]);

  return (
    <nav className="sticky top-4 w-[90vw] max-w-6xl mx-auto mb-8 px-6 py-3 flex items-center justify-between bg-white/80 backdrop-blur shadow-lg rounded-xl z-[100]">
      <div className="text-2xl font-bold text-green-700 tracking-tight select-none">Plantopia</div>
      <div className="flex gap-2 relative items-center">
        {/* Home link first */}
        <NavLink
          key={navLinks[0].name}
          to={navLinks[0].path}
          className="relative px-5 py-2 rounded-lg font-medium text-gray-700 hover:text-green-700 transition-colors"
          style={{ zIndex: 1 }}
        >
          <AnimatePresence>
            {location.pathname === navLinks[0].path && (
              <motion.div
                layoutId="navbar-active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-green-100/90 rounded-lg shadow-md"
                transition={{ type: 'spring', stiffness: 700, damping: 18 }}
                style={{ zIndex: -1 }}
              />
            )}
          </AnimatePresence>
          <span className={location.pathname === navLinks[0].path ? 'text-green-700 font-semibold' : ''}>{navLinks[0].name}</span>
        </NavLink>
        {/* Shop Dropdown */}
        <div className="relative z-50" ref={shopRef}>
          <button
            className={`relative px-5 py-2 rounded-lg font-medium flex items-center gap-1 text-gray-700 hover:text-green-700 transition-colors ${productCategories.some(c => c.path === location.pathname) ? 'text-green-700 font-semibold' : ''}`}
            onClick={() => setShopOpen(!shopOpen)}
            type="button"
          >
            Shop
            <svg className={`w-4 h-4 transition-transform ${shopOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            {productCategories.some(c => c.path === location.pathname) && (
              <motion.div
                layoutId="navbar-active"
                className="absolute inset-0 bg-green-100/90 rounded-lg shadow-md"
                transition={{ type: 'spring', stiffness: 700, damping: 18 }}
                style={{ zIndex: -1 }}
              />
            )}
          </button>
          <AnimatePresence>
            {shopOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-green-100 z-[9999] overflow-hidden min-w-[160px]"
              >
                {productCategories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={category.path}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors ${isActive ? 'bg-green-100/80 text-green-700 font-semibold' : ''}`
                    }
                    onClick={() => setShopOpen(false)}
                  >
                    {category.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* About and Contact links */}
        {navLinks.slice(1).map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className="relative px-5 py-2 rounded-lg font-medium text-gray-700 hover:text-green-700 transition-colors"
              style={{ zIndex: 1 }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-green-100/90 rounded-lg shadow-md"
                    transition={{ type: 'spring', stiffness: 700, damping: 18 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </AnimatePresence>
              <span className={isActive ? 'text-green-700 font-semibold' : ''}>{link.name}</span>
            </NavLink>
          );
        })}
      </div>
      {/* User/Profile or Login and Cart */}
      <div className="flex items-center gap-4">
        {/* Cart Icon with badge and mini cart */}
        <div className="relative" ref={cartRef}>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative focus:outline-none"
            aria-label="Cart"
          >
            <FaShoppingCart className="text-xl text-green-700 hover:text-green-900 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {cartOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-green-100 z-[9999] overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                    <span className="text-sm text-gray-500">{cartCount} items</span>
                  </div>
                  {cartItems.length > 0 ? (
                    <>
                      <div className="max-h-60 overflow-auto">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder.jpg';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaShoppingBag className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-gray-200 rounded">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(item.id, item.quantity - 1);
                                    }}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-2 py-1 text-sm min-w-[24px] text-center">{item.quantity}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(item.id, item.quantity + 1);
                                    }}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  aria-label="Remove item"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex justify-between mb-4">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-semibold text-gray-900">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="space-y-2">
                          <Link
                            to="/cart"
                            onClick={() => setCartOpen(false)}
                            className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            View Cart
                          </Link>
                          <Link
                            to="/checkout"
                            onClick={() => setCartOpen(false)}
                            className="block w-full bg-gray-800 text-white text-center py-2 rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <Link
                        to="/plants"
                        onClick={() => setCartOpen(false)}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {user ? (
          <div className="relative" ref={profileRef}>
            <div className="flex items-center">
              <img
                src={user.photoURL || defaultAvatar}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-green-200 shadow-sm object-cover cursor-pointer"
                onClick={() => { navigate('/profile'); }}
                onError={e => { e.target.onerror = null; e.target.src = defaultAvatar; }}
              />
              <button
                className="ml-1 p-1 focus:outline-none text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfileOpen(prev => !prev);
                }}
                type="button"
                aria-label="Toggle menu"
              >
                <svg className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-green-100 z-[9999] overflow-hidden"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setProfileOpen(false);
                      navigate('/cart');
                    }}
                    className="w-full text-left px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    Cart
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      setProfileOpen(false);
                      try {
                        await logOut();
                        navigate('/');
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                    className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-green-100"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:text-green-700 transition-colors border border-green-200 bg-green-50 hover:bg-green-100"
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
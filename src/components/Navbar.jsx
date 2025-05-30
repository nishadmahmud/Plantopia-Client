import React, { useContext, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../auth/AuthProvider';
import { FaShoppingCart } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', path: '/' },
  // Shop dropdown will be inserted here
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const shopLinks = [
  { name: 'Plants', path: '/plants' },
  { name: 'Seeds', path: '/seeds' },
  { name: 'Pottery', path: '/pottery' },
  { name: 'Tools', path: '/tools' },
];

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=E0F2F1&color=388E3C&rounded=true';

// Placeholder cart count (replace with real cart state if available)
const cartCount = 0;

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

  // Logout handler
  const handleLogout = async () => {
    await logOut();
    setProfileOpen(false);
    navigate('/');
  };

  // Get the position of the Shop button for the fixed dropdown
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0, width: 0 });
  const shopBtnRef = useRef();
  const handleShopClick = () => {
    if (shopBtnRef.current) {
      const rect = shopBtnRef.current.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom + window.scrollY, width: rect.width });
    }
    setShopOpen((v) => !v);
  };

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
        {/* Shop Dropdown next */}
        <div className="relative z-50" ref={shopRef}>
          <button
            ref={shopBtnRef}
            className={`relative px-5 py-2 rounded-lg font-medium flex items-center gap-1 text-gray-700 hover:text-green-700 transition-colors ${shopLinks.some(l => l.path === location.pathname) ? 'text-green-700 font-semibold' : ''}`}
            onClick={handleShopClick}
            type="button"
          >
            Shop
            <svg className={`w-4 h-4 transition-transform ${shopOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            {shopLinks.some(l => l.path === location.pathname) && (
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
                className="fixed bg-white rounded-xl shadow-lg border border-green-100 z-[9999] overflow-hidden"
                style={{ left: dropdownPos.left, top: dropdownPos.top, width: dropdownPos.width, zIndex: 9999 }}
              >
                {shopLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors ${isActive ? 'bg-green-100/80 text-green-700 font-semibold' : ''}`
                    }
                    onClick={() => setShopOpen(false)}
                  >
                    {link.name}
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
            className="relative focus:outline-none"
            onClick={() => setCartOpen((v) => !v)}
            aria-label="Cart"
          >
            <FaShoppingCart className="text-xl text-green-700 hover:text-green-900 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg border-2 border-white">
              {cartCount}
            </span>
          </button>
          <AnimatePresence>
            {cartOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-green-100 z-50 overflow-hidden"
              >
                <div className="p-4 text-center text-gray-700">
                  <p className="mb-2 font-semibold">Your Cart</p>
                  <div className="text-sm text-gray-500">Your cart is empty.</div>
                  <button
                    className="mt-4 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                    onClick={() => { setCartOpen(false); navigate('/cart'); }}
                  >
                    Go to Cart
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              className="focus:outline-none"
              onClick={() => setProfileOpen((v) => !v)}
              title={user.displayName || 'Profile'}
            >
              <img
                src={user.photoURL || defaultAvatar}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-green-200 shadow-sm object-cover"
                onError={e => { e.target.onerror = null; e.target.src = defaultAvatar; }}
              />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-green-100 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                    className="w-full text-left px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/cart'); }}
                    className="w-full text-left px-5 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    Cart
                  </button>
                  <button
                    onClick={async () => { await logOut(); setProfileOpen(false); navigate('/'); }}
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
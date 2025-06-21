import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white mb-4">Plantopia</h3>
                        <p className="text-gray-400">Your trusted source for premium plants, gardening tools, and expert advice. Making your garden dreams come true since 2023.</p>
                        <div className="flex space-x-4 mt-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-green-500 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/plants" className="text-gray-400 hover:text-green-500 transition-colors">Plants</Link>
                            </li>
                            <li>
                                <Link to="/tools" className="text-gray-400 hover:text-green-500 transition-colors">Tools</Link>
                            </li>
                            <li>
                                <Link to="/soils" className="text-gray-400 hover:text-green-500 transition-colors">Soils</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-green-500 transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-green-500" />
                                <span>Zindabazar, Sylhet 3100, Bangladesh</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaPhone className="text-green-500" />
                                <span>+880 1712-345678</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaEnvelope className="text-green-500" />
                                <span>info@plantopia.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaClock className="text-green-500" />
                                <span>Open: 9:00 AM - 8:00 PM</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
                        <form className="space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-gray-300"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Plantopia. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                                Terms of Service
                            </Link>
                            <Link to="/shipping" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                                Shipping Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
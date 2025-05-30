import { Outlet } from 'react-router';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white p-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Plantopia</h3>
            <p className="text-green-200">Your one-stop shop for all gardening needs.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-green-200 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-green-200 hover:text-white">Contact</Link></li>
              <li><Link to="/shipping" className="text-green-200 hover:text-white">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/plants" className="text-green-200 hover:text-white">Plants</Link></li>
              <li><Link to="/seeds" className="text-green-200 hover:text-white">Seeds</Link></li>
              <li><Link to="/pottery" className="text-green-200 hover:text-white">Pottery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-green-200 mb-4">Subscribe for gardening tips and offers!</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded text-gray-800"
            />
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-green-800 text-center">
          <p>&copy; 2024 Plantopia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
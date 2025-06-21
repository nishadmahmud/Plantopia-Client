import { FaLeaf, FaHandHoldingHeart, FaRecycle, FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Plantopia</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner in creating beautiful, sustainable gardens in Sylhet and beyond.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              At Plantopia, we're committed to making gardening accessible, enjoyable, and sustainable for everyone. 
              We believe in the power of plants to transform spaces and improve lives, while promoting environmental 
              consciousness and sustainable practices.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To be the leading garden center in Bangladesh, inspiring and enabling people to create their own 
              green sanctuaries while contributing to a more sustainable and greener future.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <FaLeaf className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
            <p className="text-gray-700">
              We source the healthiest plants and highest quality gardening supplies to ensure your garden thrives.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <FaHandHoldingHeart className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Care</h3>
            <p className="text-gray-700">
              We're dedicated to providing exceptional service and expert guidance for all your gardening needs.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <FaRecycle className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
            <p className="text-gray-700">
              We promote eco-friendly practices and sustainable gardening solutions for a better environment.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-green-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Plantopia?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FaUsers className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-700">
                Our knowledgeable staff includes experienced horticulturists and garden enthusiasts ready to assist you.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FaLeaf className="text-2xl text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-gray-700">
                From indoor plants to outdoor gardens, we offer a diverse range of plants and gardening supplies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visit Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <FaMapMarkerAlt className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-700">123 Garden Street<br />Sylhet, Bangladesh</p>
          </div>
          <div>
            <FaPhone className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-700">+880 1234-567890</p>
          </div>
          <div>
            <FaEnvelope className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700">info@plantopia.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 
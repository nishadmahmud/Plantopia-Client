import { useState } from 'react';
import { FaSearch, FaFilter, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Tools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample tools data - replace with actual data from your backend
  const tools = [
    {
      id: 1,
      name: 'Pruning Shears',
      category: 'cutting',
      price: 24.99,
      image: '/tools/pruning-shears.jpg',
      description: 'Professional-grade pruning shears for precise cutting.',
      inStock: true
    },
    {
      id: 2,
      name: 'Watering Can',
      category: 'watering',
      price: 19.99,
      image: '/tools/watering-can.jpg',
      description: '2-liter watering can with fine rose attachment.',
      inStock: true
    },
    {
      id: 3,
      name: 'Garden Trowel',
      category: 'digging',
      price: 14.99,
      image: '/tools/garden-trowel.jpg',
      description: 'Sturdy stainless steel garden trowel.',
      inStock: true
    },
    // Add more tools here
  ];

  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'cutting', name: 'Cutting Tools' },
    { id: 'watering', name: 'Watering Tools' },
    { id: 'digging', name: 'Digging Tools' },
    { id: 'measuring', name: 'Measuring Tools' }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gardening Tools Collection</h1>
        <p className="text-gray-600">Essential tools for every gardener's toolkit</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 bg-gray-200">
              {/* Add actual image here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <FaTools className="text-4xl text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">${tool.price}</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <FaTools className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Tools; 
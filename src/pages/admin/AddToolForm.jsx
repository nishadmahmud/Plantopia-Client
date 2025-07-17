import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import { API_URL } from '../../utils/api';

const AddToolForm = ({ subcategories, editingProduct, isEditing, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    subcategory: subcategories[0],
    features: [''],
    careInstructions: [''],
    material: 'steel', // New field
    dimensions: '', // New field
    weight: '', // New field
    warranty: '', // New field
    usage: '', // New field
    maintenance: '', // New field
    brand: '', // New field
    handleType: 'ergonomic', // New field
    weatherResistant: false, // New field
    safetyInstructions: [''] // New field
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || '',
        imageUrl: editingProduct.imageUrl || '',
        subcategory: editingProduct.subcategory || subcategories[0],
        features: editingProduct.features || [''],
        careInstructions: editingProduct.careInstructions || [''],
        material: editingProduct.material || 'steel',
        dimensions: editingProduct.dimensions || '',
        weight: editingProduct.weight || '',
        warranty: editingProduct.warranty || '',
        usage: editingProduct.usage || '',
        maintenance: editingProduct.maintenance || '',
        brand: editingProduct.brand || '',
        handleType: editingProduct.handleType || 'ergonomic',
        weatherResistant: editingProduct.weatherResistant || false,
        safetyInstructions: editingProduct.safetyInstructions || ['']
      });
    }
  }, [editingProduct, isEditing, subcategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        features: formData.features.filter(Boolean),
        careInstructions: formData.careInstructions.filter(Boolean)
      };

      if (isEditing) {
        await onUpdate(productData);
      } else {
        const response = await axios.post(`${API_URL}/api/tools`, productData);
        if (response.data.success) {
          toast.success('Tool added successfully');
          setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            imageUrl: '',
            subcategory: subcategories[0],
            features: [''],
            careInstructions: [''],
            material: 'steel',
            dimensions: '',
            weight: '',
            warranty: '',
            usage: '',
            maintenance: '',
            brand: '',
            handleType: 'ergonomic',
            weatherResistant: false,
            safetyInstructions: ['']
          });
        }
      }
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error(isEditing ? 'Failed to update tool' : 'Failed to add tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subcategory</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Material</label>
          <select
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="steel">Steel</option>
            <option value="aluminum">Aluminum</option>
            <option value="plastic">Plastic</option>
            <option value="wood">Wood</option>
            <option value="carbon-fiber">Carbon Fiber</option>
            <option value="composite">Composite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Handle Type</label>
          <select
            name="handleType"
            value={formData.handleType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="ergonomic">Ergonomic</option>
            <option value="standard">Standard</option>
            <option value="cushioned">Cushioned</option>
            <option value="telescopic">Telescopic</option>
            <option value="d-shaped">D-Shaped</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dimensions</label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="e.g., 15 x 5 x 2 inches"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Warranty</label>
          <input
            type="text"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            placeholder="e.g., 2 years limited"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <ImageUpload 
            onImageUpload={handleImageUpload}
            currentImageUrl={formData.imageUrl}
            label="Product Image"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Usage Instructions</label>
          <textarea
            name="usage"
            value={formData.usage}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter detailed usage instructions..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Maintenance Instructions</label>
          <textarea
            name="maintenance"
            value={formData.maintenance}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter maintenance instructions..."
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="weatherResistant"
              checked={formData.weatherResistant}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Weather Resistant
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter feature"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, 'features')}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('features')}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            + Add Feature
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Safety Instructions</label>
          {formData.safetyInstructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => handleArrayChange(index, e.target.value, 'safetyInstructions')}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter safety instruction"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, 'safetyInstructions')}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('safetyInstructions')}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            + Add Safety Instruction
          </button>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 flex items-center gap-2">
              <span className="text-base font-medium text-gray-700">Mark as Featured Product</span>
              {formData.isFeatured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Featured
                </span>
              )}
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">Featured tools will be highlighted on the home page and in product listings.</p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Tool' : 'Add Tool'}
        </button>
      </div>
    </form>
  );
};

export default AddToolForm; 
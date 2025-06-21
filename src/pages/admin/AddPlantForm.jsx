import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const AddPlantForm = ({ subcategories, editingProduct, isEditing, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    subcategory: subcategories[0],
    features: [''],
    careInstructions: [''],
    sunlightNeeds: 'full-sun',
    wateringFrequency: 'daily',
    size: 'small',
    difficulty: 'easy',
    indoorOutdoor: 'indoor',
    matureHeight: '',
    growthRate: 'fast',
    petFriendly: false,
    seasonalInstructions: '',
    isFeatured: false
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
        sunlightNeeds: editingProduct.sunlightNeeds || 'full-sun',
        wateringFrequency: editingProduct.wateringFrequency || 'daily',
        size: editingProduct.size || 'small',
        difficulty: editingProduct.difficulty || 'easy',
        indoorOutdoor: editingProduct.indoorOutdoor || 'indoor',
        matureHeight: editingProduct.matureHeight || '',
        growthRate: editingProduct.growthRate || 'fast',
        petFriendly: editingProduct.petFriendly || false,
        seasonalInstructions: editingProduct.seasonalInstructions || '',
        isFeatured: editingProduct.isFeatured || false
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
        const response = await axios.post('http://localhost:3000/api/plants', productData);
        if (response.data.success) {
          toast.success('Plant added successfully');
        setFormData({
          name: '',
          description: '',
            price: '',
            stock: '',
            imageUrl: '',
            subcategory: subcategories[0],
            features: [''],
            careInstructions: [''],
            sunlightNeeds: 'full-sun',
            wateringFrequency: 'daily',
            size: 'small',
            difficulty: 'easy',
            indoorOutdoor: 'indoor',
            matureHeight: '',
            growthRate: 'fast',
            petFriendly: false,
            seasonalInstructions: '',
            isFeatured: false
          });
        }
      }
    } catch (error) {
      console.error('Error saving plant:', error);
      toast.error(isEditing ? 'Failed to update plant' : 'Failed to add plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className="block text-sm font-medium text-gray-700">Sunlight Needs</label>
          <select
            name="sunlightNeeds"
            value={formData.sunlightNeeds}
                onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="full-sun">Full Sun</option>
            <option value="partial-sun">Partial Sun</option>
            <option value="shade">Shade</option>
            <option value="indirect-light">Indirect Light</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Watering Frequency</label>
          <select
                name="wateringFrequency"
                value={formData.wateringFrequency}
                onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Indoor/Outdoor</label>
          <select
            name="indoorOutdoor"
            value={formData.indoorOutdoor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mature Height</label>
          <input
            type="text"
            name="matureHeight"
            value={formData.matureHeight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="e.g., 2-3 feet"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Growth Rate</label>
          <select
            name="growthRate"
            value={formData.growthRate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
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
            label="Plant Image"
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
          <label className="block text-sm font-medium text-gray-700">Seasonal Instructions</label>
          <textarea
            name="seasonalInstructions"
            value={formData.seasonalInstructions}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter seasonal care instructions..."
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="petFriendly"
              checked={formData.petFriendly}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Pet Friendly
            </label>
          </div>
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
          <p className="mt-1 text-sm text-gray-500">Featured plants will be highlighted on the home page and in product listings.</p>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
          {formData.careInstructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => handleArrayChange(index, e.target.value, 'careInstructions')}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter care instruction"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, 'careInstructions')}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('careInstructions')}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            + Add Care Instruction
          </button>
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
          {loading ? 'Saving...' : isEditing ? 'Update Plant' : 'Add Plant'}
        </button>
      </div>
    </form>
  );
};

export default AddPlantForm; 
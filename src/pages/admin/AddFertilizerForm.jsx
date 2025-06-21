import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const AddFertilizerForm = ({ subcategories, editingProduct, isEditing, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    subcategory: subcategories[0],
    features: [''],
    composition: [''],
    npkRatio: '', // New field specific to fertilizers
    type: 'organic', // New field specific to fertilizers
    weight: '',
    coverage: '',
    nutrients: [''],
    bestFor: [''],
    organicStatus: false,
    applicationInstructions: '',
    storageInstructions: '',
    packagingSize: '',
    applicationMethod: 'granular', // New field specific to fertilizers
    releaseType: 'slow-release', // New field specific to fertilizers
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
        composition: editingProduct.composition || [''],
        npkRatio: editingProduct.npkRatio || '',
        type: editingProduct.type || 'organic',
        weight: editingProduct.weight || '',
        coverage: editingProduct.coverage || '',
        nutrients: editingProduct.nutrients || [''],
        bestFor: editingProduct.bestFor || [''],
        organicStatus: editingProduct.organicStatus || false,
        applicationInstructions: editingProduct.applicationInstructions || '',
        storageInstructions: editingProduct.storageInstructions || '',
        packagingSize: editingProduct.packagingSize || '',
        applicationMethod: editingProduct.applicationMethod || 'granular',
        releaseType: editingProduct.releaseType || 'slow-release',
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
        composition: formData.composition.filter(Boolean),
        nutrients: formData.nutrients.filter(Boolean),
        bestFor: formData.bestFor.filter(Boolean)
      };

      if (isEditing) {
        await onUpdate(productData);
      } else {
        const response = await axios.post('http://localhost:3000/api/fertilizers', productData);
        if (response.data.success) {
          toast.success('Fertilizer added successfully');
          setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            imageUrl: '',
            subcategory: subcategories[0],
            features: [''],
            composition: [''],
            npkRatio: '',
            type: 'organic',
            weight: '',
            coverage: '',
            nutrients: [''],
            bestFor: [''],
            organicStatus: false,
            applicationInstructions: '',
            storageInstructions: '',
            packagingSize: '',
            applicationMethod: 'granular',
            releaseType: 'slow-release',
            isFeatured: false
          });
        }
      }
    } catch (error) {
      console.error('Error saving fertilizer:', error);
      toast.error(isEditing ? 'Failed to update fertilizer' : 'Failed to add fertilizer');
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
          <label className="block text-sm font-medium text-gray-700">NPK Ratio</label>
          <input
            type="text"
            name="npkRatio"
            value={formData.npkRatio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="e.g., 10-10-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="organic">Organic</option>
            <option value="synthetic">Synthetic</option>
            <option value="mineral">Mineral</option>
            <option value="bio">Bio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Application Method</label>
          <select
            name="applicationMethod"
            value={formData.applicationMethod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="granular">Granular</option>
            <option value="liquid">Liquid</option>
            <option value="powder">Powder</option>
            <option value="spike">Spike</option>
            <option value="spray">Spray</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Release Type</label>
          <select
            name="releaseType"
            value={formData.releaseType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="slow-release">Slow Release</option>
            <option value="quick-release">Quick Release</option>
            <option value="controlled-release">Controlled Release</option>
          </select>
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
          <label className="block text-sm font-medium text-gray-700">Coverage Area (sq ft)</label>
          <input
            type="text"
            name="coverage"
            value={formData.coverage}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="e.g., 100-150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Packaging Size</label>
          <input
            type="text"
            name="packagingSize"
            value={formData.packagingSize}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="e.g., 5L, 10kg"
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
          <label className="block text-sm font-medium text-gray-700">Application Instructions</label>
          <textarea
            name="applicationInstructions"
            value={formData.applicationInstructions}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter detailed application instructions..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Storage Instructions</label>
          <textarea
            name="storageInstructions"
            value={formData.storageInstructions}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Enter storage instructions..."
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="organicStatus"
              checked={formData.organicStatus}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Organic Product
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Composition</label>
          {formData.composition.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, 'composition')}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter composition item"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, 'composition')}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('composition')}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            + Add Composition
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nutrients</label>
          {formData.nutrients.map((nutrient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={nutrient}
                onChange={(e) => handleArrayChange(index, e.target.value, 'nutrients')}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter nutrient (e.g., Nitrogen, Phosphorus)"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, 'nutrients')}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('nutrients')}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            + Add Nutrient
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Best For</label>
          {formData.bestFor.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, 'bestFor')}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter plant type or use case"
              />
              <button
                type="button"
                onClick={() => removeArrayField(index, 'bestFor')}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('bestFor')}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            + Add Best For
          </button>
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
          <p className="mt-1 text-sm text-gray-500">Featured fertilizers will be highlighted on the home page and in product listings.</p>
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
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default AddFertilizerForm; 
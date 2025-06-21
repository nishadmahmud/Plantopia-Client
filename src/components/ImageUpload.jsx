import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageUpload, currentImageUrl, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl || '');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:3000/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.imageUrl;
        setUploadedUrl(imageUrl);
        onImageUpload(imageUrl);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInput = (e) => {
    const url = e.target.value;
    setUploadedUrl(url);
    onImageUpload(url);
  };

  const clearImage = () => {
    setUploadedUrl('');
    onImageUpload('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* File Upload */}
      <div className="flex items-center space-x-3">
        <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2">
          <FaUpload className="w-4 h-4" />
          <span>Choose File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
        
        {uploading && (
          <div className="flex items-center space-x-2 text-gray-600">
            <FaSpinner className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}
        
        {uploadedUrl && !uploading && (
          <button
            type="button"
            onClick={clearImage}
            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
          >
            <FaTimes className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* URL Input (Alternative) */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Or enter image URL directly:
        </label>
        <input
          type="url"
          value={uploadedUrl}
          onChange={handleUrlInput}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500 text-sm"
        />
      </div>

      {/* Image Preview */}
      {uploadedUrl && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <div className="relative inline-block">
            <img
              src={uploadedUrl}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded-md border border-gray-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center w-full h-32 bg-gray-100 rounded-md border border-gray-300">
              <span className="text-gray-500 text-sm">Invalid image URL</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Upload an image file (JPG, PNG, GIF) or paste an image URL</li>
          <li>Maximum file size: 5MB</li>
          <li>Images will be automatically optimized and resized</li>
          <li>For best results, use images with aspect ratio 16:9 or 4:3</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes, FaBold, FaItalic, FaListUl, FaListOl } from 'react-icons/fa';
import ImageUpload from '../../components/ImageUpload';

const AddBlogForm = ({ blogData, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    imageUrl: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || '',
        author: blogData.author || '',
        imageUrl: blogData.imageUrl || '',
        tags: Array.isArray(blogData.tags) ? blogData.tags.join(', ') : ''
      });
      setContent(blogData.content || '');
    } else {
      setFormData({ title: '', author: '', imageUrl: '', tags: '' });
      setContent('');
    }
  }, [blogData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const addFormatting = (format) => {
    const textarea = document.getElementById('content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'ul':
        formattedText = `<ul>\n<li>${selectedText}</li>\n</ul>`;
        break;
      case 'ol':
        formattedText = `<ol>\n<li>${selectedText}</li>\n</ol>`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const blogDataPayload = {
      ...formData,
      content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      let response;
      if (blogData) {
        response = await axios.put(`http://localhost:3000/api/blogs/${blogData._id}`, blogDataPayload);
        toast.success('Blog post updated successfully!');
      } else {
        response = await axios.post('http://localhost:3000/api/blogs', blogDataPayload);
        toast.success('Blog post created successfully!');
      }

      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting blog post:', error);
      toast.error(blogData ? 'Failed to update blog post.' : 'Failed to create blog post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-[70]">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {blogData ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input 
                type="text" 
                name="author" 
                value={formData.author} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" 
                required 
              />
            </div>

            <ImageUpload 
              onImageUpload={handleImageUpload}
              currentImageUrl={formData.imageUrl}
              label="Blog Image"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input 
                type="text" 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              
              {/* Simple formatting toolbar */}
              <div className="flex space-x-2 mb-2 p-2 bg-gray-50 border border-gray-300 rounded-t-md">
                <button
                  type="button"
                  onClick={() => addFormatting('bold')}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <FaBold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => addFormatting('italic')}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <FaItalic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => addFormatting('ul')}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Unordered List"
                >
                  <FaListUl className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => addFormatting('ol')}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Ordered List"
                >
                  <FaListOl className="w-4 h-4" />
                </button>
              </div>
              
              <textarea 
                id="content-textarea"
                name="content"
                value={content}
                onChange={handleContentChange}
                className="w-full border border-gray-300 rounded-b-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                rows={10}
                placeholder="Write your blog content here... Use the formatting buttons above to style your text."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Select text and use the formatting buttons above to add styling
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
              >
                {loading ? (blogData ? 'Updating...' : 'Creating...') : (blogData ? 'Update Post' : 'Create Post')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlogForm; 
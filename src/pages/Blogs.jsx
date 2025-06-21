import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/blogs');
        if (response.data.success) {
          setBlogs(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const createSnippet = (html) => {
    const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    return cleanHtml.length > 150 ? cleanHtml.substring(0, 150) + '...' : cleanHtml;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-lg text-gray-600">Insights, tips, and stories from the world of plants.</p>
      </div>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              {blog.imageUrl && (
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{blog.title}</h2>
                <p className="text-sm text-gray-500 mb-4">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600 flex-grow">{createSnippet(blog.content)}</p>
                <Link to={`/blogs/${blog._id}`} className="mt-4 text-green-600 hover:text-green-800 font-semibold self-start">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-800">No Posts Yet</h2>
          <p className="text-gray-500 mt-4">Check back soon for articles on plant care, gardening tips, and much more!</p>
        </div>
      )}
    </div>
  );
};

export default Blogs; 
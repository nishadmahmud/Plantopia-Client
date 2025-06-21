import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/blogs/${id}`);
        if (response.data.success) {
          setBlog(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center py-20">Blog post not found.</div>;
  }

  const cleanHtml = DOMPurify.sanitize(blog.content);

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          <span>By {blog.author}</span> | <span>Published on {new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        {blog.imageUrl && (
          <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto object-cover rounded-lg mb-8" />
        )}
        <div
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </article>
    </div>
  );
};

export default BlogDetails; 
import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const ReviewForm = ({ productId, productType, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3000/api/reviews', {
        userId: user.uid,
        productId,
        productType,
        rating,
        comment
      });

      if (response.data.success) {
        toast.success('Review submitted successfully');
        setRating(0);
        setComment('');
        if (onReviewAdded) {
          onReviewAdded(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700 font-medium">Rating</label>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button
                type="button"
                key={ratingValue}
                className={`text-2xl focus:outline-none transition-colors duration-200 ${
                  (hover || rating) >= ratingValue ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              >
                <FaStar />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="comment" className="text-gray-700 font-medium">
          Review Comment
        </label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Share your experience with this product..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm; 
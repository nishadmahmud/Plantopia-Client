import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { API_URL } from '../utils/api';

const Reviews = ({ productId, productType }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  const fetchReviews = async () => {
    try {
              const response = await axios.get(`${API_URL}/api/reviews/${productId}`);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkCanReview = async () => {
    if (!user) {
      setCanReview(false);
      setCheckingEligibility(false);
      return;
    }
    try {
                const response = await axios.get(`${API_URL}/api/reviews/check/${user.uid}/${productId}`);
      if (response.data.success) {
        setCanReview(response.data.canReview);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReviews(), checkCanReview()]);
      setLoading(false);
    };
    loadData();
  }, [productId, user]);

  const handleReviewAdded = async (newReview) => {
    // Refresh the reviews list to get the properly formatted review with user info
    await fetchReviews();
    // Update the review form visibility
    setCanReview(false);
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      
      {!checkingEligibility && !canReview && user && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600">
            You can review this product after purchasing and receiving it.
          </p>
        </div>
      )}
      
      {canReview && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Write a Review</h3>
          <ReviewForm 
            productId={productId} 
            productType={productType}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4 mb-2">
                {review.user[0]?.photoURL && (
                  <img
                    src={review.user[0].photoURL}
                    alt={review.user[0].displayName}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{review.user[0]?.displayName || 'Anonymous'}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500 ml-auto">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No reviews yet</p>
      )}

      {!user && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-gray-600">
            Please <a href="/login" className="text-green-600 hover:underline">log in</a> to write a review.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews; 
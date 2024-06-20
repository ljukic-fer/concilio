import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../style'; // Import your styles

const Reviews = ({ fileId }) => {
  const currentUser = localStorage.getItem('email');
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [newReview, setNewReview] = useState({
    review_body: '',
    review_grade: 1,
  });

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/reviews/${fileId}`);
      setReviews(response.data.reviews);
      setHasReviewed(response.data.reviews.some(review => review.reviewer === currentUser));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fileId, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/insert_review`, {
        file_id: fileId,
        reviewer: currentUser,
        ...newReview,
      });
      alert('Review submitted successfully!');
      // Fetch the updated list of reviews without reloading the page
      const response = await axios.get(`http://localhost:5000/reviews/${fileId}`);
      setReviews(response.data.reviews);
      setHasReviewed(response.data.reviews.some(review => review.reviewer === currentUser));
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  return (
    <div className={`${styles.body} ${styles.marginX}`}>
      {hasReviewed ? (
        <div>
          <p className={`${styles.body} text-blue-800`}>You have already reviewed this document.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <p>You can review this document</p>
            <textarea
              name="review_body"
              placeholder='Review text'
              value={newReview.review_body}
              onChange={handleInputChange}
              required
              className={`${styles.textarea} w-1/2 min-h-24`}
            />
          </div>
          <div>
            <label className={styles.label}>Grade</label>
            <select
              name="review_grade"
              value={newReview.review_grade}
              onChange={handleInputChange}
              required
              className='ml-4'
            >
              {[1, 2, 3, 4, 5].map(grade => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
          <button type='submit' className="mt-6 py-1 px-12 bg-blue-600 font-poppins font-medium text-primary outline-none rounded-[10px] ml-auto mr-8 text-white hover:bg-blue-800">
            Submit Review
          </button>
        </form>
      )}

      {reviews.length > 0 ? (
        <h3 className={styles.heading}>Reviews</h3>
      ) : (
        <h2 className={styles.heading}>Not yet reviewed</h2>
      )}
      <ul className={`${styles.body} m-4 divide-y-2 divide-blue-800`}>
        {reviews && reviews.map(review => (
          <li key={review.review_id} className={`${styles.reviewItem} mb-2`}>
            <div>
              <strong className={`${review.reviewer === localStorage.getItem('email') ? 'text-blue-800' : ''}`}>{review.reviewer}</strong>
            </div>
            <div>{review.review_body}</div>
            <div>Grade: {review.review_grade}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;

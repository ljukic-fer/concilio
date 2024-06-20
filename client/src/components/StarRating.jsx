import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StarRating = ({ fileId }) => {
  const [averageGrade, setAverageGrade] = useState(0);

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${fileId}`);
        setAverageGrade(response.data.averageGrade);
      } catch (error) {
        console.error('Error fetching average grade:', error);
      }
    };
    fetchGrade();
  }, [fileId]);

  const fullStars = Math.floor(averageGrade);
  const halfStar = averageGrade % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="star-rating flex">
      {Array(fullStars).fill().map((_, i) => (
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24">
          <path d="M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.1-.61L12 2 9.1 8.63l-7.1.61 5.46 4.73-1.64 7.03L12 17.27z" />
        </svg>
      ))}
      {halfStar === 1 && (
        <svg key="half" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfStarGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStarGradient)" d="M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.1-.61L12 2 9.1 8.63l-7.1.61 5.46 4.73-1.64 7.03L12 17.27z" />
        </svg>
      )}
      {Array(emptyStars).fill().map((_, i) => (
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
          <path d="M12 2l2.9 6.63 7.1.61-5.46 4.73 1.64 7.03L12 17.27l-6.18 3.73 1.64-7.03-5.46-4.73 7.1-.61L12 2z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

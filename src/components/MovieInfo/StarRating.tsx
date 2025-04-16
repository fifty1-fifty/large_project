import { useState } from 'react';
import './StarRating.css';
//import MovieInfo from './MovieInfo';


// StarRating.tsx
const StarRating = ({ onRatingChange }: { onRatingChange: (value: number) => void }) => {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);

  function handleSetRating(starValue: number) 
  {
    setRating(starValue);
    onRatingChange(starValue);
  }

  return (
    <div className="starRating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`Star ${starValue <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => handleSetRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

import React from 'react';

const ResultsComponent = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((movie) => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> ({movie.release_date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsComponent;

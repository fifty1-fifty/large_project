import React, { useState } from 'react';

const SearchComponent = ({ fetchData }) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    fetchData(input); // Calls API request function in parent
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Search for a movie..." 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchComponent;

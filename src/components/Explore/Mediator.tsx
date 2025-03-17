import React, { useState } from 'react';
import axios from 'axios';
import Search_Ex from './Search_E';
import Gallery_Ex from './Gallery_Ex';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const fetchData = async (searchTerm) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: 'YOUR_API_KEY',
          query: searchTerm,
        },
      });

      setResults(response.data.results); // Store fetched results
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <Search_Ex setQuery={setQuery} fetchData={fetchData} />
      <Gallery_Ex results={results} />
    </div>
  );
};

export default App;

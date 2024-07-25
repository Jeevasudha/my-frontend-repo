import React, { useState, useEffect } from 'react';
import { fetchData } from './api';
import './SearchPage.css';

const SearchPage = () => {
  const [filter, setFilter] = useState('');
  const [images, setImages] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (filter) {
      fetchImages(filter);
    }
  }, [filter]);

  const fetchImages = async (query) => {
    try {
      const data = await fetchData(query);
      setImages(data.images);
    } catch (error) {
      setError('Failed to fetch images.');
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSaveList = async () => {
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'My Saved List',
          creationDate: new Date(),
          responseCodes: images.map((image) => image.responseCode),
          imageLinks: images.map((image) => image.url),
        }),
      });

      const data = await response.json();
      setSavedList([...savedList, data.savedList]);
      setFilter('');
      setImages([]);
    } catch (error) {
      setError('Failed to save list.');
    }
  };

  return (
    <div>
      <h2>Search Page</h2>
      <input type="text" value={filter} onChange={handleFilterChange} placeholder="Enter filter (e.g., 203, 2xx)" />
      <button onClick={() => fetchImages(filter)}>Search</button>
      
      <ul>
        {images.map((image) => (
          <li key={image.id}>
            <img src={image.url} alt={'Response Code ${image.responseCode}'} />
          </li>
        ))}
      </ul>

      <button onClick={handleSaveList}>Save List</button>

      {savedList.length > 0 && (
        <div>
          <h3>Saved List:</h3>
          <ul>
            {savedList.map((item, index) => (
              <li key={index}>
                <p>Name: {item.name}</p>
                <p>Creation Date: {item.creationDate}</p>
                <p>Response Codes: {item.responseCodes.join(', ')}</p>
                <p>Image Links: {item.imageLinks.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default SearchPage;
import React, { useState, useEffect } from 'react';
import './ListPage.css';

const ListPage = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('http://localhost:50320/api/lists');
      const data = await response.json();
      setLists(data.lists);
    } catch (err) {
      setError('Failed to fetch lists.');
    }
  };

  const handleSelectList = (list) => {
    setSelectedList(list);
  };

  const handleDeleteList = async (id) => {
    try {
      await fetch('http://localhost:3000/api/lists/${id}', { method: 'DELETE' });
      fetchLists();
    } catch (err) {
      setError('Failed to delete list.');
    }
  };

  return (
    <div className="list-container">
      <h2>List Page</h2>
      <ul className="lists">
        {lists.map((list) => (
          <li key={list._id}>
            <span>{list.name}</span>
            <button onClick={() => handleSelectList(list)}>View Images</button>
            <button onClick={() => handleDeleteList(list._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedList && (
        <div className="selected-list">
          <h3>{selectedList.name} Images:</h3>
          <ul className="images">
            {selectedList.images.map((image, index) => (
              <li key={index}><img src={image.url} alt={'Dog ${index}'} /></li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ListPage;
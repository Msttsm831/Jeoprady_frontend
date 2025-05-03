import { useState } from 'react';
import * as jeopradyService from '../../services/jeopradyService'; 

const GameForm = ({ handleAddGame }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdGame = await jeopradyService.create(formData);

      if (createdGame) {
        setSuccessMessage('Game created successfully!');
        setFormData({ title: '', description: '', category: 'General' });
        handleAddGame(createdGame); 
      } else {
        setError('Failed to create game. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error creating game:', err);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type='text'
          name='title'
          required
          value={formData.title}
          onChange={handleChange}
        />
        <label>Description</label>
        <textarea
          name='description'
          required
          value={formData.description}
          onChange={handleChange}
        />
        <label>Category</label>
        <select
          name='category'
          value={formData.category}
          onChange={handleChange}
        >
          <option value='General'>General</option>
          <option value='Movies'>Movies</option>
          <option value='Science'>Science</option>
          <option value='History'>History</option>
          <option value='Sports'>Sports</option>
        </select>
        <button type='submit'>Create Game</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </main>
  );
};

export default GameForm;
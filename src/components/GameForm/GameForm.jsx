import { useState } from 'react';
import * as jeopradyService from '../../services/jeopradyService';
import styles from './GameForm.module.css';

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
    <main className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.title}>Create a New Jeoprady Game</h2>

        <label className={styles.label}>Title</label>
        <input
          type='text'
          name='title'
          required
          className={styles.input}
          value={formData.title}
          onChange={handleChange}
        />

        <label className={styles.label}>Description</label>
        <textarea
          name='description'
          required
          className={styles.textarea}
          value={formData.description}
          onChange={handleChange}
        />

        <label className={styles.label}>Category</label>
        <select
          name='category'
          className={styles.select}
          value={formData.category}
          onChange={handleChange}
        >
          <option value='General'>General</option>
          <option value='Movies'>Movies</option>
          <option value='Science'>Science</option>
          <option value='History'>History</option>
          <option value='Sports'>Sports</option>
        </select>

        <button type='submit' className={styles.button}>Create Game</button>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </main>
  );
};

export default GameForm;
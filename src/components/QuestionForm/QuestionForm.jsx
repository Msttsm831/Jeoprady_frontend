import { useState } from 'react';

const QuestionForm = ({ handleAddQuestion }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    options: '',
    correctAnswer: '',
    points: 100,
    category: ''
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const optionsArray = formData.options
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt);

    if (optionsArray.length < 2) {
      alert('Please enter at least two options separated by commas.');
      return;
    }

    const newQuestion = {
      questionText: formData.questionText,
      options: optionsArray,
      correctAnswer: formData.correctAnswer,
      points: Number(formData.points),
      category: formData.category
    };

    handleAddQuestion(newQuestion);

    // Reset form
    setFormData({
      questionText: '',
      options: '',
      correctAnswer: '',
      points: 100,
      category: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='questionText'>Question:</label>
      <textarea
        required
        name='questionText'
        id='questionText'
        value={formData.questionText}
        onChange={handleChange}
      />

      <label htmlFor='options'>Options (comma-separated):</label>
      <input
        required
        type='text'
        name='options'
        id='options'
        placeholder='Option 1, Option 2, Option 3...'
        value={formData.options}
        onChange={handleChange}
      />

      <label htmlFor='correctAnswer'>Correct Answer:</label>
      <input
        required
        type='text'
        name='correctAnswer'
        id='correctAnswer'
        value={formData.correctAnswer}
        onChange={handleChange}
      />

      <label htmlFor='points'>Points:</label>
      <input
        required
        type='number'
        name='points'
        id='points'
        value={formData.points}
        onChange={handleChange}
      />

      <label htmlFor='category'>Category:</label>
      <input
        required
        type='text'
        name='category'
        id='category'
        value={formData.category}
        onChange={handleChange}
      />

      <button type='submit'>SUBMIT QUESTION</button>
    </form>
  );
};

export default QuestionForm;

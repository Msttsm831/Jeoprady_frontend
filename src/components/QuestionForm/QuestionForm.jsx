import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';
import styles from './QuestionForm.module.css';

const QuestionForm = ({ handleAddQuestion }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    options: '',
    correctAnswer: '',
    points: 100,
    category: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { jeopardyId, questionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (jeopardyId && questionId) {
          const game = await jeopardyService.show(jeopardyId);
          const existingQuestion = game.questions.find(q => q._id === questionId);
          if (existingQuestion) {
            setFormData({
              questionText: existingQuestion.questionText,
              options: existingQuestion.options.join(', '),
              correctAnswer: existingQuestion.correctAnswer,
              points: existingQuestion.points,
              category: existingQuestion.category
            });
            setShowForm(true);
          }
        }
      } catch (err) {
        console.error('Failed to load question for editing:', err);
      }
    };
    fetchGame();
  }, [jeopardyId, questionId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const optionsArray = formData.options
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt);

    if (optionsArray.length < 2) {
      setFeedback('Please enter at least two options.');
      return;
    }

    const questionData = {
      questionText: formData.questionText,
      options: optionsArray,
      correctAnswer: formData.correctAnswer,
      points: Number(formData.points),
      category: formData.category
    };

    try {
      if (jeopardyId && questionId) {
        await jeopardyService.editQuestion(jeopardyId, questionId, questionData);
        navigate(`/jeopardy/${jeopardyId}`);
      } else {
        handleAddQuestion(questionData);
        setFormData({
          questionText: '',
          options: '',
          correctAnswer: '',
          points: 100,
          category: ''
        });
        setFeedback('✅ Question added!');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setFeedback('❌ Failed to submit the question.');
    }
  };

  return (
    <div className={styles.formContainer}>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className={styles.formCardButton}>
          + Add Question
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.formCard}>
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

          <button type='submit'>{questionId ? 'Update' : 'Submit'} Question</button>
          {feedback && (
            <p className={`${styles.feedbackMessage} ${feedback.startsWith('✅') ? styles.success : styles.error}`}>
              {feedback}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default QuestionForm;
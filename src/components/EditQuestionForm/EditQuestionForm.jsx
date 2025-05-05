import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';

export default function EditQuestionForm() {
  const { id: gameId, questionId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    questionText: '',
    options: '',
    correctAnswer: '',
    points: 100,
    category: '',
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      const game = await jeopardyService.show(gameId);
      const question = game.questions.find(q => q._id === questionId);
      if (question) {
        setFormData({
          questionText: question.questionText,
          options: question.options.join(', '),
          correctAnswer: question.correctAnswer,
          points: question.points,
          category: question.category,
        });
      }
    };
    fetchQuestion();
  }, [gameId, questionId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedQuestion = {
      ...formData,
      options: formData.options.split(',').map(opt => opt.trim()),
      points: Number(formData.points),
    };
    await jeopardyService.updateQuestion(gameId, questionId, updatedQuestion);
    navigate(`/jeopardy/${gameId}`);
  };

  return (
    <main>
      <h1>Edit Question</h1>
      <form onSubmit={handleSubmit}>
        <label>Question Text</label>
        <textarea
          name="questionText"
          value={formData.questionText}
          onChange={handleChange}
          required
        />

        <label>Options (comma-separated)</label>
        <input
          name="options"
          value={formData.options}
          onChange={handleChange}
          required
        />

        <label>Correct Answer</label>
        <input
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={handleChange}
          required
        />

        <label>Points</label>
        <input
          name="points"
          type="number"
          value={formData.points}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Question</button>
      </form>
    </main>
  );
}
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';
import QuestionForm from '../QuestionForm/QuestionForm';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      const data = await jeopardyService.show(id);
      setGame(data);
    };
    fetchGame();
  }, [id]);

  const handleAnswer = (questionId, selectedOption, correctAnswer, points) => {
    if (answers[questionId]) return;

    const isCorrect = selectedOption === correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + points);
      setMessage(`✅ Correct! You earned ${points} points.`);
    } else {
      setMessage(`❌ Incorrect. The correct answer was: ${correctAnswer}`);
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption
    }));

    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleAddQuestion = async (newQuestion) => {
    const created = await jeopardyService.createQuestion(id, newQuestion);
    if (created) {
      setGame((prev) => ({
        ...prev,
        questions: [...prev.questions, created],
      }));
    }
  };

  const handleDeleteGame = async () => {
    const success = await jeopardyService.deleteGame(id);
    if (success) {
      navigate('/jeopardy');
    }
  };

  if (!game) return <p>Loading game details...</p>;

  return (
    <main>
      <h1>{game.title}</h1>
      <p><strong>Description:</strong> {game.description || 'No description provided'}</p>
      <h3>Total Score: {score}</h3>
      {message && <p style={{ color: message.includes('Correct') ? 'green' : 'red' }}>{message}</p>}
      <button onClick={handleDeleteGame} style={{ marginBottom: '20px' }}>
        Delete Game
      </button>

      <section>
        <h2>Add a Question</h2>
        <QuestionForm handleAddQuestion={handleAddQuestion} />
      </section>

      {game.questions?.length ? (
        <div>
          <h2>Questions</h2>
          <ul>
            {game.questions.map((q) => {
              const selected = answers[q._id];
              const isCorrect = selected === q.correctAnswer;

              return (
                <li key={q._id} style={{ marginBottom: '20px' }}>
                  <strong>Q:</strong> {q.questionText}<br />
                  <strong>Points:</strong> {q.points}<br />
                  <strong>Category:</strong> {q.category}<br />

                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={!!selected}
                      onClick={() => handleAnswer(q._id, opt, q.correctAnswer, q.points)}
                      style={{ marginRight: '8px', padding: '4px 8px' }}
                    >
                      {opt}
                    </button>
                  ))}

                  {selected && (
                    <p style={{ color: isCorrect ? 'green' : 'red' }}>
                      {isCorrect ? '✅ Correct!' : `❌ Wrong! Correct: ${q.correctAnswer}`}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>No questions added to this game.</p>
      )}
    </main>
  );
}
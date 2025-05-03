import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedAnswer }

  useEffect(() => {
    const fetchGame = async () => {
      const data = await jeopardyService.show(id);
      setGame(data);
    };
    fetchGame();
  }, [id]);

  const handleAnswer = (questionId, selectedOption, correctAnswer, points) => {
    // Prevent answering twice
    if (answers[questionId]) return;

    const isCorrect = selectedOption === correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + points);
      alert(`Correct! +${points} points`);
    } else {
      alert(`Wrong! Correct answer was: ${correctAnswer}`);
    }

    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  if (!game) return <p>Loading game details...</p>;

  return (
    <main>
      <h1>{game.title}</h1>
      <p><strong>Description:</strong> {game.description || 'No description provided'}</p>
      <h3>Total Score: {score}</h3>

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
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';
import QuestionForm from '../QuestionForm/QuestionForm';
import { UserContext } from '../../contexts/UserContext';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');

  const isGameOwner = user && game?.author?._id === user._id;

  useEffect(() => {
    jeopardyService.show(id).then(setGame);
  }, [id]);

  const handleAnswer = (questionId, selectedOption, correctAnswer, points) => {
    if (answers[questionId]) return;

    const correct = selectedOption === correctAnswer;
    setAnswers({ ...answers, [questionId]: selectedOption });
    setScore((prev) => prev + (correct ? points : 0));
    setMessage(correct ? `✅ +${points} points` : `❌ Correct answer: ${correctAnswer}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddQuestion = async (newQuestion) => {
    const created = await jeopardyService.createQuestion(id, newQuestion);
    if (created) {
      setGame({ ...game, questions: [...game.questions, created] });
    }
  };

  const handleDeleteGame = async () => {
    if (await jeopardyService.deleteGame(id)) navigate('/jeopardy');
  };

  const handleDeleteQuestion = async (questionId) => {
    if (await jeopardyService.deleteQuestion(id, questionId)) {
      setGame({ ...game, questions: game.questions.filter(q => q._id !== questionId) });
    }
  };

  if (!game) return <p>Loading...</p>;

  return (
    <main>
      <h1>{game.title}</h1>
      <p><strong>Description:</strong> {game.description}</p>
      <h3>Score: {score}</h3>
      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      {isGameOwner && (
        <>
          <button onClick={handleDeleteGame}>Delete Game</button>
          <section>
            <h2>Add a Question</h2>
            <QuestionForm handleAddQuestion={handleAddQuestion} />
          </section>
        </>
      )}

      <h2>Questions</h2>
      {game.questions.length === 0 ? (
        <p>No questions added yet.</p>
      ) : (
        <ul>
          {game.questions.map((q) => {
            const selected = answers[q._id];
            const isCorrect = selected === q.correctAnswer;
            return (
              <li key={q._id}>
                <p><strong>Q:</strong> {q.questionText}</p>
                <p><strong>Category:</strong> {q.category} | <strong>Points:</strong> {q.points}</p>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={!!selected}
                    onClick={() => handleAnswer(q._id, opt, q.correctAnswer, q.points)}
                  >
                    {opt}
                  </button>
                ))}
                {selected && (
                  <p style={{ color: isCorrect ? 'green' : 'red' }}>
                    {isCorrect ? '✅ Correct!' : `❌ Wrong! Correct: ${q.correctAnswer}`}
                  </p>
                )}
                {isGameOwner && (
                  <div>
                    <Link to={`/jeopardy/${id}/questions/${q._id}/edit`}>Edit</Link>
                    <button onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
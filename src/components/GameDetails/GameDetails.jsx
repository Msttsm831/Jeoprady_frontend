import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';
import QuestionForm from '../QuestionForm/QuestionForm';
import { UserContext } from '../../contexts/UserContext';
import styles from './GameDetails.module.css';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [game, setGame] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);

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
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>{game.title}</h1>
        <p className={styles.description}>{game.description}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.leftPanel}>
          {isGameOwner && (
            <>
              <button className={styles.deleteBtn} onClick={handleDeleteGame}>Delete Game</button>
              <QuestionForm handleAddQuestion={handleAddQuestion} />
            </>
          )}
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.scoreBox}>
            <h3>Score: {score}</h3>
            {message && (
              <p className={styles.feedback}>
                {message}
              </p>
            )}
          </div>

          <button onClick={() => setShowQuestions(true)} className={styles.playBtn}>
            Play
          </button>
        </div>
      </div>

      {showQuestions && (
        <div className={styles.questionGrid}>
          {game.questions.map((q) => {
            const selected = answers[q._id];
            const isCorrect = selected === q.correctAnswer;

            return (
              <div key={q._id} className="card text-white bg-dark mb-3" style={{ maxWidth: '500px' }}>
                <div className="card-header">
                  <strong>{q.category}</strong>
                  <span style={{ float: 'right' }}>{q.points} pts</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{q.questionText}</h5>
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={!!selected}
                      onClick={() => handleAnswer(q._id, opt, q.correctAnswer, q.points)}
                      className={`btn btn-outline-light btn-sm me-2 mt-2`}
                    >
                      {opt}
                    </button>
                  ))}

                  {selected && (
                    <p className="mt-3" style={{ color: isCorrect ? 'lightgreen' : '#ff4a4a' }}>
                      {isCorrect ? '✅ Correct!' : `❌ Wrong! Correct: ${q.correctAnswer}`}
                    </p>
                  )}

                  {isGameOwner && (
                    <div className="mt-3">
                      <Link
                        className="btn btn-sm btn-primary me-2"
                        to={`/jeopardy/${id}/questions/${q._id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteQuestion(q._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
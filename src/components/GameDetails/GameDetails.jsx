import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopardyService';

export default function JeopardyDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      const data = await jeopardyService.show(id);
      setGame(data);
    };
    fetchGame();
  }, [id]);

  if (!game) return <p>Loading game details...</p>;

  return (
    <main>
      <h1>{game.title}</h1>
      <p><strong>Category:</strong> {game.category}</p>
      <p><strong>Description:</strong> {game.description || 'No description provided'}</p>

      {game.questions && game.questions.length > 0 ? (
        <div>
          <h2>Questions</h2>
          <ul>
            {game.questions.map((q, index) => (
              <li key={index}>
                <strong>Q:</strong> {q.question} <br />
                <strong>A:</strong> {q.answer}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No questions added to this game.</p>
      )}
    </main>
  );
}

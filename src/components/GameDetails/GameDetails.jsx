import { useEffect, useState } from 'react';
import * as jeopradyService from '../../services/jeopradyService'; 
export default function JeopradyDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await jeopradyService.show(id); // ✅ match function from your service
        setGame(data);
      } catch (error) {
        console.error('Failed to fetch game:', error);
      }
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
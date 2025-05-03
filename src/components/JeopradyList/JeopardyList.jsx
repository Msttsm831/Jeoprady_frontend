import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopardyService';

export default function JeopardyListPage() {
  const [jeopardyGames, setJeopardyGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const data = await jeopardyService.index();
      console.log('Fetched jeopardy data:', data);
      setJeopardyGames(data);
    };
    fetchGames();
  }, []);

  return (
    <main>
      <h1>Jeopardy Games</h1>
      {jeopardyGames.length ? (
        <ul>
          {jeopardyGames.map((game) => (
            <li key={game._id}>
              {game.title} - <Link to={`/jeopardy/${game._id}`}>View</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No games available</p>
      )}
    </main>
  );
}
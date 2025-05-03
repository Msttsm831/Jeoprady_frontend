import { useEffect, useState } from 'react';
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
            <li key={game._id}>{game.title}</li>
          ))}
        </ul>
      ) : (
        <p>No games available</p>
      )}
    </main>
  );
}

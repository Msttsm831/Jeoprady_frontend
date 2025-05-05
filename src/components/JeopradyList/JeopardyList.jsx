import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as jeopardyService from '../../services/jeopradyService';
import styles from './JeopradyList.module.css';

export default function JeopardyListPage() {
  const [jeopardyGames, setJeopardyGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const data = await jeopardyService.index();
      setJeopardyGames(data);
    };
    fetchGames();
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Jeopardy Games</h1>
      {jeopardyGames.length ? (
        <ul className={styles.list}>
          {jeopardyGames.map((game) => (
            <li key={game._id} className={styles.item}>
              {game.title} - 
              <Link to={`/jeopardy/${game._id}`} className={styles.link}>
                View
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No games available</p>
      )}
    </main>
  );
}
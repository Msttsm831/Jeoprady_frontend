import { Routes, Route, useNavigate } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Landing from './components/Landing/Landing';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard';
import JeopardyList from './components/JeopradyList/JeopardyList';
import * as jeopardyService from './services/jeopradyService';
import GameDetails from './components/GameDetails/GameDetails';
import GameForm from './components/GameForm/GameForm';
import EditQuestionForm from './components/EditQuestionForm/EditQuestionForm'; 
import { UserContext } from './contexts/UserContext';



const App = () => {
  const { user } = useContext(UserContext);
  const [jeopardy, setJeopardy] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllJeopardys = async () => {
      const jeopardysData = await jeopardyService.index();
      setJeopardy(jeopardysData);
    };
    if (user) fetchAllJeopardys();
  }, [user]);

  const handleAddGame = (createdGame) => {
    setJeopardy([createdGame, ...jeopardy]);
    navigate('/jeopardy');
  };

  const handleDeleteGame = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this game?');
    if (!confirmed) return;

    const deleted = await jeopardyService.deleteGame(id);
    if (deleted) {
      setJeopardy(prev => prev.filter(game => game._id !== id));
      navigate('/jeopardy');
    }
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            <Route path='/jeopardy' element={<JeopardyList jeopardy={jeopardy} />} />
            <Route path='/jeoprady/new' element={<GameForm handleAddGame={handleAddGame} />} />
            <Route path='/jeopardy/:id' element={<GameDetails handleDeleteGame={handleDeleteGame} />} />
            <Route path='/jeopardy/:id/questions/:questionId/edit' element={<EditQuestionForm />} /> {/* ✅ New route */}
          </>
        ) : (
          <>
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
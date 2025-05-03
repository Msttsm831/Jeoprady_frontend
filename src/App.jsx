import { Routes, Route } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Landing from './components/Landing/Landing';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard';
import JeopardyList from './components/JeopardyList/JeopardyList';
import * as jeopardyService from './services/jeopardyService';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  const [jeopardy, setJeopardy] = useState([]);

  useEffect(() => {
    const fetchAllJeopardys = async () => {
      const jeopardysData = await jeopardyService.index();
      setJeopardy(jeopardysData);
    };
    if (user) fetchAllJeopardys();
  }, [user]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            <Route path='/jeopardy' element={<JeopardyList jeopardy={jeopardy} />} />
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

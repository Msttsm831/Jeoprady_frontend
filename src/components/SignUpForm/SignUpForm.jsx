import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import styles from './SignUpForm.module.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className={styles.container}>
      <h1>Sign Up</h1>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          id='username'
          value={username}
          name='username'
          onChange={handleChange}
          required
        />

        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          value={password}
          name='password'
          onChange={handleChange}
          required
        />

        <label htmlFor='confirm'>Confirm Password:</label>
        <input
          type='password'
          id='confirm'
          value={passwordConf}
          name='passwordConf'
          onChange={handleChange}
          required
        />

        <div className={styles.buttons}>
          <button type='submit' disabled={isFormInvalid()}>Sign Up</button>
          <button type='button' onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
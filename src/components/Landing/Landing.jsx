import styles from './Landing.module.css';

const Landing = () => {
  return (
        <div className={styles.textContainer}>
      <h1 className={styles.title}>Jeoprady</h1>
      <h2 className={styles.subtitle}>And yes it is misspelled.</h2>
      </div>
  );
};

export default Landing;
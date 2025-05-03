const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/jeopardy`;

console.log('JeopardyService BASE_URL:', BASE_URL);

const index = async () => {
    try {
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  export { index };

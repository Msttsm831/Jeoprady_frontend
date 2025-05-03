const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/jeoprady`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Jeoprady games');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching Jeoprady games:', error);
    return [];
  }
};

const show = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Jeoprady game detail');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching Jeoprady game:', error);
    return null;
  }
};

export { index, show };

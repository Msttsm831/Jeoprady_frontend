const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/jeoprady`;

// Fetch all games
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

// Fetch one game by ID
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

// Create a new game
const create = async (gameData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(gameData),
    });

    if (!res.ok) {
      throw new Error('Failed to create Jeoprady game');
    }

    return res.json();
  } catch (error) {
    console.error('Error creating Jeoprady game:', error);
    return null;
  }
};

// Create a question for a specific game
const createQuestion = async (gameId, questionData) => {
  try {
    const res = await fetch(`${BASE_URL}/${gameId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(questionData),
    });

    if (!res.ok) {
      throw new Error('Failed to create question');
    }

    return res.json();
  } catch (error) {
    console.error('Error creating question:', error);
    return null;
  }
};

// Delete a game by ID
const deleteGame = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete Jeoprady game');
    }

    return res.json();
  } catch (error) {
    console.error('Error deleting Jeoprady game:', error);
    return null;
  }
};

export { index, show, create, createQuestion, deleteGame };
const API_BASE_URL = 'http://localhost:8000';

export const sendMessage = async (message, character, gameSession, chatHistory) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        character,
        game_session: gameSession,
        chat_history: chatHistory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message to AI DM. Please check your connection and try again.');
  }
};

export const generateEncounter = async (partyLevel, partySize) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/random-encounter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        party_level: partyLevel,
        party_size: partySize
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating encounter:', error);
    throw new Error('Failed to generate encounter. Please try again.');
  }
};

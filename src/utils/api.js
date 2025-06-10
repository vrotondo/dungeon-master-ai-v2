// Determine the correct API URL based on current host
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing via IP address, use the same IP for API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8000`;
    }
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

console.log('[DEBUG] Using API Base URL:', API_BASE_URL);

export const sendMessage = async (message, character, gameSession, chatHistory) => {
  try {
    console.log('[DEBUG] Sending message to:', `${API_BASE_URL}/api/chat`);

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

    console.log('[DEBUG] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ERROR] Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Response received successfully');
    return data;
  } catch (error) {
    console.error('[ERROR] Error sending message:', error);
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
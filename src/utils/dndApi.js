const DND_API_BASE_URL = 'https://www.dnd5eapi.co/api';

export const searchSpells = async () => {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/spells`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching spells:', error);
    throw new Error('Failed to fetch spells from D&D API');
  }
};

export const getSpellDetails = async (spellIndex) => {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/spells/${spellIndex}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching spell details:', error);
    throw new Error('Failed to fetch spell details from D&D API');
  }
};

export const searchMonsters = async () => {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/monsters`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching monsters:', error);
    throw new Error('Failed to fetch monsters from D&D API');
  }
};

export const getMonsterDetails = async (monsterIndex) => {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/monsters/${monsterIndex}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching monster details:', error);
    throw new Error('Failed to fetch monster details from D&D API');
  }
};

export const searchClasses = async () => {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/classes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw new Error('Failed to fetch classes from D&D API');
  }
};

export const searchRaces = async () => {
  try {
    const response = await fetch(`${DND_API_BASE_URL}/races`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching races:', error);
    throw new Error('Failed to fetch races from D&D API');
  }
};

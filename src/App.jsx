import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import GameControls from './components/GameControls';
import SpellLookup from './components/SpellLookup';
import MonsterLookup from './components/MonsterLookup';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [character, setCharacter] = useState(null);
  const [gameSession, setGameSession] = useState(null);

  useEffect(() => {
    // Load saved character and session from localStorage
    const savedCharacter = localStorage.getItem('dnd_character');
    const savedSession = localStorage.getItem('dnd_session');
    
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
    }
    if (savedSession) {
      setGameSession(JSON.parse(savedSession));
    }
  }, []);

  const saveCharacter = (characterData) => {
    setCharacter(characterData);
    localStorage.setItem('dnd_character', JSON.stringify(characterData));
  };

  const saveSession = (sessionData) => {
    setGameSession(sessionData);
    localStorage.setItem('dnd_session', JSON.stringify(sessionData));
  };

  const tabs = [
    { id: 'chat', name: 'Chat', icon: 'fas fa-comments' },
    { id: 'character', name: 'Character', icon: 'fas fa-user' },
    { id: 'dice', name: 'Dice', icon: 'fas fa-dice' },
    { id: 'spells', name: 'Spells', icon: 'fas fa-magic' },
    { id: 'monsters', name: 'Monsters', icon: 'fas fa-dragon' },
    { id: 'controls', name: 'Game', icon: 'fas fa-cogs' }
  ];

  return (
    <div className="min-h-screen bg-fantasy-dark text-white">
      {/* Header */}
      <header className="bg-fantasy-medium border-b border-fantasy-light shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-fantasy-gold flex items-center">
            <i className="fas fa-dragon mr-3"></i>
            AI Dungeon Master
          </h1>
          <p className="text-fantasy-silver mt-1">D&D 5E Adventure Companion</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-fantasy-medium border-b border-fantasy-light">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-fantasy-accent text-fantasy-accent'
                    : 'border-transparent text-fantasy-silver hover:text-white hover:border-fantasy-light'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'chat' && <Chat character={character} gameSession={gameSession} />}
        {activeTab === 'character' && <CharacterSheet character={character} onSave={saveCharacter} />}
        {activeTab === 'dice' && <DiceRoller />}
        {activeTab === 'spells' && <SpellLookup />}
        {activeTab === 'monsters' && <MonsterLookup />}
        {activeTab === 'controls' && <GameControls gameSession={gameSession} onSave={saveSession} />}
      </main>
    </div>
  );
}

export default App;

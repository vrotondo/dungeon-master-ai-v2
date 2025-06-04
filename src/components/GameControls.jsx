import React, { useState, useEffect } from 'react';

const GameControls = ({ gameSession, onSave }) => {
  const [session, setSession] = useState({
    name: '',
    players: [],
    currentScene: '',
    notes: '',
    initiative: [],
    isActive: false
  });

  const [newPlayer, setNewPlayer] = useState('');
  const [newInitiative, setNewInitiative] = useState({ name: '', roll: 0 });

  useEffect(() => {
    if (gameSession) {
      setSession(gameSession);
    }
  }, [gameSession]);

  const handleSessionChange = (field, value) => {
    const updatedSession = { ...session, [field]: value };
    setSession(updatedSession);
    onSave(updatedSession);
  };

  const addPlayer = () => {
    if (newPlayer.trim()) {
      const updatedPlayers = [...session.players, newPlayer.trim()];
      handleSessionChange('players', updatedPlayers);
      setNewPlayer('');
    }
  };

  const removePlayer = (index) => {
    const updatedPlayers = session.players.filter((_, i) => i !== index);
    handleSessionChange('players', updatedPlayers);
  };

  const addToInitiative = () => {
    if (newInitiative.name.trim() && newInitiative.roll > 0) {
      const updatedInitiative = [...session.initiative, { 
        id: Date.now(),
        name: newInitiative.name.trim(), 
        roll: newInitiative.roll,
        isPlayer: session.players.includes(newInitiative.name.trim())
      }].sort((a, b) => b.roll - a.roll);
      
      handleSessionChange('initiative', updatedInitiative);
      setNewInitiative({ name: '', roll: 0 });
    }
  };

  const removeFromInitiative = (id) => {
    const updatedInitiative = session.initiative.filter(entry => entry.id !== id);
    handleSessionChange('initiative', updatedInitiative);
  };

  const clearInitiative = () => {
    handleSessionChange('initiative', []);
  };

  const toggleSession = () => {
    handleSessionChange('isActive', !session.isActive);
  };

  const generateRandomEncounter = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/random-encounter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          party_level: Math.max(1, session.players.length),
          party_size: session.players.length || 4
        })
      });
      
      if (response.ok) {
        const encounter = await response.json();
        handleSessionChange('notes', session.notes + '\n\n--- Random Encounter ---\n' + encounter.description);
      }
    } catch (error) {
      console.error('Failed to generate encounter:', error);
      alert('Failed to generate random encounter. Please check your connection.');
    }
  };

  return (
    <div className="bg-fantasy-medium rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-fantasy-gold">Game Session Control</h2>
        <button
          onClick={toggleSession}
          className={`px-4 py-2 rounded transition-colors ${
            session.isActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <i className={`fas ${session.isActive ? 'fa-stop' : 'fa-play'} mr-2`}></i>
          {session.isActive ? 'End Session' : 'Start Session'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold border-b border-fantasy-light pb-2">
            Session Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Session Name</label>
            <input
              type="text"
              value={session.name}
              onChange={(e) => handleSessionChange('name', e.target.value)}
              className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              placeholder="Enter session name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current Scene</label>
            <input
              type="text"
              value={session.currentScene}
              onChange={(e) => handleSessionChange('currentScene', e.target.value)}
              className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              placeholder="Describe the current scene..."
            />
          </div>

          {/* Players */}
          <div>
            <label className="block text-sm font-medium mb-2">Players</label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPlayer}
                  onChange={(e) => setNewPlayer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  className="flex-1 bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
                  placeholder="Add player name..."
                />
                <button
                  onClick={addPlayer}
                  className="bg-fantasy-accent hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              
              <div className="max-h-32 overflow-y-auto">
                {session.players.map((player, index) => (
                  <div key={index} className="flex justify-between items-center bg-fantasy-dark rounded px-3 py-2 mb-1">
                    <span>{player}</span>
                    <button
                      onClick={() => removePlayer(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
              
              {session.players.length === 0 && (
                <p className="text-fantasy-silver text-sm">No players added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Initiative Tracker */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-fantasy-gold border-b border-fantasy-light pb-2">
              Initiative Tracker
            </h3>
            <button
              onClick={clearInitiative}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              <i className="fas fa-trash mr-1"></i>
              Clear All
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={newInitiative.name}
                onChange={(e) => setNewInitiative(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-2 bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
                placeholder="Character/Monster name..."
              />
              <input
                type="number"
                min="1"
                max="30"
                value={newInitiative.roll || ''}
                onChange={(e) => setNewInitiative(prev => ({ ...prev, roll: parseInt(e.target.value) || 0 }))}
                className="bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
                placeholder="Roll"
              />
            </div>
            <button
              onClick={addToInitiative}
              className="w-full bg-fantasy-light hover:bg-fantasy-accent text-white py-2 px-4 rounded transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Add to Initiative
            </button>
          </div>

          <div className="bg-fantasy-dark rounded-lg p-3 max-h-48 overflow-y-auto">
            {session.initiative.length === 0 ? (
              <p className="text-fantasy-silver text-center">No initiative order set.</p>
            ) : (
              <div className="space-y-2">
                {session.initiative.map((entry, index) => (
                  <div key={entry.id} className={`flex justify-between items-center p-2 rounded ${
                    entry.isPlayer ? 'bg-blue-900' : 'bg-fantasy-medium'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-fantasy-gold font-bold w-6">{index + 1}.</span>
                      <span>{entry.name}</span>
                      {entry.isPlayer && <i className="fas fa-user text-blue-400 text-sm"></i>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-fantasy-gold font-bold">{entry.roll}</span>
                      <button
                        onClick={() => removeFromInitiative(entry.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Notes and Quick Actions */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-fantasy-gold">Session Notes</h3>
          <button
            onClick={generateRandomEncounter}
            className="bg-fantasy-accent hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            <i className="fas fa-random mr-2"></i>
            Random Encounter
          </button>
        </div>
        
        <textarea
          value={session.notes}
          onChange={(e) => handleSessionChange('notes', e.target.value)}
          className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
          rows="8"
          placeholder="Keep track of important events, NPCs, locations, and story developments..."
        />
      </div>

      {/* Session Status */}
      {session.isActive && (
        <div className="mt-4 p-3 bg-green-900 border border-green-600 rounded-lg">
          <div className="flex items-center space-x-2">
            <i className="fas fa-play text-green-400"></i>
            <span className="text-green-300 font-semibold">Session Active</span>
            {session.name && <span className="text-green-200">- {session.name}</span>}
          </div>
          {session.players.length > 0 && (
            <p className="text-green-200 text-sm mt-1">
              Players: {session.players.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameControls;

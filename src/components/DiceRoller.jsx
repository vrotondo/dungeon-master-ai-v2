import React, { useState } from 'react';

const DiceRoller = () => {
  const [rolls, setRolls] = useState([]);
  const [customDice, setCustomDice] = useState({ count: 1, sides: 20, modifier: 0 });
  const [isRolling, setIsRolling] = useState(false);

  const diceTypes = [
    { sides: 4, name: 'd4', color: 'bg-blue-600' },
    { sides: 6, name: 'd6', color: 'bg-green-600' },
    { sides: 8, name: 'd8', color: 'bg-yellow-600' },
    { sides: 10, name: 'd10', color: 'bg-purple-600' },
    { sides: 12, name: 'd12', color: 'bg-pink-600' },
    { sides: 20, name: 'd20', color: 'bg-red-600' },
    { sides: 100, name: 'd100', color: 'bg-indigo-600' }
  ];

  const rollDice = (count, sides, modifier = 0, label = '') => {
    setIsRolling(true);
    
    setTimeout(() => {
      const results = [];
      let total = 0;
      
      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        results.push(roll);
        total += roll;
      }
      
      const finalTotal = total + modifier;
      
      const rollResult = {
        id: Date.now() + Math.random(),
        label: label || `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
        results,
        modifier,
        total: finalTotal,
        timestamp: new Date().toLocaleTimeString(),
        isCritical: sides === 20 && results.some(r => r === 20),
        isFumble: sides === 20 && results.some(r => r === 1)
      };
      
      setRolls(prev => [rollResult, ...prev.slice(0, 19)]); // Keep last 20 rolls
      setIsRolling(false);
    }, 500);
  };

  const rollStandardDice = (sides) => {
    rollDice(1, sides);
  };

  const rollCustomDice = () => {
    rollDice(customDice.count, customDice.sides, customDice.modifier, 'Custom Roll');
  };

  const rollAbilityScore = () => {
    rollDice(4, 6, 0, 'Ability Score (4d6, drop lowest)');
  };

  const rollInitiative = () => {
    rollDice(1, 20, 0, 'Initiative');
  };

  const rollAdvantage = () => {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const higher = Math.max(roll1, roll2);
    
    const rollResult = {
      id: Date.now() + Math.random(),
      label: 'Advantage',
      results: [roll1, roll2],
      modifier: 0,
      total: higher,
      timestamp: new Date().toLocaleTimeString(),
      advantage: true,
      isCritical: higher === 20,
      isFumble: false
    };
    
    setRolls(prev => [rollResult, ...prev.slice(0, 19)]);
  };

  const rollDisadvantage = () => {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const lower = Math.min(roll1, roll2);
    
    const rollResult = {
      id: Date.now() + Math.random(),
      label: 'Disadvantage',
      results: [roll1, roll2],
      modifier: 0,
      total: lower,
      timestamp: new Date().toLocaleTimeString(),
      disadvantage: true,
      isCritical: false,
      isFumble: lower === 1
    };
    
    setRolls(prev => [rollResult, ...prev.slice(0, 19)]);
  };

  const clearRolls = () => {
    setRolls([]);
  };

  return (
    <div className="bg-fantasy-medium rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-fantasy-gold">Dice Roller</h2>
        <button
          onClick={clearRolls}
          className="bg-fantasy-accent hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          <i className="fas fa-trash mr-1"></i>
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dice Controls */}
        <div className="space-y-6">
          {/* Standard Dice */}
          <div>
            <h3 className="text-lg font-semibold text-fantasy-gold mb-3">Standard Dice</h3>
            <div className="grid grid-cols-4 gap-2">
              {diceTypes.map(dice => (
                <button
                  key={dice.sides}
                  onClick={() => rollStandardDice(dice.sides)}
                  disabled={isRolling}
                  className={`${dice.color} hover:opacity-80 disabled:opacity-50 text-white font-bold py-3 px-2 rounded transition-opacity flex flex-col items-center`}
                >
                  <i className="fas fa-dice text-lg mb-1"></i>
                  <span className="text-sm">{dice.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Rolls */}
          <div>
            <h3 className="text-lg font-semibold text-fantasy-gold mb-3">Special Rolls</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={rollInitiative}
                disabled={isRolling}
                className="bg-fantasy-accent hover:bg-red-600 disabled:opacity-50 text-white py-2 px-3 rounded transition-colors"
              >
                <i className="fas fa-bolt mr-2"></i>
                Initiative
              </button>
              <button
                onClick={rollAbilityScore}
                disabled={isRolling}
                className="bg-fantasy-accent hover:bg-red-600 disabled:opacity-50 text-white py-2 px-3 rounded transition-colors"
              >
                <i className="fas fa-user mr-2"></i>
                Ability Score
              </button>
              <button
                onClick={rollAdvantage}
                disabled={isRolling}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-3 rounded transition-colors"
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Advantage
              </button>
              <button
                onClick={rollDisadvantage}
                disabled={isRolling}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 px-3 rounded transition-colors"
              >
                <i className="fas fa-arrow-down mr-2"></i>
                Disadvantage
              </button>
            </div>
          </div>

          {/* Custom Dice */}
          <div>
            <h3 className="text-lg font-semibold text-fantasy-gold mb-3">Custom Roll</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm mb-1">Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={customDice.count}
                    onChange={(e) => setCustomDice(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-fantasy-dark border border-fantasy-light rounded px-2 py-1 text-white focus:outline-none focus:border-fantasy-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Sides</label>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={customDice.sides}
                    onChange={(e) => setCustomDice(prev => ({ ...prev, sides: parseInt(e.target.value) || 20 }))}
                    className="w-full bg-fantasy-dark border border-fantasy-light rounded px-2 py-1 text-white focus:outline-none focus:border-fantasy-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Modifier</label>
                  <input
                    type="number"
                    min="-50"
                    max="50"
                    value={customDice.modifier}
                    onChange={(e) => setCustomDice(prev => ({ ...prev, modifier: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-fantasy-dark border border-fantasy-light rounded px-2 py-1 text-white focus:outline-none focus:border-fantasy-accent"
                  />
                </div>
              </div>
              <button
                onClick={rollCustomDice}
                disabled={isRolling}
                className="w-full bg-fantasy-light hover:bg-fantasy-accent disabled:opacity-50 text-white py-2 px-4 rounded transition-colors"
              >
                <i className="fas fa-dice mr-2"></i>
                Roll {customDice.count}d{customDice.sides}{customDice.modifier !== 0 ? (customDice.modifier > 0 ? `+${customDice.modifier}` : customDice.modifier) : ''}
              </button>
            </div>
          </div>
        </div>

        {/* Roll History */}
        <div>
          <h3 className="text-lg font-semibold text-fantasy-gold mb-3">Roll History</h3>
          <div className="bg-fantasy-dark rounded-lg p-4 h-96 overflow-y-auto">
            {rolls.length === 0 ? (
              <p className="text-fantasy-silver text-center">No rolls yet. Roll some dice to get started!</p>
            ) : (
              <div className="space-y-3">
                {rolls.map(roll => (
                  <div
                    key={roll.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      roll.isCritical 
                        ? 'bg-green-900 border-green-500' 
                        : roll.isFumble 
                        ? 'bg-red-900 border-red-500'
                        : 'bg-fantasy-medium border-fantasy-light'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-fantasy-gold">{roll.label}</span>
                          {roll.isCritical && <i className="fas fa-star text-green-400"></i>}
                          {roll.isFumble && <i className="fas fa-skull text-red-400"></i>}
                        </div>
                        <div className="text-sm text-fantasy-silver mt-1">
                          {roll.advantage && <span className="text-green-400">Advantage: </span>}
                          {roll.disadvantage && <span className="text-red-400">Disadvantage: </span>}
                          Rolls: [{roll.results.join(', ')}]
                          {roll.modifier !== 0 && (
                            <span> {roll.modifier > 0 ? '+' : ''}{roll.modifier}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{roll.total}</div>
                        <div className="text-xs text-fantasy-silver">{roll.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rolling Animation */}
      {isRolling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-fantasy-medium rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">
              <i className="fas fa-dice animate-spin text-fantasy-gold"></i>
            </div>
            <p className="text-xl text-white">Rolling dice...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;

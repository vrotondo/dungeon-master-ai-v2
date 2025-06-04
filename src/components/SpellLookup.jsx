import React, { useState, useEffect } from 'react';
import { searchSpells, getSpellDetails } from '../utils/dndApi';

const SpellLookup = () => {
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSpells();
  }, []);

  const loadSpells = async () => {
    setLoading(true);
    setError('');
    try {
      const spellList = await searchSpells();
      setSpells(spellList);
    } catch (err) {
      setError('Failed to load spells. Please check your connection and try again.');
      console.error('Error loading spells:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpellSelect = async (spellIndex) => {
    setLoading(true);
    setError('');
    try {
      const spellDetails = await getSpellDetails(spellIndex);
      setSelectedSpell(spellDetails);
    } catch (err) {
      setError('Failed to load spell details. Please try again.');
      console.error('Error loading spell details:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpells = spells.filter(spell => 
    spell.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSpellLevel = (level) => {
    if (level === 0) return 'Cantrip';
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
    return `${ordinals[level]} Level`;
  };

  const formatDuration = (duration) => {
    return duration.replace(/^Up to /, '');
  };

  return (
    <div className="bg-fantasy-medium rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-fantasy-gold mb-6">D&D 5E Spell Lookup</h2>
      
      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spell List */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Spells</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              placeholder="Enter spell name..."
            />
          </div>

          <div className="bg-fantasy-dark rounded-lg p-3 h-96 overflow-y-auto">
            {loading && spells.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-fantasy-silver">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Loading spells...
                </div>
              </div>
            ) : filteredSpells.length === 0 ? (
              <div className="text-fantasy-silver text-center">
                {searchTerm ? 'No spells found matching your search.' : 'No spells available.'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSpells.map((spell) => (
                  <button
                    key={spell.index}
                    onClick={() => handleSpellSelect(spell.index)}
                    className={`w-full text-left p-2 rounded hover:bg-fantasy-medium transition-colors ${
                      selectedSpell?.index === spell.index ? 'bg-fantasy-medium border border-fantasy-accent' : ''
                    }`}
                  >
                    <div className="font-medium text-white">{spell.name}</div>
                    <div className="text-sm text-fantasy-silver">Level {spell.level}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spell Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold">Spell Details</h3>
          
          <div className="bg-fantasy-dark rounded-lg p-4 h-96 overflow-y-auto">
            {loading && selectedSpell ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-fantasy-silver">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Loading spell details...
                </div>
              </div>
            ) : selectedSpell ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-fantasy-gold">{selectedSpell.name}</h4>
                  <p className="text-fantasy-silver">
                    {formatSpellLevel(selectedSpell.level)} {selectedSpell.school?.name || 'Unknown School'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-fantasy-gold">Casting Time:</span>
                    <p className="text-white">{selectedSpell.casting_time}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-fantasy-gold">Range:</span>
                    <p className="text-white">{selectedSpell.range}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-fantasy-gold">Components:</span>
                    <p className="text-white">{selectedSpell.components?.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-fantasy-gold">Duration:</span>
                    <p className="text-white">{formatDuration(selectedSpell.duration)}</p>
                  </div>
                </div>

                {selectedSpell.material && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Material Components:</span>
                    <p className="text-white text-sm">{selectedSpell.material}</p>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-fantasy-gold">Description:</span>
                  <div className="text-white text-sm mt-1 space-y-2">
                    {selectedSpell.desc?.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {selectedSpell.higher_level && selectedSpell.higher_level.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">At Higher Levels:</span>
                    <div className="text-white text-sm mt-1 space-y-2">
                      {selectedSpell.higher_level.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSpell.classes && selectedSpell.classes.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Classes:</span>
                    <p className="text-white text-sm">
                      {selectedSpell.classes.map(cls => cls.name).join(', ')}
                    </p>
                  </div>
                )}

                {selectedSpell.ritual && (
                  <div className="bg-fantasy-medium border border-fantasy-light rounded p-2">
                    <span className="text-fantasy-gold font-semibold">
                      <i className="fas fa-star mr-1"></i>
                      Ritual Spell
                    </span>
                    <p className="text-white text-sm">This spell can be cast as a ritual.</p>
                  </div>
                )}

                {selectedSpell.concentration && (
                  <div className="bg-fantasy-medium border border-fantasy-light rounded p-2">
                    <span className="text-fantasy-gold font-semibold">
                      <i className="fas fa-brain mr-1"></i>
                      Concentration
                    </span>
                    <p className="text-white text-sm">This spell requires concentration.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-fantasy-silver">
                <div className="text-center">
                  <i className="fas fa-magic text-4xl mb-4"></i>
                  <p>Select a spell to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellLookup;

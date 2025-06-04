import React, { useState, useEffect } from 'react';
import { searchMonsters, getMonsterDetails } from '../utils/dndApi';

const MonsterLookup = () => {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMonsters();
  }, []);

  const loadMonsters = async () => {
    setLoading(true);
    setError('');
    try {
      const monsterList = await searchMonsters();
      setMonsters(monsterList);
    } catch (err) {
      setError('Failed to load monsters. Please check your connection and try again.');
      console.error('Error loading monsters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMonsterSelect = async (monsterIndex) => {
    setLoading(true);
    setError('');
    try {
      const monsterDetails = await getMonsterDetails(monsterIndex);
      setSelectedMonster(monsterDetails);
    } catch (err) {
      setError('Failed to load monster details. Please try again.');
      console.error('Error loading monster details:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMonsters = monsters.filter(monster => 
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatChallengeRating = (cr) => {
    if (cr < 1) {
      const fractions = { 0.125: '1/8', 0.25: '1/4', 0.5: '1/2' };
      return fractions[cr] || cr.toString();
    }
    return cr.toString();
  };

  const formatAbilityScore = (score) => {
    const modifier = Math.floor((score - 10) / 2);
    return `${score} (${modifier >= 0 ? '+' : ''}${modifier})`;
  };

  return (
    <div className="bg-fantasy-medium rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-fantasy-gold mb-6">D&D 5E Monster Lookup</h2>
      
      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monster List */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Monsters</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              placeholder="Enter monster name..."
            />
          </div>

          <div className="bg-fantasy-dark rounded-lg p-3 h-96 overflow-y-auto">
            {loading && monsters.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-fantasy-silver">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Loading monsters...
                </div>
              </div>
            ) : filteredMonsters.length === 0 ? (
              <div className="text-fantasy-silver text-center">
                {searchTerm ? 'No monsters found matching your search.' : 'No monsters available.'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredMonsters.map((monster) => (
                  <button
                    key={monster.index}
                    onClick={() => handleMonsterSelect(monster.index)}
                    className={`w-full text-left p-2 rounded hover:bg-fantasy-medium transition-colors ${
                      selectedMonster?.index === monster.index ? 'bg-fantasy-medium border border-fantasy-accent' : ''
                    }`}
                  >
                    <div className="font-medium text-white">{monster.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monster Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold">Monster Details</h3>
          
          <div className="bg-fantasy-dark rounded-lg p-4 h-96 overflow-y-auto">
            {loading && selectedMonster ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-fantasy-silver">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Loading monster details...
                </div>
              </div>
            ) : selectedMonster ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-fantasy-gold">{selectedMonster.name}</h4>
                  <p className="text-fantasy-silver">
                    {selectedMonster.size} {selectedMonster.type}, {selectedMonster.alignment}
                  </p>
                </div>

                {/* Basic Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-fantasy-gold">Armor Class:</span>
                    <p className="text-white">{selectedMonster.armor_class?.[0]?.value || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-fantasy-gold">Hit Points:</span>
                    <p className="text-white">{selectedMonster.hit_points} ({selectedMonster.hit_dice})</p>
                  </div>
                  <div>
                    <span className="font-semibold text-fantasy-gold">Speed:</span>
                    <p className="text-white">
                      {Object.entries(selectedMonster.speed || {}).map(([type, value]) => 
                        `${type === 'walk' ? '' : type + ' '}${value}`
                      ).join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-fantasy-gold">Challenge Rating:</span>
                    <p className="text-white">
                      {formatChallengeRating(selectedMonster.challenge_rating)} 
                      ({selectedMonster.xp?.toLocaleString() || '0'} XP)
                    </p>
                  </div>
                </div>

                {/* Ability Scores */}
                <div>
                  <span className="font-semibold text-fantasy-gold">Ability Scores:</span>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div className="text-center">
                      <div className="text-fantasy-silver">STR</div>
                      <div className="text-white">{formatAbilityScore(selectedMonster.strength)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-fantasy-silver">DEX</div>
                      <div className="text-white">{formatAbilityScore(selectedMonster.dexterity)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-fantasy-silver">CON</div>
                      <div className="text-white">{formatAbilityScore(selectedMonster.constitution)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-fantasy-silver">INT</div>
                      <div className="text-white">{formatAbilityScore(selectedMonster.intelligence)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-fantasy-silver">WIS</div>
                      <div className="text-white">{formatAbilityScore(selectedMonster.wisdom)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-fantasy-silver">CHA</div>
                      <div className="text-white">{formatAbilityScore(selectedMonster.charisma)}</div>
                    </div>
                  </div>
                </div>

                {/* Skills, Resistances, etc. */}
                {selectedMonster.skills && Object.keys(selectedMonster.skills).length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Skills:</span>
                    <p className="text-white text-sm">
                      {Object.entries(selectedMonster.skills).map(([skill, bonus]) => 
                        `${skill.replace('_', ' ')} +${bonus}`
                      ).join(', ')}
                    </p>
                  </div>
                )}

                {selectedMonster.damage_resistances && selectedMonster.damage_resistances.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Damage Resistances:</span>
                    <p className="text-white text-sm">{selectedMonster.damage_resistances.join(', ')}</p>
                  </div>
                )}

                {selectedMonster.damage_immunities && selectedMonster.damage_immunities.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Damage Immunities:</span>
                    <p className="text-white text-sm">{selectedMonster.damage_immunities.join(', ')}</p>
                  </div>
                )}

                {selectedMonster.condition_immunities && selectedMonster.condition_immunities.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Condition Immunities:</span>
                    <p className="text-white text-sm">
                      {selectedMonster.condition_immunities.map(condition => condition.name).join(', ')}
                    </p>
                  </div>
                )}

                {selectedMonster.senses && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Senses:</span>
                    <p className="text-white text-sm">{selectedMonster.senses.passive_perception ? `passive Perception ${selectedMonster.senses.passive_perception}` : 'None'}</p>
                  </div>
                )}

                {selectedMonster.languages && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Languages:</span>
                    <p className="text-white text-sm">{selectedMonster.languages || 'None'}</p>
                  </div>
                )}

                {/* Special Abilities */}
                {selectedMonster.special_abilities && selectedMonster.special_abilities.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Special Abilities:</span>
                    <div className="space-y-2 mt-1">
                      {selectedMonster.special_abilities.map((ability, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-white">{ability.name}.</span>
                          <span className="text-fantasy-silver"> {ability.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedMonster.actions && selectedMonster.actions.length > 0 && (
                  <div>
                    <span className="font-semibold text-fantasy-gold">Actions:</span>
                    <div className="space-y-2 mt-1">
                      {selectedMonster.actions.map((action, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-white">{action.name}.</span>
                          <span className="text-fantasy-silver"> {action.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-fantasy-silver">
                <div className="text-center">
                  <i className="fas fa-dragon text-4xl mb-4"></i>
                  <p>Select a monster to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterLookup;

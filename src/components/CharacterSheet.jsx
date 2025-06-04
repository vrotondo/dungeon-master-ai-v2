import React, { useState, useEffect } from 'react';

const CharacterSheet = ({ character, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    background: '',
    alignment: '',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    hitPoints: 8,
    armorClass: 10,
    speed: 30,
    proficiencyBonus: 2,
    skills: [],
    equipment: '',
    backstory: ''
  });

  const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'];
  const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
  const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
  const skillsList = ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'];

  useEffect(() => {
    if (character) {
      setFormData(character);
    }
  }, [character]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleSave = () => {
    onSave(formData);
    alert('Character saved successfully!');
  };

  const generateRandomStats = () => {
    const rollStat = () => {
      const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    setFormData(prev => ({
      ...prev,
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    }));
  };

  return (
    <div className="bg-fantasy-medium rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-fantasy-gold">Character Sheet</h2>
        <div className="space-x-2">
          <button
            onClick={generateRandomStats}
            className="bg-fantasy-light hover:bg-fantasy-accent text-white px-4 py-2 rounded transition-colors"
          >
            <i className="fas fa-dice mr-2"></i>
            Roll Stats
          </button>
          <button
            onClick={handleSave}
            className="bg-fantasy-accent hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            <i className="fas fa-save mr-2"></i>
            Save Character
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold border-b border-fantasy-light pb-2">
            Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Character Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              placeholder="Enter character name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Race</label>
              <select
                value={formData.race}
                onChange={(e) => handleInputChange('race', e.target.value)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              >
                <option value="">Select Race</option>
                {races.map(race => (
                  <option key={race} value={race}>{race}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.level}
                onChange={(e) => handleInputChange('level', parseInt(e.target.value) || 1)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Background</label>
              <input
                type="text"
                value={formData.background}
                onChange={(e) => handleInputChange('background', e.target.value)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
                placeholder="e.g., Acolyte, Criminal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Alignment</label>
            <select
              value={formData.alignment}
              onChange={(e) => handleInputChange('alignment', e.target.value)}
              className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
            >
              <option value="">Select Alignment</option>
              {alignments.map(alignment => (
                <option key={alignment} value={alignment}>{alignment}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold border-b border-fantasy-light pb-2">
            Ability Scores
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(ability => (
              <div key={ability} className="bg-fantasy-dark rounded p-3">
                <label className="block text-sm font-medium mb-1 capitalize">{ability}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData[ability]}
                    onChange={(e) => handleInputChange(ability, parseInt(e.target.value) || 10)}
                    className="w-16 bg-fantasy-medium border border-fantasy-light rounded px-2 py-1 text-center text-white focus:outline-none focus:border-fantasy-accent"
                  />
                  <span className="text-fantasy-gold font-bold">
                    {formatModifier(calculateModifier(formData[ability]))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combat Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold border-b border-fantasy-light pb-2">
            Combat Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hit Points</label>
              <input
                type="number"
                min="1"
                value={formData.hitPoints}
                onChange={(e) => handleInputChange('hitPoints', parseInt(e.target.value) || 1)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Armor Class</label>
              <input
                type="number"
                min="1"
                value={formData.armorClass}
                onChange={(e) => handleInputChange('armorClass', parseInt(e.target.value) || 10)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Speed</label>
              <input
                type="number"
                min="0"
                value={formData.speed}
                onChange={(e) => handleInputChange('speed', parseInt(e.target.value) || 30)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Proficiency Bonus</label>
              <input
                type="number"
                min="1"
                value={formData.proficiencyBonus}
                onChange={(e) => handleInputChange('proficiencyBonus', parseInt(e.target.value) || 2)}
                className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-fantasy-gold border-b border-fantasy-light pb-2">
            Proficient Skills
          </h3>
          
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {skillsList.map(skill => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer hover:bg-fantasy-dark p-1 rounded">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="text-fantasy-accent focus:ring-fantasy-accent"
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment and Backstory */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Equipment</label>
          <textarea
            value={formData.equipment}
            onChange={(e) => handleInputChange('equipment', e.target.value)}
            className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
            rows="3"
            placeholder="List your character's equipment, weapons, and gear..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Backstory</label>
          <textarea
            value={formData.backstory}
            onChange={(e) => handleInputChange('backstory', e.target.value)}
            className="w-full bg-fantasy-dark border border-fantasy-light rounded px-3 py-2 text-white focus:outline-none focus:border-fantasy-accent"
            rows="4"
            placeholder="Describe your character's background, personality, and motivations..."
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;

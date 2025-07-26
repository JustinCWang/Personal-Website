/**
 * Skills Manager Component
 * Manages the display and manipulation of user skills
 * Provides interface for adding, editing, and deleting skills
 */

import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';
import SkillCategoryDropdown from './SkillCategoryDropdown';
import CustomDropdown from './CustomDropdown';

/**
 * Skill type definition
 */
interface Skill {
  _id: string;
  name: string;
  category: string;
}

/**
 * Skills Manager Props
 */
interface SkillsManagerProps {
  isDarkMode: boolean;
}

/**
 * Available skill categories
 */
const CATEGORIES = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'AI/ML',
  'DevOps & Tools',
  'Additional Tools'
];

/**
 * Skills Manager Component
 * @param {SkillsManagerProps} props - Component props
 * @param {boolean} props.isDarkMode - Dark mode state
 */
const SkillsManager: React.FC<SkillsManagerProps> = ({ isDarkMode }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState<Omit<Skill, '_id'>>({
    name: '',
    category: ''
  });

  /**
   * Fetch all skills on component mount
   */
  useEffect(() => {
    fetchSkills();
  }, []);

  /**
   * Fetch all skills from the API
   */
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await skillsAPI.getMine();
      setSkills(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch skills');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new skill
   * @param {React.FormEvent} e - Form submit event
   */
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    try {
      const addedSkill = await skillsAPI.add(newSkill);
      setSkills(prevSkills => [...prevSkills, addedSkill]);
      setNewSkill({ name: '', category: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add skill');
      console.error('Error adding skill:', err);
    }
  };

  /**
   * Update an existing skill
   * @param {React.FormEvent} e - Form submit event
   */
  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      const updatedSkill = await skillsAPI.update(editingSkill._id, {
        name: editingSkill.name,
        category: editingSkill.category
      });
      setSkills(prevSkills => prevSkills.map(skill => 
        skill._id === editingSkill._id ? updatedSkill : skill
      ));
      setEditingSkill(null);
      setError(null);
    } catch (err) {
      setError('Failed to update skill');
      console.error('Error updating skill:', err);
    }
  };

  /**
   * Delete a skill
   * @param {string} id - Skill ID to delete
   */
  const handleDeleteSkill = async (id: string) => {
    try {
      await skillsAPI.delete(id);
      setSkills(prevSkills => prevSkills.filter(skill => skill._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete skill');
      console.error('Error deleting skill:', err);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border border-green-500' 
        : 'bg-white'
    }`}>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-mono ${
        isDarkMode ? 'text-green-400' : 'text-slate-800'
      }`}>
        Skills Management
      </h2>

      {/* Error Message */}
      {error && (
        <div className={`text-center rounded-lg p-6 border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-red-900 border-red-600' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`font-semibold mb-4 font-mono ${
            isDarkMode ? 'text-red-300' : 'text-red-600'
          }`}>
            Error: {error}
          </p>
        </div>
      )}

      {/* Add New Skill Form */}
      <form onSubmit={handleAddSkill} className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            autoComplete="off"
            className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-1 font-mono text-xs sm:text-sm transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none' 
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
          />
          <div className="w-full sm:w-64">
            <CustomDropdown
              value={newSkill.category}
              onChange={(value) => setNewSkill({ ...newSkill, category: value })}
              options={CATEGORIES.map(category => ({ value: category, label: category }))}
              placeholder="Select category..."
                            isDarkMode={isDarkMode}
              backgroundColor={isDarkMode ? 'bg-gray-800' : 'bg-white'}
              borderColor={isDarkMode ? 'border-green-500' : 'border-blue-400'}
              borderFocusColor={isDarkMode ? 'focus:ring-2 focus:ring-green-400 focus:border-green-400' : 'focus:ring-2 focus:ring-blue-400 focus:border-blue-400'}
              textColor={isDarkMode ? 'text-white' : 'text-slate-900'}
              placeholderColor={isDarkMode ? 'placeholder-green-400' : 'placeholder-slate-400'}
              padding="px-3 sm:px-4 py-1.5 sm:py-2"
            />
          </div>
          <button
            type="submit"
            className={`px-4 sm:px-6 py-1 sm:py-1.5 rounded-lg transition-all duration-300 border-2 font-mono font-bold whitespace-nowrap flex items-center justify-center text-xs sm:text-sm ${
              isDarkMode
                ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            Add Skill
          </button>
        </div>
      </form>

      {/* Skills List */}
      {loading ? (
        <div className="text-center py-12">
          <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDarkMode ? 'border-green-400' : 'border-blue-600'
          }`}></div>
          <p className={`mt-4 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-600'
          }`}>
            Loading skills...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {skills.length === 0 ? (
            <div className="text-center py-12">
              <div className={`mb-4 ${isDarkMode ? 'text-green-400' : 'text-slate-400'}`}>
                {/* Empty Skills Icon SVG */}
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className={`text-lg font-mono ${isDarkMode ? 'text-green-300' : 'text-slate-600'}`}>
                No Skills Found
              </p>
              <p className={`mt-2 font-mono ${isDarkMode ? 'text-green-200' : 'text-slate-500'}`}>
                Add your first skill using the form above.
              </p>
            </div>
          ) : (
            CATEGORIES.map(category => {
              const categorySkills = skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <SkillCategoryDropdown
                  key={category}
                  category={category}
                  skills={categorySkills}
                  editingSkill={editingSkill}
                  setEditingSkill={setEditingSkill}
                  handleDeleteSkill={handleDeleteSkill}
                  handleUpdateSkill={handleUpdateSkill}
                  categories={CATEGORIES}
                  isDarkMode={isDarkMode}
                  centered={false}
                  compact={true}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsManager; 
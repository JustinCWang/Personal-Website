import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';

interface Skill {
  _id: string;
  name: string;
  category: string;
}

interface SkillsManagerProps {
  isDarkMode: boolean;
}

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Languages',
  'Other'
];

const SkillsManager: React.FC<SkillsManagerProps> = ({ isDarkMode }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState<Skill>({
    _id: '',
    name: '',
    category: CATEGORIES[0]
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await skillsAPI.getAll();
      setSkills(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch skills');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    try {
      const addedSkill = await skillsAPI.add(newSkill);
      setSkills([...skills, addedSkill]);
      setNewSkill({ ...newSkill, name: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add skill');
      console.error('Error adding skill:', err);
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      const updatedSkill = await skillsAPI.update(editingSkill._id, editingSkill);
      setSkills(skills.map(skill => 
        skill._id === editingSkill._id ? updatedSkill : skill
      ));
      setEditingSkill(null);
      setError(null);
    } catch (err) {
      setError('Failed to update skill');
      console.error('Error updating skill:', err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await skillsAPI.delete(id);
      setSkills(skills.filter(skill => skill._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete skill');
      console.error('Error deleting skill:', err);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border border-green-500' 
        : 'bg-white'
    }`}>
      <h2 className={`text-5xl font-bold mb-6 font-mono ${
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
      <form onSubmit={handleAddSkill} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className={`flex-1 p-2 rounded-lg border font-mono ${
              isDarkMode 
                ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className={`p-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-green-400 focus:border-green-500'
                : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
            } focus:outline-none focus:ring-2 focus:ring-green-500/20 font-mono`}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg transition-all duration-300 border-2 font-mono font-bold ${
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
          {CATEGORIES.map(category => {
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className={`text-xl font-semibold mb-3 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-700'
                }`}>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map(skill => (
                    <div
                      key={skill._id}
                      className={`border-l-4 rounded-lg p-6 hover:shadow-md transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-900 border-green-400 hover:bg-gray-800' 
                          : 'bg-slate-50 border-blue-600'
                      }`}
                    >
                      {editingSkill?._id === skill._id ? (
                        <form onSubmit={handleUpdateSkill} className="space-y-3">
                          <input
                            type="text"
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({
                              ...editingSkill,
                              name: e.target.value
                            })}
                            className={`w-full p-2 rounded-lg border font-mono ${
                              isDarkMode 
                                ? 'bg-gray-700 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400' 
                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                          />
                          <select
                            value={editingSkill.category}
                            onChange={(e) => setEditingSkill({
                              ...editingSkill,
                              category: e.target.value
                            })}
                            className={`w-full p-2 rounded-lg border font-mono ${
                              isDarkMode 
                                ? 'bg-gray-700 border-green-500 text-white focus:ring-2 focus:ring-green-400 focus:border-green-400' 
                                : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className={`flex-1 px-3 py-1 rounded-lg font-mono ${
                                isDarkMode
                                  ? 'bg-green-500 text-black hover:bg-green-400'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSkill(null)}
                              className={`flex-1 px-3 py-1 rounded-lg font-mono ${
                                isDarkMode
                                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className={`font-mono ${
                            isDarkMode ? 'text-green-400' : 'text-slate-800'
                          }`}>
                            {skill.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingSkill(skill)}
                              className={`p-2 rounded-lg transition-all duration-300 ${
                                isDarkMode
                                  ? 'text-green-400 hover:bg-gray-700'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill._id)}
                              className={`p-2 rounded-lg transition-all duration-300 ${
                                isDarkMode
                                  ? 'text-red-400 hover:bg-gray-700'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsManager; 
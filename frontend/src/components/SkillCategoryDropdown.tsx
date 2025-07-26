/**
 * Skill Category Dropdown Component
 * A reusable component for displaying collapsible skill categories
 * Can be used in landing page and dashboard for consistent skill display
 */

import React, { useState } from 'react'
import CustomDropdown from './CustomDropdown'

/**
 * Props interface for the SkillCategoryDropdown component
 */
interface SkillCategoryDropdownProps {
  category: string
  skills: ({ name: string; category: string } & { _id?: string })[]
  isDarkMode: boolean
  showSkillCount?: boolean  // Optional: whether to show skill count in header
  centered?: boolean        // Optional: whether to center the skills display
  compact?: boolean         // Optional: whether to use compact styling
  // Optional editing props for SkillsManager
  editingSkill?: { _id: string; name: string; category: string } | null
  setEditingSkill?: (skill: { _id: string; name: string; category: string } | null) => void
  handleDeleteSkill?: (id: string) => void
  handleUpdateSkill?: (e: React.FormEvent) => void
  categories?: string[]     // For editing category selection
}

/**
 * SkillCategoryDropdown Component
 * @desc Displays a collapsible category of skills with a dropdown toggle
 * @param {SkillCategoryDropdownProps} props - Component props
 * @returns {JSX.Element} Collapsible skill category dropdown
 */
const SkillCategoryDropdown: React.FC<SkillCategoryDropdownProps> = ({ 
  category, 
  skills, 
  isDarkMode,
  showSkillCount = true,
  centered = true,
  compact = false,
  editingSkill,
  setEditingSkill,
  handleDeleteSkill,
  handleUpdateSkill,
  categories
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Check if we're in editing mode (SkillsManager)
  const isEditingMode = editingSkill !== undefined && setEditingSkill && handleDeleteSkill && handleUpdateSkill && categories

  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={`border rounded-lg transition-all duration-300 cursor-pointer ${
        isDarkMode 
          ? 'border-green-500 bg-gray-900 hover:bg-gray-800' 
          : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      {/* Category Header - Always clickable to toggle dropdown */}
      <div
        className={`w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-all duration-300`}
      >
        <h3 className={`font-semibold font-mono ${
          compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
        } ${
          isDarkMode ? 'text-green-300' : 'text-slate-700'
        }`}>
          {category}
        </h3>
        <div className={`flex items-center gap-2 sm:gap-4 ${
          isDarkMode ? 'text-green-400' : 'text-slate-600'
        }`}>
          {showSkillCount && (
            <span className="text-xs sm:text-sm font-mono mr-2">
              {skills.length} skill{skills.length !== 1 ? 's' : ''}
            </span>
          )}
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Skills Content - Animated dropdown */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`px-4 sm:px-6 pb-3 sm:pb-4 ${
          isDarkMode ? 'border-t border-green-500' : 'border-t border-slate-200'
        }`}>
          <div className={`flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 ${
            centered ? 'justify-center' : 'justify-start'
          }`}>
            {skills.map((skill, index) => {
              // Check if we're in editing mode (SkillsManager)
              if (isEditingMode) {
                const isEditing = editingSkill?._id === skill._id;
                
                if (isEditing) {
                  return (
                    <div
                      key={skill._id}
                      className={`border-l-4 rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-900 border-green-400 hover:bg-gray-800' 
                          : 'bg-slate-50 border-blue-400'
                      }`}
                    >
                      <form onSubmit={handleUpdateSkill} className="space-y-3">
                        <input
                          type="text"
                          value={editingSkill?.name || ''}
                          onChange={(e) => editingSkill && setEditingSkill({
                            ...editingSkill,
                            name: e.target.value
                          })}
                          autoComplete="off"
                          className={`w-full p-2 rounded-lg border font-mono ${
                            isDarkMode 
                              ? 'bg-gray-700 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400' 
                              : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
                          }`}
                        />
                        <CustomDropdown
                          value={editingSkill?.category || ''}
                          onChange={(value) => editingSkill && setEditingSkill({
                            ...editingSkill,
                            category: value
                          })}
                          options={categories.map(cat => ({ value: cat, label: cat }))}
                          placeholder="Select category..."
                          isDarkMode={isDarkMode}
                          borderColor={isDarkMode ? 'border-green-500' : 'border-blue-400'}
                          borderFocusColor={isDarkMode ? 'focus:ring-2 focus:ring-green-400 focus:border-green-400' : 'focus:ring-2 focus:ring-blue-400 focus:border-blue-400'}
                          textColor={isDarkMode ? 'text-white' : 'text-slate-900'}
                          placeholderColor={isDarkMode ? 'placeholder-green-400' : 'placeholder-slate-400'}
                          padding="px-3 sm:px-4 py-1.5 sm:py-2"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className={`flex-1 px-3 py-1 rounded-lg font-mono ${
                              isDarkMode
                                ? 'bg-green-500 text-black hover:bg-green-400'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
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
                    </div>
                  );
                }
                
                // Display skill as badge with edit/delete buttons (SkillsManager)
                return (
                  <div
                    key={skill._id}
                    className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 font-mono text-xs sm:text-sm group ${
                      isDarkMode
                        ? 'bg-gray-800 text-green-400 border border-green-500 hover:bg-gray-700 hover:border-green-400'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (skill._id) {
                            setEditingSkill(skill as { _id: string; name: string; category: string });
                          }
                        }}
                        className={`p-2 rounded transition-all duration-300 ${
                          isDarkMode
                            ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Edit skill"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (skill._id) {
                            handleDeleteSkill(skill._id);
                          }
                        }}
                        className={`p-2 rounded transition-all duration-300 ${
                          isDarkMode
                            ? 'text-red-400 hover:bg-gray-700'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title="Delete skill"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              }
              
              // Default display mode (LandingPage)
              return (
                <span
                  key={index}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 font-mono text-xs sm:text-sm ${
                    isDarkMode
                      ? 'bg-gray-800 text-green-400 border border-green-500 hover:bg-gray-700 hover:border-green-400'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300'
                  }`}
                >
                  {skill.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillCategoryDropdown 
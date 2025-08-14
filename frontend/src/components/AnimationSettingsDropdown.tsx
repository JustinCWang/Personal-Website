import React, { useState } from 'react';

/**
 * AnimationSettingsDropdown
 *
 * This component provides a dropdown UI for controlling animation settings.
 * 
 * Features:
 * - Global animation toggle (ON/OFF) - defaults to OFF
 * - When disabled, animation components are not rendered at all
 * - When enabled, provides freeze/resume controls and setting adjustments
 * - Settings persist in localStorage via useAnimationToggle hook
 *
 * To change the default values for MatrixRain or RippleEffect animations,
 * edit the default values in MatrixRain.tsx and RippleEffect.tsx directly.
 * (Look for variables like `speed`, `length`, `opacity`, `SPAWN_INTERVAL_MS`, etc.)
 */

interface AnimationSettingsDropdownProps {
  isDarkMode: boolean;
  isFrozen: boolean;
  onToggleFreeze: () => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
  matrixRainSettings: {
    speed: number;
    length: number;
    opacity: number;
    onChange: (settings: { speed: number; length: number; opacity: number }) => void;
  };
  rippleEffectSettings: {
    opacity: number;
    speed: number;
    spawnInterval: number;
    onChange: (settings: { opacity: number; speed: number; spawnInterval: number }) => void;
  };
}

// Add a style block for custom slider styling
const sliderGreen = '#4ade80'; // Tailwind green-400

const AnimationSettingsDropdown: React.FC<AnimationSettingsDropdownProps> = ({
  isDarkMode,
  isFrozen,
  onToggleFreeze,
  animationsEnabled,
  onToggleAnimations,
  matrixRainSettings,
  rippleEffectSettings,
}) => {
  const [open, setOpen] = useState(false);

  // Local state for sliders (to avoid laggy UI)
  const [matrixRain, setMatrixRain] = useState({
    speed: matrixRainSettings.speed,
    length: matrixRainSettings.length,
    opacity: matrixRainSettings.opacity,
  });
  const [ripple, setRipple] = useState({
    opacity: rippleEffectSettings.opacity,
    speed: rippleEffectSettings.speed,
    spawnInterval: rippleEffectSettings.spawnInterval,
  });

  // Custom slider style for dark mode
  const sliderStyle = isDarkMode
    ? {
        accentColor: sliderGreen,
      }
    : {};

  // Handlers
  const handleMatrixRainChange = (field: keyof typeof matrixRain, value: number) => {
    const updated = { ...matrixRain, [field]: value };
    setMatrixRain(updated);
    matrixRainSettings.onChange(updated);
  };
  const handleRippleChange = (field: keyof typeof ripple, value: number) => {
    const updated = { ...ripple, [field]: value };
    setRipple(updated);
    rippleEffectSettings.onChange(updated);
  };

  return (
    <div className="relative animation-settings-dropdown">
      {/* Custom slider CSS for dark mode */}
      {isDarkMode && (
        <style>{`
          .animation-settings-dropdown input[type="range"]::-webkit-slider-thumb {
            background: #4ade80;
            border: 2px solid #22c55e;
          }
          .animation-settings-dropdown input[type="range"]::-webkit-slider-runnable-track {
            background: #14532d;
          }
          .animation-settings-dropdown input[type="range"]::-moz-range-thumb {
            background: #4ade80;
            border: 2px solid #22c55e;
          }
          .animation-settings-dropdown input[type="range"]::-moz-range-track {
            background: #14532d;
          }
          .animation-settings-dropdown input[type="range"]::-ms-thumb {
            background: #4ade80;
            border: 2px solid #22c55e;
          }
          .animation-settings-dropdown input[type="range"]::-ms-fill-lower,
          .animation-settings-dropdown input[type="range"]::-ms-fill-upper {
            background: #14532d;
          }
          .animation-settings-dropdown input[type="range"] {
            accent-color: #4ade80;
            outline: none;
            box-shadow: none;
          }
        `}</style>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-600 text-green-300 hover:bg-gray-500'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`}
        title="Animation Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
      {open && (
        <div className={`absolute right-0 mt-2 w-80 z-50 rounded-lg shadow-lg border text-sm font-mono ${
          isDarkMode ? 'bg-gray-900 border-green-500 text-green-200' : 'bg-white border-slate-300 text-slate-700'
        }`}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span>Animation Settings</span>
              <div className="flex gap-2">
                <button
                  onClick={onToggleAnimations}
                  className={`px-3 py-1 rounded transition-all font-bold ${
                    animationsEnabled
                      ? isDarkMode
                        ? 'bg-green-600 text-white hover:bg-green-500'
                        : 'bg-green-500 text-white hover:bg-green-400'
                      : isDarkMode
                        ? 'bg-red-600 text-white hover:bg-red-500'
                        : 'bg-red-500 text-white hover:bg-red-400'
                  }`}
                  title={animationsEnabled ? 'Disable Animations' : 'Enable Animations'}
                >
                  {animationsEnabled ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={onToggleFreeze}
                  disabled={!animationsEnabled}
                  className={`px-3 py-1 rounded transition-all font-bold ${
                    !animationsEnabled
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                      : isFrozen
                        ? 'bg-blue-400 text-white hover:bg-blue-300'
                        : isDarkMode
                          ? 'bg-gray-700 text-green-300 hover:bg-gray-600'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title={!animationsEnabled ? 'Enable animations first' : (isFrozen ? 'Resume Animations' : 'Freeze Animations')}
                >
                  {isFrozen ? 'Resume' : 'Freeze'}
                </button>
              </div>
            </div>
            <hr className={isDarkMode ? 'border-green-700' : 'border-slate-200'} />
            {!animationsEnabled ? (
              <div className="text-center py-4">
                <div className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Animations Disabled
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Click "ON" to enable background animations<br/>
                  and interactive effects
                </div>
              </div>
            ) : isDarkMode ? (
              <div>
                <div className="font-bold mb-2">Matrix Rain</div>
                <div className="mb-2">
                  <label>Speed: <span className="ml-2">{matrixRain.speed.toFixed(2)}</span></label>
                  <input type="range" min={0.5} max={2} step={0.01} value={matrixRain.speed} onChange={e => handleMatrixRainChange('speed', parseFloat(e.target.value))} className="w-full" style={sliderStyle} />
                </div>
                <div className="mb-2">
                  <label>Length: <span className="ml-2">{matrixRain.length}</span></label>
                  <input type="range" min={8} max={30} step={1} value={matrixRain.length} onChange={e => handleMatrixRainChange('length', parseInt(e.target.value))} className="w-full" style={sliderStyle} />
                </div>
                <div className="mb-2">
                  <label>Opacity: <span className="ml-2">{matrixRain.opacity.toFixed(2)}</span></label>
                  <input type="range" min={0.1} max={1} step={0.01} value={matrixRain.opacity} onChange={e => handleMatrixRainChange('opacity', parseFloat(e.target.value))} className="w-full" style={sliderStyle} />
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold mb-2">Ripple Effect</div>
                <div className="mb-2">
                  <label>Opacity: <span className="ml-2">{ripple.opacity.toFixed(2)}</span></label>
                  <input type="range" min={0.1} max={1} step={0.01} value={ripple.opacity} onChange={e => handleRippleChange('opacity', parseFloat(e.target.value))} className="w-full" style={sliderStyle} />
                </div>
                <div className="mb-2">
                  <label>Speed: <span className="ml-2">{ripple.speed.toFixed(2)}</span></label>
                  <input type="range" min={0.5} max={2} step={0.01} value={ripple.speed} onChange={e => handleRippleChange('speed', parseFloat(e.target.value))} className="w-full" style={sliderStyle} />
                </div>
                <div className="mb-2">
                  <label>Spawn Interval (ms): <span className="ml-2">{ripple.spawnInterval}</span></label>
                  <input type="range" min={1000} max={15000} step={100} value={ripple.spawnInterval} onChange={e => handleRippleChange('spawnInterval', parseInt(e.target.value))} className="w-full" style={sliderStyle} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationSettingsDropdown; 
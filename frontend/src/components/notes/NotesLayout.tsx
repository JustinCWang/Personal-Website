/**
 * Notes Layout Component
 * Provides the sidebar navigation and page structure for all digital notes
 * Supports nested subtopics with smooth scrolling hash links
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { NotesGuideModal } from './NotesGuideModal';

interface Subtopic {
  name: string;
  hash: string;
  subtopics?: Subtopic[];
}

interface MainTopicItem {
  name: string;
  path: string;
  subtopics?: Subtopic[];
}

const TOPICS = [
  {
    title: 'Mathematics',
    items: [
      { 
        name: 'Calculus', 
        path: '/notes/calculus',
        subtopics: [
  {
    "name": "1. Functions",
    "hash": "functions",
    "subtopics": [
      {
        "name": "Function Basics",
        "hash": "function-basics"
      },
      {
        "name": "Domain and Range",
        "hash": "domain-and-range"
      },
      {
        "name": "Composition of Functions",
        "hash": "composition-of-functions"
      },
      {
        "name": "Inverse Functions",
        "hash": "inverse-functions"
      },
      {
        "name": "Graph Transformations",
        "hash": "graph-transformations"
      },
      {
        "name": "Polynomial Functions",
        "hash": "polynomial-functions"
      },
      {
        "name": "Rational Functions",
        "hash": "rational-functions"
      },
      {
        "name": "Exponential Functions",
        "hash": "exponential-functions"
      },
      {
        "name": "Logarithmic Functions",
        "hash": "logarithmic-functions"
      },
      {
        "name": "Trigonometric Functions",
        "hash": "trigonometric-functions"
      },
      {
        "name": "Algebra Review",
        "hash": "algebra-review"
      },
      {
        "name": "Trig Identities",
        "hash": "trig-identities"
      }
    ]
  },
  {
    "name": "2. Limits",
    "hash": "limits",
    "subtopics": [
      {
        "name": "Intuitive Limits",
        "hash": "intuitive-limits"
      },
      {
        "name": "One-Sided Limits",
        "hash": "one-sided-limits"
      },
      {
        "name": "Infinite Limits",
        "hash": "infinite-limits"
      },
      {
        "name": "Limits at Infinity",
        "hash": "limits-at-infinity"
      },
      {
        "name": "Continuity",
        "hash": "continuity"
      },
      {
        "name": "Discontinuities",
        "hash": "discontinuities"
      },
      {
        "name": "Intermediate Value Theorem",
        "hash": "intermediate-value-theorem"
      },
      {
        "name": "Epsilon-Delta Definition",
        "hash": "epsilon-delta-definition"
      }
    ]
  },
  {
    "name": "3. Derivatives",
    "hash": "derivatives",
    "subtopics": [
      {
        "name": "Derivative Definition",
        "hash": "derivative-definition"
      },
      {
        "name": "Tangent Lines",
        "hash": "tangent-lines"
      },
      {
        "name": "Rates of Change",
        "hash": "rates-of-change"
      },
      {
        "name": "Power Rule",
        "hash": "power-rule"
      },
      {
        "name": "Product Rule",
        "hash": "product-rule"
      },
      {
        "name": "Quotient Rule",
        "hash": "quotient-rule"
      },
      {
        "name": "Chain Rule",
        "hash": "chain-rule"
      },
      {
        "name": "Trig Derivatives",
        "hash": "trig-derivatives"
      },
      {
        "name": "Exponential Derivatives",
        "hash": "exponential-derivatives"
      },
      {
        "name": "Logarithmic Derivatives",
        "hash": "logarithmic-derivatives"
      },
      {
        "name": "Implicit Differentiation",
        "hash": "implicit-differentiation"
      },
      {
        "name": "Inverse Function Derivatives",
        "hash": "inverse-function-derivatives"
      },
      {
        "name": "Higher-Order Derivatives",
        "hash": "higher-order-derivatives"
      }
    ]
  },
  {
    "name": "4. Derivative Applications",
    "hash": "derivative-applications",
    "subtopics": [
      {
        "name": "Linear Approximation",
        "hash": "linear-approximation"
      },
      {
        "name": "Related Rates",
        "hash": "related-rates"
      },
      {
        "name": "Optimization",
        "hash": "optimization"
      },
      {
        "name": "Motion Problems",
        "hash": "motion-problems"
      },
      {
        "name": "Increasing and Decreasing Functions",
        "hash": "increasing-and-decreasing-functions"
      },
      {
        "name": "Concavity",
        "hash": "concavity"
      },
      {
        "name": "Inflection Points",
        "hash": "inflection-points"
      },
      {
        "name": "Mean Value Theorem",
        "hash": "mean-value-theorem"
      },
      {
        "name": "L\u2019H\u00f4pital\u2019s Rule",
        "hash": "l-h-pital-s-rule"
      },
      {
        "name": "Curve Sketching",
        "hash": "curve-sketching"
      }
    ]
  },
  {
    "name": "5. Integrals",
    "hash": "integrals",
    "subtopics": [
      {
        "name": "Antiderivatives",
        "hash": "antiderivatives"
      },
      {
        "name": "Riemann Sums",
        "hash": "riemann-sums"
      },
      {
        "name": "Definite Integrals",
        "hash": "definite-integrals"
      },
      {
        "name": "Indefinite Integrals",
        "hash": "indefinite-integrals"
      },
      {
        "name": "Accumulation Functions",
        "hash": "accumulation-functions"
      },
      {
        "name": "Fundamental Theorem of Calculus",
        "hash": "fundamental-theorem-of-calculus"
      },
      {
        "name": "Basic Substitution",
        "hash": "basic-substitution"
      }
    ]
  },
  {
    "name": "6. Integration Techniques",
    "hash": "integration-techniques",
    "subtopics": [
      {
        "name": "u-Substitution",
        "hash": "u-substitution"
      },
      {
        "name": "Integration by Parts",
        "hash": "integration-by-parts"
      },
      {
        "name": "Trig Integrals",
        "hash": "trig-integrals"
      },
      {
        "name": "Trig Substitution",
        "hash": "trig-substitution"
      },
      {
        "name": "Partial Fractions",
        "hash": "partial-fractions"
      },
      {
        "name": "Improper Integrals",
        "hash": "improper-integrals"
      },
      {
        "name": "Numerical Integration",
        "hash": "numerical-integration"
      }
    ]
  },
  {
    "name": "7. Integral Applications",
    "hash": "integral-applications",
    "subtopics": [
      {
        "name": "Area Under a Curve",
        "hash": "area-under-a-curve"
      },
      {
        "name": "Area Between Curves",
        "hash": "area-between-curves"
      },
      {
        "name": "Average Value",
        "hash": "average-value"
      },
      {
        "name": "Volumes by Slicing",
        "hash": "volumes-by-slicing"
      },
      {
        "name": "Disk Method",
        "hash": "disk-method"
      },
      {
        "name": "Washer Method",
        "hash": "washer-method"
      },
      {
        "name": "Shell Method",
        "hash": "shell-method"
      },
      {
        "name": "Arc Length",
        "hash": "arc-length"
      },
      {
        "name": "Surface Area",
        "hash": "surface-area"
      },
      {
        "name": "Work",
        "hash": "work"
      },
      {
        "name": "Motion with Integrals",
        "hash": "motion-with-integrals"
      }
    ]
  },
  {
    "name": "8. Differential Equations",
    "hash": "differential-equations",
    "subtopics": [
      {
        "name": "Differential Equation Basics",
        "hash": "differential-equation-basics"
      },
      {
        "name": "Verifying Solutions",
        "hash": "verifying-solutions"
      },
      {
        "name": "Slope Fields",
        "hash": "slope-fields"
      },
      {
        "name": "Separable Equations",
        "hash": "separable-equations"
      },
      {
        "name": "Exponential Growth and Decay",
        "hash": "exponential-growth-and-decay"
      },
      {
        "name": "Logistic Growth",
        "hash": "logistic-growth"
      },
      {
        "name": "First-Order Equations",
        "hash": "first-order-equations"
      },
      {
        "name": "Second-Order Linear Equations",
        "hash": "second-order-linear-equations"
      },
      {
        "name": "Characteristic Equations",
        "hash": "characteristic-equations"
      },
      {
        "name": "Laplace Transforms",
        "hash": "laplace-transforms"
      }
    ]
  },
  {
    "name": "9. Parametric Equations",
    "hash": "parametric-equations",
    "subtopics": [
      {
        "name": "Parametric Curves",
        "hash": "parametric-curves"
      },
      {
        "name": "Eliminating the Parameter",
        "hash": "eliminating-the-parameter"
      },
      {
        "name": "Parametric Derivatives",
        "hash": "parametric-derivatives"
      },
      {
        "name": "Tangent Lines",
        "hash": "tangent-lines-1"
      },
      {
        "name": "Parametric Arc Length",
        "hash": "parametric-arc-length"
      },
      {
        "name": "Motion with Parametric Equations",
        "hash": "motion-with-parametric-equations"
      }
    ]
  },
  {
    "name": "10. Polar Coordinates",
    "hash": "polar-coordinates",
    "subtopics": [
      {
        "name": "Polar Coordinates",
        "hash": "polar-coordinates-1"
      },
      {
        "name": "Converting Between Polar and Cartesian",
        "hash": "converting-between-polar-and-cartesian"
      },
      {
        "name": "Polar Graphs",
        "hash": "polar-graphs"
      },
      {
        "name": "Polar Derivatives",
        "hash": "polar-derivatives"
      },
      {
        "name": "Area in Polar Coordinates",
        "hash": "area-in-polar-coordinates"
      },
      {
        "name": "Arc Length in Polar Coordinates",
        "hash": "arc-length-in-polar-coordinates"
      }
    ]
  },
  {
    "name": "11. Vector-Valued Functions",
    "hash": "vector-valued-functions",
    "subtopics": [
      {
        "name": "Vector-Valued Functions",
        "hash": "vector-valued-functions-1"
      },
      {
        "name": "Position, Velocity, and Acceleration",
        "hash": "position-velocity-and-acceleration"
      },
      {
        "name": "Unit Tangent Vector",
        "hash": "unit-tangent-vector"
      },
      {
        "name": "Unit Normal Vector",
        "hash": "unit-normal-vector"
      },
      {
        "name": "Curvature",
        "hash": "curvature"
      },
      {
        "name": "Motion in the Plane",
        "hash": "motion-in-the-plane"
      },
      {
        "name": "Arc Length for Vector Functions",
        "hash": "arc-length-for-vector-functions"
      }
    ]
  },
  {
    "name": "12. Series",
    "hash": "series",
    "subtopics": [
      {
        "name": "Sequences",
        "hash": "sequences"
      },
      {
        "name": "Infinite Series",
        "hash": "infinite-series"
      },
      {
        "name": "Geometric Series",
        "hash": "geometric-series"
      },
      {
        "name": "nth-Term Test",
        "hash": "nth-term-test"
      },
      {
        "name": "p-Series",
        "hash": "p-series"
      },
      {
        "name": "Integral Test",
        "hash": "integral-test"
      },
      {
        "name": "Comparison Test",
        "hash": "comparison-test"
      },
      {
        "name": "Limit Comparison Test",
        "hash": "limit-comparison-test"
      },
      {
        "name": "Alternating Series Test",
        "hash": "alternating-series-test"
      },
      {
        "name": "Ratio Test",
        "hash": "ratio-test"
      },
      {
        "name": "Root Test",
        "hash": "root-test"
      },
      {
        "name": "Power Series",
        "hash": "power-series"
      },
      {
        "name": "Taylor Series",
        "hash": "taylor-series"
      },
      {
        "name": "Maclaurin Series",
        "hash": "maclaurin-series"
      }
    ]
  },
  {
    "name": "13. Multivariable Basics",
    "hash": "multivariable-basics",
    "subtopics": [
      {
        "name": "Vectors",
        "hash": "vectors"
      },
      {
        "name": "3D Coordinates",
        "hash": "3d-coordinates"
      },
      {
        "name": "Dot Product",
        "hash": "dot-product"
      },
      {
        "name": "Cross Product",
        "hash": "cross-product"
      },
      {
        "name": "Lines and Planes",
        "hash": "lines-and-planes"
      },
      {
        "name": "Multivariable Functions",
        "hash": "multivariable-functions"
      },
      {
        "name": "Level Curves",
        "hash": "level-curves"
      },
      {
        "name": "Level Surfaces",
        "hash": "level-surfaces"
      },
      {
        "name": "Vector Fields",
        "hash": "vector-fields"
      }
    ]
  },
  {
    "name": "14. Multivariable Derivatives",
    "hash": "multivariable-derivatives",
    "subtopics": [
      {
        "name": "Partial Derivatives",
        "hash": "partial-derivatives"
      },
      {
        "name": "Higher-Order Partial Derivatives",
        "hash": "higher-order-partial-derivatives"
      },
      {
        "name": "Gradient",
        "hash": "gradient"
      },
      {
        "name": "Directional Derivatives",
        "hash": "directional-derivatives"
      },
      {
        "name": "Tangent Planes",
        "hash": "tangent-planes"
      },
      {
        "name": "Linear Approximation",
        "hash": "linear-approximation-1"
      },
      {
        "name": "Chain Rule",
        "hash": "chain-rule-1"
      },
      {
        "name": "Jacobian",
        "hash": "jacobian"
      }
    ]
  },
  {
    "name": "15. Multivariable Derivative Applications",
    "hash": "multivariable-derivative-applications",
    "subtopics": [
      {
        "name": "Critical Points",
        "hash": "critical-points"
      },
      {
        "name": "Local Maxima and Minima",
        "hash": "local-maxima-and-minima"
      },
      {
        "name": "Saddle Points",
        "hash": "saddle-points"
      },
      {
        "name": "Second Derivative Test",
        "hash": "second-derivative-test"
      },
      {
        "name": "Constrained Optimization",
        "hash": "constrained-optimization"
      },
      {
        "name": "Lagrange Multipliers",
        "hash": "lagrange-multipliers"
      }
    ]
  },
  {
    "name": "16. Multivariable Integrals",
    "hash": "multivariable-integrals",
    "subtopics": [
      {
        "name": "Double Integrals",
        "hash": "double-integrals"
      },
      {
        "name": "Triple Integrals",
        "hash": "triple-integrals"
      },
      {
        "name": "Iterated Integrals",
        "hash": "iterated-integrals"
      },
      {
        "name": "Region Setup",
        "hash": "region-setup"
      },
      {
        "name": "Change of Variables",
        "hash": "change-of-variables"
      },
      {
        "name": "Jacobian Determinant",
        "hash": "jacobian-determinant"
      },
      {
        "name": "Polar Coordinates in Double Integrals",
        "hash": "polar-coordinates-in-double-integrals"
      },
      {
        "name": "Cylindrical Coordinates",
        "hash": "cylindrical-coordinates"
      },
      {
        "name": "Spherical Coordinates",
        "hash": "spherical-coordinates"
      },
      {
        "name": "Line Integrals",
        "hash": "line-integrals"
      },
      {
        "name": "Surface Integrals",
        "hash": "surface-integrals"
      }
    ]
  },
  {
    "name": "17. Vector Calculus Theorems",
    "hash": "vector-calculus-theorems",
    "subtopics": [
      {
        "name": "Conservative Vector Fields",
        "hash": "conservative-vector-fields"
      },
      {
        "name": "Fundamental Theorem for Line Integrals",
        "hash": "fundamental-theorem-for-line-integrals"
      },
      {
        "name": "Green\u2019s Theorem",
        "hash": "green-s-theorem"
      },
      {
        "name": "Curl",
        "hash": "curl"
      },
      {
        "name": "Divergence",
        "hash": "divergence"
      },
      {
        "name": "Flux",
        "hash": "flux"
      },
      {
        "name": "Stokes\u2019 Theorem",
        "hash": "stokes-theorem"
      },
      {
        "name": "Divergence Theorem",
        "hash": "divergence-theorem"
      }
    ]
  }
]
      }
    ]
  },
  {
    title: 'Computer Science',
    items: [
      { 
        name: 'Computer Science Notes', 
        path: '/notes/cs',
        subtopics: [
          { name: 'Data Structures', hash: 'data-structures' },
          { name: 'Sorting Algorithms', hash: 'sorting' }
        ]
      }
    ]
  }
];

interface NotesLayoutProps {
  children: React.ReactNode;
}

const SubtopicItem: React.FC<{ sub: Subtopic, isDarkMode: boolean, closeMenu: () => void, depth: number, parentPath: string }> = ({ sub, isDarkMode, closeMenu, depth, parentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = sub.subtopics && sub.subtopics.length > 0;

  return (
    <li>
      <div className={`flex items-center justify-between rounded-md transition-colors ${
        isDarkMode 
          ? 'text-green-300 hover:bg-green-500/10' 
          : 'text-slate-500 hover:bg-slate-50'
      }`}>
        <Link 
          to={`${parentPath}#${sub.hash}`}
          className={`block flex-1 px-2 py-1 text-xs font-mono ${!isDarkMode && 'hover:text-blue-500'} ${isDarkMode && 'hover:text-green-400'}`}
          onClick={() => {
            closeMenu();
            if (hasChildren && !isOpen) setIsOpen(true);
          }}
        >
          {sub.name}
        </Link>
        {hasChildren && (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1 hover:opacity-80 focus:outline-none"
            title={isOpen ? "Collapse" : "Expand"}
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <SubtopicList subtopics={sub.subtopics!} isDarkMode={isDarkMode} closeMenu={closeMenu} depth={depth + 1} parentPath={parentPath} />
      )}
    </li>
  );
};

const SubtopicList: React.FC<{ subtopics: Subtopic[], isDarkMode: boolean, closeMenu: () => void, depth?: number, parentPath: string }> = ({ subtopics, isDarkMode, closeMenu, depth = 0, parentPath }) => {
  return (
    <ul className={`mt-1 space-y-1 ${depth === 0 ? 'ml-4 border-l-2 border-slate-200 dark:border-green-500/30 pl-2' : 'ml-3 border-l border-slate-200 dark:border-green-500/20 pl-2'}`}>
      {subtopics.map((sub, index) => (
        <SubtopicItem key={index} sub={sub} isDarkMode={isDarkMode} closeMenu={closeMenu} depth={depth} parentPath={parentPath} />
      ))}
    </ul>
  );
};

const MainSectionItem: React.FC<{ item: MainTopicItem, isDarkMode: boolean, closeMenu: () => void, isActive: boolean }> = ({ item, isDarkMode, closeMenu, isActive }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  
  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  const hasChildren = item.subtopics && item.subtopics.length > 0;

  return (
    <li>
      <div className={`flex items-center justify-between rounded-md transition-colors ${
        isActive 
          ? (isDarkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-blue-50')
          : (isDarkMode ? 'hover:bg-green-500/10' : 'hover:bg-slate-100')
      }`}>
        <Link
          to={item.path}
          onClick={() => {
            closeMenu();
            if (hasChildren && !isOpen) setIsOpen(true);
          }}
          className={`block flex-1 px-3 py-2 text-sm font-medium font-mono ${
            isActive 
              ? (isDarkMode ? 'text-green-400' : 'text-blue-600')
              : (isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-slate-600')
          }`}
        >
          {item.name}
        </Link>
        {hasChildren && (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-2 hover:opacity-80 focus:outline-none ${
              isActive ? (isDarkMode ? 'text-green-400' : 'text-blue-600') : (isDarkMode ? 'text-green-300' : 'text-slate-500')
            }`}
            title={isOpen ? "Collapse Section" : "Expand Section"}
          >
            <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <SubtopicList 
          subtopics={item.subtopics!}
          isDarkMode={isDarkMode} 
          closeMenu={closeMenu} 
          parentPath={item.path}
        />
      )}
    </li>
  );
};

/**
 * Main layout wrapper for notes pages
 * @param {NotesLayoutProps} props - Component props containing page children
 * @returns {JSX.Element} Responsive layout with sidebar navigation and mobile menu
 */
export const NotesLayout: React.FC<NotesLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);


  const renderThemeIcon = () => {
    return isDarkMode ? (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen transition-all duration-300 ${
      isDarkMode ? 'page-bg-dark text-green-100' : 'page-bg-light text-slate-800'
    }`} style={{ scrollBehavior: 'smooth' }}>
      
      {/* Top Bar for Mobile - Fixed */}
      <div className={`md:hidden sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b ${
        isDarkMode ? 'bg-black/90 border-green-500/30' : 'bg-white/90 border-slate-200'
      } backdrop-blur-md`}>
        <Link to="/notes" className={`text-lg font-bold font-mono ${
          isDarkMode ? 'text-green-400 hacker-text-gradient' : 'text-blue-600'
        }`}>
          My Notes
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuideOpen(true)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            title="Component Guide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-green-400 text-black hover:bg-green-300'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {renderThemeIcon()}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md ${
              isDarkMode ? 'text-green-400' : 'text-slate-600'
            }`}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 flex-shrink-0 border-r md:sticky md:top-0 md:h-screen md:overflow-y-auto custom-scrollbar transition-all ${
        mobileMenuOpen ? 'block' : 'hidden md:block'
      } ${
        isDarkMode ? 'border-green-500/30 bg-black/50 md:bg-transparent' : 'border-slate-200 bg-white md:bg-transparent'
      }`}>
        <div className="p-6">
          <div className="hidden md:flex items-center justify-between mb-8">
            <Link to="/notes" className={`text-xl font-bold block hover:opacity-80 transition-opacity font-mono ${
              isDarkMode ? 'text-green-400 hacker-text-gradient' : 'text-slate-800'
            }`}>
              My Notes
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuideOpen(true)}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title="Component Guide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-green-400 text-black hover:bg-green-300'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {renderThemeIcon()}
              </button>
            </div>
          </div>
          
          <Link to="/" className={`block mb-8 text-sm font-mono hover:underline ${
             isDarkMode ? 'text-green-500' : 'text-slate-500'
          }`}>
            &larr; Back to Portfolio
          </Link>
          
          <div className="space-y-8">
            {TOPICS.map((topic, index) => (
              <div key={index}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 font-mono ${
                  isDarkMode ? 'text-green-500/70' : 'text-slate-500'
                }`}>
                  {topic.title}
                </h3>
                <ul className="space-y-2">
                  {topic.items.map((item, itemIndex) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <MainSectionItem 
                        key={itemIndex} 
                        item={item} 
                        isDarkMode={isDarkMode} 
                        closeMenu={() => setMobileMenuOpen(false)} 
                        isActive={isActive} 
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl mx-auto px-6 py-10 pb-24 md:px-12 w-full transition-all duration-300 ${mobileMenuOpen ? 'hidden md:block' : ''}`}>
        <div className="font-mono w-full">
          {children}
        </div>
      </main>

      <NotesGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};

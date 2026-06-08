/**
 * Notes Layout Component
 * Provides the shared sidebar navigation and page structure for all digital notes.
 */

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { NotesGuideModal } from './NotesGuideModal';

interface NotesLayoutProps {
  children: React.ReactNode;
}

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

interface NotesTopicGroup {
  title: string;
  items: MainTopicItem[];
}

const NOTE_TOPIC_GROUPS: NotesTopicGroup[] = [
  {
    title: 'Mathematics',
    items: [
      {
        name: 'Calculus',
        path: '/notes/calculus',
        subtopics: [
          {
            name: '1. Functions',
            hash: 'functions',
            subtopics: [
              { name: 'Function Basics', hash: 'function-basics' },
              { name: 'Domain and Range', hash: 'domain-and-range' },
              { name: 'Composition of Functions', hash: 'composition-of-functions' },
              { name: 'Inverse Functions', hash: 'inverse-functions' },
              { name: 'Graph Transformations', hash: 'graph-transformations' },
              { name: 'Polynomial Functions', hash: 'polynomial-functions' },
              { name: 'Rational Functions', hash: 'rational-functions' },
              { name: 'Exponential Functions', hash: 'exponential-functions' },
              { name: 'Logarithmic Functions', hash: 'logarithmic-functions' },
              { name: 'Trigonometric Functions', hash: 'trigonometric-functions' },
              { name: 'Algebra Review', hash: 'algebra-review' },
              { name: 'Trig Identities', hash: 'trig-identities' },
            ],
          },
          {
            name: '2. Limits',
            hash: 'limits',
            subtopics: [
              { name: 'Intuitive Limits', hash: 'intuitive-limits' },
              { name: 'One-Sided Limits', hash: 'one-sided-limits' },
              { name: 'Infinite Limits', hash: 'infinite-limits' },
              { name: 'Limits at Infinity', hash: 'limits-at-infinity' },
              { name: 'Continuity', hash: 'continuity' },
              { name: 'Discontinuities', hash: 'discontinuities' },
              { name: 'Intermediate Value Theorem', hash: 'intermediate-value-theorem' },
              { name: 'Epsilon-Delta Definition', hash: 'epsilon-delta-definition' },
              { name: 'Limit Laws', hash: 'limit-laws' },
              { name: 'Squeeze Theorem', hash: 'squeeze-theorem' },
              { name: 'Special Trig Limits', hash: 'special-trig-limits' },
            ],
          },
          {
            name: '3. Derivatives',
            hash: 'derivatives',
            subtopics: [
              { name: 'Derivative Definition', hash: 'derivative-definition' },
              { name: 'Tangent Lines', hash: 'tangent-lines' },
              { name: 'Rates of Change', hash: 'rates-of-change' },
              { name: 'Power Rule', hash: 'power-rule' },
              { name: 'Product Rule', hash: 'product-rule' },
              { name: 'Quotient Rule', hash: 'quotient-rule' },
              { name: 'Chain Rule', hash: 'chain-rule' },
              { name: 'Trig Derivatives', hash: 'trig-derivatives' },
              { name: 'Exponential Derivatives', hash: 'exponential-derivatives' },
              { name: 'Logarithmic Derivatives', hash: 'logarithmic-derivatives' },
              { name: 'Implicit Differentiation', hash: 'implicit-differentiation' },
              { name: 'Inverse Function Derivatives', hash: 'inverse-function-derivatives' },
              { name: 'Higher-Order Derivatives', hash: 'higher-order-derivatives' },
              { name: 'Differentiability', hash: 'differentiability' },
              { name: 'Inverse Trig Derivatives', hash: 'inverse-trig-derivatives' },
              { name: 'Logarithmic Differentiation', hash: 'logarithmic-differentiation' },
            ],
          },
          {
            name: '4. Derivative Applications',
            hash: 'derivative-applications',
            subtopics: [
              { name: 'Linear Approximation', hash: 'linear-approximation' },
              { name: 'Related Rates', hash: 'related-rates' },
              { name: 'Optimization', hash: 'optimization' },
              { name: 'Motion Problems', hash: 'motion-problems' },
              { name: 'Increasing and Decreasing Functions', hash: 'increasing-and-decreasing-functions' },
              { name: 'Concavity', hash: 'concavity' },
              { name: 'Inflection Points', hash: 'inflection-points' },
              { name: 'Mean Value Theorem', hash: 'mean-value-theorem' },
              { name: "L'Hopital's Rule", hash: 'l-h-pital-s-rule' },
              { name: 'Curve Sketching', hash: 'curve-sketching' },
              { name: "Newton's Method", hash: 'newtons-method' },
            ],
          },
          {
            name: '5. Integrals',
            hash: 'integrals',
            subtopics: [
              { name: 'Antiderivatives', hash: 'antiderivatives' },
              { name: 'Riemann Sums', hash: 'riemann-sums' },
              { name: 'Definite Integrals', hash: 'definite-integrals' },
              { name: 'Indefinite Integrals', hash: 'indefinite-integrals' },
              { name: 'Accumulation Functions', hash: 'accumulation-functions' },
              { name: 'Fundamental Theorem of Calculus', hash: 'fundamental-theorem-of-calculus' },
              { name: 'Basic Substitution', hash: 'basic-substitution' },
            ],
          },
          {
            name: '6. Integration Techniques',
            hash: 'integration-techniques',
            subtopics: [
              { name: 'u-Substitution', hash: 'u-substitution' },
              { name: 'Integration by Parts', hash: 'integration-by-parts' },
              { name: 'Trig Integrals', hash: 'trig-integrals' },
              { name: 'Trig Substitution', hash: 'trig-substitution' },
              { name: 'Partial Fractions', hash: 'partial-fractions' },
              { name: 'Improper Integrals', hash: 'improper-integrals' },
              { name: 'Numerical Integration', hash: 'numerical-integration' },
              { name: 'Inverse Trig Antiderivatives', hash: 'inverse-trig-antiderivatives' },
              { name: 'Reduction Formulas', hash: 'reduction-formulas' },
            ],
          },
          {
            name: '7. Integral Applications',
            hash: 'integral-applications',
            subtopics: [
              { name: 'Area Under a Curve', hash: 'area-under-a-curve' },
              { name: 'Area Between Curves', hash: 'area-between-curves' },
              { name: 'Average Value', hash: 'average-value' },
              { name: 'Volumes by Slicing', hash: 'volumes-by-slicing' },
              { name: 'Disk Method', hash: 'disk-method' },
              { name: 'Washer Method', hash: 'washer-method' },
              { name: 'Shell Method', hash: 'shell-method' },
              { name: 'Arc Length', hash: 'arc-length' },
              { name: 'Surface Area', hash: 'surface-area' },
              { name: 'Work', hash: 'work' },
              { name: 'Motion with Integrals', hash: 'motion-with-integrals' },
            ],
          },
          {
            name: '8. Differential Equations',
            hash: 'differential-equations',
            subtopics: [
              { name: 'Differential Equation Basics', hash: 'differential-equation-basics' },
              { name: 'Verifying Solutions', hash: 'verifying-solutions' },
              { name: 'Slope Fields', hash: 'slope-fields' },
              { name: 'Separable Equations', hash: 'separable-equations' },
              { name: 'Exponential Growth and Decay', hash: 'exponential-growth-and-decay' },
              { name: 'Logistic Growth', hash: 'logistic-growth' },
              { name: 'First-Order Equations', hash: 'first-order-equations' },
              { name: 'Second-Order Linear Equations', hash: 'second-order-linear-equations' },
              { name: 'Characteristic Equations', hash: 'characteristic-equations' },
              { name: 'Laplace Transforms', hash: 'laplace-transforms' },
              { name: "Euler's Method", hash: 'eulers-method' },
              { name: 'Exact Differential Equations', hash: 'exact-differential-equations' },
              { name: 'Systems and Phase Portraits', hash: 'systems-and-phase-portraits' },
            ],
          },
          {
            name: '9. Parametric Equations',
            hash: 'parametric-equations',
            subtopics: [
              { name: 'Parametric Curves', hash: 'parametric-curves' },
              { name: 'Eliminating the Parameter', hash: 'eliminating-the-parameter' },
              { name: 'Parametric Derivatives', hash: 'parametric-derivatives' },
              { name: 'Tangent Lines', hash: 'tangent-lines-1' },
              { name: 'Parametric Arc Length', hash: 'parametric-arc-length' },
              { name: 'Motion with Parametric Equations', hash: 'motion-with-parametric-equations' },
              { name: 'Second Derivatives for Parametric Curves', hash: 'second-derivatives-for-parametric-curves' },
              { name: 'Area with Parametric Curves', hash: 'area-with-parametric-curves' },
            ],
          },
          {
            name: '10. Polar Coordinates',
            hash: 'polar-coordinates',
            subtopics: [
              { name: 'Polar Coordinates', hash: 'polar-coordinates-1' },
              { name: 'Converting Between Polar and Cartesian', hash: 'converting-between-polar-and-cartesian' },
              { name: 'Polar Graphs', hash: 'polar-graphs' },
              { name: 'Polar Derivatives', hash: 'polar-derivatives' },
              { name: 'Area in Polar Coordinates', hash: 'area-in-polar-coordinates' },
              { name: 'Arc Length in Polar Coordinates', hash: 'arc-length-in-polar-coordinates' },
              { name: 'Polar Symmetry and Intersections', hash: 'polar-symmetry-and-intersections' },
            ],
          },
          {
            name: '11. Vector-Valued Functions',
            hash: 'vector-valued-functions',
            subtopics: [
              { name: 'Vector-Valued Functions', hash: 'vector-valued-functions-1' },
              { name: 'Position, Velocity, and Acceleration', hash: 'position-velocity-and-acceleration' },
              { name: 'Unit Tangent Vector', hash: 'unit-tangent-vector' },
              { name: 'Unit Normal Vector', hash: 'unit-normal-vector' },
              { name: 'Curvature', hash: 'curvature' },
              { name: 'Motion in the Plane', hash: 'motion-in-the-plane' },
              { name: 'Arc Length for Vector Functions', hash: 'arc-length-for-vector-functions' },
              { name: 'Frenet Frame and Torsion', hash: 'frenet-frame-and-torsion' },
            ],
          },
          {
            name: '12. Series',
            hash: 'series',
            subtopics: [
              { name: 'Sequences', hash: 'sequences' },
              { name: 'Infinite Series', hash: 'infinite-series' },
              { name: 'Geometric Series', hash: 'geometric-series' },
              { name: 'nth-Term Test', hash: 'nth-term-test' },
              { name: 'p-Series', hash: 'p-series' },
              { name: 'Integral Test', hash: 'integral-test' },
              { name: 'Comparison Test', hash: 'comparison-test' },
              { name: 'Limit Comparison Test', hash: 'limit-comparison-test' },
              { name: 'Alternating Series Test', hash: 'alternating-series-test' },
              { name: 'Ratio Test', hash: 'ratio-test' },
              { name: 'Root Test', hash: 'root-test' },
              { name: 'Power Series', hash: 'power-series' },
              { name: 'Taylor Series', hash: 'taylor-series' },
              { name: 'Maclaurin Series', hash: 'maclaurin-series' },
              { name: 'Absolute and Conditional Convergence', hash: 'absolute-and-conditional-convergence' },
              { name: 'Taylor Remainder', hash: 'taylor-remainder' },
              { name: 'Uniform Convergence', hash: 'uniform-convergence' },
              { name: 'Fourier Series', hash: 'fourier-series' },
            ],
          },
          {
            name: '13. Multivariable Basics',
            hash: 'multivariable-basics',
            subtopics: [
              { name: 'Vectors', hash: 'vectors' },
              { name: '3D Coordinates', hash: '3d-coordinates' },
              { name: 'Dot Product', hash: 'dot-product' },
              { name: 'Cross Product', hash: 'cross-product' },
              { name: 'Lines and Planes', hash: 'lines-and-planes' },
              { name: 'Multivariable Functions', hash: 'multivariable-functions' },
              { name: 'Level Curves', hash: 'level-curves' },
              { name: 'Level Surfaces', hash: 'level-surfaces' },
              { name: 'Vector Fields', hash: 'vector-fields' },
              { name: 'Multivariable Limits and Continuity', hash: 'multivariable-limits-and-continuity' },
            ],
          },
          {
            name: '14. Multivariable Derivatives',
            hash: 'multivariable-derivatives',
            subtopics: [
              { name: 'Partial Derivatives', hash: 'partial-derivatives' },
              { name: 'Higher-Order Partial Derivatives', hash: 'higher-order-partial-derivatives' },
              { name: 'Gradient', hash: 'gradient' },
              { name: 'Directional Derivatives', hash: 'directional-derivatives' },
              { name: 'Tangent Planes', hash: 'tangent-planes' },
              { name: 'Linear Approximation', hash: 'linear-approximation-1' },
              { name: 'Chain Rule', hash: 'chain-rule-1' },
              { name: 'Jacobian', hash: 'jacobian' },
              { name: 'Hessian', hash: 'hessian' },
              { name: 'Implicit Function Viewpoint', hash: 'implicit-function-viewpoint' },
            ],
          },
          {
            name: '15. Multivariable Derivative Applications',
            hash: 'multivariable-derivative-applications',
            subtopics: [
              { name: 'Critical Points', hash: 'critical-points' },
              { name: 'Local Maxima and Minima', hash: 'local-maxima-and-minima' },
              { name: 'Saddle Points', hash: 'saddle-points' },
              { name: 'Second Derivative Test', hash: 'second-derivative-test' },
              { name: 'Constrained Optimization', hash: 'constrained-optimization' },
              { name: 'Lagrange Multipliers', hash: 'lagrange-multipliers' },
              { name: 'Multiple Constraints', hash: 'multiple-constraints' },
              { name: 'Gradient Descent', hash: 'gradient-descent' },
            ],
          },
          {
            name: '16. Multivariable Integrals',
            hash: 'multivariable-integrals',
            subtopics: [
              { name: 'Double Integrals', hash: 'double-integrals' },
              { name: 'Triple Integrals', hash: 'triple-integrals' },
              { name: 'Iterated Integrals', hash: 'iterated-integrals' },
              { name: 'Region Setup', hash: 'region-setup' },
              { name: 'Change of Variables', hash: 'change-of-variables' },
              { name: 'Jacobian Determinant', hash: 'jacobian-determinant' },
              { name: 'Polar Coordinates in Double Integrals', hash: 'polar-coordinates-in-double-integrals' },
              { name: 'Cylindrical Coordinates', hash: 'cylindrical-coordinates' },
              { name: 'Spherical Coordinates', hash: 'spherical-coordinates' },
              { name: 'Line Integrals', hash: 'line-integrals' },
              { name: 'Surface Integrals', hash: 'surface-integrals' },
              { name: 'Mass and Center of Mass', hash: 'mass-and-center-of-mass' },
              { name: 'Probability Density Integrals', hash: 'probability-density-integrals' },
            ],
          },
          {
            name: '17. Vector Calculus Theorems',
            hash: 'vector-calculus-theorems',
            subtopics: [
              { name: 'Conservative Vector Fields', hash: 'conservative-vector-fields' },
              { name: 'Fundamental Theorem for Line Integrals', hash: 'fundamental-theorem-for-line-integrals' },
              { name: "Green's Theorem", hash: 'green-s-theorem' },
              { name: 'Curl', hash: 'curl' },
              { name: 'Divergence', hash: 'divergence' },
              { name: 'Flux', hash: 'flux' },
              { name: "Stokes' Theorem", hash: 'stokes-theorem' },
              { name: 'Divergence Theorem', hash: 'divergence-theorem' },
              { name: 'Conservative Field Tests', hash: 'conservative-field-tests' },
              { name: 'Orientation and Boundaries', hash: 'orientation-and-boundaries' },
            ],
          },
          {
            name: '18. Variational Calculus',
            hash: 'variational-calculus',
            subtopics: [
              { name: 'Functionals', hash: 'functionals' },
              { name: 'First Variation', hash: 'first-variation' },
              { name: 'Euler-Lagrange Equation', hash: 'euler-lagrange-equation' },
              { name: 'Constraints in Variational Problems', hash: 'constraints-in-variational-problems' },
            ],
          },
          {
            name: '19. Computational Calculus',
            hash: 'computational-calculus',
            subtopics: [
              { name: 'Finite Differences', hash: 'finite-differences' },
              { name: 'Automatic Differentiation', hash: 'automatic-differentiation' },
              { name: 'Numerical Error', hash: 'numerical-error' },
            ],
          },
        ],
      },
      {
        name: 'Discrete Math',
        path: '/notes/discrete-math',
        subtopics: [
          {
            name: '1. Logic',
            hash: 'logic',
            subtopics: [
              { name: 'Propositions and Operators', hash: 'propositions-and-operators' },
              { name: 'Conditionals', hash: 'conditionals' },
              { name: 'Biconditionals, XOR, and Precedence', hash: 'biconditionals-xor-and-precedence' },
            ],
          },
          {
            name: '2. Logical Equivalence',
            hash: 'logical-equivalence',
            subtopics: [
              { name: 'Equivalence Methods', hash: 'equivalence-methods' },
              { name: 'Equivalence Proof Format', hash: 'equivalence-proof-format' },
            ],
          },
          {
            name: '3. Predicates and Quantifiers',
            hash: 'predicates-and-quantifiers',
            subtopics: [
              { name: 'Predicate Basics', hash: 'predicate-basics' },
              { name: 'Nested Quantifiers', hash: 'nested-quantifiers' },
            ],
          },
          {
            name: '4. Proofs',
            hash: 'proofs',
            subtopics: [{ name: 'Proof Language and Methods', hash: 'proof-language-and-methods' }],
          },
          {
            name: '5. Divisibility and Modular Arithmetic',
            hash: 'divisibility-and-modular-arithmetic',
            subtopics: [
              { name: 'Divisibility', hash: 'divisibility' },
              { name: 'Division Algorithm', hash: 'division-algorithm' },
              { name: 'Congruence', hash: 'congruence' },
              { name: "Primes and Euclid's Algorithm", hash: 'primes-and-euclids-algorithm' },
            ],
          },
          {
            name: '6. Sets',
            hash: 'sets',
            subtopics: [
              { name: 'Set Basics', hash: 'set-basics' },
              { name: 'Set Identities', hash: 'set-identities' },
            ],
          },
          {
            name: '7. Functions',
            hash: 'functions',
            subtopics: [
              { name: 'Function Definition', hash: 'function-definition' },
              { name: 'Function Properties', hash: 'function-properties' },
            ],
          },
          {
            name: '8. Relations',
            hash: 'relations',
            subtopics: [
              { name: 'Relation Basics', hash: 'relation-basics' },
              { name: 'Equivalence Relations and Classes', hash: 'equivalence-relations-and-classes' },
            ],
          },
          {
            name: '9. Sequences and Summations',
            hash: 'sequences-and-summations',
            subtopics: [
              { name: 'Sequence Basics', hash: 'sequence-basics' },
              { name: 'Recurrences and Summations', hash: 'recurrence-relations-and-summations' },
            ],
          },
          {
            name: '10. Induction',
            hash: 'induction',
            subtopics: [
              { name: 'Weak Induction', hash: 'weak-induction' },
              { name: 'Strong Induction and Well-Ordering', hash: 'strong-induction-and-well-ordering' },
            ],
          },
          {
            name: '11. Recursion and Structural Induction',
            hash: 'recursion-and-structural-induction',
            subtopics: [
              { name: 'Recursive Definitions', hash: 'recursive-definitions' },
              { name: 'Strings, Languages, and Structural Induction', hash: 'strings-languages-and-structural-induction' },
            ],
          },
          {
            name: '12. Program Verification and Loop Invariants',
            hash: 'program-verification-and-loop-invariants',
            subtopics: [
              { name: 'Program Correctness', hash: 'program-correctness' },
              { name: 'Loop Correctness Template', hash: 'loop-correctness-template' },
            ],
          },
          {
            name: '13. Boolean Algebra',
            hash: 'boolean-algebra',
            subtopics: [{ name: 'Boolean Values and Operations', hash: 'boolean-values-and-operations' }],
          },
          {
            name: '14. Normal Forms',
            hash: 'normal-forms',
            subtopics: [
              { name: 'Literals, Terms, and Clauses', hash: 'literals-terms-and-clauses' },
              { name: 'DNF and CNF Algorithms', hash: 'dnf-and-cnf-algorithms' },
            ],
          },
          {
            name: '15. Functional Completeness and SAT',
            hash: 'functional-completeness-and-sat',
            subtopics: [
              { name: 'Functional Completeness', hash: 'functional-completeness' },
              { name: 'Boolean Satisfiability', hash: 'boolean-satisfiability' },
            ],
          },
          {
            name: '16. Counting',
            hash: 'counting',
            subtopics: [
              { name: 'Counting Rules', hash: 'counting-rules' },
              { name: 'Permutations and Combinations', hash: 'permutations-and-combinations' },
              { name: 'Inclusion-Exclusion and the Binomial Theorem', hash: 'inclusion-exclusion-and-binomial-theorem' },
            ],
          },
        ],
      },
      {
        name: 'Linear Algebra',
        path: '/notes/linear-algebra',
        subtopics: [
          {
            name: '1. Linear Systems',
            hash: 'linear-systems',
            subtopics: [
              { name: 'Linear Equations and Solutions', hash: 'linear-equations-and-solutions' },
              { name: 'Geometry of Systems', hash: 'geometry-of-systems' },
              { name: 'Matrices of a System', hash: 'matrices-of-a-system' },
            ],
          },
          {
            name: '2. Numerical Computation',
            hash: 'numerical-computation',
            subtopics: [
              { name: 'Floating-Point Thinking', hash: 'floating-point-thinking' },
              { name: 'Flops and Cost', hash: 'flops-and-cost' },
            ],
          },
          {
            name: '3. Gaussian Elimination',
            hash: 'gaussian-elimination',
            subtopics: [
              { name: 'Row Operations and Echelon Form', hash: 'row-operations-and-echelon-form' },
              { name: 'Pivot and Free Variables', hash: 'pivot-and-free-variables' },
              { name: 'Elimination Template', hash: 'elimination-template' },
            ],
          },
          {
            name: '4. Vectors and Linear Combinations',
            hash: 'vectors-and-linear-combinations',
            subtopics: [
              { name: 'Vectors in Rn', hash: 'vectors-in-rn' },
              { name: 'Linear Combinations and Span', hash: 'linear-combinations-and-span' },
            ],
          },
          {
            name: '5. Matrix Equations',
            hash: 'matrix-equations',
            subtopics: [
              { name: 'Columns of a Matrix', hash: 'columns-of-a-matrix' },
              { name: 'Existence and Uniqueness', hash: 'existence-and-uniqueness' },
            ],
          },
          {
            name: '6. Linear Independence',
            hash: 'linear-independence',
            subtopics: [
              { name: 'Dependence Definition', hash: 'dependence-definition' },
              { name: 'Independence Intuition', hash: 'independence-intuition' },
            ],
          },
          {
            name: '7. Linear Transformations and Matrix Algebra',
            hash: 'linear-transformations-and-matrix-algebra',
            subtopics: [
              { name: 'Linear Transformations', hash: 'linear-transformations' },
              { name: 'Matrix Products', hash: 'matrix-products' },
            ],
          },
          {
            name: '8. Inverses and Factorizations',
            hash: 'inverses-and-factorizations',
            subtopics: [
              { name: 'Matrix Inverse', hash: 'matrix-inverse' },
              { name: 'LU Factorization', hash: 'lu-factorization' },
            ],
          },
          {
            name: '9. Computational Applications',
            hash: 'computational-applications',
            subtopics: [
              { name: 'Markov Chains', hash: 'markov-chains' },
              { name: 'Computer Graphics', hash: 'computer-graphics' },
            ],
          },
          {
            name: '10. Subspaces, Dimension, and Rank',
            hash: 'subspaces-dimension-and-rank',
            subtopics: [
              { name: 'Subspaces', hash: 'subspaces' },
              { name: 'Basis, Dimension, and Rank', hash: 'basis-dimension-rank' },
            ],
          },
          {
            name: '11. Eigenvalues and Diagonalization',
            hash: 'eigenvalues-and-diagonalization',
            subtopics: [
              { name: 'Eigenvectors and Eigenvalues', hash: 'eigenvectors-and-eigenvalues' },
              { name: 'Characteristic Equation', hash: 'characteristic-equation' },
              { name: 'Diagonalization and PageRank', hash: 'diagonalization-and-pagerank' },
            ],
          },
          {
            name: '12. Orthogonality and Projection',
            hash: 'orthogonality-and-projection',
            subtopics: [
              { name: 'Dot Products and Orthogonality', hash: 'dot-products-and-orthogonality' },
              { name: 'Projection', hash: 'projection' },
              { name: 'Orthogonal Bases', hash: 'orthogonal-bases' },
            ],
          },
          {
            name: '13. Least Squares and Linear Models',
            hash: 'least-squares-and-linear-models',
            subtopics: [
              { name: 'Least Squares', hash: 'least-squares' },
              { name: 'Linear Models', hash: 'linear-models' },
            ],
          },
          {
            name: '14. Symmetric Matrices',
            hash: 'symmetric-matrices',
            subtopics: [
              { name: 'Spectral Theorem', hash: 'spectral-theorem' },
              { name: 'Quadratic Forms', hash: 'quadratic-forms' },
            ],
          },
          {
            name: '15. Singular Value Decomposition',
            hash: 'singular-value-decomposition',
            subtopics: [
              { name: 'SVD Structure', hash: 'svd-structure' },
              { name: 'SVD Applications', hash: 'svd-applications' },
            ],
          },
        ],
      },
      {
        name: 'Probability and Statistics',
        path: '/notes/probability-statistics',
        subtopics: [
          {
            name: '1. Modeling Uncertainty',
            hash: 'modeling-uncertainty',
            subtopics: [
              { name: 'Probability Modeling Steps', hash: 'probability-modeling-steps' },
            ],
          },
          {
            name: '2. Probability Spaces',
            hash: 'probability-spaces',
            subtopics: [
              { name: 'Experiments, Outcomes, and Events', hash: 'experiments-outcomes-events' },
              { name: 'Probability Axioms', hash: 'probability-axioms' },
              { name: 'Basic Probability Rules', hash: 'basic-probability-rules' },
              { name: 'Uniform Models', hash: 'uniform-models' },
              { name: 'Continuous Uniform Spaces', hash: 'continuous-uniform-spaces' },
            ],
          },
          {
            name: '3. Conditioning and Bayes',
            hash: 'conditioning-and-bayes',
            subtopics: [
              { name: 'Conditional Probability', hash: 'conditional-probability' },
              { name: 'Product Rule and Trees', hash: 'product-rule-and-trees' },
              { name: 'Total Probability', hash: 'total-probability' },
              { name: "Bayes' Theorem", hash: 'bayes-theorem' },
            ],
          },
          {
            name: '4. Independence',
            hash: 'independence',
            subtopics: [
              { name: 'Event Independence', hash: 'event-independence' },
              { name: 'Pairwise and Mutual Independence', hash: 'pairwise-and-mutual-independence' },
              { name: 'Fallacies and False Independence', hash: 'fallacies-and-false-independence' },
            ],
          },
          {
            name: '5. Random Variables and Distributions',
            hash: 'random-variables-and-distributions',
            subtopics: [
              { name: 'Random Variables', hash: 'random-variable-definition' },
              { name: 'Discrete vs Continuous', hash: 'discrete-vs-continuous' },
              { name: 'PMF, PDF, and CDF', hash: 'pmf-pdf-cdf' },
              { name: 'Simulation and Empirical Distributions', hash: 'simulation-and-empirical-distributions' },
            ],
          },
          {
            name: '6. Discrete Distributions',
            hash: 'discrete-distributions',
            subtopics: [
              { name: 'Discrete Uniform', hash: 'discrete-uniform' },
              { name: 'Bernoulli and Binomial', hash: 'bernoulli-and-binomial' },
              { name: 'Geometric and Negative Binomial', hash: 'geometric-and-negative-binomial' },
              { name: 'Poisson', hash: 'poisson' },
            ],
          },
          {
            name: '7. Continuous Distributions',
            hash: 'continuous-distributions',
            subtopics: [
              { name: 'Continuous Uniform', hash: 'continuous-uniform' },
              { name: 'Normal and Standardization', hash: 'normal-and-standardization' },
              { name: 'Exponential', hash: 'exponential-distribution' },
            ],
          },
          {
            name: '8. Expectation',
            hash: 'expectation',
            subtopics: [
              { name: 'Expectation Basics', hash: 'expectation-basics' },
              { name: 'Linearity of Expectation', hash: 'linearity-of-expectation' },
              { name: 'Indicator Variables', hash: 'indicator-random-variables' },
              { name: 'Conditional and Total Expectation', hash: 'conditional-expectation' },
            ],
          },
          {
            name: '9. Variance and Covariance',
            hash: 'variance-and-covariance',
            subtopics: [
              { name: 'Variance and Standard Deviation', hash: 'variance-basics' },
              { name: 'Variance Rules', hash: 'variance-rules' },
              { name: 'Covariance', hash: 'covariance' },
              { name: 'Independent Random Variables', hash: 'independent-random-variables' },
            ],
          },
          {
            name: '10. Sampling, Estimation, and Concentration',
            hash: 'sampling-and-concentration',
            subtopics: [
              { name: 'Estimator Language', hash: 'estimator-language' },
              { name: 'Polling Estimators', hash: 'polling-estimators' },
              { name: 'Markov and Chebyshev', hash: 'markov-and-chebyshev' },
            ],
          },
          {
            name: '11. Computing Applications',
            hash: 'computing-applications',
            subtopics: [
              { name: 'Coupon Collector', hash: 'coupon-collector' },
              { name: 'Reservoir Sampling', hash: 'reservoir-sampling' },
              { name: 'Randomized Algorithms and Systems', hash: 'randomized-algorithms-and-systems' },
            ],
          },
        ],
      },
      {
        name: 'Foundations of Data Science',
        path: '/notes/foundations-data-science',
        subtopics: [
          { name: '1. Foundations of Data Science Overview', hash: 'foundations-of-data-science-overview' },
          { name: '2. Data Science, Features, and Datasets', hash: 'data-science-features-and-datasets' },
          { name: '3. Probability Basics', hash: 'probability-basics' },
          { name: '4. Conditional Probability, Independence, and Bayes Rule', hash: 'conditional-probability-independence-and-bayes-rule' },
          { name: '5. Random Variables, PMFs, PDFs, and CDFs', hash: 'random-variables-pmfs-pdfs-and-cdfs' },
          { name: '6. Common Distributions', hash: 'common-distributions' },
          { name: '7. Expectation, Variance, and Probability Bounds', hash: 'expectation-variance-and-probability-bounds' },
          { name: '8. Maximum Likelihood Estimation', hash: 'maximum-likelihood-estimation' },
          { name: '9. Gaussian Models', hash: 'gaussian-models' },
          { name: '10. Expectation Maximization', hash: 'expectation-maximization' },
          { name: '11. Gaussian Mixture Models', hash: 'gaussian-mixture-models' },
          { name: '12. Hard Clustering and KMeans', hash: 'hard-clustering-and-kmeans' },
          { name: '13. DBSCAN', hash: 'dbscan' },
          { name: '14. Dimensionality Reduction Overview', hash: 'dimensionality-reduction-overview' },
          { name: '15. Random Projection and Johnson-Lindenstrauss', hash: 'random-projection-and-johnson-lindenstrauss' },
          { name: '16. Linear Algebra Refresher', hash: 'linear-algebra-refresher' },
          { name: '17. Singular Value Decomposition', hash: 'singular-value-decomposition' },
          { name: '18. SVD Reconstruction and Outlier Detection', hash: 'svd-reconstruction-and-outlier-detection' },
          { name: '19. Distances and Metrics', hash: 'distances-and-metrics' },
          { name: '20. Hamming, Jaccard, Edit Distance, and Dynamic Time Warping', hash: 'hamming-jaccard-edit-distance-and-dynamic-time-warping' },
          { name: '21. Hierarchical Clustering', hash: 'hierarchical-clustering' },
          { name: '22. Clustering Aggregation', hash: 'clustering-aggregation' },
          { name: '23. Graph Mining Overview', hash: 'graph-mining-overview' },
          { name: '24. Degree Distributions and Clustering Coefficients', hash: 'degree-distributions-and-clustering-coefficients' },
          { name: '25. Graph Models: Erdos-Renyi, Preferential Attachment, Watts-Strogatz', hash: 'graph-models-erdos-renyi-preferential-attachment-watts-strogatz' },
          { name: '26. Centrality Measures', hash: 'centrality-measures' },
          { name: '27. Markov Chains', hash: 'markov-chains' },
          { name: '28. Stationary Distributions and Power Method', hash: 'stationary-distributions-and-power-method' },
          { name: '29. PageRank', hash: 'pagerank' },
          { name: '30. Supervised Learning', hash: 'supervised-learning' },
          { name: '31. Linear Regression', hash: 'linear-regression' },
          { name: '32. Logistic Regression', hash: 'logistic-regression' },
          { name: '33. Gradient Descent and SGD', hash: 'gradient-descent-and-sgd' },
          { name: '34. Model Evaluation', hash: 'model-evaluation' },
          { name: '35. Cross Validation and Statistical Model Comparison', hash: 'cross-validation-and-statistical-model-comparison' },
          { name: '36. Rank Aggregation', hash: 'rank-aggregation' },
          { name: "37. Voting Theory and Arrow's Theorem", hash: 'voting-theory-and-arrows-theorem' },
          { name: '38. Implementation Guide', hash: 'implementation-guide' },
        ],
      },
    ],
  },
  {
    title: 'Programming, Frameworks, and Tools',
    items: [
      {
        name: 'Python Foundations',
        path: '/notes/intro-python',
        subtopics: [
          { name: '1. Programming Basics', hash: 'programming-basics' },
          { name: '2. Python Program Basics', hash: 'python-program-basics' },
          { name: '3. Values, Types, and Variables', hash: 'values-types-and-variables' },
          { name: '4. Expressions and Operators', hash: 'expressions-and-operators' },
          { name: '5. Input, Output, and Conversion', hash: 'input-output-and-conversion' },
          { name: '6. Strings and Indexing', hash: 'strings-and-indexing' },
          { name: '7. Boolean Logic and Conditionals', hash: 'boolean-logic-and-conditionals' },
          { name: '8. Loops and Iteration', hash: 'loops-and-iteration' },
          { name: '9. Functions and Decomposition', hash: 'functions-and-decomposition' },
          { name: '10. Scope and Mutability', hash: 'scope-and-mutability' },
          { name: '11. Lists and Sequences', hash: 'lists-and-sequences' },
          { name: '12. Nested Lists and Grids', hash: 'nested-lists-and-grids' },
          { name: '13. Tuples, Sets, and Dictionaries', hash: 'tuples-sets-and-dictionaries' },
          { name: '14. Files and Exceptions', hash: 'files-and-exceptions' },
          { name: '15. Debugging and Testing', hash: 'debugging-and-testing' },
          { name: '16. Simple Algorithms and Big-O', hash: 'simple-algorithms-and-big-o' },
          { name: '17. Program Design Foundations', hash: 'program-design-foundations' },
        ],
      },
      {
        name: 'Java and Data Structures',
        path: '/notes/intro-java',
        subtopics: [
          { name: '1. Python to Java Overview', hash: 'python-to-java-overview' },
          { name: '2. Input, Output, and Variables', hash: 'input-output-and-variables' },
          { name: '3. Java Memory Model', hash: 'java-memory-model' },
          { name: '4. Conditional Execution', hash: 'conditional-execution' },
          { name: '5. Switch Statements', hash: 'switch-statements' },
          { name: '6. Loops', hash: 'loops' },
          { name: '7. Scope of Variables', hash: 'scope-of-variables' },
          { name: '8. Methods', hash: 'methods' },
          { name: '9. Strings and the Java API', hash: 'strings-and-java-api' },
          { name: '10. Arrays', hash: 'arrays' },
          { name: '11. Classes and Custom Data Types', hash: 'classes-and-custom-data-types' },
          { name: '12. Client Programs and Encapsulation', hash: 'client-programs-and-encapsulation' },
          { name: '13. Bag Data Structure', hash: 'bag-data-structure' },
          { name: '14. Inheritance', hash: 'inheritance' },
          { name: '15. Polymorphism', hash: 'polymorphism' },
          { name: '16. Interfaces and Iterators', hash: 'interfaces-and-iterators' },
          { name: '17. Recursion', hash: 'recursion' },
          { name: '18. Recursive Backtracking', hash: 'recursive-backtracking' },
          { name: '19. Big-O and Algorithm Efficiency', hash: 'big-o-and-algorithm-efficiency' },
          { name: '20. Sorting Algorithms', hash: 'sorting-algorithms' },
          { name: '21. Linked Lists', hash: 'linked-lists' },
          { name: '22. List ADT', hash: 'list-adt' },
          { name: '23. Stack ADT', hash: 'stack-adt' },
          { name: '24. Queue ADT', hash: 'queue-adt' },
          { name: '25. Trees and Binary Trees', hash: 'trees-and-binary-trees' },
          { name: '26. Tree Traversals', hash: 'tree-traversals' },
          { name: '27. Binary Search Trees', hash: 'binary-search-trees' },
          { name: '28. Balanced Search Trees and 2-3 Trees', hash: 'balanced-search-trees-and-2-3-trees' },
          { name: '29. Heaps', hash: 'heaps' },
          { name: '30. Heap Implementation', hash: 'heap-implementation' },
          { name: '31. Priority Queues', hash: 'priority-queues' },
          { name: '32. Hash Tables', hash: 'hash-tables' },
          { name: '33. ADTs and Design Principles', hash: 'adts-and-design-principles' },
        ],
      },
      {
        name: 'C Programming',
        path: '/notes/c-programming',
        subtopics: [
          { name: '1. C Overview', hash: 'c-overview' },
          { name: '2. Compilation, Linking, and Translation Units', hash: 'compilation-linking-and-translation-units' },
          { name: '3. C Memory Model', hash: 'c-memory-model' },
          { name: '4. Types, Integers, and Object Representation', hash: 'types-integers-and-object-representation' },
          { name: '5. Pointers and Indirection', hash: 'pointers-and-indirection' },
          { name: '6. Arrays, Pointer Arithmetic, and Strings', hash: 'arrays-pointer-arithmetic-and-strings' },
          { name: '7. Structs and Data Layout', hash: 'structs-and-data-layout' },
          { name: '8. Dynamic Memory Allocation', hash: 'dynamic-memory-allocation' },
          { name: '9. Pointer Declarations and Operator Precedence', hash: 'pointer-declarations-and-operator-precedence' },
          { name: '10. Undefined Behavior and Safety', hash: 'undefined-behavior-and-safety' },
          { name: '11. Debugging C Programs', hash: 'debugging-c-programs' },
        ],
      },
      {
        name: 'Go',
        path: '/notes/go',
        subtopics: [
          { name: '1. Go Overview', hash: 'go-overview' },
          { name: '2. Modules, Packages, and Imports', hash: 'modules-packages-and-imports' },
          { name: '3. Types, Values, and Zero Values', hash: 'types-values-and-zero-values' },
          { name: '4. Functions, Methods, and Interfaces', hash: 'functions-methods-and-interfaces' },
          { name: '5. Structs, Pointers, and Receivers', hash: 'structs-pointers-and-receivers' },
          { name: '6. Errors, Defer, and Resource Lifetime', hash: 'errors-defer-and-resource-lifetime' },
          { name: '7. Slices, Maps, and Strings', hash: 'slices-maps-and-strings' },
          { name: '8. Goroutines and the Scheduler', hash: 'goroutines-and-the-scheduler' },
          { name: '9. Channels and Select', hash: 'channels-and-select' },
          { name: '10. Mutexes, WaitGroups, and Context', hash: 'mutexes-waitgroups-and-context' },
          { name: '11. Race Conditions and Testing', hash: 'race-conditions-and-testing' },
          { name: '12. RPC and Networked Services in Go', hash: 'rpc-and-networked-services-in-go' },
          { name: '13. Serialization, State, and Compatibility', hash: 'serialization-state-and-compatibility' },
          { name: '14. Go in Distributed Systems', hash: 'go-in-distributed-systems' },
        ],
      },
      {
        name: 'OCaml',
        path: '/notes/ocaml',
        subtopics: [
          { name: '1. OCaml Overview', hash: 'ocaml-overview' },
          { name: '2. Dune and Project Structure', hash: 'dune-and-project-structure' },
          { name: '3. Expressions, Values, and Types', hash: 'expressions-values-and-types' },
          { name: '4. Let Bindings, Scope, and Shadowing', hash: 'let-bindings-scope-and-shadowing' },
          { name: '5. Functions and Recursion', hash: 'functions-and-recursion' },
          { name: '6. Tail Recursion', hash: 'tail-recursion' },
          { name: '7. Lists, Tuples, and Records', hash: 'lists-tuples-and-records' },
          { name: '8. Pattern Matching', hash: 'pattern-matching' },
          { name: '9. Options and Variants', hash: 'options-and-variants' },
          { name: '10. Higher-Order Functions', hash: 'higher-order-functions' },
          { name: '11. Modules and Interfaces', hash: 'modules-and-interfaces' },
          { name: '12. Testing OCaml Code', hash: 'testing-ocaml-code' },
        ],
      },
      {
        name: 'SQL',
        path: '/notes/sql',
        subtopics: [
          { name: '1. SQL Overview', hash: 'sql-overview' },
          { name: '2. SELECT, FROM, and WHERE', hash: 'select-from-where' },
          { name: '3. Logical Query Processing Order', hash: 'logical-query-processing-order' },
          { name: '4. Predicates, Patterns, and Three-Valued Logic', hash: 'predicates-patterns-and-three-valued-logic' },
          { name: '5. Joins', hash: 'joins' },
          { name: '6. Aggregation, GROUP BY, and HAVING', hash: 'aggregation-group-by-and-having' },
          { name: '7. Subqueries and EXISTS', hash: 'subqueries-and-exists' },
          { name: '8. Set Operations', hash: 'set-operations' },
          { name: '9. Data Definition and Modification', hash: 'data-definition-and-modification' },
          { name: '10. Constraints and Keys', hash: 'constraints-and-keys' },
          { name: '11. Transactions and Isolation in SQL', hash: 'transactions-and-isolation-in-sql' },
          { name: '12. Query Reasoning and Performance', hash: 'query-reasoning-and-performance' },
        ],
      },
      {
        name: 'Web Frameworks and Tooling',
        path: '/notes/web-frameworks-and-tooling',
        subtopics: [
          { name: '1. Web Frameworks Overview', hash: 'web-frameworks-overview' },
          { name: '2. React Component Model', hash: 'react-component-model' },
          { name: '3. State, Effects, and Hooks', hash: 'state-effects-and-hooks' },
          { name: '4. Forms and Client State', hash: 'forms-and-client-state' },
          { name: '5. API Clients: Fetch and Axios', hash: 'api-clients-fetch-and-axios' },
          { name: '6. Next.js Rendering Models', hash: 'next-js-rendering-models' },
          { name: '7. Hydration and Server/Client Boundaries', hash: 'hydration-and-server-client-boundaries' },
          { name: '8. Backend Frameworks: FastAPI and Flask', hash: 'backend-frameworks-fastapi-and-flask' },
          { name: '9. ORMs and SQLAlchemy', hash: 'orms-and-sqlalchemy' },
          { name: '10. Testing Web Applications', hash: 'testing-web-applications' },
          { name: '11. Docker and Containers', hash: 'docker-and-containers' },
          { name: '12. Git Version Control', hash: 'git-version-control' },
          { name: '13. Deployment and Operations', hash: 'deployment-and-operations' },
        ],
      },
    ],
  },
  {
    title: 'Computer Science',
    items: [
      {
        name: 'Programming Languages',
        path: '/notes/programming-languages',
        subtopics: [
          { name: '1. Programming Languages Overview', hash: 'programming-languages-overview' },
          { name: '2. Expression-Oriented Core Model', hash: 'expression-oriented-core-model' },
          { name: '3. Source Text to Meaning', hash: 'source-text-to-meaning' },
          { name: '15. Inference Rules', hash: 'inference-rules' },
          { name: '16. Typing Judgments and Contexts', hash: 'typing-judgments-and-contexts' },
          { name: '17. Derivations', hash: 'derivations' },
          { name: '18. Formal Grammar and Parsing', hash: 'formal-grammar-and-parsing' },
          { name: '19. Ambiguity and Parser Generators', hash: 'ambiguity-and-parser-generators' },
          { name: '20. Formal Semantics', hash: 'formal-semantics' },
          { name: '21. Big-Step Semantics', hash: 'big-step-semantics' },
          { name: '22. Small-Step Semantics', hash: 'small-step-semantics' },
          { name: '23. Lambda Calculus', hash: 'lambda-calculus' },
          { name: '24. Substitution and Capture Avoidance', hash: 'substitution-and-capture-avoidance' },
          { name: '25. Environment Model', hash: 'environment-model' },
          { name: '26. Lexical Scope and Closures', hash: 'lexical-scope-and-closures' },
          { name: '27. Recursion and Named Closures', hash: 'recursion-and-named-closures' },
          { name: '28. Simply Typed Lambda Calculus', hash: 'simply-typed-lambda-calculus' },
          { name: '29. Type Checking and Type Inference', hash: 'type-checking-and-type-inference' },
          { name: '30. Type Safety: Progress and Preservation', hash: 'type-safety-progress-and-preservation' },
          { name: '31. Hindley-Milner Light', hash: 'hindley-milner-light' },
          { name: '32. Constraint-Based Type Inference', hash: 'constraint-based-type-inference' },
          { name: '33. Unification', hash: 'unification' },
          { name: '34. Principal Types and Specialization', hash: 'principal-types-and-specialization' },
          { name: '35. Bytecode Interpreters', hash: 'bytecode-interpreters' },
          { name: '36. Stack Machines and Compilation', hash: 'stack-machines-and-compilation' },
        ],
      },
      {
        name: 'Web Development',
        path: '/notes/web-development',
        subtopics: [
          { name: '1. Web Development and Practical Software Development', hash: 'web-development-and-practical-software-development' },
          { name: '2. Software Development Lifecycle', hash: 'software-development-lifecycle' },
          { name: '3. Agile Development', hash: 'agile-development' },
          { name: '4. User Stories and Acceptance Criteria', hash: 'user-stories-and-acceptance-criteria' },
          { name: '5. Team Software Development', hash: 'team-software-development' },
          { name: '6. Full-Stack Project Delivery', hash: 'full-stack-project-delivery' },
          { name: '7. Anatomy of a Web Application', hash: 'anatomy-of-a-web-application' },
          { name: '8. HTML and CSS', hash: 'html-and-css' },
          { name: '9. JavaScript and the DOM', hash: 'javascript-and-the-dom' },
          { name: '10. HTTP, URLs, APIs, and Pagination', hash: 'http-urls-apis-and-pagination' },
          { name: '15. Styling and Component Libraries', hash: 'styling-and-component-libraries' },
          { name: '16. TypeScript', hash: 'typescript' },
          { name: '20. Backend Development', hash: 'backend-development' },
          { name: '22. Relational Databases and SQL', hash: 'relational-databases-and-sql' },
          { name: '23. SQL Joins and SQL Categories', hash: 'sql-joins-and-sql-categories' },
          { name: '25. Serverless Architecture', hash: 'serverless-architecture' },
          { name: '27. Web Security', hash: 'web-security' },
          { name: '28. Threat Modeling and Secure Coding', hash: 'threat-modeling-and-secure-coding' },
          { name: '29. Debugging', hash: 'debugging' },
          { name: '33. Documentation and Diagrams', hash: 'documentation-and-diagrams' },
          { name: '34. Networking Fundamentals', hash: 'networking-fundamentals' },
          { name: '35. DNS, Ports, and OSI/TCP-IP Models', hash: 'dns-ports-and-osi-tcp-ip-models' },
          { name: '36. IoT and Computing Frontiers', hash: 'iot-and-computing-frontiers' },
          { name: '37. Project Delivery and Review', hash: 'project-delivery-and-review' },
        ],
      },
      {
        name: 'Algorithms',
        path: '/notes/algorithms',
        subtopics: [
          { name: '1. Algorithm Design and Analysis Overview', hash: 'algorithm-design-and-analysis-overview' },
          { name: '2. Running Time and Asymptotic Notation', hash: 'running-time-and-asymptotic-notation' },
          { name: '3. Stable Matching and Gale-Shapley', hash: 'stable-matching-and-gale-shapley' },
          { name: '4. Graph Basics and Representations', hash: 'graph-basics-and-representations' },
          { name: '5. BFS and Connected Components', hash: 'bfs-and-connected-components' },
          { name: '6. DFS, Edge Classification, and Cycles', hash: 'dfs-edge-classification-and-cycles' },
          { name: '7. Topological Sort and DAGs', hash: 'topological-sort-and-dags' },
          { name: '8. Strongly Connected Components', hash: 'strongly-connected-components' },
          { name: '9. Greedy Algorithms', hash: 'greedy-algorithms' },
          { name: '10. Interval Scheduling', hash: 'interval-scheduling' },
          { name: '11. Interval Partitioning and Priority Queues', hash: 'interval-partitioning-and-priority-queues' },
          { name: '12. Scheduling to Minimize Lateness', hash: 'scheduling-to-minimize-lateness' },
          { name: '13. Shortest Paths and Dijkstra', hash: 'shortest-paths-and-dijkstra' },
          { name: '14. Minimum Spanning Trees', hash: 'minimum-spanning-trees' },
          { name: "15. Prim's Algorithm", hash: 'prims-algorithm' },
          { name: "16. Kruskal's Algorithm and Union-Find", hash: 'kruskals-algorithm-and-union-find' },
          { name: '17. Divide and Conquer', hash: 'divide-and-conquer' },
          { name: '18. MergeSort and Binary Search', hash: 'mergesort-and-binary-search' },
          { name: '19. Karatsuba Multiplication', hash: 'karatsuba-multiplication' },
          { name: '20. Recurrences and Master Method', hash: 'recurrences-and-master-method' },
          { name: '21. Dynamic Programming Principles', hash: 'dynamic-programming-principles' },
          { name: '22. Weighted Interval Scheduling', hash: 'weighted-interval-scheduling' },
          { name: '23. Subset Sum and Knapsack', hash: 'subset-sum-and-knapsack' },
          { name: '24. Bellman-Ford and Negative Cycles', hash: 'bellman-ford-and-negative-cycles' },
          { name: '25. Network Flow Basics', hash: 'network-flow-basics' },
          { name: '26. Residual Graphs and Ford-Fulkerson', hash: 'residual-graphs-and-ford-fulkerson' },
          { name: '27. Max-Flow Min-Cut Theorem', hash: 'max-flow-min-cut-theorem' },
          { name: '28. Flow Reductions and Bipartite Matching', hash: 'flow-reductions-and-bipartite-matching' },
          { name: '29. Flow Applications: Light Switches and Disjoint Paths', hash: 'flow-applications-light-switches-and-disjoint-paths' },
          { name: '30. Circulation with Demands', hash: 'circulation-with-demands' },
          { name: '31. Image Segmentation via Min-Cut', hash: 'image-segmentation-via-min-cut' },
          { name: '32. Sequence Alignment and LCS', hash: 'sequence-alignment-and-lcs' },
          { name: '33. Computational Hardness', hash: 'computational-hardness' },
          { name: '34. P, NP, Certificates, and Verifiers', hash: 'p-np-certificates-and-verifiers' },
          { name: '35. Polynomial-Time Reductions', hash: 'polynomial-time-reductions' },
          { name: '36. NP-Completeness and Undecidability', hash: 'np-completeness-and-undecidability' },
        ],
      },
      {
        name: 'Artificial Intelligence',
        path: '/notes/artificial-intelligence',
        subtopics: [
          { name: '1. Artificial Intelligence Overview', hash: 'artificial-intelligence-overview' },
          { name: '2. Brief History of AI', hash: 'brief-history-of-ai' },
          { name: '3. AI Umbrella and Core Vocabulary', hash: 'ai-umbrella-and-core-vocabulary' },
          { name: '4. Agents, Environments, and Rationality', hash: 'agents-environments-and-rationality' },
          { name: '5. Task Environments', hash: 'task-environments' },
          { name: '6. Agent Types', hash: 'agent-types' },
          { name: '7. Classical Search Problems', hash: 'classical-search-problems' },
          { name: '8. Breadth-First Search', hash: 'breadth-first-search' },
          { name: '9. Depth-First Search and Iterative Deepening', hash: 'depth-first-search-and-iterative-deepening' },
          { name: "10. Dijkstra's Algorithm", hash: 'dijkstras-algorithm' },
          { name: '11. A* Search', hash: 'a-star-search' },
          { name: '12. Heuristics: Admissibility and Consistency', hash: 'heuristics-admissibility-and-consistency' },
          { name: '13. Local Search and Optimization', hash: 'local-search-and-optimization' },
          { name: '14. Hill Climbing', hash: 'hill-climbing' },
          { name: '15. Simulated Annealing', hash: 'simulated-annealing' },
          { name: '16. Local Beam Search', hash: 'local-beam-search' },
          { name: '17. Genetic Algorithms', hash: 'genetic-algorithms' },
          { name: '18. Continuous Optimization and Gradients', hash: 'continuous-optimization-and-gradients' },
          { name: '19. Adversarial Search', hash: 'adversarial-search' },
          { name: '20. Minimax', hash: 'minimax' },
          { name: '21. Depth-Limited and Iterative-Deepening Minimax', hash: 'depth-limited-and-iterative-deepening-minimax' },
          { name: '22. Alpha-Beta Pruning', hash: 'alpha-beta-pruning' },
          { name: '23. Move Ordering and Killer Moves', hash: 'move-ordering-and-killer-moves' },
          { name: '24. Heuristic Evaluation and Quiescence Search', hash: 'heuristic-evaluation-and-quiescence-search' },
          { name: '25. Stochastic Adversarial Search', hash: 'stochastic-adversarial-search' },
          { name: '26. Chance Nodes and Expectiminimax', hash: 'chance-nodes-and-expectiminimax' },
          { name: '27. Move Order Uncertainty', hash: 'move-order-uncertainty' },
          { name: '28. Constraint Satisfaction Problems', hash: 'constraint-satisfaction-problems' },
          { name: '29. Node and Arc Consistency', hash: 'node-and-arc-consistency' },
          { name: '30. AC-3', hash: 'ac-3' },
          { name: '31. Backtracking Search', hash: 'backtracking-search' },
          { name: '32. MRV, Degree Heuristic, and LCV', hash: 'mrv-degree-heuristic-and-lcv' },
          { name: '33. Forward Checking and MAC', hash: 'forward-checking-and-mac' },
          { name: '34. Backjumping and Conflict Sets', hash: 'backjumping-and-conflict-sets' },
          { name: '35. Supervised Learning Overview', hash: 'supervised-learning-overview' },
          { name: '36. Train/Validation/Test Splits', hash: 'train-validation-test-splits' },
          { name: '37. Decision Trees', hash: 'decision-trees' },
          { name: '38. Information Gain', hash: 'information-gain' },
          { name: '39. Naive Bayes', hash: 'naive-bayes' },
          { name: '40. Linear Regression', hash: 'linear-regression' },
          { name: '41. Logistic Regression', hash: 'logistic-regression' },
          { name: '42. Neural Networks', hash: 'neural-networks' },
          { name: '43. Backpropagation', hash: 'backpropagation' },
          { name: '44. CNNs, RNNs, and Graph Neural Networks', hash: 'cnns-rnns-and-graph-neural-networks' },
          { name: '45. Markov Decision Processes', hash: 'markov-decision-processes' },
          { name: '46. Policies, Rewards, Utilities, and Horizons', hash: 'policies-rewards-utilities-and-horizons' },
          { name: '47. Bellman Equations', hash: 'bellman-equations' },
          { name: '48. Value Iteration', hash: 'value-iteration' },
          { name: '49. Policy Iteration', hash: 'policy-iteration' },
          { name: '50. Passive Reinforcement Learning', hash: 'passive-reinforcement-learning' },
          { name: '51. Direct Utility Estimation', hash: 'direct-utility-estimation' },
          { name: '52. Adaptive Dynamic Programming', hash: 'adaptive-dynamic-programming' },
          { name: '53. Temporal-Difference Learning', hash: 'temporal-difference-learning' },
          { name: '54. Active Reinforcement Learning', hash: 'active-reinforcement-learning' },
          { name: '55. Exploration vs Exploitation', hash: 'exploration-vs-exploitation' },
          { name: '56. Q-Learning and SARSA', hash: 'q-learning-and-sarsa' },
          { name: '57. Function Approximation', hash: 'function-approximation' },
          { name: '58. Policy Search and Softmax Policies', hash: 'policy-search-and-softmax-policies' },
          { name: '59. REINFORCE', hash: 'reinforce' },
          { name: '60. Actor-Critic, A2C, and A3C', hash: 'actor-critic-a2c-and-a3c' },
          { name: '61. Neural-Network Q-Functions', hash: 'neural-network-q-functions' },
        ],
      },
      {
        name: 'Machine Learning',
        path: '/notes/machine-learning',
        subtopics: [
          { name: '1. Machine Learning Overview', hash: 'machine-learning-overview' },
          { name: '2. Mathematical Foundations', hash: 'mathematical-foundations' },
          { name: '3. Linear Algebra Review', hash: 'linear-algebra-review' },
          { name: '4. Calculus and Optimization Review', hash: 'calculus-and-optimization-review' },
          { name: '5. Probability and Maximum Likelihood Review', hash: 'probability-and-maximum-likelihood-review' },
          { name: '6. Supervised Learning Setup', hash: 'supervised-learning-setup' },
          { name: '7. Hypothesis Classes', hash: 'hypothesis-classes' },
          { name: '8. Regression vs Classification', hash: 'regression-vs-classification' },
          { name: '9. Linear Regression', hash: 'linear-regression' },
          { name: '10. Gradient Descent for Linear Models', hash: 'gradient-descent-for-linear-models' },
          { name: '11. Normal Equation and Pseudoinverse', hash: 'normal-equation-and-pseudoinverse' },
          { name: '12. Feature Scaling and Standardization', hash: 'feature-scaling-and-standardization' },
          { name: '13. Maximum Likelihood Estimation', hash: 'maximum-likelihood-estimation' },
          { name: '14. Bernoulli and Exponential MLE', hash: 'bernoulli-and-exponential-mle' },
          { name: '15. Nonlinear Features', hash: 'nonlinear-features' },
          { name: '16. Linear Classification', hash: 'linear-classification' },
          { name: '17. Logistic Regression', hash: 'logistic-regression' },
          { name: '18. Overfitting', hash: 'overfitting' },
          { name: '19. Bias-Variance Tradeoff', hash: 'bias-variance-tradeoff' },
          { name: '20. Regularization', hash: 'regularization' },
          { name: '21. L1 vs L2 Regularization', hash: 'l1-vs-l2-regularization' },
          { name: '22. Bayesian Learning', hash: 'bayesian-learning' },
          { name: '23. Beta Distributions and Additive Smoothing', hash: 'beta-distributions-and-additive-smoothing' },
          { name: '24. Bayesian Linear Regression', hash: 'bayesian-linear-regression' },
          { name: '25. Kernels', hash: 'kernels' },
          { name: '26. Valid Kernel Construction Rules', hash: 'valid-kernel-construction-rules' },
          { name: '27. Support Vector Machines', hash: 'support-vector-machines' },
          { name: '28. Soft-Margin SVMs', hash: 'soft-margin-svms' },
          { name: '29. Kernel SVMs', hash: 'kernel-svms' },
          { name: '30. Neural Networks', hash: 'neural-networks' },
          { name: '31. Output Activations and Loss Functions', hash: 'output-activations-and-loss-functions' },
          { name: '32. Backpropagation', hash: 'backpropagation' },
          { name: '33. Gradient-Based Optimization', hash: 'gradient-based-optimization' },
          { name: '34. RNNs and Time Series', hash: 'rnns-and-time-series' },
          { name: '35. Attention and Transformers', hash: 'attention-and-transformers' },
          { name: '36. Decision Trees', hash: 'decision-trees' },
          { name: '37. Tree Decision Boundaries', hash: 'tree-decision-boundaries' },
          { name: '38. Ensembles', hash: 'ensembles' },
          { name: '39. Bagging, Random Forests, and Boosting', hash: 'bagging-random-forests-and-boosting' },
          { name: '40. Gradient Boosted Trees', hash: 'gradient-boosted-trees' },
          { name: '41. Probabilistic Generative Models', hash: 'probabilistic-generative-models' },
          { name: '42. Gaussian Classifiers', hash: 'gaussian-classifiers' },
          { name: '43. Naive Bayes', hash: 'naive-bayes' },
          { name: '44. Unsupervised Learning', hash: 'unsupervised-learning' },
          { name: '45. K-Means', hash: 'k-means' },
          { name: '46. Gaussian Mixture Models', hash: 'gaussian-mixture-models' },
          { name: '47. EM Algorithm', hash: 'em-algorithm' },
          { name: '48. PCA', hash: 'pca' },
          { name: '49. PCA Normalization and Reconstruction', hash: 'pca-normalization-and-reconstruction' },
          { name: '50. Reinforcement Learning', hash: 'reinforcement-learning' },
          { name: '51. MDPs', hash: 'mdps' },
          { name: '52. Bellman Equations', hash: 'bellman-equations' },
          { name: '53. Value Iteration', hash: 'value-iteration' },
          { name: '54. Policy Iteration', hash: 'policy-iteration' },
          { name: '55. Q-Learning', hash: 'q-learning' },
          { name: '56. Implementation Guide', hash: 'implementation-guide' },
          { name: '57. Model Selection Tradeoffs', hash: 'model-selection-tradeoffs' },
        ],
      },
      {
        name: 'Computer Vision',
        path: '/notes/computer-vision',
        subtopics: [
          { name: '1. Computer Vision Overview', hash: 'computer-vision-overview' },
          { name: '2. What Is Image and Video Computing?', hash: 'what-is-image-and-video-computing' },
          { name: '3. Why Vision Is Hard', hash: 'why-vision-is-hard' },
          { name: '4. History of Computer Vision', hash: 'history-of-computer-vision' },
          { name: '5. Image Formation', hash: 'image-formation' },
          { name: '6. Pinhole Camera Model', hash: 'pinhole-camera-model' },
          { name: '7. Homogeneous Coordinates', hash: 'homogeneous-coordinates' },
          { name: '8. Perspective Projection', hash: 'perspective-projection' },
          { name: '9. Color Sensors and Color Formats', hash: 'color-sensors-and-color-formats' },
          { name: '10. Camera Calibration', hash: 'camera-calibration' },
          { name: '11. Intrinsic Parameters', hash: 'intrinsic-parameters' },
          { name: '12. Extrinsic Parameters', hash: 'extrinsic-parameters' },
          { name: '13. Triangulation', hash: 'triangulation' },
          { name: '14. Lighting and Reflectance', hash: 'lighting-and-reflectance' },
          { name: '15. BRDF', hash: 'brdf' },
          { name: '16. Ray Tracing and Path Tracing', hash: 'ray-tracing-and-path-tracing' },
          { name: '17. Linear Filtering and Convolution', hash: 'linear-filtering-and-convolution' },
          { name: '18. Gaussian and Box Filtering', hash: 'gaussian-and-box-filtering' },
          { name: '19. Edge Detection', hash: 'edge-detection' },
          { name: '20. Image Derivatives and Gradients', hash: 'image-derivatives-and-gradients' },
          { name: '21. Derivative of Gaussian Filters', hash: 'derivative-of-gaussian-filters' },
          { name: '22. Canny Edge Detector', hash: 'canny-edge-detector' },
          { name: '23. Morphological Operations', hash: 'morphological-operations' },
          { name: '24. Histogram Equalization', hash: 'histogram-equalization' },
          { name: '25. Hough Transform', hash: 'hough-transform' },
          { name: '26. Fourier Analysis', hash: 'fourier-analysis' },
          { name: '27. Frequency-Domain Filtering', hash: 'frequency-domain-filtering' },
          { name: '28. Image Pyramids and Template Matching', hash: 'image-pyramids-and-template-matching' },
          { name: '29. Model Fitting', hash: 'model-fitting' },
          { name: '30. Feature Warping and Generalized Linear Models', hash: 'feature-warping-and-generalized-linear-models' },
          { name: '31. Overfitting and Regularization', hash: 'overfitting-and-regularization' },
          { name: '32. Logistic Regression', hash: 'logistic-regression' },
          { name: '33. Keypoint Detection', hash: 'keypoint-detection' },
          { name: '34. Harris Corners', hash: 'harris-corners' },
          { name: '35. SIFT and Feature Invariance', hash: 'sift-and-feature-invariance' },
          { name: '36. Image Recognition', hash: 'image-recognition' },
          { name: '37. Bag of Visual Words', hash: 'bag-of-visual-words' },
          { name: '38. Spatial Pyramids', hash: 'spatial-pyramids' },
          { name: '39. Object Detection', hash: 'object-detection' },
          { name: '40. R-CNN, Fast R-CNN, Faster R-CNN', hash: 'r-cnn-fast-r-cnn-faster-r-cnn' },
          { name: '41. Dense Image Labeling', hash: 'dense-image-labeling' },
          { name: '42. Mean Shift Segmentation', hash: 'mean-shift-segmentation' },
          { name: '43. Fully Convolutional Networks', hash: 'fully-convolutional-networks' },
          { name: '44. Instance Segmentation and Mask R-CNN', hash: 'instance-segmentation-and-mask-r-cnn' },
          { name: '45. Expectation Maximization', hash: 'expectation-maximization' },
          { name: '46. Autoencoders', hash: 'autoencoders' },
          { name: '47. Variational Autoencoders', hash: 'variational-autoencoders' },
          { name: '48. Diffusion Models', hash: 'diffusion-models' },
          { name: '49. Super-Resolution', hash: 'super-resolution' },
          { name: '50. Dictionary Learning and K-SVD', hash: 'dictionary-learning-and-k-svd' },
          { name: '51. GPU Computing', hash: 'gpu-computing' },
        ],
      },
      {
        name: 'Computer Systems',
        path: '/notes/computer-systems',
        subtopics: [
          { name: '1. Computer Systems Big Picture', hash: 'computer-systems-big-picture' },
          { name: '2. Digital Abstraction', hash: 'digital-abstraction' },
          { name: '3. Combinational Logic', hash: 'combinational-logic' },
          { name: '4. Timing and Logic Simplification', hash: 'timing-and-logic-simplification' },
          { name: '5. Sequential Logic', hash: 'sequential-logic' },
          { name: '6. Finite State Machines', hash: 'finite-state-machines' },
          { name: '7. Pipelining', hash: 'pipelining' },
          { name: '8. Instruction Sets and the Beta Processor', hash: 'instruction-sets-and-beta-processor' },
          { name: '9. Assembly Programming Basics', hash: 'assembly-programming-basics' },
          { name: '10. Assembly Data Types and Instructions', hash: 'assembly-data-types-and-instructions' },
          { name: '11. Assembly Control Flow', hash: 'assembly-control-flow' },
          { name: '12. Assembly Functions and Stack Frames', hash: 'assembly-functions-and-stack-frames' },
          { name: '13. Processes, Executables, and I/O', hash: 'processes-executables-and-io' },
          { name: '14. Operating Systems and System Calls', hash: 'operating-systems-and-system-calls' },
          { name: '15. Scheduling and Concurrency', hash: 'scheduling-and-concurrency' },
          { name: '16. Virtual Memory', hash: 'virtual-memory' },
          { name: '17. Caches and Memory Hierarchy', hash: 'caches-and-memory-hierarchy' },
          { name: '18. Cache Writes and Coherence', hash: 'cache-writes-and-coherence' },
          { name: '30. Systems Design Lessons', hash: 'systems-design-lessons' },
        ],
      },
      {
        name: 'Database Systems',
        path: '/notes/database-systems',
        subtopics: [
          { name: '1. Database Systems Overview and DBMS Architecture', hash: 'database-systems-overview-and-dbms-architecture' },
          { name: '2. Two-Layer DBMS Model', hash: 'two-layer-dbms-model' },
          { name: '3. Database Design', hash: 'database-design' },
          { name: '4. Entity-Relationship Models', hash: 'entity-relationship-models' },
          { name: '5. Entities, Attributes, and Keys', hash: 'entities-attributes-and-keys' },
          { name: '6. Relationships, Cardinality, and Participation', hash: 'relationships-cardinality-and-participation' },
          { name: '7. ER-to-Relational Translation', hash: 'er-to-relational-translation' },
          { name: '8. Relational Model', hash: 'relational-model' },
          { name: '9. Primary Keys, Foreign Keys, and Constraints', hash: 'primary-keys-foreign-keys-and-constraints' },
          { name: '10. Relational Algebra', hash: 'relational-algebra' },
          { name: '11. Selection, Projection, Rename, and Cartesian Product', hash: 'selection-projection-rename-and-cartesian-product' },
          { name: '12. Joins and Outer Joins', hash: 'joins-and-outer-joins' },
          { name: '13. Set Difference and Assignment', hash: 'set-difference-and-assignment' },
          { name: '20. Storage Fundamentals', hash: 'storage-fundamentals' },
          { name: '21. Records, Pages, Blocks, and Caching', hash: 'records-pages-blocks-and-caching' },
          { name: '22. Index Structures', hash: 'index-structures' },
          { name: '23. B-Trees and B+ Trees', hash: 'b-trees-and-b-plus-trees' },
          { name: '24. Hash Indexes and Linear Hashing', hash: 'hash-indexes-and-linear-hashing' },
          { name: '25. Semistructured Data', hash: 'semistructured-data' },
          { name: '26. XML, XPath, and XQuery', hash: 'xml-xpath-and-xquery' },
          { name: '27. Logical-to-Physical Mapping', hash: 'logical-to-physical-mapping' },
          { name: '28. Transactions and ACID', hash: 'transactions-and-acid' },
          { name: '29. Schedules and Serializability', hash: 'schedules-and-serializability' },
          { name: '30. Concurrency Control', hash: 'concurrency-control' },
          { name: '31. Locking and Two-Phase Locking', hash: 'locking-and-two-phase-locking' },
          { name: '32. Deadlocks and Optimistic Concurrency Control', hash: 'deadlocks-and-optimistic-concurrency-control' },
          { name: '33. Distributed Databases and Replication', hash: 'distributed-databases-and-replication' },
          { name: '34. MapReduce', hash: 'mapreduce' },
          { name: '35. NoSQL Databases', hash: 'nosql-databases' },
          { name: '36. MongoDB and Aggregation', hash: 'mongodb-and-aggregation' },
          { name: '37. Recovery and Logging', hash: 'recovery-and-logging' },
          { name: '38. Redo, Undo, and Checkpointing', hash: 'redo-undo-and-checkpointing' },
          { name: '39. Two-Phase Commit', hash: 'two-phase-commit' },
          { name: '40. Choosing the Right Data Management Tool', hash: 'choosing-the-right-data-management-tool' },
        ],
      },
      {
        name: 'Distributed Systems',
        path: '/notes/distributed-systems',
        subtopics: [
          { name: '1. Distributed Systems Overview', hash: 'distributed-systems-overview' },
          { name: '2. Processes, Requests, and Local State', hash: 'processes-requests-and-local-state' },
          { name: '3. Concurrency vs Parallelism', hash: 'concurrency-vs-parallelism' },
          { name: '5. RPC and Failure Semantics', hash: 'rpc-and-failure-semantics' },
          { name: '6. Time, Asynchrony, and Causality', hash: 'time-asynchrony-and-causality' },
          { name: '7. Lamport Clocks and Vector Clocks', hash: 'lamport-clocks-and-vector-clocks' },
          { name: '8. Distributed Snapshots', hash: 'distributed-snapshots' },
          { name: '9. Replication', hash: 'replication' },
          { name: '10. Failure Models', hash: 'failure-models' },
          { name: '11. Consensus and Replicated State Machines', hash: 'consensus-and-replicated-state-machines' },
          { name: '12. Raft Leader Election', hash: 'raft-leader-election' },
          { name: '13. Raft Log Replication and Safety', hash: 'raft-log-replication-and-safety' },
          { name: '14. Raft Snapshotting and Configuration Changes', hash: 'raft-snapshotting-and-configuration-changes' },
          { name: '15. Consistency Models', hash: 'consistency-models' },
          { name: '16. Transactions and ACID', hash: 'transactions-and-acid' },
          { name: '17. Two-Phase Commit and Atomic Commit', hash: 'two-phase-commit-and-atomic-commit' },
          { name: '18. Distributed Shared Memory', hash: 'distributed-shared-memory' },
          { name: '19. Sharding and Consistent Hashing', hash: 'sharding-and-consistent-hashing' },
          { name: '20. MapReduce', hash: 'mapreduce' },
          { name: '21. Google File System', hash: 'google-file-system' },
          { name: '22. Dynamo', hash: 'dynamo' },
          { name: '23. Spanner', hash: 'spanner' },
          { name: '24. TLA+', hash: 'tla-plus' },
          { name: '25. Paper Reading Framework', hash: 'paper-reading-framework' },
          { name: '26. Distributed Systems Design Tradeoffs', hash: 'distributed-systems-design-tradeoffs' },
        ],
      },
      {
        name: 'Information Security',
        path: '/notes/information-security',
        subtopics: [
          { name: '1. Security and Threat Modeling', hash: 'security-and-threat-modeling' },
          { name: '2. Responsible Disclosure and CFAA', hash: 'responsible-disclosure-and-cfaa' },
          { name: '3. Web Architecture: URLs, HTTP, HTTPS', hash: 'web-architecture-urls-http-https' },
          { name: '4. SQL Injection', hash: 'sql-injection' },
          { name: '5. XSS', hash: 'xss' },
          { name: '6. CSRF', hash: 'csrf' },
          { name: '7. Same-Origin Policy, CORS, and Browser Security', hash: 'same-origin-policy-cors-and-browser-security' },
          { name: '8. Cookies, Sessions, and Cookie Flags', hash: 'cookies-sessions-and-cookie-flags' },
          { name: '9. Web Privacy and Tracking Pixels', hash: 'web-privacy-and-tracking-pixels' },
          { name: '10. HSTS and HTTPS Deployment', hash: 'hsts-and-https-deployment' },
          { name: '11. Cryptography Overview', hash: 'cryptography-overview' },
          { name: '12. Confidentiality, Integrity, and Authenticity', hash: 'confidentiality-integrity-and-authenticity' },
          { name: '13. Symmetric Encryption', hash: 'symmetric-encryption' },
          { name: '14. MACs and Authenticated Encryption', hash: 'macs-and-authenticated-encryption' },
          { name: '15. Hash Functions and Password Hashing', hash: 'hash-functions-and-password-hashing' },
          { name: '16. Public Key Cryptography', hash: 'public-key-cryptography' },
          { name: '17. Digital Signatures and Bitcoin', hash: 'digital-signatures-and-bitcoin' },
          { name: '18. Diffie-Hellman Key Exchange', hash: 'diffie-hellman-key-exchange' },
          { name: '19. TLS, Certificates, and PKI', hash: 'tls-certificates-and-pki' },
          { name: '20. Authentication vs Authorization', hash: 'authentication-vs-authorization' },
          { name: '21. Passwords, Credential Stuffing, and MFA', hash: 'passwords-credential-stuffing-and-mfa' },
          { name: '22. OAuth 2.0', hash: 'oauth-2-0' },
          { name: '23. OpenID Connect', hash: 'openid-connect' },
          { name: '24. Networking Basics: TCP, UDP, IP', hash: 'networking-basics-tcp-udp-ip' },
          { name: '25. DDoS and Reflection Attacks', hash: 'ddos-and-reflection-attacks' },
          { name: '26. DNS Security', hash: 'dns-security' },
          { name: '27. BGP Security', hash: 'bgp-security' },
          { name: '28. LLM Security and Prompt Injection', hash: 'llm-security-and-prompt-injection' },
          { name: '29. Secure System Design Principles', hash: 'secure-system-design-principles' },
        ],
      },
      {
        name: 'Cryptography',
        path: '/notes/cryptography',
        subtopics: [
          { name: '1. Cryptography Overview and Proof Style', hash: 'cryptography-overview-and-proof-style' },
          { name: '2. One-Time Encryption and the One-Time Pad', hash: 'one-time-encryption-and-the-one-time-pad' },
          { name: "3. Perfect Secrecy and Shannon's Impossibility", hash: 'perfect-secrecy-and-shannons-impossibility' },
          { name: '4. Computational Security', hash: 'computational-security' },
          { name: '5. Negligible Functions and Polynomial-Time Adversaries', hash: 'negligible-functions-and-polynomial-time-adversaries' },
          { name: '6. Attack Games and Advantage', hash: 'attack-games-and-advantage' },
          { name: '7. Semantic Security', hash: 'semantic-security' },
          { name: '8. Indistinguishability Definitions', hash: 'indistinguishability-definitions' },
          { name: '9. Pseudorandom Generators', hash: 'pseudorandom-generators' },
          { name: '10. Stream Ciphers', hash: 'stream-ciphers' },
          { name: '11. PRG Composition', hash: 'prg-composition' },
          { name: '12. One-Way Functions and One-Way Permutations', hash: 'one-way-functions-and-one-way-permutations' },
          { name: '13. Hardcore Predicates', hash: 'hardcore-predicates' },
          { name: '14. Blum-Micali PRG', hash: 'blum-micali-prg' },
          { name: '15. Discrete Logarithm Assumption', hash: 'discrete-logarithm-assumption' },
          { name: '16. Necessity of Assumptions', hash: 'necessity-of-assumptions' },
          { name: '17. Pseudorandom Functions', hash: 'pseudorandom-functions' },
          { name: '18. PRF Tree Construction', hash: 'prf-tree-construction' },
          { name: '19. PRGs from PRFs', hash: 'prgs-from-prfs' },
          { name: '20. Block Ciphers', hash: 'block-ciphers' },
          { name: '21. DES, AES, PRFs, and PRPs', hash: 'des-aes-prfs-and-prps' },
          { name: '22. CPA Security', hash: 'cpa-security' },
          { name: '23. CTR Mode', hash: 'ctr-mode' },
          { name: '24. ECB Insecurity', hash: 'ecb-insecurity' },
          { name: '25. CBC Mode', hash: 'cbc-mode' },
          { name: '26. Difference Lemma / Bad Event Lemma', hash: 'difference-lemma-bad-event-lemma' },
          { name: '27. Message Authentication Codes', hash: 'message-authentication-codes' },
          { name: '28. MACs from PRFs', hash: 'macs-from-prfs' },
          { name: '29. CBC-MAC, Cascade, and Extension Attacks', hash: 'cbc-mac-cascade-and-extension-attacks' },
          { name: '30. Full Variable-Length MAC Security', hash: 'full-variable-length-mac-security' },
          { name: '31. Chosen-Ciphertext Security', hash: 'chosen-ciphertext-security' },
          { name: '32. Authenticated Encryption', hash: 'authenticated-encryption' },
          { name: '33. Encrypt-then-MAC', hash: 'encrypt-then-mac' },
          { name: '34. AEAD', hash: 'aead' },
          { name: '35. Collision-Resistant Hashing', hash: 'collision-resistant-hashing' },
          { name: '36. DL-Based Hashing', hash: 'dl-based-hashing' },
          { name: '37. Merkle Trees', hash: 'merkle-trees' },
          { name: '38. Diffie-Hellman', hash: 'diffie-hellman' },
          { name: '39. CDH and DDH', hash: 'cdh-and-ddh' },
          { name: '40. ElGamal Encryption', hash: 'elgamal-encryption' },
          { name: '41. Public-Key Semantic Security', hash: 'public-key-semantic-security' },
          { name: '42. ElGamal in the Random Oracle Model', hash: 'elgamal-in-the-random-oracle-model' },
          { name: '43. Digital Signatures', hash: 'digital-signatures' },
          { name: '44. Schnorr Identification', hash: 'schnorr-identification' },
          { name: '45. Completeness, Knowledge Soundness, and Zero Knowledge', hash: 'completeness-knowledge-soundness-and-zero-knowledge' },
          { name: '46. Fiat-Shamir and Schnorr Signatures', hash: 'fiat-shamir-and-schnorr-signatures' },
          { name: '47. Merkle Signatures and Hash-Based Authentication', hash: 'merkle-signatures-and-hash-based-authentication' },
          { name: '48. Certificates, Signature Chains, and PKI', hash: 'certificates-signature-chains-and-pki' },
          { name: '49. Blockchains', hash: 'blockchains' },
          { name: '50. Miller-Rabin Primality Testing', hash: 'miller-rabin-primality-testing' },
          { name: '51. Oblivious Transfer', hash: 'oblivious-transfer' },
          { name: '52. Secure Two-Party Computation', hash: 'secure-two-party-computation' },
          { name: '53. Yao Garbled Circuits', hash: 'yao-garbled-circuits' },
          { name: '54. Verifiable Outsourced Computation', hash: 'verifiable-outsourced-computation' },
          { name: '55. Circuit Arithmetization', hash: 'circuit-arithmetization' },
          { name: '56. Cryptographic Proof Techniques', hash: 'cryptographic-proof-techniques' },
        ],
      },
    ],
  },
];

const subtopicContainsHash = (subtopic: Subtopic, hash: string): boolean => {
  return subtopic.hash === hash || Boolean(subtopic.subtopics?.some((child) => subtopicContainsHash(child, hash)));
};

const ChevronIcon = ({ isOpen, sizeClass }: { isOpen: boolean; sizeClass: string }) => (
  <svg
    className={`${sizeClass} transition-transform ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const SubtopicItem: React.FC<{
  subtopic: Subtopic;
  isDarkMode: boolean;
  closeMenu: () => void;
  depth: number;
  parentPath: string;
  currentHash: string;
}> = ({ subtopic, isDarkMode, closeMenu, depth, parentPath, currentHash }) => {
  const hasChildren = Boolean(subtopic.subtopics?.length);
  const isCurrentHash = currentHash === subtopic.hash;
  const containsCurrentHash = currentHash ? subtopicContainsHash(subtopic, currentHash) : false;
  const [isOpen, setIsOpen] = useState(containsCurrentHash);

  useEffect(() => {
    if (containsCurrentHash) setIsOpen(true);
  }, [containsCurrentHash]);

  const rowClass = isCurrentHash
    ? isDarkMode
      ? 'bg-green-500/15 text-green-300'
      : 'bg-blue-50 text-blue-600'
    : isDarkMode
      ? 'text-green-300 hover:bg-green-500/10'
      : 'text-slate-500 hover:bg-slate-50';

  return (
    <li>
      <div className={`flex items-center justify-between rounded-md transition-colors ${rowClass}`}>
        <Link
          to={`${parentPath}#${subtopic.hash}`}
          className={`block flex-1 px-2 py-1 text-xs font-mono text-inherit ${
            isDarkMode ? 'hover:text-green-200' : 'hover:text-blue-500'
          }`}
          onClick={() => {
            closeMenu();
            if (hasChildren && !isOpen) setIsOpen(true);
          }}
        >
          {subtopic.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:opacity-80 focus:outline-none"
            title={isOpen ? 'Collapse' : 'Expand'}
            aria-expanded={isOpen}
          >
            <ChevronIcon isOpen={isOpen} sizeClass="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <SubtopicList
          subtopics={subtopic.subtopics!}
          isDarkMode={isDarkMode}
          closeMenu={closeMenu}
          depth={depth + 1}
          parentPath={parentPath}
          currentHash={currentHash}
        />
      )}
    </li>
  );
};

const SubtopicList: React.FC<{
  subtopics: Subtopic[];
  isDarkMode: boolean;
  closeMenu: () => void;
  depth?: number;
  parentPath: string;
  currentHash: string;
}> = ({ subtopics, isDarkMode, closeMenu, depth = 0, parentPath, currentHash }) => {
  const listClass =
    depth === 0
      ? `ml-4 border-l-2 pl-2 ${isDarkMode ? 'border-green-500/30' : 'border-slate-200'}`
      : `ml-3 border-l pl-2 ${isDarkMode ? 'border-green-500/20' : 'border-slate-200'}`;

  return (
    <ul className={`mt-1 space-y-1 ${listClass}`}>
      {subtopics.map((subtopic) => (
        <SubtopicItem
          key={subtopic.hash}
          subtopic={subtopic}
          isDarkMode={isDarkMode}
          closeMenu={closeMenu}
          depth={depth}
          parentPath={parentPath}
          currentHash={currentHash}
        />
      ))}
    </ul>
  );
};

const MainSectionItem: React.FC<{
  item: MainTopicItem;
  isDarkMode: boolean;
  closeMenu: () => void;
  isActive: boolean;
  currentHash: string;
}> = ({ item, isDarkMode, closeMenu, isActive, currentHash }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const hasChildren = Boolean(item.subtopics?.length);
  const activeHash = isActive ? currentHash : '';

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  return (
    <li>
      <div
        className={`flex items-center justify-between rounded-md transition-colors ${
          isActive
            ? isDarkMode
              ? 'border border-green-500/30 bg-green-500/20'
              : 'bg-blue-50'
            : isDarkMode
              ? 'hover:bg-green-500/10'
              : 'hover:bg-slate-100'
        }`}
      >
        <Link
          to={item.path}
          onClick={() => {
            closeMenu();
            if (hasChildren && !isOpen) setIsOpen(true);
          }}
          className={`block flex-1 px-3 py-2 text-sm font-medium font-mono ${
            isActive
              ? isDarkMode
                ? 'text-green-400'
                : 'text-blue-600'
              : isDarkMode
                ? 'text-green-300 hover:text-green-200'
                : 'text-slate-600'
          }`}
        >
          {item.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 hover:opacity-80 focus:outline-none ${
              isActive
                ? isDarkMode
                  ? 'text-green-400'
                  : 'text-blue-600'
                : isDarkMode
                  ? 'text-green-300'
                  : 'text-slate-500'
            }`}
            title={isOpen ? 'Collapse Section' : 'Expand Section'}
            aria-expanded={isOpen}
          >
            <ChevronIcon isOpen={isOpen} sizeClass="h-4 w-4" />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <SubtopicList
          subtopics={item.subtopics!}
          isDarkMode={isDarkMode}
          closeMenu={closeMenu}
          parentPath={item.path}
          currentHash={activeHash}
        />
      )}
    </li>
  );
};

export const NotesLayout: React.FC<NotesLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const currentHash = location.hash.replace('#', '');

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
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div
      className={`flex min-h-screen flex-col transition-all duration-300 md:flex-row ${
        isDarkMode ? 'page-bg-dark text-green-100' : 'page-bg-light text-slate-800'
      }`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div
        className={`sticky top-0 z-40 flex items-center justify-between border-b px-6 py-4 md:hidden ${
          isDarkMode ? 'border-green-500/30 bg-black/90' : 'border-slate-200 bg-white/90'
        } backdrop-blur-md`}
      >
        <Link
          to="/notes"
          className={`text-lg font-bold font-mono ${isDarkMode ? 'hacker-text-gradient text-green-400' : 'text-blue-600'}`}
        >
          My Notes
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className={`rounded-lg p-2 transition-all duration-300 ${
              isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            title="Component Guide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`rounded-lg p-2 transition-all duration-300 ${
              isDarkMode ? 'bg-green-400 text-black hover:bg-green-300' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {renderThemeIcon()}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded-md p-2 ${isDarkMode ? 'text-green-400' : 'text-slate-600'}`}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <aside
        className={`w-full flex-shrink-0 border-r transition-all custom-scrollbar md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto ${
          mobileMenuOpen ? 'block' : 'hidden md:block'
        } ${isDarkMode ? 'border-green-500/30 bg-black/50 md:bg-transparent' : 'border-slate-200 bg-white md:bg-transparent'}`}
      >
        <div className="p-6">
          <div className="mb-8 hidden items-center justify-between md:flex">
            <Link
              to="/notes"
              className={`block text-xl font-bold font-mono transition-opacity hover:opacity-80 ${
                isDarkMode ? 'hacker-text-gradient text-green-400' : 'text-slate-800'
              }`}
            >
              My Notes
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className={`rounded-lg p-1.5 transition-all duration-300 ${
                  isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title="Component Guide"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`rounded-lg p-1.5 transition-all duration-300 ${
                  isDarkMode ? 'bg-green-400 text-black hover:bg-green-300' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {renderThemeIcon()}
              </button>
            </div>
          </div>

          <Link to="/" className={`mb-8 block text-sm font-mono hover:underline ${isDarkMode ? 'text-green-500' : 'text-slate-500'}`}>
            &larr; Back to Portfolio
          </Link>

          <div className="space-y-8">
            {NOTE_TOPIC_GROUPS.map((topicGroup) => (
              <div key={topicGroup.title}>
                <h3
                  className={`mb-3 text-xs font-semibold uppercase tracking-wider font-mono ${
                    isDarkMode ? 'text-green-500/70' : 'text-slate-500'
                  }`}
                >
                  {topicGroup.title}
                </h3>
                <ul className="space-y-2">
                  {topicGroup.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <MainSectionItem
                        key={item.path}
                        item={item}
                        isDarkMode={isDarkMode}
                        closeMenu={closeMobileMenu}
                        isActive={isActive}
                        currentHash={currentHash}
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main
        className={`mx-auto w-full max-w-7xl flex-1 px-6 py-10 pb-24 transition-all duration-300 md:px-12 ${
          mobileMenuOpen ? 'hidden md:block' : ''
        }`}
      >
        <div className="w-full font-mono">{children}</div>
      </main>

      <NotesGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};

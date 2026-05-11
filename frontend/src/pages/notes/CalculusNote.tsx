/**
 * Calculus Notes Page
 * A comprehensive overview of limits, derivatives, and integrals
 * Demonstrates the use of NoteTypography, MathBlock, and CodeBlock components
 */

import { NotesLayout } from '../../components/notes/NotesLayout';
import { MathBlock, InlineMath, CodeBlock, NoteHeader, NoteSectionTitle, NoteSubSectionTitle, NoteParagraph } from '../../components/notes';

/**
 * Renders the Calculus notes content
 * @returns {JSX.Element} Structured calculus notes page
 */
export default function CalculusNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Calculus"
        subtitle="The beginning of all things regarding change..."
      />

      {/* 1. FUNCTIONS SECTION */}
      <NoteSectionTitle id="functions">1. Functions</NoteSectionTitle>
      <NoteParagraph>Content for 1. Functions goes here.</NoteParagraph>

      <NoteSubSectionTitle id="function-basics">1.1 Function Basics</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Function Basics.
      </NoteParagraph>

      <NoteSubSectionTitle id="domain-and-range">1.2 Domain and Range</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Domain and Range.
      </NoteParagraph>

      <NoteSubSectionTitle id="composition-of-functions">1.3 Composition of Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Composition of Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="inverse-functions">1.4 Inverse Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Inverse Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="graph-transformations">1.5 Graph Transformations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Graph Transformations.
      </NoteParagraph>

      <NoteSubSectionTitle id="polynomial-functions">1.6 Polynomial Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polynomial Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="rational-functions">1.7 Rational Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Rational Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="exponential-functions">1.8 Exponential Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Exponential Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="logarithmic-functions">1.9 Logarithmic Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Logarithmic Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="trigonometric-functions">1.10 Trigonometric Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trigonometric Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="algebra-review">1.11 Algebra Review</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Algebra Review.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-identities">1.12 Trig Identities</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Identities.
      </NoteParagraph>

      {/* 2. LIMITS SECTION */}
      <NoteSectionTitle id="limits">2. Limits</NoteSectionTitle>
      <NoteParagraph>Content for 2. Limits goes here.</NoteParagraph>

      <NoteSubSectionTitle id="intuitive-limits">2.1 Intuitive Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Intuitive Limits.
      </NoteParagraph>

      <NoteSubSectionTitle id="one-sided-limits">2.2 One-Sided Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on One-Sided Limits.
      </NoteParagraph>

      <NoteSubSectionTitle id="infinite-limits">2.3 Infinite Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Infinite Limits.
      </NoteParagraph>

      <NoteSubSectionTitle id="limits-at-infinity">2.4 Limits at Infinity</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Limits at Infinity.
      </NoteParagraph>

      <NoteSubSectionTitle id="continuity">2.5 Continuity</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Continuity.
      </NoteParagraph>

      <NoteSubSectionTitle id="discontinuities">2.6 Discontinuities</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Discontinuities.
      </NoteParagraph>

      <NoteSubSectionTitle id="intermediate-value-theorem">2.7 Intermediate Value Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Intermediate Value Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="epsilon-delta-definition">2.8 Epsilon-Delta Definition</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Epsilon-Delta Definition.
      </NoteParagraph>

      {/* 3. DERIVATIVES SECTION */}
      <NoteSectionTitle id="derivatives">3. Derivatives</NoteSectionTitle>
      <NoteParagraph>Content for 3. Derivatives goes here.</NoteParagraph>

      <NoteSubSectionTitle id="derivative-definition">3.1 Derivative Definition</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Derivative Definition.
      </NoteParagraph>

      <NoteSubSectionTitle id="tangent-lines">3.2 Tangent Lines</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Tangent Lines.
      </NoteParagraph>

      <NoteSubSectionTitle id="rates-of-change">3.3 Rates of Change</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Rates of Change.
      </NoteParagraph>

      <NoteSubSectionTitle id="power-rule">3.4 Power Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Power Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="product-rule">3.5 Product Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Product Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="quotient-rule">3.6 Quotient Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Quotient Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="chain-rule">3.7 Chain Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Chain Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-derivatives">3.8 Trig Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="exponential-derivatives">3.9 Exponential Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Exponential Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="logarithmic-derivatives">3.10 Logarithmic Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Logarithmic Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="implicit-differentiation">3.11 Implicit Differentiation</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Implicit Differentiation.
      </NoteParagraph>

      <NoteSubSectionTitle id="inverse-function-derivatives">3.12 Inverse Function Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Inverse Function Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="higher-order-derivatives">3.13 Higher-Order Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Higher-Order Derivatives.
      </NoteParagraph>

      {/* 4. DERIVATIVE APPLICATIONS SECTION */}
      <NoteSectionTitle id="derivative-applications">4. Derivative Applications</NoteSectionTitle>
      <NoteParagraph>Content for 4. Derivative Applications goes here.</NoteParagraph>

      <NoteSubSectionTitle id="linear-approximation">4.1 Linear Approximation</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Linear Approximation.
      </NoteParagraph>

      <NoteSubSectionTitle id="related-rates">4.2 Related Rates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Related Rates.
      </NoteParagraph>

      <NoteSubSectionTitle id="optimization">4.3 Optimization</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Optimization.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-problems">4.4 Motion Problems</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion Problems.
      </NoteParagraph>

      <NoteSubSectionTitle id="increasing-and-decreasing-functions">4.5 Increasing and Decreasing Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Increasing and Decreasing Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="concavity">4.6 Concavity</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Concavity.
      </NoteParagraph>

      <NoteSubSectionTitle id="inflection-points">4.7 Inflection Points</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Inflection Points.
      </NoteParagraph>

      <NoteSubSectionTitle id="mean-value-theorem">4.8 Mean Value Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Mean Value Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="l-h-pital-s-rule">4.9 L’Hôpital’s Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on L’Hôpital’s Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="curve-sketching">4.10 Curve Sketching</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Curve Sketching.
      </NoteParagraph>

      {/* 5. INTEGRALS SECTION */}
      <NoteSectionTitle id="integrals">5. Integrals</NoteSectionTitle>
      <NoteParagraph>Content for 5. Integrals goes here.</NoteParagraph>

      <NoteSubSectionTitle id="antiderivatives">5.1 Antiderivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Antiderivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="riemann-sums">5.2 Riemann Sums</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Riemann Sums.
      </NoteParagraph>

      <NoteSubSectionTitle id="definite-integrals">5.3 Definite Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Definite Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="indefinite-integrals">5.4 Indefinite Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Indefinite Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="accumulation-functions">5.5 Accumulation Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Accumulation Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="fundamental-theorem-of-calculus">5.6 Fundamental Theorem of Calculus</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Fundamental Theorem of Calculus.
      </NoteParagraph>

      <NoteSubSectionTitle id="basic-substitution">5.7 Basic Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Basic Substitution.
      </NoteParagraph>

      {/* 6. INTEGRATION TECHNIQUES SECTION */}
      <NoteSectionTitle id="integration-techniques">6. Integration Techniques</NoteSectionTitle>
      <NoteParagraph>Content for 6. Integration Techniques goes here.</NoteParagraph>

      <NoteSubSectionTitle id="u-substitution">6.1 u-Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on u-Substitution.
      </NoteParagraph>

      <NoteSubSectionTitle id="integration-by-parts">6.2 Integration by Parts</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Integration by Parts.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-integrals">6.3 Trig Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-substitution">6.4 Trig Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Substitution.
      </NoteParagraph>

      <NoteSubSectionTitle id="partial-fractions">6.5 Partial Fractions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Partial Fractions.
      </NoteParagraph>

      <NoteSubSectionTitle id="improper-integrals">6.6 Improper Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Improper Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="numerical-integration">6.7 Numerical Integration</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Numerical Integration.
      </NoteParagraph>

      {/* 7. INTEGRAL APPLICATIONS SECTION */}
      <NoteSectionTitle id="integral-applications">7. Integral Applications</NoteSectionTitle>
      <NoteParagraph>Content for 7. Integral Applications goes here.</NoteParagraph>

      <NoteSubSectionTitle id="area-under-a-curve">7.1 Area Under a Curve</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Area Under a Curve.
      </NoteParagraph>

      <NoteSubSectionTitle id="area-between-curves">7.2 Area Between Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Area Between Curves.
      </NoteParagraph>

      <NoteSubSectionTitle id="average-value">7.3 Average Value</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Average Value.
      </NoteParagraph>

      <NoteSubSectionTitle id="volumes-by-slicing">7.4 Volumes by Slicing</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Volumes by Slicing.
      </NoteParagraph>

      <NoteSubSectionTitle id="disk-method">7.5 Disk Method</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Disk Method.
      </NoteParagraph>

      <NoteSubSectionTitle id="washer-method">7.6 Washer Method</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Washer Method.
      </NoteParagraph>

      <NoteSubSectionTitle id="shell-method">7.7 Shell Method</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Shell Method.
      </NoteParagraph>

      <NoteSubSectionTitle id="arc-length">7.8 Arc Length</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Arc Length.
      </NoteParagraph>

      <NoteSubSectionTitle id="surface-area">7.9 Surface Area</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Surface Area.
      </NoteParagraph>

      <NoteSubSectionTitle id="work">7.10 Work</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Work.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-with-integrals">7.11 Motion with Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion with Integrals.
      </NoteParagraph>

      {/* 8. DIFFERENTIAL EQUATIONS SECTION */}
      <NoteSectionTitle id="differential-equations">8. Differential Equations</NoteSectionTitle>
      <NoteParagraph>Content for 8. Differential Equations goes here.</NoteParagraph>

      <NoteSubSectionTitle id="differential-equation-basics">8.1 Differential Equation Basics</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Differential Equation Basics.
      </NoteParagraph>

      <NoteSubSectionTitle id="verifying-solutions">8.2 Verifying Solutions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Verifying Solutions.
      </NoteParagraph>

      <NoteSubSectionTitle id="slope-fields">8.3 Slope Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Slope Fields.
      </NoteParagraph>

      <NoteSubSectionTitle id="separable-equations">8.4 Separable Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Separable Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="exponential-growth-and-decay">8.5 Exponential Growth and Decay</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Exponential Growth and Decay.
      </NoteParagraph>

      <NoteSubSectionTitle id="logistic-growth">8.6 Logistic Growth</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Logistic Growth.
      </NoteParagraph>

      <NoteSubSectionTitle id="first-order-equations">8.7 First-Order Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on First-Order Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="second-order-linear-equations">8.8 Second-Order Linear Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Second-Order Linear Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="characteristic-equations">8.9 Characteristic Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Characteristic Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="laplace-transforms">8.10 Laplace Transforms</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Laplace Transforms.
      </NoteParagraph>

      {/* 9. PARAMETRIC EQUATIONS SECTION */}
      <NoteSectionTitle id="parametric-equations">9. Parametric Equations</NoteSectionTitle>
      <NoteParagraph>Content for 9. Parametric Equations goes here.</NoteParagraph>

      <NoteSubSectionTitle id="parametric-curves">9.1 Parametric Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Parametric Curves.
      </NoteParagraph>

      <NoteSubSectionTitle id="eliminating-the-parameter">9.2 Eliminating the Parameter</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Eliminating the Parameter.
      </NoteParagraph>

      <NoteSubSectionTitle id="parametric-derivatives">9.3 Parametric Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Parametric Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="tangent-lines-1">9.4 Tangent Lines</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Tangent Lines.
      </NoteParagraph>

      <NoteSubSectionTitle id="parametric-arc-length">9.5 Parametric Arc Length</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Parametric Arc Length.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-with-parametric-equations">9.6 Motion with Parametric Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion with Parametric Equations.
      </NoteParagraph>

      {/* 10. POLAR COORDINATES SECTION */}
      <NoteSectionTitle id="polar-coordinates">10. Polar Coordinates</NoteSectionTitle>
      <NoteParagraph>Content for 10. Polar Coordinates goes here.</NoteParagraph>

      <NoteSubSectionTitle id="polar-coordinates-1">10.1 Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="converting-between-polar-and-cartesian">10.2 Converting Between Polar and Cartesian</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Converting Between Polar and Cartesian.
      </NoteParagraph>

      <NoteSubSectionTitle id="polar-graphs">10.3 Polar Graphs</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Graphs.
      </NoteParagraph>

      <NoteSubSectionTitle id="polar-derivatives">10.4 Polar Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="area-in-polar-coordinates">10.5 Area in Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Area in Polar Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="arc-length-in-polar-coordinates">10.6 Arc Length in Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Arc Length in Polar Coordinates.
      </NoteParagraph>

      {/* 11. VECTOR-VALUED FUNCTIONS SECTION */}
      <NoteSectionTitle id="vector-valued-functions">11. Vector-Valued Functions</NoteSectionTitle>
      <NoteParagraph>Content for 11. Vector-Valued Functions goes here.</NoteParagraph>

      <NoteSubSectionTitle id="vector-valued-functions-1">11.1 Vector-Valued Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Vector-Valued Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="position-velocity-and-acceleration">11.2 Position, Velocity, and Acceleration</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Position, Velocity, and Acceleration.
      </NoteParagraph>

      <NoteSubSectionTitle id="unit-tangent-vector">11.3 Unit Tangent Vector</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Unit Tangent Vector.
      </NoteParagraph>

      <NoteSubSectionTitle id="unit-normal-vector">11.4 Unit Normal Vector</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Unit Normal Vector.
      </NoteParagraph>

      <NoteSubSectionTitle id="curvature">11.5 Curvature</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Curvature.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-in-the-plane">11.6 Motion in the Plane</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion in the Plane.
      </NoteParagraph>

      <NoteSubSectionTitle id="arc-length-for-vector-functions">11.7 Arc Length for Vector Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Arc Length for Vector Functions.
      </NoteParagraph>

      {/* 12. SERIES SECTION */}
      <NoteSectionTitle id="series">12. Series</NoteSectionTitle>
      <NoteParagraph>Content for 12. Series goes here.</NoteParagraph>

      <NoteSubSectionTitle id="sequences">12.1 Sequences</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Sequences.
      </NoteParagraph>

      <NoteSubSectionTitle id="infinite-series">12.2 Infinite Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Infinite Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="geometric-series">12.3 Geometric Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Geometric Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="nth-term-test">12.4 nth-Term Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on nth-Term Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="p-series">12.5 p-Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on p-Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="integral-test">12.6 Integral Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Integral Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="comparison-test">12.7 Comparison Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Comparison Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="limit-comparison-test">12.8 Limit Comparison Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Limit Comparison Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="alternating-series-test">12.9 Alternating Series Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Alternating Series Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="ratio-test">12.10 Ratio Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Ratio Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="root-test">12.11 Root Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Root Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="power-series">12.12 Power Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Power Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="taylor-series">12.13 Taylor Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Taylor Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="maclaurin-series">12.14 Maclaurin Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Maclaurin Series.
      </NoteParagraph>

      {/* 13. MULTIVARIABLE BASICS SECTION */}
      <NoteSectionTitle id="multivariable-basics">13. Multivariable Basics</NoteSectionTitle>
      <NoteParagraph>Content for 13. Multivariable Basics goes here.</NoteParagraph>

      <NoteSubSectionTitle id="vectors">13.1 Vectors</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Vectors.
      </NoteParagraph>

      <NoteSubSectionTitle id="3d-coordinates">13.2 3D Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on 3D Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="dot-product">13.3 Dot Product</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Dot Product.
      </NoteParagraph>

      <NoteSubSectionTitle id="cross-product">13.4 Cross Product</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Cross Product.
      </NoteParagraph>

      <NoteSubSectionTitle id="lines-and-planes">13.5 Lines and Planes</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Lines and Planes.
      </NoteParagraph>

      <NoteSubSectionTitle id="multivariable-functions">13.6 Multivariable Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Multivariable Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="level-curves">13.7 Level Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Level Curves.
      </NoteParagraph>

      <NoteSubSectionTitle id="level-surfaces">13.8 Level Surfaces</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Level Surfaces.
      </NoteParagraph>

      <NoteSubSectionTitle id="vector-fields">13.9 Vector Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Vector Fields.
      </NoteParagraph>

      {/* 14. MULTIVARIABLE DERIVATIVES SECTION */}
      <NoteSectionTitle id="multivariable-derivatives">14. Multivariable Derivatives</NoteSectionTitle>
      <NoteParagraph>Content for 14. Multivariable Derivatives goes here.</NoteParagraph>

      <NoteSubSectionTitle id="partial-derivatives">14.1 Partial Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Partial Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="higher-order-partial-derivatives">14.2 Higher-Order Partial Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Higher-Order Partial Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="gradient">14.3 Gradient</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Gradient.
      </NoteParagraph>

      <NoteSubSectionTitle id="directional-derivatives">14.4 Directional Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Directional Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="tangent-planes">14.5 Tangent Planes</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Tangent Planes.
      </NoteParagraph>

      <NoteSubSectionTitle id="linear-approximation-1">14.6 Linear Approximation</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Linear Approximation.
      </NoteParagraph>

      <NoteSubSectionTitle id="chain-rule-1">14.7 Chain Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Chain Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="jacobian">14.8 Jacobian</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Jacobian.
      </NoteParagraph>

      {/* 15. MULTIVARIABLE DERIVATIVE APPLICATIONS SECTION */}
      <NoteSectionTitle id="multivariable-derivative-applications">15. Multivariable Derivative Applications</NoteSectionTitle>
      <NoteParagraph>Content for 15. Multivariable Derivative Applications goes here.</NoteParagraph>

      <NoteSubSectionTitle id="critical-points">15.1 Critical Points</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Critical Points.
      </NoteParagraph>

      <NoteSubSectionTitle id="local-maxima-and-minima">15.2 Local Maxima and Minima</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Local Maxima and Minima.
      </NoteParagraph>

      <NoteSubSectionTitle id="saddle-points">15.3 Saddle Points</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Saddle Points.
      </NoteParagraph>

      <NoteSubSectionTitle id="second-derivative-test">15.4 Second Derivative Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Second Derivative Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="constrained-optimization">15.5 Constrained Optimization</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Constrained Optimization.
      </NoteParagraph>

      <NoteSubSectionTitle id="lagrange-multipliers">15.6 Lagrange Multipliers</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Lagrange Multipliers.
      </NoteParagraph>

      {/* 16. MULTIVARIABLE INTEGRALS SECTION */}
      <NoteSectionTitle id="multivariable-integrals">16. Multivariable Integrals</NoteSectionTitle>
      <NoteParagraph>Content for 16. Multivariable Integrals goes here.</NoteParagraph>

      <NoteSubSectionTitle id="double-integrals">16.1 Double Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Double Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="triple-integrals">16.2 Triple Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Triple Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="iterated-integrals">16.3 Iterated Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Iterated Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="region-setup">16.4 Region Setup</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Region Setup.
      </NoteParagraph>

      <NoteSubSectionTitle id="change-of-variables">16.5 Change of Variables</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Change of Variables.
      </NoteParagraph>

      <NoteSubSectionTitle id="jacobian-determinant">16.6 Jacobian Determinant</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Jacobian Determinant.
      </NoteParagraph>

      <NoteSubSectionTitle id="polar-coordinates-in-double-integrals">16.7 Polar Coordinates in Double Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Coordinates in Double Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="cylindrical-coordinates">16.8 Cylindrical Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Cylindrical Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="spherical-coordinates">16.9 Spherical Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Spherical Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="line-integrals">16.10 Line Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Line Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="surface-integrals">16.11 Surface Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Surface Integrals.
      </NoteParagraph>

      {/* 17. VECTOR CALCULUS THEOREMS SECTION */}
      <NoteSectionTitle id="vector-calculus-theorems">17. Vector Calculus Theorems</NoteSectionTitle>
      <NoteParagraph>Content for 17. Vector Calculus Theorems goes here.</NoteParagraph>

      <NoteSubSectionTitle id="conservative-vector-fields">17.1 Conservative Vector Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Conservative Vector Fields.
      </NoteParagraph>

      <NoteSubSectionTitle id="fundamental-theorem-for-line-integrals">17.2 Fundamental Theorem for Line Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Fundamental Theorem for Line Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="green-s-theorem">17.3 Green’s Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Green’s Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="curl">17.4 Curl</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Curl.
      </NoteParagraph>

      <NoteSubSectionTitle id="divergence">17.5 Divergence</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Divergence.
      </NoteParagraph>

      <NoteSubSectionTitle id="flux">17.6 Flux</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Flux.
      </NoteParagraph>

      <NoteSubSectionTitle id="stokes-theorem">17.7 Stokes’ Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Stokes’ Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="divergence-theorem">17.8 Divergence Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Divergence Theorem.
      </NoteParagraph>

    </NotesLayout>
  );
}

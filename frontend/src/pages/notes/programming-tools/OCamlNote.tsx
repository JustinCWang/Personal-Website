/**
 * OCaml Notes Page
 * A standalone note for OCaml syntax, functional programming, algebraic data types, pattern matching, modules, and testing.
 */

import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  CodeBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteTable,
  NoteTopicBlock,
  NoteTopicGroup,
  RelatedNotes,
} from '../../../components/notes';

export default function OCamlNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="OCaml"
        subtitle="A functional programming guide to expressions, types, recursion, pattern matching, algebraic data types, higher-order functions, modules, and tests."
      />

      <RelatedNotes
        links={[
          { href: '/notes/programming-languages', label: 'Programming Languages', note: 'Connect OCaml mechanics to semantics, type systems, inference rules, and lambda calculus.' },
          { href: '/notes/intro-python', label: 'Python Foundations', note: 'Compare dynamic scripting with typed functional programming.' },
        ]}
      />

      <NoteSectionTitle id="ocaml-overview">1. OCaml Overview</NoteSectionTitle>
      <NoteParagraph>
        OCaml is an expression-oriented, statically typed, mostly functional language with strong type inference. An OCaml program is built from expressions that evaluate to values, and the type checker infers most types before the program runs.
      </NoteParagraph>
      <NoteParagraph>
        Most values are immutable by default. Instead of changing a value in place, OCaml code usually builds a new value from an old one.
      </NoteParagraph>

      <NoteSectionTitle id="dune-and-project-structure">2. Dune and Project Structure</NoteSectionTitle>
      <NoteParagraph>
        Dune is the common OCaml build system. It describes libraries, executables, and tests using small configuration files. A clean project separates implementation modules, public interfaces, test files, and executable entry points.
      </NoteParagraph>
      <CodeBlock
        language="lisp"
        code={`
(executable
 (name main)
 (libraries mylib))

(test
 (name test_parser)
 (libraries mylib ounit2))
        `}
      />

      <NoteSectionTitle id="expressions-values-and-types">3. Expressions, Values, and Types</NoteSectionTitle>
      <NoteParagraph>
        OCaml expressions produce values. The type checker infers the type of each expression and rejects inconsistent combinations before execution.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
let radius = 3.0
let area = Float.pi *. radius *. radius

let count = 10
let label = "items"
        `}
      />
      <NoteTable
        headers={['syntax', 'meaning']}
        rows={[
          [<code>+ - * /</code>, 'integer arithmetic'],
          [<code>+. -. *. /.</code>, 'floating-point arithmetic'],
          [<code>= &lt;&gt; &lt; &lt;= &gt; &gt;=</code>, 'comparison operators'],
          [<code>let name = expr</code>, 'bind a name to a value'],
        ]}
      />

      <NoteSectionTitle id="let-bindings-scope-and-shadowing">4. Let Bindings, Scope, and Shadowing</NoteSectionTitle>
      <NoteParagraph>
        A <code>let</code> binding gives a name to a value. Scope controls where that name is visible. Shadowing creates a new binding with the same name in an inner scope; it does not mutate the old value.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
let x = 10

let y =
  let x = x + 1 in
  x * 2
        `}
      />
      <NoteParagraph>
        The inner <code>x</code> shadows the outer <code>x</code> only inside the expression after <code>in</code>. This is one reason functional programs can reuse short names without global side effects.
      </NoteParagraph>

      <NoteSectionTitle id="functions-and-recursion">5. Functions and Recursion</NoteSectionTitle>
      <NoteParagraph>
        Functions are values. A function can be named, passed to another function, returned from a function, and partially applied. Recursive functions must be declared with <code>let rec</code>.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
let square x = x * x

let rec factorial n =
  if n = 0 then 1
  else n * factorial (n - 1)
        `}
      />
      <NoteParagraph>
        Recursion replaces many loop patterns. The important design question is the same as induction: what is the base case, and how does the recursive call make the problem smaller?
      </NoteParagraph>

      <NoteSectionTitle id="tail-recursion">6. Tail Recursion</NoteSectionTitle>
      <NoteParagraph>
        A recursive call is in tail position when its result is returned directly. Tail-recursive functions can run in constant stack space because the current frame is no longer needed after the recursive call.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
let factorial n =
  let rec loop acc k =
    if k = 0 then acc
    else loop (acc * k) (k - 1)
  in
  loop 1 n
        `}
      />
      <NoteParagraph>
        The accumulator carries the partial answer. This is the same mathematical computation as ordinary recursion, but the control flow is friendlier to the runtime stack.
      </NoteParagraph>

      <NoteSectionTitle id="lists-tuples-and-records">7. Lists, Tuples, and Records</NoteSectionTitle>
      <NoteParagraph>
        OCaml offers several lightweight ways to group data. Lists store variable-length sequences of one type. Tuples group a fixed number of values by position. Records group named fields.
      </NoteParagraph>
      <NoteTable
        headers={['structure', 'best use']}
        rows={[
          ['list', 'recursive sequence processing where all elements share one type'],
          ['tuple', 'small fixed group where positions are obvious'],
          ['record', 'named product type with clear field meaning'],
        ]}
      />

      <NoteSectionTitle id="pattern-matching">8. Pattern Matching</NoteSectionTitle>
      <NoteParagraph>
        Pattern matching inspects the shape of a value and binds names to its pieces. It is especially valuable with lists, options, and variants because the code mirrors the data definition.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
let rec length xs =
  match xs with
  | [] -> 0
  | _ :: rest -> 1 + length rest
        `}
      />
      <NoteParagraph>
        Exhaustiveness matters. If every possible shape is handled, the type checker can protect you from missing cases when data definitions evolve.
      </NoteParagraph>

      <NoteSectionTitle id="options-and-variants">9. Options and Variants</NoteSectionTitle>
      <NoteParagraph>
        An option represents a value that may be absent. A variant represents one value chosen from a fixed set of cases, optionally carrying data in each case.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
type shape =
  | Circle of float
  | Rectangle of float * float

let area s =
  match s with
  | Circle r -> Float.pi *. r *. r
  | Rectangle (w, h) -> w *. h
        `}
      />
      <NoteParagraph>
        Variants are algebraic data types. They are a direct bridge between programming practice and formal language/type-system ideas.
      </NoteParagraph>

      <NoteSectionTitle id="higher-order-functions">10. Higher-Order Functions</NoteSectionTitle>
      <NoteParagraph>
        A higher-order function takes a function as input or returns a function as output. This lets code separate traversal structure from the action performed at each element.
      </NoteParagraph>
      <NoteTable
        headers={['function', 'meaning']}
        rows={[
          ['map', 'transform each element independently'],
          ['filter', 'keep elements satisfying a predicate'],
          ['fold', 'combine a sequence into one accumulated result'],
          ['compose', 'build a pipeline from smaller functions'],
        ]}
      />
      <CodeBlock
        language="ocaml"
        code={`
let squares = List.map (fun x -> x * x) [1; 2; 3; 4]
let evens = List.filter (fun x -> x mod 2 = 0) [1; 2; 3; 4]
let sum = List.fold_left ( + ) 0 [1; 2; 3; 4]
        `}
      />

      <NoteSectionTitle id="modules-and-interfaces">11. Modules and Interfaces</NoteSectionTitle>
      <NoteParagraph>
        Modules organize names and hide implementation details. Interface files can expose a smaller public surface than the implementation file, which helps preserve abstraction boundaries.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
module type STACK = sig
  type 'a t
  val empty : 'a t
  val push : 'a -> 'a t -> 'a t
  val pop : 'a t -> ('a * 'a t) option
end
        `}
      />
      <NoteParagraph>
        A module signature is like a contract. It says what operations exist without forcing clients to know how the data is represented internally.
      </NoteParagraph>

      <NoteSectionTitle id="testing-ocaml-code">12. Testing OCaml Code</NoteSectionTitle>
      <NoteParagraph>
        Functional code is often easy to test because pure functions depend only on inputs and return outputs without hidden mutation. Good tests still need edge cases, empty structures, nested structures, and failure paths.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`
let test_length_empty _ =
  assert_equal 0 (length [])

let test_length_nonempty _ =
  assert_equal 3 (length [1; 2; 3])
        `}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Recursive Test Cases">
          <NoteParagraph className="mb-0">
            Test one data constructor at a time, then test combinations. For recursive data, make sure each base case and recursive case is exercised directly.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}

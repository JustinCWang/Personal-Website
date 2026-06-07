/**
 * C Programming Notes Page
 * A standalone note for C as a systems language: compilation, memory, pointers, arrays, structs, allocation, and safety.
 */

import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  BulletList,
  CodeBlock,
  MathBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteTable,
  RelatedNotes,
} from '../../../components/notes';

export default function CProgrammingNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="C Programming"
        subtitle="A systems-level guide to C: compilation, memory layout, integer representation, pointers, arrays, strings, structs, dynamic allocation, undefined behavior, and debugging."
      />

      <RelatedNotes
        links={[
          { href: '/notes/computer-systems', label: 'Computer Systems', note: 'Use C to make memory hierarchy, processes, I/O, and machine representation concrete.' },
          { href: '/notes/intro-java', label: 'Java and Data Structures', note: 'Compare C manual memory and pointer behavior with managed object references.' },
        ]}
      />

      <NoteSectionTitle id="c-overview">1. C Overview</NoteSectionTitle>
      <NoteParagraph>
        C is close enough to hardware that ordinary source code exposes memory layout, object representation, pointer arithmetic, and process-level resource management. It gives typed views over bytes, but it does not automatically prevent out-of-bounds access, dangling pointers, double frees, integer mistakes, or lifetime bugs.
      </NoteParagraph>

      <NoteSectionTitle id="compilation-linking-and-translation-units">2. Compilation, Linking, and Translation Units</NoteSectionTitle>
      <NoteParagraph>
        A C build is usually split into preprocessing, compilation, assembly, and linking. Each <code>.c</code> file becomes a translation unit after preprocessing. The linker then connects object files and libraries into an executable.
      </NoteParagraph>
      <CodeBlock
        language="bash"
        code={`
gcc -Wall -Wextra -g -c vector.c
gcc -Wall -Wextra -g -c main.c
gcc -o app main.o vector.o
        `}
      />
      <NoteTable
        headers={['phase', 'what happens']}
        rows={[
          ['preprocess', 'expand includes and macros'],
          ['compile', 'type-check and translate C to lower-level code'],
          ['assemble', 'produce object code'],
          ['link', 'resolve symbols across object files and libraries'],
        ]}
      />

      <NoteSectionTitle id="c-memory-model">3. C Memory Model</NoteSectionTitle>
      <NoteParagraph>
        A running C program stores data in several broad regions. The exact layout is platform-dependent, but stack, heap, static storage, and code storage are the main regions to track when debugging lifetime and ownership bugs.
      </NoteParagraph>
      <NoteTable
        headers={['region', 'stores', 'lifetime']}
        rows={[
          ['stack', 'local variables and call frames', 'until the function returns'],
          ['heap', 'dynamically allocated blocks', 'until explicitly freed'],
          ['static/global', 'global variables and static locals', 'entire program execution'],
          ['text/code', 'machine instructions', 'loaded with the program'],
        ]}
      />
      <NoteParagraph>
        Bugs often come from using a pointer after its lifetime ended or assuming a value lives in a region different from where it actually lives.
      </NoteParagraph>

      <NoteSectionTitle id="types-integers-and-object-representation">4. Types, Integers, and Object Representation</NoteSectionTitle>
      <NoteParagraph>
        C types determine how bytes are interpreted. The same bytes can mean an integer, character, pointer, struct field, or floating-point value depending on the type used to read them.
      </NoteParagraph>
      <MathBlock math="\text{address}+\text{index}\cdot\text{sizeof(element)}" />
      <NoteTable
        headers={['issue', 'why it matters']}
        rows={[
          ['signed vs unsigned', 'comparisons and wraparound can surprise you when types mix'],
          ['two\'s complement', 'common signed integer representation, but overflow rules still matter'],
          ['sizeof', 'measures bytes occupied by a type or object'],
          ['alignment', 'some types must start at addresses with particular multiples'],
        ]}
      />

      <NoteSectionTitle id="pointers-and-indirection">5. Pointers and Indirection</NoteSectionTitle>
      <NoteParagraph>
        A pointer stores an address. Dereferencing a pointer reads or writes the object at that address. This creates one of C's central powers: code can operate directly on caller-owned memory.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
        `}
      />
      <BulletList>
        <li><code>&x</code> means the address of <code>x</code>.</li>
        <li><code>*p</code> means the object pointed to by <code>p</code>.</li>
        <li><code>NULL</code> means the pointer does not point to a valid object.</li>
        <li>A pointer is only useful when you know what it points to and how long that object remains alive.</li>
      </BulletList>

      <NoteSectionTitle id="arrays-pointer-arithmetic-and-strings">6. Arrays, Pointer Arithmetic, and Strings</NoteSectionTitle>
      <NoteParagraph>
        An array stores elements contiguously. In many expressions, an array name decays to a pointer to its first element. Pointer arithmetic advances by element size, not by one raw byte.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`
int values[4] = {10, 20, 30, 40};
int *p = values;
printf("%d\\n", *(p + 2)); // 30
        `}
      />
      <NoteParagraph>
        A C string is a sequence of characters terminated by the null byte <code>'\0'</code>. String functions depend on that terminator; forgetting it can make code read past the intended buffer.
      </NoteParagraph>

      <NoteSectionTitle id="structs-and-data-layout">7. Structs and Data Layout</NoteSectionTitle>
      <NoteParagraph>
        A struct groups fields into one memory layout. Field order can affect padding because the compiler may insert unused bytes to satisfy alignment constraints.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`
typedef struct {
    size_t len;
    size_t cap;
    int *data;
} IntVec;
        `}
      />
      <NoteParagraph>
        Structs are the foundation for explicit data structures in C. Linked lists, dynamic arrays, hash tables, and trees all depend on struct layout plus pointer ownership.
      </NoteParagraph>

      <NoteSectionTitle id="dynamic-memory-allocation">8. Dynamic Memory Allocation</NoteSectionTitle>
      <NoteParagraph>
        Dynamic allocation asks the heap for memory whose lifetime outlives the current function call. The tradeoff is manual responsibility: every successful allocation needs a clear owner and eventually a matching release.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`
int *data = malloc(n * sizeof *data);
if (data == NULL) {
    return -1;
}

/* use data */

free(data);
        `}
      />
      <NoteTable
        headers={['bug', 'meaning']}
        rows={[
          ['memory leak', 'allocated memory is never freed'],
          ['double free', 'the same allocation is freed twice'],
          ['use after free', 'code reads or writes memory after ownership ended'],
          ['buffer overflow', 'code writes past the allocated object'],
        ]}
      />

      <NoteSectionTitle id="pointer-declarations-and-operator-precedence">9. Pointer Declarations and Operator Precedence</NoteSectionTitle>
      <NoteParagraph>
        C declarations are easiest to read from the identifier outward. Parentheses matter because arrays, functions, and pointers bind differently.
      </NoteParagraph>
      <NoteTable
        headers={['declaration', 'read as']}
        rows={[
          [<code>int *p</code>, 'p is a pointer to int'],
          [<code>int *a[10]</code>, 'a is an array of 10 pointers to int'],
          [<code>int (*a)[10]</code>, 'a is a pointer to an array of 10 int values'],
          [<code>int (*f)(int)</code>, 'f is a pointer to a function taking int and returning int'],
        ]}
      />

      <NoteSectionTitle id="undefined-behavior-and-safety">10. Undefined Behavior and Safety</NoteSectionTitle>
      <NoteParagraph>
        Undefined behavior means the language standard places no requirements on what happens. The compiler may assume it never occurs and optimize around that assumption. This is why some C bugs seem to disappear or change shape under optimization.
      </NoteParagraph>
      <BulletList>
        <li>Do not read uninitialized variables.</li>
        <li>Do not access arrays out of bounds.</li>
        <li>Do not dereference invalid, null, or dangling pointers.</li>
        <li>Do not violate object lifetimes or incompatible type aliasing rules.</li>
        <li>Check allocation and I/O results before using them.</li>
      </BulletList>

      <NoteSectionTitle id="debugging-c-programs">11. Debugging C Programs</NoteSectionTitle>
      <NoteParagraph>
        C debugging is most effective when you combine compiler warnings, sanitizers, a debugger, and small reproducible tests. Warnings should be treated as design feedback, not cosmetic noise.
      </NoteParagraph>
      <CodeBlock
        language="bash"
        code={`
gcc -Wall -Wextra -Wpedantic -g -fsanitize=address,undefined main.c -o app
./app
gdb ./app
        `}
      />
      <NoteParagraph>
        AddressSanitizer catches many memory errors at runtime. UndefinedBehaviorSanitizer catches many invalid operations. They do not prove correctness, but they turn many silent C failures into visible failures.
      </NoteParagraph>
    </NotesLayout>
  );
}

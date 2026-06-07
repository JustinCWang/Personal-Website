/**
 * Go Notes Page
 * A standalone note for Go syntax, runtime behavior, concurrency, testing, and networked service patterns.
 */

import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  BulletList,
  CodeBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteTable,
  NoteTopicBlock,
  NoteTopicGroup,
  RelatedNotes,
} from '../../../components/notes';

export default function GoNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Go"
        subtitle="A practical guide to Go as a systems and distributed-services language: types, packages, errors, goroutines, channels, context, testing, and networked service design."
      />

      <RelatedNotes
        links={[
          { href: '/notes/distributed-systems', label: 'Distributed Systems', note: 'Use Go concepts here when implementing RPC, Raft, replication, and fault-tolerant services.' },
          { href: '/notes/computer-systems', label: 'Computer Systems', note: 'Connect Go runtime behavior to processes, memory, I/O, and concurrency.' },
        ]}
      />

      <NoteSectionTitle id="go-overview">1. Go Overview</NoteSectionTitle>
      <NoteParagraph>
        Go is designed around small syntax, fast compilation, explicit error handling, built-in concurrency, and a standard library that is strong enough for networked services. A Go program is organized into packages, and each package exposes exported names while hiding unexported implementation details.
      </NoteParagraph>
      <NoteParagraph>
        Go concurrency uses lightweight goroutines inside one process. That makes it easy to start concurrent work, but shared state, cancellation, lifetime, and failure still need explicit design.
      </NoteParagraph>

      <NoteSectionTitle id="modules-packages-and-imports">2. Modules, Packages, and Imports</NoteSectionTitle>
      <NoteParagraph>
        A module is a versioned collection of packages. A package is the compilation and namespace unit. Files in the same directory usually share one package declaration and compile together.
      </NoteParagraph>
      <CodeBlock
        language="go"
        code={`
module example.com/kvstore

go 1.22
        `}
      />
      <NoteTable
        headers={['term', 'meaning']}
        rows={[
          ['module', 'versioned project boundary described by go.mod'],
          ['package', 'namespace and compilation unit'],
          ['import path', 'stable name used to import a package'],
          ['exported identifier', 'a name starting with a capital letter, visible outside the package'],
        ]}
      />

      <NoteSectionTitle id="types-values-and-zero-values">3. Types, Values, and Zero Values</NoteSectionTitle>
      <NoteParagraph>
        Go is statically typed. Variables have known types at compile time, but short declarations can infer the type from the initializer. Every type also has a zero value, which makes allocation and initialization predictable.
      </NoteParagraph>
      <NoteTable
        headers={['type family', 'zero value', 'notes']}
        rows={[
          ['numbers', '0', 'integers and floats are not implicitly interchangeable'],
          ['bool', 'false', 'used directly in conditionals'],
          ['string', 'empty string', 'immutable sequence of bytes, usually UTF-8 text'],
          ['pointers, slices, maps, channels, funcs, interfaces', 'nil', 'nil means no underlying value or backing structure'],
          ['struct', 'field-wise zero value', 'useful for configuration and plain data records'],
        ]}
      />

      <NoteSectionTitle id="functions-methods-and-interfaces">4. Functions, Methods, and Interfaces</NoteSectionTitle>
      <NoteParagraph>
        Functions are ordinary values. Methods are functions with a receiver. Interfaces describe behavior by method set rather than inheritance, so a type satisfies an interface implicitly when it has the required methods.
      </NoteParagraph>
      <CodeBlock
        language="go"
        code={`
type Store interface {
    Get(key string) (string, bool)
    Put(key string, value string) error
}

type MemoryStore struct {
    data map[string]string
}

func (s *MemoryStore) Get(key string) (string, bool) {
    value, ok := s.data[key]
    return value, ok
}
        `}
      />
      <NoteParagraph>
        Interfaces are most useful at package boundaries. Accept interfaces where you need behavior; return concrete types when callers benefit from the actual implementation.
      </NoteParagraph>

      <NoteSectionTitle id="structs-pointers-and-receivers">5. Structs, Pointers, and Receivers</NoteSectionTitle>
      <NoteParagraph>
        A struct groups fields into one value. A pointer stores an address to another value. Pointer receivers let a method mutate the receiver or avoid copying large values.
      </NoteParagraph>
      <NoteTable
        headers={['choice', 'when it fits']}
        rows={[
          ['value receiver', 'small immutable values, methods that do not mutate receiver state'],
          ['pointer receiver', 'methods that mutate state, large structs, types containing synchronization primitives'],
          ['struct pointer', 'shared mutable object or optional object reference'],
          ['plain struct value', 'copyable data with clear ownership'],
        ]}
      />

      <NoteSectionTitle id="errors-defer-and-resource-lifetime">6. Errors, Defer, and Resource Lifetime</NoteSectionTitle>
      <NoteParagraph>
        Go handles expected failure with explicit error return values. This makes failure paths visible at call sites, which is especially important in networked systems where I/O, timeouts, retries, and partial failure are normal.
      </NoteParagraph>
      <CodeBlock
        language="go"
        code={`
file, err := os.Open(path)
if err != nil {
    return fmt.Errorf("open %s: %w", path, err)
}
defer file.Close()
        `}
      />
      <BulletList>
        <li><code>defer</code> schedules cleanup at function exit.</li>
        <li><code>%w</code> wraps an error while preserving the original cause for <code>errors.Is</code> and <code>errors.As</code>.</li>
        <li>Panics should be exceptional; ordinary service failure should usually be returned as an error.</li>
      </BulletList>

      <NoteSectionTitle id="slices-maps-and-strings">7. Slices, Maps, and Strings</NoteSectionTitle>
      <NoteParagraph>
        A slice is a view over an array: pointer, length, and capacity. A map is a hash table. A string is immutable bytes. These types are convenient, but their reference-like behavior matters when sharing data.
      </NoteParagraph>
      <NoteTable
        headers={['structure', 'pitfall', 'safe use']}
        rows={[
          ['slice', 'appending can reallocate or can mutate shared backing arrays', 'copy when ownership should be independent'],
          ['map', 'not safe for concurrent writes', 'guard with a mutex or use a single owner goroutine'],
          ['string', 'indexing reads bytes, not Unicode characters', 'range over runes when processing text characters'],
        ]}
      />

      <NoteSectionTitle id="goroutines-and-the-scheduler">8. Goroutines and the Scheduler</NoteSectionTitle>
      <NoteParagraph>
        A goroutine is a lightweight concurrent execution unit managed by the Go runtime. Many goroutines can run on fewer operating-system threads. The scheduler multiplexes goroutines onto available threads.
      </NoteParagraph>
      <NoteParagraph>
        Goroutines are cheap, not free. A goroutine needs a clear lifetime: what starts it, what stops it, how it reports errors, and what happens when its owner no longer needs the result.
      </NoteParagraph>
      <CodeBlock
        language="go"
        code={`
go func() {
    if err := serveReplica(ctx, id); err != nil {
        log.Printf("replica %d stopped: %v", id, err)
    }
}()
        `}
      />

      <NoteSectionTitle id="channels-and-select">9. Channels and Select</NoteSectionTitle>
      <NoteParagraph>
        A channel is a typed communication path between goroutines. Sending on a channel transfers a value. Depending on buffering, it can also synchronize sender and receiver.
      </NoteParagraph>
      <NoteTable
        headers={['channel form', 'behavior']}
        rows={[
          ['unbuffered', 'send waits until a receiver is ready; receiver waits until a sender is ready'],
          ['buffered', 'send waits only when the buffer is full; receive waits only when empty'],
          ['closed', 'receivers can keep draining buffered values; sends panic'],
          ['nil', 'send and receive block forever, useful only when deliberately disabling select cases'],
        ]}
      />
      <CodeBlock
        language="go"
        code={`
select {
case msg := <-inbox:
    handle(msg)
case <-ctx.Done():
    return ctx.Err()
case <-time.After(200 * time.Millisecond):
    return ErrTimeout
}
        `}
      />

      <NoteSectionTitle id="mutexes-waitgroups-and-context">10. Mutexes, WaitGroups, and Context</NoteSectionTitle>
      <NoteParagraph>
        Not every concurrent program should be channel-heavy. Mutexes protect shared state. WaitGroups wait for a collection of goroutines. Context carries cancellation, deadlines, and request-scoped values through call chains.
      </NoteParagraph>
      <NoteTable
        headers={['tool', 'use it for', 'avoid using it for']}
        rows={[
          ['sync.Mutex', 'protecting a small invariant around shared memory', 'long blocking I/O while holding the lock'],
          ['sync.WaitGroup', 'waiting for goroutines to finish', 'communicating results or errors by itself'],
          ['context.Context', 'cancellation, deadlines, request scope', 'optional parameters or business data'],
        ]}
      />

      <NoteSectionTitle id="race-conditions-and-testing">11. Race Conditions and Testing</NoteSectionTitle>
      <NoteParagraph>
        A data race occurs when two goroutines access the same memory at the same time, at least one access writes, and there is no synchronization. Data races are correctness bugs, not just performance issues.
      </NoteParagraph>
      <CodeBlock
        language="bash"
        code={`
go test ./...
go test -race ./...
go test -run TestLeaderElection -count=100 ./raft
        `}
      />
      <NoteParagraph>
        Repetition matters because concurrency bugs often depend on timing. Good tests also control timeouts, isolate shared state, and expose deterministic hooks where possible.
      </NoteParagraph>

      <NoteSectionTitle id="rpc-and-networked-services-in-go">12. RPC and Networked Services in Go</NoteSectionTitle>
      <NoteParagraph>
        Go is strong for services because networking, HTTP, JSON, binary encoding, timeouts, and concurrency are all standard patterns. The hard part is not opening a socket; it is designing behavior when messages are delayed, duplicated, lost, reordered, or retried.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="RPC Failure Cases">
          <BulletList className="mb-0">
            <li>Retries require idempotent operations or request identifiers.</li>
            <li>Timeouts and cancellation should flow through <code>context.Context</code>.</li>
            <li>Handlers that mutate shared state need synchronization.</li>
            <li>Wrapped errors preserve the low-level cause while adding service context.</li>
            <li>Persistent state must preserve invariants across crashes and restarts.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="serialization-state-and-compatibility">13. Serialization, State, and Compatibility</NoteSectionTitle>
      <NoteParagraph>
        Distributed programs turn in-memory values into bytes and later reconstruct them. Serialization choices affect compatibility, performance, error handling, and long-term storage.
      </NoteParagraph>
      <NoteTable
        headers={['format', 'good for', 'tradeoff']}
        rows={[
          ['JSON', 'debuggable APIs and simple config', 'larger and less strict than binary formats'],
          ['gob', 'Go-to-Go internal encoding', 'not a language-neutral public interface'],
          ['protocol buffers', 'stable schemas and multi-language systems', 'requires schema management and generated code'],
        ]}
      />

      <NoteSectionTitle id="go-in-distributed-systems">14. Go in Distributed Systems</NoteSectionTitle>
      <NoteParagraph>
        Go does not remove distributed-system complexity. It gives good primitives for expressing that complexity: goroutines for background roles, channels for events, mutexes for shared state, contexts for cancellation, and tests that can run many service instances in one process.
      </NoteParagraph>
      <NoteTable
        headers={['distributed concern', 'Go mechanism']}
        rows={[
          ['timeouts', 'pass context through every RPC path'],
          ['replica state', 'guard invariants with a mutex and keep critical sections short'],
          ['background work', 'tie goroutine lifetime to a parent context'],
          ['flaky tests', 'avoid sleeps as synchronization; use channels or condition checks'],
          ['debugging', 'log node id, term, request id, and state transition together'],
        ]}
      />
    </NotesLayout>
  );
}

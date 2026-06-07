/**
 * Web Frameworks and Tooling Notes Page
 * A standalone note for React, Next.js, backend frameworks, API clients, ORMs, testing, Docker, Git, and deployment.
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

export default function WebFrameworksToolingNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Web Frameworks and Tooling"
        subtitle="A practical guide to modern web application tools: React, hooks, Next.js rendering, API clients, FastAPI, Flask, SQLAlchemy, testing, Docker, Git, and deployment."
      />

      <RelatedNotes
        links={[
          { href: '/notes/web-development', label: 'Web Development', note: 'Use these tools after the web fundamentals: HTML, CSS, JavaScript, DOM, HTTP, URLs, and APIs.' },
          { href: '/notes/sql', label: 'SQL', note: 'Connect backend APIs and ORMs to relational query design.' },
          { href: '/notes/information-security', label: 'Information Security', note: 'Connect framework usage to browser security, sessions, CSRF, CORS, OAuth, and secure deployment.' },
        ]}
      />

      <NoteSectionTitle id="web-frameworks-overview">1. Web Frameworks Overview</NoteSectionTitle>
      <NoteParagraph>
        Web frameworks organize repeated application concerns: routing, rendering, state, forms, validation, API calls, data access, authentication, testing, and deployment. They sit on top of platform APIs such as HTML, CSS, JavaScript, HTTP, browsers, servers, and databases.
      </NoteParagraph>

      <NoteSectionTitle id="react-component-model">2. React Component Model</NoteSectionTitle>
      <NoteParagraph>
        React builds interfaces from components. A component is a function of props and state that returns a description of UI. React then reconciles changes and updates the browser DOM.
      </NoteParagraph>
      <CodeBlock
        language="tsx"
        code={`
function UserBadge({ name, role }: { name: string; role: string }) {
  return (
    <section>
      <h2>{name}</h2>
      <p>{role}</p>
    </section>
  );
}
        `}
      />
      <NoteTable
        headers={['idea', 'meaning']}
        rows={[
          ['props', 'inputs passed from a parent component'],
          ['state', 'component-owned data that can change over time'],
          ['render', 'derive UI from current props and state'],
          ['composition', 'build larger UI from smaller components'],
        ]}
      />

      <NoteSectionTitle id="state-effects-and-hooks">3. State, Effects, and Hooks</NoteSectionTitle>
      <NoteParagraph>
        Hooks are functions that let components use React features. <code>useState</code> stores local state. <code>useEffect</code> synchronizes with something outside React, such as a subscription, timer, browser API, or network request.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Derived Values vs Effects">
          <NoteParagraph className="mb-0">
            If a value can be derived during render from props and state, do not put it in an effect. Effects are for synchronization with external systems, not for ordinary data flow.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <CodeBlock
        language="tsx"
        code={`
useEffect(() => {
  const id = window.setInterval(refresh, 1000);
  return () => window.clearInterval(id);
}, []);
        `}
      />

      <NoteSectionTitle id="forms-and-client-state">4. Forms and Client State</NoteSectionTitle>
      <NoteParagraph>
        Forms are where UI state, validation, accessibility, and server interaction meet. Controlled inputs keep form values in React state; uncontrolled inputs let the DOM own the current value until submission.
      </NoteParagraph>
      <NoteTable
        headers={['state type', 'examples', 'where it belongs']}
        rows={[
          ['local UI state', 'open modal, selected tab, input draft', 'component state'],
          ['server cache', 'loaded user profile, paginated results', 'query/cache library or loader'],
          ['URL state', 'search query, page number, filters', 'route params or query string'],
          ['global app state', 'theme, authenticated user, feature flags', 'context or small store'],
        ]}
      />

      <NoteSectionTitle id="api-clients-fetch-and-axios">5. API Clients: Fetch and Axios</NoteSectionTitle>
      <NoteParagraph>
        API client code should make request construction, error handling, cancellation, and response parsing consistent. The browser's <code>fetch</code> is built in; Axios adds convenience features like interceptors and default JSON handling.
      </NoteParagraph>
      <CodeBlock
        language="ts"
        code={`
async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(\`request failed: \${response.status}\`);
  }
  return response.json() as Promise<T>;
}
        `}
      />
      <BulletList>
        <li>Handle non-200 responses explicitly.</li>
        <li>Abort requests that are no longer needed.</li>
        <li>Separate transport errors from application-level errors.</li>
        <li>Keep API shapes typed at boundaries.</li>
      </BulletList>

      <NoteSectionTitle id="next-js-rendering-models">6. Next.js Rendering Models</NoteSectionTitle>
      <NoteParagraph>
        Next.js adds file-based routing, server-side rendering, static generation, API routes or server actions, and conventions for loading data. The main design choice is where code runs: server, client, build time, or request time.
      </NoteParagraph>
      <NoteTable
        headers={['rendering mode', 'use it when']}
        rows={[
          ['static generation', 'content can be prepared before requests'],
          ['server-side rendering', 'HTML depends on request-time data or auth'],
          ['client-side rendering', 'highly interactive UI can load after the shell'],
          ['server components', 'data access and rendering can stay on the server'],
          ['client components', 'the component needs browser state, effects, or event handlers'],
        ]}
      />

      <NoteSectionTitle id="hydration-and-server-client-boundaries">7. Hydration and Server/Client Boundaries</NoteSectionTitle>
      <NoteParagraph>
        Hydration connects server-rendered HTML to client-side JavaScript so the page becomes interactive. A hydration mismatch means the HTML produced on the server does not match what the client expects.
      </NoteParagraph>
      <BulletList>
        <li>Do not read browser-only values during server render without guarding them.</li>
        <li>Keep server-only secrets and database access out of client components.</li>
        <li>Use client components for event handlers and browser APIs.</li>
        <li>Prefer server components for data fetching that should not ship to the browser.</li>
      </BulletList>

      <NoteSectionTitle id="backend-frameworks-fastapi-and-flask">8. Backend Frameworks: FastAPI and Flask</NoteSectionTitle>
      <NoteParagraph>
        Backend frameworks map HTTP requests to application functions. Flask is minimal and flexible. FastAPI adds strong request/response typing, validation, generated OpenAPI docs, and async-friendly patterns.
      </NoteParagraph>
      <NoteTable
        headers={['framework', 'strength']}
        rows={[
          ['Flask', 'small surface area, explicit routing, flexible project structure'],
          ['FastAPI', 'type-driven validation, automatic docs, dependency injection, async support'],
        ]}
      />
      <CodeBlock
        language="python"
        code={`
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}
        `}
      />

      <NoteSectionTitle id="orms-and-sqlalchemy">9. ORMs and SQLAlchemy</NoteSectionTitle>
      <NoteParagraph>
        An object-relational mapper, or ORM, maps application objects to database rows. SQLAlchemy can help manage models, sessions, relationships, and migrations, but it does not remove the need to understand SQL.
      </NoteParagraph>
      <NoteTable
        headers={['ORM benefit', 'risk']}
        rows={[
          ['central model definitions', 'models can drift from actual schema if migrations are sloppy'],
          ['query composition in application code', 'generated SQL may be inefficient or surprising'],
          ['relationship loading', 'accidental N+1 queries can hurt performance'],
          ['transaction/session management', 'hidden lifetime bugs if sessions are shared incorrectly'],
        ]}
      />

      <NoteSectionTitle id="testing-web-applications">10. Testing Web Applications</NoteSectionTitle>
      <NoteParagraph>
        Web testing works best as a pyramid: many fast unit tests, fewer integration tests, and a small number of end-to-end tests for critical flows.
      </NoteParagraph>
      <NoteTable
        headers={['test level', 'checks']}
        rows={[
          ['unit', 'pure functions, components with controlled props, validation helpers'],
          ['integration', 'API route with database, component with data loader, auth middleware'],
          ['end-to-end', 'browser-level interaction across frontend and backend'],
        ]}
      />
      <CodeBlock
        language="bash"
        code={`
npm test
pytest
npm run lint
npm run build
        `}
      />

      <NoteSectionTitle id="docker-and-containers">11. Docker and Containers</NoteSectionTitle>
      <NoteParagraph>
        A container packages an application with its runtime dependencies and filesystem environment. Docker is useful for matching development, test, and deployment environments, especially when services depend on databases or queues.
      </NoteParagraph>
      <CodeBlock
        language="dockerfile"
        code={`
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
        `}
      />
      <NoteParagraph>
        Containers do not automatically make an app production-ready. You still need correct secrets management, logging, health checks, resource limits, and update strategy.
      </NoteParagraph>

      <NoteSectionTitle id="git-version-control">12. Git Version Control</NoteSectionTitle>
      <NoteParagraph>
        Git tracks source history as commits. A useful commit is small enough to review, tied to a coherent change, and easy to revert if the change is wrong.
      </NoteParagraph>
      <BulletList>
        <li>Commit one coherent change at a time.</li>
        <li>Write messages that explain intent, not just touched files.</li>
        <li>Review diffs before pushing.</li>
        <li>Keep generated files and secrets out of commits.</li>
        <li>Use branches and pull requests to make review explicit.</li>
      </BulletList>

      <NoteSectionTitle id="deployment-and-operations">13. Deployment and Operations</NoteSectionTitle>
      <NoteParagraph>
        Deployment turns a working app into a running service. The important details are configuration, failure behavior, logs, health checks, migrations, and rollback.
      </NoteParagraph>
      <NoteTable
        headers={['concern', 'implementation detail']}
        rows={[
          ['configuration', 'use environment variables or managed config, not hard-coded secrets'],
          ['observability', 'log useful request ids, error causes, and latency'],
          ['health checks', 'expose readiness and liveness where the platform supports it'],
          ['migrations', 'make database changes backward-compatible when possible'],
          ['rollback', 'know what version and schema state can be safely restored'],
        ]}
      />
    </NotesLayout>
  );
}

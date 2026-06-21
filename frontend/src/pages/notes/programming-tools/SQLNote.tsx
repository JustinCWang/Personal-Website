/**
 * SQL Notes Page
 * A standalone note for SQL query writing, joins, aggregation, subqueries, data modification, nulls, and transaction-aware usage.
 */

import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  BulletList,
  CodeBlock,
  InlineMath,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteTable,
  RelatedNotes,
} from '../../../components/notes';
import { SqlLogicalQueryRunner } from './ProgrammingToolAlgorithmRunners';

export default function SQLNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="SQL"
        subtitle="A practical guide to relational querying: SELECT, filtering, joins, grouping, subqueries, set operations, modification commands, nulls, transactions, and query reasoning."
      />

      <RelatedNotes
        links={[
          { href: '/notes/database-systems', label: 'Database Systems', note: 'Use SQL here as the concrete language for relational algebra, joins, indexing, and transactions.' },
          { href: '/notes/web-frameworks-and-tooling', label: 'Web Frameworks and Tooling', note: 'Connect SQL to backend APIs, ORMs, migrations, and application data access.' },
        ]}
      />

      <NoteSectionTitle id="sql-overview">1. SQL Overview</NoteSectionTitle>
      <NoteParagraph>
        SQL is a declarative language for working with relational data. A SQL query transforms relations: clauses choose source rows, combine tables, filter rows, form groups, compute output columns, and order results.
      </NoteParagraph>
      <NoteParagraph>
        The written order is not the same as the logical evaluation order, and neither is guaranteed to be the physical execution order chosen by the optimizer.
      </NoteParagraph>

      <NoteSectionTitle id="select-from-where">2. SELECT, FROM, and WHERE</NoteSectionTitle>
      <NoteParagraph>
        A basic query chooses source tables with <code>FROM</code>, filters rows with <code>WHERE</code>, and projects output expressions with <code>SELECT</code>.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
SELECT student_id, name, graduation_year
FROM students
WHERE graduation_year >= 2026;
        `}
      />
      <NoteTable
        headers={['clause', 'job']}
        rows={[
          ['FROM', 'choose the input relation or joined relations'],
          ['WHERE', 'filter individual rows before grouping'],
          ['SELECT', 'choose output columns or computed expressions'],
          ['ORDER BY', 'sort final output rows'],
        ]}
      />

      <NoteSectionTitle id="logical-query-processing-order">3. Logical Query Processing Order</NoteSectionTitle>
      <NoteParagraph>
        SQL is written in a human-friendly order, but its logical meaning is closer to a pipeline. This matters when deciding whether a name or aggregate is available in a clause.
      </NoteParagraph>
      <NoteTable
        headers={['logical stage', 'effect']}
        rows={[
          ['FROM and JOIN', 'build the source row set'],
          ['WHERE', 'remove rows before grouping'],
          ['GROUP BY', 'form groups'],
          ['HAVING', 'remove groups after aggregation'],
          ['SELECT', 'compute output expressions'],
          ['ORDER BY and LIMIT', 'sort and restrict the final result'],
        ]}
      />
      <SqlLogicalQueryRunner />

      <NoteSectionTitle id="predicates-patterns-and-three-valued-logic">4. Predicates, Patterns, and Three-Valued Logic</NoteSectionTitle>
      <NoteParagraph>
        SQL predicates can evaluate to true, false, or unknown because <code>NULL</code> represents missing or inapplicable information. Rows pass a <code>WHERE</code> filter only when the predicate is true.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
SELECT *
FROM users
WHERE email IS NOT NULL
  AND email LIKE '%@example.com';
        `}
      />
      <BulletList>
        <li>Use <code>IS NULL</code> and <code>IS NOT NULL</code>; do not compare null with <code>=</code>.</li>
        <li><code>LIKE</code> supports pattern matching with <code>%</code> for any sequence and <code>_</code> for one character.</li>
        <li><code>IN</code>, <code>BETWEEN</code>, and boolean combinations make filters easier to read.</li>
      </BulletList>

      <NoteSectionTitle id="joins">5. Joins</NoteSectionTitle>
      <NoteParagraph>
        A join combines rows from two relations. The join condition says which rows correspond. Inner joins keep matching pairs; outer joins preserve unmatched rows from one or both sides.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers
  ON customers.id = orders.customer_id;
        `}
      />
      <NoteTable
        headers={['join', 'meaning']}
        rows={[
          ['INNER JOIN', 'keep only matching row pairs'],
          ['LEFT JOIN', 'keep every left row; fill missing right fields with NULL'],
          ['RIGHT JOIN', 'keep every right row; fill missing left fields with NULL'],
          ['FULL OUTER JOIN', 'keep rows from both sides even when unmatched'],
          ['CROSS JOIN', 'Cartesian product: every left row paired with every right row'],
        ]}
      />

      <NoteSectionTitle id="aggregation-group-by-and-having">6. Aggregation, GROUP BY, and HAVING</NoteSectionTitle>
      <NoteParagraph>
        Aggregation summarizes many rows into one value. <code>GROUP BY</code> forms one output group per distinct key. <code>HAVING</code> filters groups after aggregate values exist.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS revenue
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 3;
        `}
      />
      <NoteParagraph>
        A common mistake is trying to use an aggregate in <code>WHERE</code>. Use <code>WHERE</code> to filter rows before groups, and <code>HAVING</code> to filter groups after aggregation.
      </NoteParagraph>

      <NoteSectionTitle id="subqueries-and-exists">7. Subqueries and EXISTS</NoteSectionTitle>
      <NoteParagraph>
        A subquery is a query nested inside another query. It can produce a scalar value, a set of values, or be used to test existence. <code>EXISTS</code> is often the clearest way to ask whether a matching row exists.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
SELECT c.id, c.name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
);
        `}
      />

      <NoteSectionTitle id="set-operations">8. Set Operations</NoteSectionTitle>
      <NoteParagraph>
        SQL can combine whole query results using set-like operations. The participating queries need compatible column counts and types.
      </NoteParagraph>
      <NoteTable
        headers={['operation', 'effect']}
        rows={[
          ['UNION', 'combine rows and remove duplicates'],
          ['UNION ALL', 'combine rows and keep duplicates'],
          ['INTERSECT', 'keep rows appearing in both results'],
          ['EXCEPT', 'keep rows from the first result that are absent from the second'],
        ]}
      />

      <NoteSectionTitle id="data-definition-and-modification">9. Data Definition and Modification</NoteSectionTitle>
      <NoteParagraph>
        SQL includes commands for defining schema and changing data. Schema operations affect table structure; modification operations affect rows.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  balance INTEGER NOT NULL CHECK (balance >= 0)
);

INSERT INTO accounts (id, email, balance)
VALUES (1, 'a@example.com', 500);
        `}
      />
      <NoteTable
        headers={['category', 'commands']}
        rows={[
          ['schema', 'CREATE, ALTER, DROP'],
          ['data', 'INSERT, UPDATE, DELETE'],
          ['permissions', 'GRANT, REVOKE'],
          ['transactions', 'BEGIN, COMMIT, ROLLBACK'],
        ]}
      />

      <NoteSectionTitle id="constraints-and-keys">10. Constraints and Keys</NoteSectionTitle>
      <NoteParagraph>
        Constraints keep the database from accepting impossible or inconsistent states. They are better than application-only checks because every client must respect them.
      </NoteParagraph>
      <NoteTable
        headers={['constraint', 'purpose']}
        rows={[
          ['PRIMARY KEY', 'uniquely identifies a row and cannot be null'],
          ['FOREIGN KEY', 'requires a value to reference an existing row in another table'],
          ['UNIQUE', 'prevents duplicate values for a column or column group'],
          ['NOT NULL', 'requires a value to be present'],
          ['CHECK', 'enforces a row-level predicate'],
        ]}
      />

      <NoteSectionTitle id="transactions-and-isolation-in-sql">11. Transactions and Isolation in SQL</NoteSectionTitle>
      <NoteParagraph>
        A transaction groups operations into one logical unit. The goal is that either all changes commit or none do, and concurrent transactions do not break application invariants.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
        `}
      />
      <NoteParagraph>
        Isolation levels control what one transaction may observe about another. Stronger isolation is easier to reason about but can reduce concurrency or increase aborts.
      </NoteParagraph>

      <NoteSectionTitle id="query-reasoning-and-performance">12. Query Reasoning and Performance</NoteSectionTitle>
      <NoteParagraph>
        SQL performance depends on data size, indexes, join order, selectivity, statistics, and physical execution plans. The same query can be fast or slow depending on whether the database can avoid scanning unnecessary rows.
      </NoteParagraph>
      <BulletList>
        <li>Index columns used for selective filters, joins, and ordering, but remember indexes cost write time and storage.</li>
        <li>Inspect execution plans when performance matters.</li>
        <li>Prefer clear relational logic first, then optimize with evidence.</li>
        <li>Watch for accidental Cartesian products caused by missing join predicates.</li>
        <li>Use <InlineMath math="N" /> and result cardinality thinking: how many rows exist at each logical stage?</li>
      </BulletList>
    </NotesLayout>
  );
}

/**
 * Test file for QueryBuilder
 * Run with: node --loader=esmock test-query-builder.js
 */
import { QueryBuilder } from './src/utils/queryBuilder.js';

// Create test data
const users = [
  {
    id: '1',
    username: 'alice_user',
    email: 'alice@gmail.com',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    username: 'bob_engineer',
    email: 'bob@gmail.com',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    username: 'charlie_manager',
    email: 'charlie@company.com',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    username: 'diana_admin',
    email: 'diana@company.com',
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    username: 'eve_developer',
    email: 'eve@test.dev',
    createdAt: new Date('2024-05-01'),
  },
];

console.log('🧪 Testing QueryBuilder...\n');

// Test 1: Basic pagination
console.log('=== Test 1: Basic Pagination (limit=2) ===');
let query = QueryBuilder.fromQuery({ limit: '2', page: '1' });
let result = query.execute(users);
console.log(`Found ${result.data.length} users, total: ${result.total}, pages: ${result.pages}`);
console.log('Users:', result.data.map((u) => u.username));

// Test 2: Global search
console.log('\n=== Test 2: Global Search (search=admin) ===');
query = QueryBuilder.fromQuery({ search: 'admin' });
result = query.execute(users);
console.log(`Found ${result.data.length} matching users`);
console.log('Users:', result.data.map((u) => u.username));

// Test 3: Filter by email endsWith
console.log('\n=== Test 3: Filter email_endsWith=gmail.com ===');
query = QueryBuilder.fromQuery({ email_endsWith: 'gmail.com' });
result = query.execute(users);
console.log(`Found ${result.data.length} gmail users`);
console.log('Emails:', result.data.map((u) => u.email));

// Test 4: Filter by company domain
console.log('\n=== Test 4: Filter email_endsWith=company.com ===');
query = QueryBuilder.fromQuery({ email_endsWith: 'company.com' });
result = query.execute(users);
console.log(`Found ${result.data.length} company users`);
console.log('Emails:', result.data.map((u) => u.email));

// Test 5: Sorting descending by username
console.log('\n=== Test 5: Sort by -username (descending) ===');
query = QueryBuilder.fromQuery({ sort: '-username' });
result = query.execute(users);
console.log('Sorted usernames:', result.data.map((u) => u.username));

// Test 6: Sorting by email
console.log('\n=== Test 6: Sort by email (ascending) ===');
query = QueryBuilder.fromQuery({ sort: 'email' });
result = query.execute(users);
console.log('Sorted emails:', result.data.map((u) => u.email));

// Test 7: Complex query - search + filter + sort + paginate
console.log('\n=== Test 7: Complex Query (search + sort + limit) ===');
query = QueryBuilder.fromQuery({
  search: 'er',
  sort: '-createdAt',
  limit: '2',
});
result = query.execute(users);
console.log(`Found ${result.data.length} users matching "er"`);
console.log('Results:', result.data.map((u) => `${u.username} (${u.email})`));

// Test 8: Filter by email contains
console.log('\n=== Test 8: Filter email_contains=gmail ==='  );
query = QueryBuilder.fromQuery({ email_contains: 'gmail' });
result = query.execute(users);
console.log(`Found ${result.data.length} users`);
console.log('Users:', result.data.map((u) => u.email));

// Test 9: Multiple filters
console.log('\n=== Test 9: Multiple Filters (email_contains=@gmail + username_contains=user) ===');
query = QueryBuilder.fromQuery({
  email_contains: '@gmail',
  username_contains: 'user',
});
result = query.execute(users);
console.log(`Found ${result.data.length} users`);
console.log('Users:', result.data.map((u) => u.username));

// Test 10: Filter with startsWith
console.log('\n=== Test 10: Filter username_startsWith=d ===');
query = QueryBuilder.fromQuery({ username_startsWith: 'd' });
result = query.execute(users);
console.log(`Found ${result.data.length} users`);
console.log('Users:', result.data.map((u) => u.username));

console.log('\n✅ All QueryBuilder tests completed!');

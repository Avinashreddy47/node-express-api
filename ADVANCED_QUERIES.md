# Advanced Query Documentation

## Overview

The API now supports powerful filtering, sorting, and pagination capabilities through query parameters. You can combine multiple filters, sort by multiple fields, and paginate results efficiently.

## Query Parameter Format

### Basic Structure

```
/api/v1/users?[filter_params]&sort=[fields]&page=[number]&limit=[number]&search=[term]
```

---

## Features

### 1. **Pagination**

Control which page and how many results per page.

```bash
# Get page 2 with 20 results per page
GET /api/v1/users?page=2&limit=20

# Default: page=1, limit=10
GET /api/v1/users
```

**Parameters:**
- `page` - Page number (default: 1, min: 1)
- `limit` - Results per page (default: 10, min: 1, max: 100)

**Response includes:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 2. **Global Search**

Search across multiple text fields at once.

```bash
# Search for "john" in username and email
GET /api/v1/users?search=john

# Specify which fields to search in
GET /api/v1/users?search=john&searchFields=username,email
```

**Parameters:**
- `search` - Search term (max 100 characters)
- `searchFields` - Comma-separated fields to search (default: username, email)

---

### 3. **Field Filtering**

Filter by specific fields using operators.

#### Operators Supported

| Operator | Symbol | Type | Example |
|----------|--------|------|---------|
| **Equal** | `_eq` | Any | `username_eq=john` |
| **Not Equal** | `_ne` | Any | `username_ne=admin` |
| **Contains** | `_contains` | String | `username_contains=john` |
| **Starts With** | `_startsWith` | String | `email_startsWith=john` |
| **Ends With** | `_endsWith` | String | `email_endsWith=@gmail.com` |
| **Greater Than** | `_gt` | Number | `age_gt=18` |
| **Greater Than or Equal** | `_gte` | Number/Date | `createdAt_gte=2024-01-01` |
| **Less Than** | `_lt` | Number | `age_lt=65` |
| **Less Than or Equal** | `_lte` | Number/Date | `updatedAt_lte=2024-12-31` |
| **In** | `_in` | Any | `status_in=active,pending,review` |
| **Between** | `_between` | Number | `age_between=18,65` |

#### Examples

```bash
# Exact match
GET /api/v1/users?email_eq=john@example.com

# Partial match
GET /api/v1/users?username_contains=john

# Case-insensitive substring search
GET /api/v1/users?email_contains=gmail

# Starts with
GET /api/v1/users?username_startsWith=admin

# Ends with
GET /api/v1/users?email_endsWith=@company.com

# Date range filtering
GET /api/v1/users?createdAt_gte=2024-01-01&createdAt_lte=2024-12-31

# Multiple values (IN operator)
GET /api/v1/users?status_in=active,pending,review
```

---

### 4. **Sorting**

Sort results by one or multiple fields in ascending or descending order.

**Format:**
- Ascending (default): `sort=fieldName`
- Descending: `sort=-fieldName`
- Multiple fields: `sort=field1,-field2,field3`

**Examples:**

```bash
# Sort by creation date (newest first)
GET /api/v1/users?sort=-createdAt

# Sort by username (A-Z), then by creation date (newest first)
GET /api/v1/users?sort=username,-createdAt

# Sort by email descending
GET /api/v1/users?sort=-email
```

**Available sort fields:**
- `username`
- `email`
- `createdAt`
- `updatedAt`
- `id`

---

## Complex Query Examples

### Example 1: Recent Active Users Matching Search

```bash
GET /api/v1/users?search=john&createdAt_gte=2024-06-01&sort=-createdAt&page=1&limit=20
```

Finds users with "john" in username/email, created after June 1st, sorted by newest, page 1 with 20 per page.

### Example 2: Gmail Users by Signup Date

```bash
GET /api/v1/users?email_endsWith=@gmail.com&sort=-createdAt&page=1&limit=50
```

Finds all Gmail users, sorted by signup date (newest first).

### Example 3: User Search with Date Range

```bash
GET /api/v1/users?username_startsWith=admin&createdAt_gte=2024-01-01&createdAt_lte=2024-06-30&sort=username
```

Finds admin users created between January and June 2024, sorted alphabetically.

### Example 4: Multiple Email Domains

```bash
GET /api/v1/users?email_endsWith=@company.com&email_endsWith=@partner.com&sort=email&limit=100
```

Finds users from company.com and partner.com domains.

### Example 5: Pagination with Complex Filters

```bash
GET /api/v1/users?search=test&email_contains=@&sort=-createdAt&page=3&limit=25
```

Search for "test", ensure email exists, sort by newest, get page 3 with 25 items per page.

---

## Response Format

All list endpoints return paginated responses:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "username": "johndoe",
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "timestamp": "2024-01-15T10:35:20.456Z"
}
```

---

## cURL Examples

### Get first 20 users sorted by newest

```bash
curl "http://localhost:3000/api/v1/users?limit=20&sort=-createdAt" \
  -H "Authorization: Bearer <token>"
```

### Search for "john" and paginate

```bash
curl "http://localhost:3000/api/v1/users?search=john&page=2&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Find gmail users created in 2024

```bash
curl "http://localhost:3000/api/v1/users?email_endsWith=@gmail.com&createdAt_gte=2024-01-01&sort=username" \
  -H "Authorization: Bearer <token>"
```

### Complex query: search + filter + sort + paginate

```bash
curl "http://localhost:3000/api/v1/users?search=admin&username_contains=super&createdAt_gte=2024-01-01&sort=-createdAt,username&page=1&limit=25" \
  -H "Authorization: Bearer <token>"
```

---

## JavaScript/Fetch Examples

### Basic pagination

```javascript
const response = await fetch(
  'http://localhost:3000/api/v1/users?page=2&limit=20',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const data = await response.json();
console.log(data.data); // users array
console.log(data.pagination); // pagination info
```

### Advanced search with multiple filters

```javascript
const params = new URLSearchParams({
  search: 'john',
  email_contains: '@gmail.com',
  createdAt_gte: '2024-01-01',
  sort: '-createdAt',
  page: 1,
  limit: 20
});

const response = await fetch(
  `http://localhost:3000/api/v1/users?${params}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const data = await response.json();
```

### Helper function for queries

```javascript
async function queryUsers(filters = {}, sort = [], page = 1, limit = 10) {
  const params = new URLSearchParams({
    ...filters,
    sort: sort.join(','),
    page,
    limit
  });

  const response = await fetch(
    `http://localhost:3000/api/v1/users?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  return response.json();
}

// Usage
const results = await queryUsers(
  {
    email_contains: '@gmail.com',
    createdAt_gte: '2024-01-01'
  },
  ['-createdAt', 'username'],
  2,
  20
);
```

---

## Best Practices

1. **Always specify limit** - Set appropriate limits to avoid large datasets
2. **Use searchFields** - Specify which fields to search when using global search
3. **Combine filters** - Use multiple filters together for precise results
4. **Sort efficiently** - Sort by indexed fields when possible (id, createdAt)
5. **Paginate large results** - Don't fetch all data at once
6. **Case insensitive** - All string searches are case-insensitive
7. **URL encode** - Properly encode special characters in query params

---

## Performance Notes

- Filtering happens client-side in this version (in-memory store)
- In production with a database, queries would be optimized by the DB engine
- Maximum limit is 100 to prevent performance issues
- Combine filters to reduce result set before sorting
- Consider caching frequently-used queries

---

## Future Enhancements

- [ ] Database integration for server-side filtering
- [ ] Full-text search with scoring
- [ ] Range aggregations
- [ ] Custom field definitions
- [ ] Saved filter presets
- [ ] Query performance metrics

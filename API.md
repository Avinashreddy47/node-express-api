# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Health Check

### Endpoint
```
GET /health
```

### Response
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## Authentication

### Register (Public)

**Request**
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securepass123"
}
```

**Validation Rules**
- `email`: Valid email format (required)
- `username`: Alphanumeric, 3-30 characters (required)
- `password`: Minimum 6 characters (required)

**Success Response (201 Created)**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error Response (409 Conflict)**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "User with this email or username already exists",
  "errors": null,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error Response (400 Bad Request)**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "must be a valid email",
    "password": "must be at least 6 characters long"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

### Login (Public)

**Request**
```http
POST /login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Validation Rules**
- `username`: String (required)
- `password`: String (required)

**Success Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "john_doe",
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInVzZXJuYW1lIjoiam9obl9kb2UiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDU0NTEwNDUsImV4cCI6MTcwNTUzNzQ0NX0.signature"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error Response (401 Unauthorized)**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials",
  "errors": null,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## Protected Endpoints

**All endpoints below require:**
```http
Authorization: Bearer <token>
```

Where `<token>` is the JWT token received from login.

---

### Get All Users (Paginated)

**Request**
```http
GET /users?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters**
- `page`: Page number (default: 1, min: 1)
- `limit`: Results per page (default: 10, min: 1, max: 100)

**Success Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "john_doe",
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

### Get User by ID

**Request**
```http
GET /users/{userId}
Authorization: Bearer <token>
```

**Path Parameters**
- `userId`: UUID of the user

**Success Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Error Response (404 Not Found)**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "errors": null,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

### Update User

**Request**
```http
PUT /users/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "username": "new_username",
  "password": "newpassword123"
}
```

**Path Parameters**
- `userId`: UUID of the user

**Body (at least one field required)**
- `email`: Valid email format (optional)
- `username`: Alphanumeric, 3-30 characters (optional)
- `password`: Minimum 6 characters (optional)

**Success Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newemail@example.com",
    "username": "new_username",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:55:30.456Z"
  },
  "timestamp": "2024-01-15T10:55:30.456Z"
}
```

---

### Delete User

**Request**
```http
DELETE /users/{userId}
Authorization: Bearer <token>
```

**Path Parameters**
- `userId`: UUID of the user

**Success Response (200 OK)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": null,
  "timestamp": "2024-01-15T10:56:15.789Z"
}
```

**Error Response (404 Not Found)**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "errors": null,
  "timestamp": "2024-01-15T10:56:15.789Z"
}
```

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed or malformed request |
| 401 | Unauthorized | Invalid/missing authentication |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## Authentication Header Format

All protected endpoints require the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token expires after **24 hours** by default (configurable in `.env`).

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "securepass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepass123"
  }'
```

### Get Users (replace TOKEN)
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer TOKEN"
```

### Create User
```bash
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "jane_doe",
    "password": "password123"
  }'
```

### Update User (replace USERID and TOKEN)
```bash
curl -X PUT http://localhost:3000/api/v1/users/USERID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "updated@example.com"
  }'
```

### Delete User (replace USERID and TOKEN)
```bash
curl -X DELETE http://localhost:3000/api/v1/users/USERID \
  -H "Authorization: Bearer TOKEN"
```

---

## Response Structure

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Descriptive message",
  "data": { /* response data */ },
  "timestamp": "ISO-8601 timestamp"
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": { /* field-level errors */ },
  "timestamp": "ISO-8601 timestamp"
}
```

**Paginated:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Message",
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "timestamp": "ISO-8601 timestamp"
}
```

---

## Best Practices

1. **Always include Content-Type header** for POST/PUT requests
2. **Store token securely** (localStorage in browser, secure storage in mobile)
3. **Include Bearer prefix** in Authorization header
4. **Handle token expiration** - implement refresh token rotation
5. **Validate on client** before sending requests
6. **Log errors** for debugging
7. **Test with different input** to ensure validation works

---

**API Version**: v1  
**Last Updated**: 2024

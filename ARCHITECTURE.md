# Architecture & Design Patterns

## 1. Layered Architecture

```
┌─────────────────────────────────────────┐
│         Client Request (HTTP)           │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Request Middleware  │
        │  - Logging           │
        │  - Parsing           │
        │  - CORS              │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Validation Middleware│
        │  - Schema Validation │
        │  - Error Handling    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Auth Middleware    │
        │  - JWT Verification  │
        │  - Token Extraction  │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    Route Matching    │
        │  - URL Matching      │
        │  - Method Matching   │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    Controllers       │
        │  - Request Handler   │
        │  - Response Format   │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │     Services         │
        │  - Business Logic    │
        │  - Data Operations   │
        │  - Validations       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Data/Repository     │
        │  - In-Memory Store   │
        │  - Database (future) │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Error Handler      │
        │  - Status Code       │
        │  - Error Envelope    │
        └──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      HTTP Response (JSON)               │
└─────────────────────────────────────────┘
```

## 2. Request Flow Example

**POST /api/v1/users/login**

```
1. requestLogger.js
   └─> Logs: [2024-01-15] POST /api/v1/login 200 45ms

2. express.json()
   └─> Parses JSON body → req.body = { username, password }

3. cors()
   └─> Adds CORS headers

4. validateRequest(schemas.login)
   └─> Validates { username, password } against schema
   └─> If invalid → 400 error response
   └─> If valid → req.body updated with validated data

5. userRoutes.js (router.post('/login', ...))
   └─> Matches route

6. UserController.login(req, res, next)
   └─> Extracts: req.body.username, req.body.password
   └─> Calls: UserService.authenticateUser()

7. UserService.authenticateUser(username, password)
   └─> Searches in-memory store
   └─> If not found → throw ApiError(401)
   └─> If found → return sanitized user

8. Back in Controller
   └─> Generates JWT token via jwtUtils.generateToken()
   └─> Formats response via response.successResponse()
   └─> Sends: res.json(...)

9. Response Middleware
   └─> Logs response
   └─> Sends HTTP 200 with JSON body

If any error thrown → errorHandler catches → sends error response
```

## 3. Middleware Chain Pattern

```javascript
// This is the order middleware is applied:

app.use(requestLogger); // ← First: Log all requests
app.use(express.json()); // ← Parse JSON body
app.use(express.urlencoded()); // ← Parse URL-encoded body
app.use(cors()); // ← Handle CORS

// Routes registered here
app.use(`/api/${version}`, userRoutes);

// Post-route middleware
app.use(notFoundHandler); // ← Catch 404s
app.use(errorHandler); // ← Last: Handle all errors
```

**Key: Order Matters!**

- Middleware processes requests sequentially
- Each calls `next()` to pass control
- Error handlers must be last

## 4. Service Layer Benefits

### Before (without services)

```javascript
// Controller code gets messy
app.get('/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }
  // Business logic mixed with HTTP
  const { password, ...sanitized } = user;
  res.json(sanitized);
});
```

### After (with services)

```javascript
// Clean separation
app.get('/users/:id', (req, res, next) => {
  try {
    const user = UserService.getUserById(req.params.id);
    res.json(successResponse(user));
  } catch (error) {
    next(error); // Let error handler deal with it
  }
});

// Service is testable and reusable
class UserService {
  static getUserById(id) {
    const user = users.get(id);
    if (!user) throw new ApiError('Not found', 404);
    return this._sanitizeUser(user);
  }
}
```

## 5. Validation Pattern

```javascript
// Joi schema definition
const userCreate = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

// Reusable middleware factory
const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json(errorResponse('Validation failed', 400, errors));
  }
  req.body = value; // Use validated data
  next();
};

// Use in routes
router.post(
  '/register',
  validateRequest(userCreate), // ← Validates before reaching controller
  UserController.register,
);
```

## 6. Error Handling Pattern

### Custom Error Class

```javascript
class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
```

### In Service

```javascript
static createUser(data) {
  if (userExists) {
    throw new ApiError('User already exists', 409);
  }
  // ...
}
```

### In Controller

```javascript
static async register(req, res, next) {
  try {
    const user = UserService.createUser(req.body);
    res.status(201).json(successResponse(user, 'Created', 201));
  } catch (error) {
    next(error); // ← Pass to error handler
  }
}
```

### Global Error Handler

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(errorResponse(message, statusCode, err.errors));
};

app.use(errorHandler); // ← Last middleware
```

## 7. JWT Authentication Flow

```
Client Request with Token:
    ↓
Authorization: Bearer eyJhbGciOiJIUzI1NiI...
    ↓
authMiddleware checks header
    ↓
extractTokenFromHeader() gets token
    ↓
verifyToken() validates signature & expiration
    ↓
If valid: req.user = decoded payload → next()
If invalid: return 401 error → stop
    ↓
Controller can access req.user for current user
```

## 8. Response Envelope Pattern

All responses follow one of three patterns:

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    /* actual response */
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "must be valid email",
    "password": "must be at least 6 characters"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved",
  "data": [
    /* items */
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## 9. Configuration Management

```javascript
// config/index.js loads from .env
import dotenv from 'dotenv';
dotenv.config();

const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Usage throughout app
import config from './config';

if (config.isDevelopment) {
  console.error('Error details:', err);
}

const token = jwt.sign(payload, config.jwt.secret, {
  expiresIn: config.jwt.expiresIn,
});
```

## 10. Extensibility Example

Adding a new resource (e.g., Tasks):

```
1. Create Service: src/services/taskService.js
   ├─ Business logic
   └─ Data operations

2. Create Controller: src/controllers/taskController.js
   ├─ HTTP handlers
   └─ Call service methods

3. Create Routes: src/routes/taskRoutes.js
   ├─ Middleware chain
   ├─ Route definitions
   └─ Controller binding

4. Register in app.js:
   └─ app.use(`/api/${version}`, taskRoutes);

Result: New resource fully integrated with:
  ✓ Authentication
  ✓ Validation
  ✓ Error handling
  ✓ Logging
  ✓ Response formatting
```

---

## Cross-Runtime Design Patterns

This architecture translates to:

### Java/Spring Boot

- Service layer → `@Service` beans
- Controllers → `@RestController` endpoints
- Middleware → `@Component` filters
- Validation → `@Valid` + annotations

### Go

- Service interface → `interface` types
- Middleware → `http.Handler` chain
- Error handling → custom error types
- Config → struct with env tags

### Python

- Service class → reusable methods
- Flask Blueprint → route groups
- Decorator → middleware pattern
- Dataclass → validation with Pydantic

---

**Key Takeaway**: Separation of concerns and layering makes code testable, maintainable, and portable across frameworks and languages.

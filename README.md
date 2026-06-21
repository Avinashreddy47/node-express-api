# Node.js Express RESTful API

A production-structured RESTful API server built with **Node.js** and **Express**, demonstrating layered architecture, cross-runtime backend design patterns, and enterprise-level best practices.

## 🏗️ Architecture Overview

### Layered Architecture

```
Request → Middleware Chain → Route Handler → Controller → Service → Response
          ↓
       - Logging
       - CORS
       - Body Parsing
       - Validation
       - Authentication
       - Error Handling
```

### Project Structure

```
src/
├── config/
│   └── index.js                 # Environment-based configuration
├── middleware/
│   ├── authMiddleware.js        # JWT authentication & authorization
│   ├── validationMiddleware.js  # Request validation with Joi
│   ├── errorHandler.js          # Centralized error handling
│   └── requestLogger.js         # HTTP request logging
├── routes/
│   └── userRoutes.js            # API endpoint definitions
├── controllers/
│   └── userController.js        # HTTP request/response handling
├── services/
│   └── userService.js           # Business logic layer
├── utils/
│   ├── jwtUtils.js              # JWT token operations
│   └── response.js              # Structured response envelopes
├── app.js                       # Express app configuration
└── server.js                    # Application entry point
```

## 🚀 Key Features

### 1. **Modular Route Handlers**

- Clean separation of concerns
- Composable middleware chain
- Route-level and global middleware support

### 2. **Composable Middleware Chain**

- **JWT Authentication**: Token-based access control with Bearer scheme
- **Request Validation**: Schema-based validation using Joi
- **Centralized Error Handling**: Consistent error response envelopes
- **Request Logging**: HTTP method, status, and duration tracking
- **CORS**: Cross-origin resource sharing

### 3. **Structured JSON Contracts**

- Consistent success response envelope:

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Success",
    "data": {...},
    "timestamp": "2024-01-15T10:30:45.123Z"
  }
  ```

- Consistent error response envelope:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Validation failed",
    "errors": {
      "email": "must be valid email"
    },
    "timestamp": "2024-01-15T10:30:45.123Z"
  }
  ```

### 4. **HTTP Status Semantics**

- `201 Created`: Resource creation
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing/invalid authentication
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server errors

### 5. **Environment-Based Configuration**

- Development/production modes
- JWT secret and expiration management
- Port and logging level configuration
- Automatic dotenv loading

## 📦 Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **HTTP Headers**: CORS
- **Configuration**: Dotenv

## 🛠️ Installation & Setup

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Environment Configuration

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
# JWT_SECRET=your-production-secret-key
# NODE_ENV=production
```

## 🏃 Running the Server

### Development (with auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

Server starts on `http://localhost:3000` by default.

## 📖 API Endpoints

### Health Check

```http
GET /health
```

### Authentication

#### Register

```http
POST /api/v1/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepass123"
}
```

Response (201 Created):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2024-01-15T10:30:45.123Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### Login

```http
POST /api/v1/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepass123"
}
```

Response (200 OK):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "johndoe",
      "createdAt": "2024-01-15T10:30:45.123Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### User Management (Protected)

All endpoints below require `Authorization: Bearer <token>` header.

#### Get All Users (Paginated)

```http
GET /api/v1/users?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Get User by ID

```http
GET /api/v1/users/{userId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Update User

```http
PUT /api/v1/users/{userId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "email": "newemail@example.com",
  "username": "newusername"
}
```

#### Delete User

```http
DELETE /api/v1/users/{userId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Security Features

1. **JWT Authentication**: Token-based stateless authentication
2. **Request Validation**: Schema validation prevents invalid data
3. **Error Masking**: Production errors don't leak sensitive information
4. **CORS Protection**: Configurable cross-origin access
5. **Environment Secrets**: Sensitive data via environment variables

## 🎯 Design Patterns Demonstrated

### 1. **MVC/MVS Architecture**

- **Models**: User domain objects
- **Views**: Structured JSON response envelopes
- **Controllers**: Request handlers with HTTP semantics
- **Services**: Business logic and data operations

### 2. **Middleware Chain Pattern**

Composable middleware that processes requests sequentially:

```javascript
app.use(requestLogger); // 1. Log request
app.use(express.json()); // 2. Parse body
app.use(cors()); // 3. Handle CORS
app.use(authMiddleware); // 4. Authenticate
app.use(validateRequest); // 5. Validate
// Handle route
// 6. Error handling
```

### 3. **Dependency Injection**

Services receive dependencies through static methods, enabling testability.

### 4. **Error Response Standardization**

All errors return consistent envelope with status code, message, and validation details.

### 5. **Factory Pattern**

`validateRequest()` creates validation middleware dynamically based on schema.

## 🔄 Cross-Runtime Compatibility

This project demonstrates patterns applicable across:

- **Java/Spring Boot**: Service layer, DTO validation, exception handling
- **Go**: Interface-based design, middleware chaining, error types
- **Python**: Blueprint structure, middleware decorators

## 📝 Example: Adding a New Resource

1. **Create Service** (`src/services/productService.js`):

```javascript
export class ProductService {
  static create(data) {
    /* business logic */
  }
  static getById(id) {
    /* business logic */
  }
}
```

2. **Create Controller** (`src/controllers/productController.js`):

```javascript
export class ProductController {
  static async create(req, res, next) {
    try {
      const product = ProductService.create(req.body);
      res.status(201).json(successResponse(product, 'Created', 201));
    } catch (error) {
      next(error);
    }
  }
}
```

3. **Create Routes** (`src/routes/productRoutes.js`):

```javascript
router.post(
  '/products',
  authMiddleware,
  validateRequest(schemas.productCreate),
  ProductController.create,
);
```

4. **Add to App** (`src/app.js`):

```javascript
app.use(`/api/${config.api.version}`, productRoutes);
```

## 🧪 Testing Example

```bash
# Register user
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'

# Use returned token
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <token>"
```

## 📚 Production Considerations

- **Database Integration**: Replace in-memory store with PostgreSQL/MongoDB
- **Password Hashing**: Use bcrypt for password security
- **Rate Limiting**: Add express-rate-limit middleware
- **API Documentation**: Integrate Swagger/OpenAPI
- **Testing**: Add Jest/Mocha test suites
- **Logging**: Implement Winston or Morgan for structured logging
- **Monitoring**: Add APM with Datadog or New Relic

## 🤝 Contributing

This is an educational reference implementation for building production-grade APIs.

## 📄 License

ISC

---

**Created**: 2024–2025  
**Technology Stack**: Node.js, Express.js, JavaScript, REST APIs  
**Pattern Focus**: Layered architecture, middleware chains, structured contracts, HTTP semantics

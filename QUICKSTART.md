## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if needed (default values work for development)
```

### 3. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
╔════════════════════════════════════════════════╗
║         Node.js Express API Server              ║
╠════════════════════════════════════════════════╣
║ Environment: development                         ║
║ Port:        3000                                ║
║ Version:     v1                                  ║
╚════════════════════════════════════════════════╝
```

### 4. Test the API

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Register a User
```bash
curl -X POST http://localhost:3000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "securepass123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepass123"
  }'
```

Store the returned `token` for authenticated requests.

#### Get All Users (Replace TOKEN with your token)
```bash
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer TOKEN"
```

### 5. Understanding the Code

**File Flow for a Request:**
1. `server.js` → Entry point
2. `app.js` → Express app with middleware chain
3. `middleware/` → Request processing (logging, auth, validation)
4. `routes/userRoutes.js` → Route matching
5. `controllers/userController.js` → HTTP handler
6. `services/userService.js` → Business logic
7. `utils/response.js` → Format response back to client

### 6. Key Concepts

- **Services**: Business logic, reusable across routes
- **Controllers**: Handle HTTP requests/responses
- **Middleware**: Process requests in sequence
- **Validation**: Joi schemas ensure data integrity
- **JWT**: Secure stateless authentication
- **Error Handling**: Centralized with consistent responses

### 7. Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Check node version
node --version
```

### 8. Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Module not found?**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Invalid token?**
- Ensure you're using the token from login response
- Prefix with "Bearer " in Authorization header
- Tokens expire after 24h (configurable in .env)

---

See `README.md` for complete documentation.

# Generic Backend Template

A production-ready Express.js backend template with PostgreSQL, Auth0 authentication, and a clean service layer architecture.

## Features

- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database
- **Auth0** - Enterprise-grade authentication
- **Service Layer** - Clean separation of concerns
- **Input Validation** - Request validation with express-validator
- **Error Handling** - Comprehensive error handling middleware
- **Security** - Helmet, CORS, rate limiting
- **Logging** - Request logging middleware
- **Database Migrations** - Easy database setup and management

## Project Structure

```
src/
├── app.js                 # Main application entry point
├── database/
│   ├── connection.js      # PostgreSQL connection pool
│   ├── schema.js          # Database schema definitions
│   ├── migrate.js         # Database migration script
│   └── seed.js            # Sample data seeding
├── middleware/
│   ├── auth.js            # Auth0 JWT authentication
│   ├── errorHandler.js    # Global error handling
│   └── requestLogger.js    # Request logging
├── models/
│   ├── BaseModel.js       # Base model with CRUD operations
│   └── User.js            # User model
├── routes/
│   └── userRoutes.js      # User API routes
└── services/
    ├── UserService.js     # User business logic
    └── Auth0Service.js     # Auth0 management operations
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Auth0 account

### 2. Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env
```

### 3. Environment Configuration

Update `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=generic_backend_db
DB_USER=postgres
DB_PASSWORD=password

# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

```bash
# Create database
createdb generic_backend_db

# Run migrations
npm run migrate

# Seed sample data (optional)
npm run seed
```

### 5. Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new API in your Auth0 dashboard
3. Note down the API identifier (audience)
4. Create a Machine-to-Machine application
5. Update your `.env` file with the Auth0 credentials

### 6. Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

- `GET /health` - Server health status

### User Management

- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/active` - Get active users only
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/:id` - Update user by ID (admin)
- `DELETE /api/users/:id` - Delete user by ID (admin)
- `PATCH /api/users/:id/activate` - Activate user
- `PATCH /api/users/:id/deactivate` - Deactivate user

### Authentication

All API endpoints (except `/health`) require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Example API Usage

### Get All Users

```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:3000/api/users?limit=10&offset=0"
```

### Get Current User Profile

```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:3000/api/users/me"
```

### Update User Profile

```bash
curl -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"first_name": "John", "last_name": "Doe"}' \
     "http://localhost:3000/api/users/me"
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Scripts

- `npm start` - Start the application
- `npm run dev` - Start in development mode with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed sample data
- `npm test` - Run tests

## Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Rate Limiting** - Prevents abuse with request rate limiting
- **Input Validation** - Validates all incoming requests
- **JWT Authentication** - Secure token-based authentication
- **SQL Injection Protection** - Parameterized queries

## Error Handling

The application includes comprehensive error handling:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Database errors (500)
- Custom business logic errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this template for your projects!

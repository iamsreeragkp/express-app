# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

All API endpoints (except `/health`) require authentication using Auth0 JWT tokens.

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

- **GET** `/health`
- **Description**: Check server health status
- **Authentication**: None required
- **Response**:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### User Management

#### Get All Users

- **GET** `/api/users`
- **Description**: Get all users with pagination
- **Authentication**: Required
- **Query Parameters**:
  - `limit` (optional): Number of users to return (1-100, default: 100)
  - `offset` (optional): Number of users to skip (default: 0)
  - `is_active` (optional): Filter by active status (true/false)
- **Response**:

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "auth0_id": "auth0|...",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "profile_picture": "https://...",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 10,
      "limit": 100,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### Get Active Users

- **GET** `/api/users/active`
- **Description**: Get only active users
- **Authentication**: Required
- **Query Parameters**: Same as Get All Users
- **Response**: Same format as Get All Users

#### Get Current User Profile

- **GET** `/api/users/me`
- **Description**: Get current authenticated user's profile
- **Authentication**: Required
- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "auth0_id": "auth0|...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://...",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get User by ID

- **GET** `/api/users/:id`
- **Description**: Get user by UUID
- **Authentication**: Required
- **Path Parameters**:
  - `id`: User UUID
- **Response**: Same format as Get Current User Profile

#### Update Current User Profile

- **PUT** `/api/users/me`
- **Description**: Update current user's profile
- **Authentication**: Required
- **Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "https://example.com/avatar.jpg"
}
```

- **Response**: Same format as Get Current User Profile

#### Update User by ID

- **PUT** `/api/users/:id`
- **Description**: Update user by UUID (admin only)
- **Authentication**: Required
- **Path Parameters**:
  - `id`: User UUID
- **Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "https://example.com/avatar.jpg",
  "is_active": true
}
```

- **Response**: Same format as Get Current User Profile

#### Delete User

- **DELETE** `/api/users/:id`
- **Description**: Delete user by UUID (admin only)
- **Authentication**: Required
- **Path Parameters**:
  - `id`: User UUID
- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "auth0_id": "auth0|...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://...",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User deleted successfully"
}
```

#### Activate User

- **PATCH** `/api/users/:id/activate`
- **Description**: Activate a user
- **Authentication**: Required
- **Path Parameters**:
  - `id`: User UUID
- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "auth0_id": "auth0|...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://...",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User activated successfully"
}
```

#### Deactivate User

- **PATCH** `/api/users/:id/deactivate`
- **Description**: Deactivate a user
- **Authentication**: Required
- **Path Parameters**:
  - `id`: User UUID
- **Response**:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "auth0_id": "auth0|...",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://...",
    "is_active": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User deactivated successfully"
}
```

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "msg": "Invalid user ID format",
      "param": "id",
      "location": "params"
    }
  ]
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "error": "Invalid token or token expired"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": "User not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## Example Usage

### Get current user profile

```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:3000/api/users/me"
```

### Update user profile

```bash
curl -X PUT \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"first_name": "John", "last_name": "Doe"}' \
     "http://localhost:3000/api/users/me"
```

### Get all users with pagination

```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:3000/api/users?limit=10&offset=0"
```

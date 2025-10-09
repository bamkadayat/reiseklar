# Reiseklar Backend API Documentation

## Base URL
`http://localhost:8080/api`

## Authentication Flow

### 1. Sign Up
**POST** `/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "clxxx...",
    "email": "user@example.com",
    "message": "Verification code sent to your email"
  }
}
```

---

### 2. Verify Email
**POST** `/auth/verify`

Verify email address with the 4-digit code sent via email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "1234"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Verification code expires in 10 minutes
- Maximum 5 attempts allowed
- After successful verification, user receives JWT tokens

---

### 3. Resend Verification Code
**POST** `/auth/resend-code`

Resend the verification code if it expired or wasn't received.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Verification code resent"
  }
}
```

**Notes:**
- Maximum 3 resend attempts allowed

---

### 4. Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Email must be verified before login
- Access token expires in 15 minutes
- Refresh token expires in 7 days

---

### 5. Refresh Token
**POST** `/auth/refresh`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Old refresh token is revoked after use (rotating refresh tokens)
- Automatic token rotation for enhanced security

---

### 6. Logout
**POST** `/auth/logout`

Logout and revoke the refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### Get Current User Profile
**GET** `/users/me`

Get the profile of the authenticated user.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerifiedAt": "2025-01-09T10:00:00.000Z",
    "createdAt": "2025-01-09T09:00:00.000Z",
    "updatedAt": "2025-01-09T09:00:00.000Z"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Error Codes:
- **400** - Validation error or bad request
- **401** - Unauthorized (invalid or missing token)
- **404** - Resource not found
- **500** - Internal server error

### Validation Errors:
For validation errors, additional details are provided:

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "path": ["password"],
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## Token Management

### Access Token
- Expires in 15 minutes
- Include in `Authorization: Bearer <token>` header
- Used for all protected routes

### Refresh Token
- Expires in 7 days
- Used to get new access tokens
- Automatically rotates on refresh
- Stored securely (should be httpOnly cookie in production)

---

## Health Check
**GET** `/health`

Check if the server is running.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-09T10:00:00.000Z",
  "service": "reiseklar-backend"
}
```

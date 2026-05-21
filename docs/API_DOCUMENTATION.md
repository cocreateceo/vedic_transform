# API Documentation

**Base URL:** `https://d1wkrhl40vhx82.cloudfront.net`

---

## Authentication

### Register User

**POST** `/api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "cmjklyclk000024j1uli82v0t",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login

**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {...}
}
```

Sets cookie: `vedic-auth-token`

### Logout

**POST** `/api/auth/logout`

**Authentication:** Required

---

## Goals

### Get Goals

**GET** `/api/goals?week=2`

**Authentication:** Required

**Response:**
```json
{
  "goals": [...],
  "focusPillars": [...],
  "currentWeek": 2,
  "stats": {
    "totalGoals": 10,
    "completedGoals": 6,
    "streak": 2
  }
}
```

### Create Goal

**POST** `/api/goals`

**Request:**
```json
{
  "title": "Complete morning routine 5 times",
  "description": "Wake at 5 AM",
  "pillarId": "1"
}
```

### Update Goal

**PATCH** `/api/goals`

**Request:**
```json
{
  "goalId": "goal_123",
  "isCompleted": true
}
```

### Delete Goal

**DELETE** `/api/goals?id=goal_123`

---

## Focus Pillars

### Get Focus Pillars

**GET** `/api/focus-pillars`

### Set Focus Pillars

**POST** `/api/focus-pillars`

**Request:**
```json
{
  "pillarIds": ["1", "5", "9"]
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Example: Full Auth Flow

```bash
# Register
curl -X POST https://d1wkrhl40vhx82.cloudfront.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123","name":"John"}' \
  -c cookies.txt

# Use authenticated endpoint
curl https://d1wkrhl40vhx82.cloudfront.net/api/goals -b cookies.txt

# Logout
curl -X POST https://d1wkrhl40vhx82.cloudfront.net/api/auth/logout -b cookies.txt
```

---

**API Version:** 1.0
**Last Updated:** January 2, 2026

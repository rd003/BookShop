# Authentication API

Base route: `/api/auth`

Consumed by both web and mobile clients. Web clients receive tokens via `HttpOnly` cookies (`accessToken`, `refreshToken`); mobile clients receive tokens in the JSON response body and must send them back manually (`Authorization: Bearer` header for access token, request body for refresh token).

---

## POST /api/auth/signup

Creates a new user account with the `User` role.

**Auth required:** No

**Request body**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Responses**
| Status | Condition |
|---|---|
| 200 OK | User created successfully |
| 400 Bad Request | Role creation failed, user creation failed, or role assignment failed |
| 409 Conflict | A user with the given email already exists |

---

## POST /api/auth/login

Authenticates a user and issues an access token + refresh token.

**Auth required:** No

**Request body**
```json
{
  "username": "string",
  "password": "string"
}
```

**Behavior**
- Validates credentials against `UserManager`.
- Generates JWT access token with user roles as claims.
- Generates a refresh token and upserts it into `TokenInfos` (keyed by username), with a 2-minute expiry.
- Sets `accessToken` and `refreshToken` as cookies via `TokenService.SetTokenCookies`.

**Responses**
| Status | Condition |
|---|---|
| 200 OK | Returns `{ accessToken, refreshToken }` in body (also set as cookies) |
| 401 Unauthorized | Username not found, or password invalid |

---

## POST /api/auth/refresh

Issues a new access/refresh token pair using a valid refresh token.

**Auth required:** No (uses refresh token, not access token)

**Request body**
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Behavior**
- Reads `refreshToken` from cookie if present; otherwise falls back to the value in the request body (mobile flow).
- Looks up the refresh token in database; validates it exists and is not expired.
- Rotates the refresh token (issues a new one, discards the old).
- Issues a new access token with fresh role claims.
- Sets new tokens as cookies **and** returns them in the response body.

**Responses**
| Status | Condition |
|---|---|
| 200 OK | Returns new `{ accessToken, refreshToken }` |
| 400 Bad Request | No refresh token found in cookie or body; refresh token not found/expired; user no longer exists |

---

## POST /api/auth/token/revoke

Revokes the stored refresh token for the currently authenticated user, without deleting the token record.

**Auth required:** Yes (Bearer access token)

**Request body:** None

**Responses**
| Status | Condition |
|---|---|
| 200 OK | Refresh token cleared |
| 400 Bad Request | No `TokenInfos` record found for the user |

---

## POST /api/auth/logout

Logs the user out by deleting their stored token record and clearing auth cookies.

**Auth required:** Yes (Bearer access token)

**Request body:** None

**Behavior**
- Deletes a token from database for the authenticated username.
- Deletes `accessToken` and `refreshToken` cookies (`HttpOnly`, `Secure`, `SameSite=None`).

**Responses**
| Status | Condition |
|---|---|
| 204 No Content | Logged out successfully |
| 401 Unauthorized | No username on the authenticated principal |

---

## GET /api/auth/me

Returns the profile of the currently authenticated user.

**Auth required:** Yes (Bearer access token)

**Request body:** None

**Responses**
| Status | Condition |
|---|---|
| 200 OK | `{ "email": "string", "username": "string", "roles": ["string"] }` |
| 401 Unauthorized | No username on principal, or user not found |

---

## Token Delivery Model

| Client type | Access token | Refresh token |
|---|---|---|
| Web | `HttpOnly` cookie, auto-sent by browser | `HttpOnly` cookie, auto-sent by browser |
| Mobile | Returned in JSON body → sent as `Authorization: Bearer <token>` header | Returned in JSON body → sent in request body on `/refresh` |

`/refresh` supports both: it prefers the cookie value when present, and falls back to the request body value otherwise.
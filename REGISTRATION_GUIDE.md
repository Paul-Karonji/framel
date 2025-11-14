# 📝 User Registration Guide

## Overview
This guide explains how to register new users in the Framel backend API and troubleshoot common issues.

## Endpoint
```
POST /api/auth/register
```

## Request Format

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "0712345678"
}
```

## Field Requirements

### 1. Email
- **Type:** String
- **Format:** Valid email address
- **Example:** `user@example.com`, `john.doe@gmail.com`
- **Error:** "Invalid email address"

### 2. Password
- **Type:** String
- **Minimum Length:** 8 characters
- **Requirements:**
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
- **Valid Examples:**
  - `Password123`
  - `SecurePass1`
  - `MyP@ssw0rd`
- **Invalid Examples:**
  - `password` (no uppercase, no number)
  - `PASSWORD123` (no lowercase)
  - `Pass123` (too short)
- **Error:** "Password must contain at least one uppercase letter, one lowercase letter, and one number"

### 3. Name
- **Type:** String
- **Minimum Length:** 2 characters
- **Example:** `John Doe`, `Mary Jane`
i 
- **Error:** "Name must be at least 2 characters"

### 4. Phone
- **Type:** String
- **Format:** Kenyan mobile number (Safaricom/Airtel)
- **Accepted Formats:**
  - `0712345678` (with leading 0)
  - `0112345678` (with leading 0)
  - `712345678` (without leading 0)
  - `254712345678` (country code without +)
  - `+254712345678` (full international format)
- **Networks Supported:**
  - Safaricom: 07XX XXXXXX
  - Airtel: 01XX XXXXXX
- **Note:** Phone number will be automatically normalized to international format (+254...)
- **Error:** "Phone number must be a valid Kenyan mobile number (e.g., 0712345678, 0712345678, +254712345678)"

## Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "Registration successful! Welcome to Framel.",
  "data": {
    "user": {
      "uid": "firebase-user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+254712345678",
      "role": "customer"
    }
  }
}
```

## Error Responses

### Validation Errors
**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email address"
      },
      {
        "field": "password",
        "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
    ]
  }
}
```

### Email Already Exists
**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "error": "Email already registered",
  "message": "Email already registered"
}
```

### Server Error
**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "error": "Registration failed. Please try again.",
  "message": "Registration failed. Please try again."
}
```

## Testing with cURL

### Valid Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123",
    "name": "Test User",
    "phone": "0712345678"
  }'
```

### Testing Validation Errors

#### Invalid Email
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "SecurePass123",
    "name": "Test User",
    "phone": "0712345678"
  }'
```

#### Weak Password
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "weak",
    "name": "Test User",
    "phone": "0712345678"
  }'
```

#### Invalid Phone Number
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123",
    "name": "Test User",
    "phone": "1234567890"
  }'
```

## Testing with Postman

1. **Create New Request**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`

2. **Set Headers**
   - Key: `Content-Type`
   - Value: `application/json`

3. **Set Body** (raw JSON)
   ```json
   {
     "email": "testuser@example.com",
     "password": "SecurePass123",
     "name": "Test User",
     "phone": "0712345678"
   }
   ```

4. **Send Request**

## Common Issues & Solutions

### Issue 1: "Invalid email address"
**Cause:** Email format is incorrect
**Solution:** Use a valid email format (e.g., `user@example.com`)

### Issue 2: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
**Cause:** Password doesn't meet security requirements
**Solution:**
- Ensure password is at least 8 characters
- Include at least one uppercase letter (A-Z)
- Include at least one lowercase letter (a-z)
- Include at least one number (0-9)
- Example: `SecurePass123`

### Issue 3: "Phone number must be a valid Kenyan mobile number"
**Cause:** Phone number format is incorrect or not a Kenyan mobile number
**Solution:**
- Use Safaricom format: `0712345678` or `+254712345678`
- Use Airtel format: `0112345678` or `+254112345678`
- Ensure the number has exactly 10 digits (with leading 0) or 12 digits (with 254)

### Issue 4: "Email already registered"
**Cause:** A user with this email already exists
**Solution:**
- Use a different email address
- If you forgot your password, use the password reset endpoint

### Issue 5: "Name must be at least 2 characters"
**Cause:** Name is too short
**Solution:** Provide a full name with at least 2 characters

## After Registration

Once registered successfully:

1. **User is created in Firebase Auth** with the provided email and password
2. **User document is created in Firestore** with profile information
3. **Welcome email is sent** to the user's email address (if email service is configured)
4. **User role is set to "customer"** by default
5. **User can now login** using their email and password

## Next Steps

After successful registration, users can:

1. **Login** using Firebase Client SDK:
   ```javascript
   import { signInWithEmailAndPassword } from 'firebase/auth';
   const userCredential = await signInWithEmailAndPassword(auth, email, password);
   const idToken = await userCredential.user.getIdToken();
   ```

2. **Access Protected Endpoints** by including the token in requests:
   ```
   Authorization: Bearer <idToken>
   ```

3. **Update Profile** at `PUT /api/auth/profile`
4. **View Orders** at `GET /api/orders/user/me`
5. **Manage Cart** at `/api/cart/*`
6. **Add to Wishlist** at `/api/wishlist/*`

## Security Notes

- ✅ Passwords are securely hashed by Firebase Auth
- ✅ Phone numbers are normalized to international format
- ✅ Email addresses are validated before account creation
- ✅ Duplicate emails are prevented
- ✅ Strong password requirements enforced
- ✅ Welcome emails are sent asynchronously (won't fail registration if email fails)

## Support

If you continue to experience issues:
1. Check the server logs for detailed error messages
2. Verify Firebase configuration is correct
3. Ensure all environment variables are set
4. Check that Firestore is accessible
5. Verify email service configuration (for welcome emails)

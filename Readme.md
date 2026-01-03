<div align="center">

# 🚀 **Y_PROJECT**
### 🔐 *Production-Grade Backend with JWT, Cookies & Cloudinary*

Secure • Scalable • API-First • Real-World Architecture

---

<!-- Badges -->
<img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express" />
<img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" />
<br/>
<img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Security-HTTP%20Only%20Cookies-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Storage-Cloudinary-purple?style=for-the-badge" />

---

# ✨ Overview
</div>

**Y_PROJECT** is a **real-world backend system** built with **Node.js, Express, MongoDB, and JWT-based authentication**.

It is designed to behave like a **production SaaS backend**, supporting:

- 🔑 Secure login & logout  
- 🔄 Access & Refresh token system  
- 🍪 HTTP-only cookie-based sessions  
- 🖼️ Image uploads using Cloudinary  
- 🛡️ Protected APIs using middleware  

This is **not a tutorial backend** — it follows the same architecture used by **Netflix, GitHub, and Stripe**.

---

# 📂 Folder Structure

Y_PROJECT/
│
├── src/
│ ├── controllers/ # Auth logic (register, login, logout)
│ ├── routes/ # API endpoints
│ ├── middlewares/ # JWT auth, multer, security
│ ├── models/ # MongoDB schemas
│ ├── utils/ # Cloudinary, tokens, async handler
│ ├── db/ # MongoDB connection
│ ├── app.js # Express app setup
│ └── index.js # Server entry point
│
└── public/temp # Temporary file uploads



This structure allows:
- Clean separation of logic  
- Easy scaling  
- Team collaboration  

---

# 🔐 Authentication System

Y_PROJECT uses **dual-token authentication**:

| Token | Purpose |
|------|--------|
| **Access Token** | Used on every API request (short-lived) |
| **Refresh Token** | Used to generate new access tokens (long-lived) |

Both tokens are stored in **secure HTTP-only cookies**, which protects them from:
- JavaScript access
- XSS attacks
- Token theft

---

# 🔄 Auth Flow

### 🟢 Login
1. User sends email or username + password  
2. Server validates credentials  
3. Server creates:
   - Access Token  
   - Refresh Token  
4. Both are stored in **secure cookies**

### 🔵 Protected Request
1. Browser automatically sends cookies  
2. JWT middleware verifies the token  
3. User is attached to `req.user`  
4. API returns protected data  

### 🔴 Logout
1. User calls `/logout`  
2. JWT middleware verifies user  
3. Refresh token is removed from DB  
4. Cookies are cleared  
5. Session ends  

---

# 🛡️ Security Features

- Password hashing  
- JWT signature verification  
- Token expiry handling  
- Refresh token rotation  
- HTTP-only secure cookies  
- MongoDB-stored refresh tokens  

This is how **real production backends** handle authentication.

---

# 📤 File Upload System

Y_PROJECT supports:
- Avatar upload  
- Cover image upload  

Flow:
1. Multer receives file  
2. File is uploaded to Cloudinary  
3. Local file is deleted  
4. Cloudinary URL is stored in MongoDB  

This keeps the backend:
- Fast  
- Scalable  
- Storage-efficient  

---

# 🌐 API Endpoints

| Method | Route | Description |
|-------|------|-------------|
| POST | `/api/v1/users/register` | Register new user |
| POST | `/api/v1/users/login` | Login & receive tokens |
| POST | `/api/v1/users/logout` | Logout (JWT protected) |

---

# 🧪 Current Status

| Feature | Status |
|-------|--------|
User Registration | ✅ Done  
Login with JWT | ✅ Done  
Secure Cookies | ✅ Done  
JWT Middleware | ✅ Done  
Logout | ✅ Done  
Token Refresh | ⏳ Testing Pending  

---

# 👨‍💻 Developer

**Nikhil Dubey**  
Backend Developer  
Building production-grade systems step by step 🚀

---

<div align="center">

### ⭐ If you like this project, star the repo and follow its progress!

</div>

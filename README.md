<div align="center">
🚀 Y_PROJECT
🔐 Production-Grade Backend with JWT, Secure Cookies & Cloudinary

Secure • Scalable • API-First • Real-World Architecture

<img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" /> <img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express" /> <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" /> <br/> <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" /> <img src="https://img.shields.io/badge/Security-HTTP%20Only%20Cookies-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Storage-Cloudinary-purple?style=for-the-badge" /> </div>


✨ Overview

Y_PROJECT is a production-oriented backend system built using Node.js, Express, MongoDB, and JWT-based authentication.

The goal of this project is to replicate real SaaS backend architecture, focusing on security, scalability, and maintainability, rather than tutorial-level implementations.

It supports:

🔑 Secure user authentication

🔄 Access & Refresh token lifecycle

🍪 HTTP-only cookie-based sessions

🖼️ Media uploads via Cloudinary

🛡️ Protected APIs with middleware

This project follows patterns used in real-world systems, similar to those used by large-scale platforms.


📂 Folder Structure
Y_PROJECT/
│
├── src/
│   ├── controllers/     # Business logic (auth, user, profile)
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Auth, multer, security middlewares
│   ├── models/          # MongoDB schemas
│   ├── utils/           # Cloudinary, tokens, async handlers
│   ├── db/              # Database connection
│   ├── app.js           # Express app configuration
│   └── index.js         # Server entry point
│
└── public/temp          # Temporary upload storage

Why this structure?

 Clear separation of concerns

 Easy to scale and maintain

 Suitable for team-based development

 🔐 Authentication System

Y_PROJECT implements a dual-token authentication strategy.

Token	Purpose
Access Token	Used on every protected API request (short-lived)
Refresh Token	Used to issue new access tokens (long-lived)
Token Storage

Stored in HTTP-only secure cookies

Not accessible via JavaScript

Resistant to XSS and token theft

🔄 Authentication Flow
🟢 Login

User submits email/username and password

Server validates credentials

Generates access & refresh tokens

Stores both tokens in secure cookies

🔵 Protected Requests

Browser automatically sends cookies

JWT middleware validates access token

User data is attached to req.user

Protected resource is returned

🔴 Logout

User hits logout endpoint

Refresh token is removed from database

Cookies are cleared

Session is fully terminated

🛡️ Security Features

Password hashing

JWT signature verification

Token expiry handling

Refresh token rotation

HTTP-only secure cookies

Refresh tokens stored in MongoDB

These practices reflect real production security standards.

📤 File Upload System

Supported uploads:

User avatar

User cover image

Upload Flow

Multer processes incoming file

File is uploaded to Cloudinary

Temporary local file is removed

Cloudinary URL is stored in MongoDB

Benefits:

Reduced server storage load

Faster media delivery

Scalable file handling

👨‍💻 Developer

Nikhil Dubey
Backend Developer

Focused on building secure, scalable, production-grade systems step by step.


<div align="center">
⭐ If you find this project useful, consider starring the repository
</div>
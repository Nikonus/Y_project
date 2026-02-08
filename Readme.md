<div align="center">
🚀 Y_PROJECT
🔐 Production-Grade Backend Architecture

Secure • Scalable • API-First • Cloud-Ready

<br/> <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js" /> <img src="https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express" /> <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb" /> <br/> <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" /> <img src="https://img.shields.io/badge/Security-HTTP--Only%20Cookies-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Storage-Cloudinary-purple?style=for-the-badge" /> </div>
✨ Project Overview

Y_PROJECT is a production-oriented backend system designed using Node.js, Express, MongoDB, and JWT authentication.

This project is built with a real-world SaaS backend mindset — focusing on:

🔒 Security-first design

⚙️ Scalable architecture

🧩 Maintainable code structure

🧠 Industry-level patterns (not tutorial code)

It simulates the backend of a media-driven platform where users can authenticate, upload media, and interact with protected resources.

🧱 Monorepo Structure
Y_PROJECT
├── BACKEND   → Node.js + Express API server
└── FRONTEND  → (React app – in progress)

📂 Backend Structure
BACKEND/
│
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Auth, Multer, security layers
│   ├── models/          # MongoDB schemas
│   ├── utils/           # Cloudinary, tokens, helpers
│   ├── db/              # Database connection setup
│   ├── app.js           # Express configuration
│   └── index.js         # Server entry point
│
└── public/temp          # Temporary file storage

Why this structure?

✔ Clear separation of concerns
✔ Easy to scale features
✔ Team-friendly organization
✔ Matches real production backend layouts

🔐 Authentication System

Y_PROJECT uses a dual-token authentication strategy used in modern production systems.

Token	Purpose
Access Token	Short-lived, used for protected requests
Refresh Token	Long-lived, used to issue new access tokens
🍪 Token Storage

Tokens are stored in HTTP-only secure cookies

✔ Not accessible via JavaScript
✔ Protected from XSS attacks
✔ Reduces token theft risk

🔄 Authentication Flow
🟢 Login

User submits credentials

Server verifies password

Access + Refresh tokens generated

Tokens stored in secure cookies

🔵 Protected Requests

Cookies automatically sent by browser

JWT middleware validates token

User info attached to req.user

API returns protected resource

🔴 Logout

Refresh token removed from database

Cookies cleared

Session fully invalidated

🛡️ Security Practices Implemented

✔ Password hashing
✔ JWT signature verification
✔ Token expiration handling
✔ Refresh token rotation
✔ HTTP-only secure cookies
✔ Refresh tokens stored in MongoDB

These match real production security standards.

📤 File Upload & Media Handling

Supported uploads:

User avatar

User cover image

Media files (videos/images)

Upload Flow

Multer receives file

File uploaded to Cloudinary

Temporary file deleted locally

Cloudinary URL saved in MongoDB

Benefits

🚀 Reduced server storage load
⚡ Faster media delivery
📈 Horizontally scalable storage

⚙️ Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	MongoDB, Mongoose
Auth	JWT (Access + Refresh)
Security	HTTP-Only Cookies
Storage	Cloudinary
Dev Tools	Nodemon, Prettier
🧪 How to Run Locally
Backend
cd BACKEND
npm install
npm run dev


Server runs on:

http://localhost:8000

👨‍💻 Developer

Nikhil Dubey
Backend Developer focused on building secure, scalable, production-grade systems step by step.

<div align="center">
⭐ If you find this project helpful, consider starring the repository
</div>
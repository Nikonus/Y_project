# Y_PROJECT – Development Log

This file records the chronological development of the backend system.
Each entry shows what was built, when, and how.

---

## 📅 30 December 2025  
⏰ Time: 11:18 PM IST  
🎯 Milestone: MongoDB Connection Established

### What was implemented
The backend was successfully connected to MongoDB Atlas using Mongoose.  
Environment variables were configured using `dotenv`, and the database connection was made mandatory before starting the Express server.

### Steps performed

1. Created `.env` file to store sensitive credentials:

2. Implemented a MongoDB connection module:
```js
mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
3.Built an async startup system using an IIFE:

(async () => {
  await connectDB();
  app.listen(PORT);
})();


Problems faced

MongoDB failed due to incorrect connection string

Special characters (@) in password had to be URL-encoded

ES Modules required replacing require() with import

Solution

Fixed .env formatting (no spaces)

Encoded password using %40

Used import "dotenv/config" for ES Modules


## 📅 30 December 2025  
⏰ Time: 02:15 AM IST  
🎯 Milestone: API Utility Layer Implemented

### What was implemented
A core utility layer was added to standardize how the backend handles API responses and errors. This includes:

- A custom `Apierr` class for structured API errors  
- A `Apiresponse` class for consistent success responses  
- An `asyncHandler` middleware to eliminate repetitive try/catch blocks in controllers  

### Purpose
These utilities ensure that all API responses follow a predictable and professional format. They also centralize error handling, making the backend more stable, readable, and production-ready.

### Files added
utils/Apierr.js
utils/Apiresponse.js
utils/asyncHandler.js



### Architecture improvement
Controllers will now:
- Throw `Apierr` for failures
- Return `Apiresponse` for success
- Be wrapped with `asyncHandler` to catch async errors automatically

This establishes a clean API contract for all future routes.

### Result
The backend now has a structured, scalable response and error-handling system aligned with professional backend engineering practices.

### What this enables next
- User authentication routes
- Protected APIs
- Centralized error middleware


## 3:49 
i am going to push user and video model


## 7:14 pm
## 📅 30 December 2025  
⏰ Time: 02:15 AM IST  
🎯 Milestone: Media Upload Pipeline Implemented (Multer + Cloudinary)

### What was implemented
A complete media upload system was added to the backend using **Multer** for temporary file storage and **Cloudinary** for permanent cloud storage of images and videos.

This allows the application to safely accept user-uploaded files, process them on the server, and store them in a scalable cloud-based media service.

---

### Components added

#### 1. Multer Disk Storage
Files are temporarily stored inside:


Multer handles:
- Multipart form data
- File naming
- Temporary disk storage before upload

Each file is assigned a unique timestamp-based name to avoid overwriting.

---

#### 2. Cloudinary Upload Utility
A reusable Cloudinary upload function was created to:

- Accept a local file path
- Upload the file to Cloudinary
- Automatically detect image or video type
- Delete the local file after successful upload

This ensures the backend does not accumulate unnecessary files on disk.

---

### Architecture Flow

Client Upload
↓
Multer (public/temp)
↓
Cloudinary (Cloud Storage)
↓
Local file deleted
↓
Cloud URL returned


This is the standard pattern used in production-grade backend systems.

---

### Why this matters
This implementation provides:
- Scalable media storage
- Secure file handling
- Support for both images and videos
- Clean separation between temporary and permanent storage

It prepares the backend for:
- User profile images
- Post media
- AI image processing
- Video uploads

---

### Files involved
middlewares/multer.js
utils/cloudinary.js


---

### Result
The backend now has a fully functional, cloud-based media upload system integrated with its architecture.

This is a critical building block for all user-generated content features.



### 
1 January 2026, 10:00 PM

Task: API connectivity and routing validation using Postman

Today I completed the first end-to-end validation of the backend routing layer by integrating the user router, controller, and app.js entry point and testing the API flow through Postman.

I created and wired the following components:

user.routes.js to define route paths and HTTP methods

user.controller.js to handle business logic and responses

app.js to register middleware and mount the user router under /api/v1/users

After connecting these layers, I used Postman as a client simulator to send HTTP requests to the API. This allowed me to verify that:

The router was correctly mounted

Requests were reaching the correct controller

Express middleware (JSON parser, CORS, cookies) was functioning

The server was returning the expected JSON response

Postman was used to simulate real client behavior by sending requests directly to the backend without a frontend. This confirmed that the backend request pipeline — from URL → Router → Controller → Response — is working correctly.

This step ensures that the foundation of the API is stable before adding authentication, database integration, or frontend communication.

Status: Backend routing layer successfully verified using Postman.



 2 January 2026, 11:14 AM

Task: Completion of user registration system with file upload and Cloudinary integration

Today the user registration module of the backend was fully implemented and validated. The registration flow now handles complete user onboarding, including input validation, duplicate account prevention, media upload, and secure database persistence.

The controller now performs the following operations in sequence:

Validates required fields (fullname, username, email, password)

Verifies email format using regex validation

Checks MongoDB for existing users with the same username or email

Validates the presence of an avatar file via Multer

Uploads avatar and optional cover image to Cloudinary

Stores Cloudinary URLs along with user details in MongoDB

Excludes sensitive fields (password and refresh token) from API responses

Returns a structured success response using a standardized API response format

This establishes a production-grade registration pipeline using Express, MongoDB (Mongoose), Multer, and Cloudinary, confirming that the backend can now safely accept, process, and store new user accounts.

Status: User registration feature successfully completed and operational.





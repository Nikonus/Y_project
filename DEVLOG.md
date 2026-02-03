📘 Development Log – Y_PROJECT Backend

This document tracks the structured, chronological development of the backend system, including architectural decisions, implementations, and technical challenges.

📅 30 December 2025 — 11:18 PM IST
🎯 Milestone: MongoDB Connection Established
Overview

The backend was successfully connected to MongoDB Atlas using Mongoose. The server startup process was redesigned so the Express app only starts after a successful database connection.

Implementation Details

Environment Configuration

Created a .env file to store sensitive credentials securely

Loaded environment variables using:

import "dotenv/config";


Database Connection Module

mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);


Async Server Startup Pattern

(async () => {
  await connectDB();
  app.listen(PORT);
})();


This ensures the server never runs without a live database connection.

Challenges Faced
Issue	Cause	Resolution
MongoDB connection failure	Incorrect connection string	Corrected Atlas connection URI
Authentication error	Special characters (@) in password	URL-encoded password (%40)
Module import errors	ES Modules in use	Replaced require() with import syntax
Outcome

A reliable and production-safe database initialization flow is now in place.

📅 31 December 2025 — 02:15 AM IST
🎯 Milestone: API Utility Layer Implemented
Overview

A reusable API utility layer was introduced to standardize response formatting and error handling across the backend.

Components Added
File	Purpose
utils/Apierr.js	Custom structured error class
utils/Apiresponse.js	Standard success response formatter
utils/asyncHandler.js	Wrapper to catch async errors automatically
Architectural Improvement

Controllers now follow a clean, consistent contract:

Throw Apierr for operational failures

Return Apiresponse for successful operations

Wrapped with asyncHandler to remove repetitive try/catch blocks

This significantly improves maintainability and readability.

Outcome

The backend now follows a professional-grade API response structure, enabling scalable route development and centralized error management.

Enables Next

Authentication system

Protected routes

Global error middleware

📅 31 December 2025 — 07:14 PM IST
🎯 Milestone: Media Upload Pipeline Implemented (Multer + Cloudinary)
Overview

A complete media upload pipeline was integrated using Multer for temporary file handling and Cloudinary for permanent cloud storage of images and videos.

This enables secure, scalable handling of user-uploaded media.

System Components
1️⃣ Multer Disk Storage

Temporary storage directory:

public/temp


Responsibilities:

Handles multipart/form-data

Assigns unique timestamp-based filenames

Stores files temporarily before cloud upload

2️⃣ Cloudinary Upload Utility

A reusable upload function was implemented to:

Accept a local file path

Upload media to Cloudinary

Automatically detect resource type (image/video)

Delete the local file after successful upload

This prevents unnecessary disk usage on the server.

Media Processing Flow
Client Upload
   ↓
Multer (Temporary Storage)
   ↓
Cloudinary (Permanent Storage)
   ↓
Local File Deleted
   ↓
Cloud URL Stored in Database


This mirrors industry-standard backend media handling practices.

Why This Matters

✔ Scalable cloud-based media storage
✔ Secure file handling workflow
✔ Supports both image and video uploads
✔ Clean separation of temporary vs permanent storage

📌 Notes Logged During Development

Developer noted intent to push User and Video models after utility layer completion.
📘 Development Log – Y_PROJECT Backend (Continued)
📅 31 December 2025 — 07:14 PM IST
🎯 Milestone: Media Upload Pipeline Implemented (Multer + Cloudinary)
What This System Enables

This media pipeline prepares the backend for:

User profile image uploads

Post media attachments

AI-based image processing workflows

Video uploads and storage

Core Files
File	Responsibility
middlewares/multer.js	Handles multipart form data and temporary file storage
utils/cloudinary.js	Uploads media to Cloudinary and removes local temp files
Result

The backend now includes a fully functional, cloud-based media upload system integrated into its architecture.
This serves as a foundational layer for all user-generated content features.

📅 01 January 2026 — 10:00 PM IST
🎯 Task: API Connectivity & Routing Validation (Postman Testing)
Overview

The backend routing layer was validated end-to-end using Postman to simulate client requests. This marked the first successful full pipeline test of the API infrastructure.

Components Integrated
File	Purpose
user.routes.js	Defines route paths and HTTP methods
user.controller.js	Implements business logic
app.js	Registers middleware and mounts routes

Routes were mounted under:

/api/v1/users

Validation Checklist

Using Postman, the following were verified:

Router correctly mounted in Express

Requests reached the intended controller

Middleware stack (JSON parser, CORS, cookies) functioned correctly

API returned structured JSON responses

Architectural Significance

This confirmed that the backend request lifecycle is functioning:

Client Request → Express Router → Controller → Response

Outcome

The routing foundation is now stable, allowing safe progression toward authentication, database operations, and frontend integration.

📅 02 January 2026 — 11:14 AM IST
🎯 Task: User Registration System Implemented
Overview

The user registration pipeline was fully developed, enabling secure onboarding of new users with media upload and cloud storage integration.

Registration Workflow

The controller executes the following sequence:

Validates required fields

fullname, username, email, password

Email format validation using regex

Duplicate account check

Prevents existing username or email

Avatar validation

Ensures file is received via Multer

Cloudinary upload

Avatar (required)

Cover image (optional)

MongoDB persistence

Stores user data + Cloudinary URLs

Response sanitization

Excludes password and refreshToken

Standardized success response

Uses structured API response format

Result

A production-grade user registration system is now integrated using:

Express.js

MongoDB + Mongoose

Multer

Cloudinary

Status at This Stage

The feature was implemented without server crashes.
Next step identified: full validation of file uploads and field checks.

📅 02 January 2026 — 03:42 PM IST
🎯 Milestone: User Registration Pipeline Fully Operational

The registration system was debugged and elevated to a fully working production-ready flow. Several critical issues were identified and resolved.

🐞 Issue 1: Multer Not Receiving Files (req.files === undefined)

Observed Error

"avatar is required"


Root Cause

Route was not consistently passing through Multer middleware

Postman requests sometimes not sent as multipart/form-data

Incorrect endpoint usage during testing

Fix Applied

Confirmed route path:

/api/v1/users/register


Ensured middleware usage:

upload.fields([{ name: "avatar" }, { name: "coverImage" }])


Corrected Postman request type to form-data

Matched field names exactly: avatar, coverImage

Added debug logging to verify Multer execution

🐞 Issue 2: Cloudinary Error — “Must supply api_secret”

Root Cause
Cloudinary environment variables were not properly loaded into the runtime environment.

Fix Applied

Verified .env variables:

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

Ensured dotenv/config loads before Cloudinary initialization

Restarted server after environment updates

Outcome

✔ File upload middleware functioning correctly
✔ Cloudinary integration verified
✔ Registration endpoint successfully processes full user onboarding

The user registration pipeline is now fully operational and production-ready.
📘 Development Log – Y_PROJECT Backend (Continued)
📅 02 January 2026 — Evening Session
🎯 Milestone: User Registration Pipeline Stabilization & Bug Fixes

During final testing of the user registration system, multiple backend failures were discovered and resolved. This phase transformed the feature from “working sometimes” into a stable, production-grade pipeline.

🐞 Issue 2 (Continued): Cloudinary “Must supply api_secret”

Root Cause
Environment variable typo in .env:

CLOUDINARY_API_SECRETE   ❌
CLOUDINARY_API_SECRET    ✅


Fix Applied

Corrected the variable name

Restarted the server to reload environment variables

🐞 Issue 3: Cloudinary “Invalid Signature” Error

Error Message

Invalid Signature ... timestamp=...


Root Causes

Cloudinary API Key and Secret did not match

Incorrect environment variable casing:

CLOUDINARY_API_key   ❌
CLOUDINARY_API_KEY   ✅


Fix Applied

Generated a new API key from the Cloudinary Dashboard

Standardized environment variables:

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET


Removed all duplicate or misspelled Cloudinary variables

🐞 Issue 4: MongoDB Validation Error

Error Message

User validation failed: email is required


Root Cause
The email field was not included in the User.create() call.

Fix Applied

User.create({
  fullname,
  email,
  username,
  password,
  avatar,
  coverImage
});

🐞 Issue 5: “next is not a function” — Mongoose Pre-save Hook Crash

Error Message

TypeError: next is not a function
at user.model.js


Root Cause
A Mongoose middleware hook was incorrectly written using an arrow function, which breaks access to this and next.

Incorrect

userSchema.pre("save", async (next) => {})


Fix Applied

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

🐞 Issue 6: asyncHandler Breaking Express Middleware Chain

Error Message

next is not a function


Root Cause
The custom asyncHandler did not correctly forward errors to Express.

Fix Applied

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


This restores proper error propagation to global error middleware.

✅ Final System State After Fixes

After resolving all issues:

✔ Multer correctly receives uploaded files
✔ Cloudinary authenticates and uploads media
✔ MongoDB successfully stores user data
✔ Passwords are securely hashed before saving
✔ API returns structured, sanitized responses

📦 Example Successful Registration Response
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "nick",
    "email": "nikh@gmail.com",
    "fullname": "nikhil dubey",
    "coverImage": "https://res.cloudinary.com/...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "User successfully registered"
}

🚀 Outcome

The User Registration feature is now fully stable, secure, and production-ready, forming the foundation for:

Authentication (login/logout)

Profile management

Media-based user content

📘 Development Log – Y_PROJECT Backend (Continued)
📅 02 January 2026 — Final Status
✅ Milestone: User Registration System Production-Ready

The User Registration pipeline — including file upload, Cloudinary integration, MongoDB storage, password hashing, and response sanitization — is now fully functional and production-grade.

This completes the foundational user onboarding system.

📅 03 January 2026 — 12:20 PM IST
🎯 Milestone: Authentication & Logout System Implemented

A complete authentication layer was introduced, enabling secure login, token-based session management, and protected logout functionality using JWT and HTTP-only cookies.

🔐 Features Implemented
1️⃣ Login System

Users can authenticate using:

Email + Password

Username + Password

On successful login:

Access Token (short-lived) generated

Refresh Token (long-lived) generated

Refresh token stored in MongoDB

Both tokens sent as HTTP-only secure cookies

2️⃣ JWT Authentication Middleware

A verifyJWT middleware was implemented to:

Read tokens from cookies or Authorization header

Validate JWT signature and expiration

Fetch the authenticated user from MongoDB

Attach req.user to protected routes

3️⃣ Protected Logout System

Logout route now requires valid authentication.

On logout:

Refresh token removed from database

Access and refresh cookies cleared

User session fully invalidated

4️⃣ Secure Cookie-Based Authentication

Authentication tokens are stored in:

httpOnly cookies → protects from XSS

secure cookies → transmitted only over HTTPS

This approach is significantly safer than localStorage-based token storage.

📌 Current System Status

✔ Backend authentication flow fully wired
✔ Login, token generation, middleware, and logout implemented

⏭ Next Planned Validation

Postman / Thunder Client end-to-end testing

Cookie transmission verification

Token expiry and refresh logic testing

Protected route access validation

🛠 DEVLOG — Authentication System Debugging & Stabilization
📅 03 January 2026 — Completed at 10:18 PM IST
Overview

This session focused on stabilizing the authentication system after encountering failures during login and refresh-token handling. Multiple schema and middleware defects were identified and resolved.

The system now reliably supports:

Login via username + password

Login via email + password

Secure access & refresh token issuance

Cookie-based session handling

🐞 Issue 1: Password Re-Hashed on Every Save
Problem

Whenever the refreshToken field was updated, the password hashing middleware ran again, corrupting the stored password hash.

Symptoms

Correct passwords stopped matching

Login returned “invalid credentials”

Root Cause

The pre("save") middleware lacked proper password modification checks.

Fix Applied
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


Result

Password hashes only when modified

Refresh token updates no longer affect password

🐞 Issue 2: “next is not a function” During Login
Problem

Login crashed while saving the refresh token.

Root Cause

Mongoose v6+ uses promise-based middleware.
The schema incorrectly mixed callback-style next() with async middleware.

This caused:

Error: next is not a function

Fix Applied

Removed all usage of next() in async middleware

Converted to promise-style middleware only

✅ Outcome After Stabilization

✔ Password hashing logic corrected
✔ Refresh token updates safe
✔ Login system stable
✔ Token generation and storage working
✔ Cookie-based authentication functioning correctly
📘 Development Log – Y_PROJECT Backend (Continued)
📅 03 January 2026 — Authentication Stabilization (Continued)
🐞 Issue 3: Refresh Token Signed with Wrong Secret

Problem
Refresh tokens were mistakenly signed using:

ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY


This broke refresh token rotation and caused JWT verification failures.

Fix Applied

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};


Refresh tokens now use a dedicated secret and expiry configuration.

🐞 Issue 4: Incorrect Environment Variables

Problem

The .env file contained invalid entries:

REFRESH_TOKEN_EXPIRY=longRandomString
REFRESH_TOKEN_EXPIRY=10D


There was no REFRESH_TOKEN_SECRET, causing JWT signing to fail.

Fix Applied

Standardized environment variables:

REFRESH_TOKEN_SECRET=<secure_random_string>
REFRESH_TOKEN_EXPIRY=10d


Server restarted to ensure correct loading.

🐞 Issue 5: Password Field Marked as unique

Problem
The password field had unique: true.
Because bcrypt can occasionally produce identical hashes, MongoDB rejected saves when refresh tokens were updated.

Fix Applied

Removed unique: true from the password schema field

Deleted the existing unique index from MongoDB

🐞 Issue 6: Incorrect Password Comparison Method

Problem

Controller called:

user.comparePassword()


But the schema defined:

ispasswordmatched()


Fix Applied

Updated controller usage:

user.ispasswordmatched(password);

✅ Authentication System Status (03 Jan 2026 — 10:18 PM IST)

The authentication system is now fully operational and stable.

System Capabilities

✔ Login via username + password
✔ Login via email + password
✔ Secure cookie-based session handling
✔ Stable refresh token storage
✔ No password corruption
✔ No JWT signing errors
✔ No middleware crashes

📅 23 January 2026 — 11:09 AM IST
🎯 Milestone: Refresh Token Rotation System Implemented
Overview

A refresh token mechanism was implemented to regenerate access tokens after expiration, ensuring seamless session continuity without forcing users to log in again.

Work Completed

Added refresh-token controller logic in user.controller.js

Implemented JWT verification using REFRESH_TOKEN_SECRET

Retrieved refresh token from:

HTTP-only cookies

Request body (fallback)

Validated refresh token against:

JWT signature

User existence in MongoDB

Match with stored refresh token (rotation safety)

Generated new access + refresh tokens using a centralized utility

Sent updated tokens back via secure HTTP-only cookies

Edge Cases Handled

Missing refresh token

Invalid or expired token

Token mismatch (reuse or forced logout scenario)

Security Measures

✔ HTTP-only cookies (prevents XSS access)
✔ secure and sameSite: "strict" cookie flags (CSRF protection)
✔ Refresh token validation against database (prevents token reuse)

Files Modified
File	Description
src/controllers/user.controller.js	Refresh token controller implementation
Outcome

Users can now maintain active sessions even after access token expiry.
The authentication system is now more secure, scalable, and aligned with modern production standards.

🎥 Devlog — Video Module Development
📅 01 February 2026 — 1:40 PM IST
📦 Module: Video Management System

Status: Controllers Implemented ✅ | Testing Pending ⏳

🎯 Objective

To build the backend foundation for handling video-based content within Y_PROJECT, including upload handling, database storage, and controller logic for video operations.
🎥 Development Log — Video Management Module
📅 01 February 2026 — 1:40 PM IST
🎯 Milestone: Video Controller Layer Implemented

Status: Controllers Complete ✅ | Testing Pending ⏳

Overview

Backend controller logic for the Video Management System was implemented.
This module handles full lifecycle operations for video content, including publishing, retrieval, updates, deletion, filtering, and visibility control.

Focus areas included:

Database integration (MongoDB + Mongoose)

Media upload handling (Cloudinary)

Ownership authorization checks

Aggregation pipelines for optimized queries

✅ Features Implemented
1️⃣ Publish Video — publishAddVideo

Purpose: Upload a new video with thumbnail and store metadata.

Core Logic

Accepts title and description

Uploads:

Video file

Thumbnail image
to Cloudinary

Stores:

Video URL

Thumbnail URL

Video duration

Owner ID (from JWT middleware)

Validation Covered

Video file required

Thumbnail required

Cloudinary upload failure handling

2️⃣ Get Video by ID — getVideoById

Purpose: Retrieve detailed information for a single video.

Core Logic

Validates MongoDB ObjectId

Uses aggregation pipeline

Matches video by ID

Joins owner data from users collection

Projects only required fields:

username

email

avatar

Returns a structured video object with embedded owner details.

3️⃣ Update Video — updateVideo

Purpose: Modify video metadata or thumbnail.

Core Logic

Validates video ID

Confirms ownership (only uploader can edit)

Supports partial updates:

Title

Description

Thumbnail

Thumbnail Update Flow

Upload new thumbnail to Cloudinary

Delete old thumbnail from Cloudinary

Apply updates using $set

4️⃣ Delete Video — deleteVideo

Purpose: Remove a video and all associated media.

Core Logic

Validates video ID

Verifies ownership

Deletes:

Video file from Cloudinary

Thumbnail from Cloudinary

Video document from MongoDB

Prevents orphaned cloud storage files.

5️⃣ Get All Videos — getAllVideos

Purpose: Fetch paginated and filtered video listings.

Filters Implemented

Search by title/description (regex)

Filter by uploader (user ID)

Only published videos

Enhancements

Dynamic sorting (field + ascending/descending)

Aggregation join with owner information

Pagination using aggregatePaginate

6️⃣ Toggle Publish Status — toggleVideoPublishStatus

Purpose: Switch a video between published and unpublished states.

Core Logic

Ownership verification

Toggles isPublished boolean

Saves updated document

🔒 Security Measures

JWT-based authentication assumed for all protected routes

Ownership verification before:

Update

Delete

Publish status toggle

ObjectId validation to prevent malformed queries

📦 External Services & Techniques
Service / Technique	Purpose
Cloudinary	Video & thumbnail hosting
MongoDB Aggregation	Efficient joins & filtering
Aggregate Pagination	Scalable listing responses
⚠️ Pending Work
Task	Status
Route testing via Postman	⏳ Pending
Cloudinary deletion utility verification	⏳ Pending
Edge case testing (large files, invalid formats)	⏳ Pending
Auth middleware integration testing	⏳ Pending
API documentation	⏳ Pending
🧠 Engineering Notes

Controllers follow standardized pattern:
asyncHandler + ApiError + ApiResponse

Aggregation pipelines used instead of multiple queries for performance

File cleanup logic ensures no unused Cloudinary assets remain

📅 DEVLOG — 02/02/2026

⏰ Time Spent: 22:00 hrs
📌 Module: Comment Controller & Routes

🚀 Overview

Completed the backend implementation for the Comment system, covering creation, retrieval, updating, and deletion of comments with proper validation, pagination, aggregation, and authorization.

This module is now structured for scalable discussion handling under videos.

🧠 Features Implemented
1️⃣ Get Comments for a Video (Paginated + Aggregated)

Built an aggregation pipeline to fetch comments belonging to a specific video along with commenter details.

🔧 Key Logic

Validated video_id

Used MongoDB aggregation pipeline:

$match → filter comments by video

$lookup → join user (commenter) data

$project → return only safe user fields

$unwind → flatten joined user array

$sort → newest comments first

Integrated aggregate pagination plugin

📦 Returned Data Includes

Comment content

Comment creation time

Commenter:

username

avatar

fullname

2️⃣ Add Comment

Implemented endpoint to allow authenticated users to post comments.

🔧 Validation

Checked valid video_id

Prevented empty or whitespace-only comments

🧩 Data Stored

Video reference

Logged-in user ID (req.user._id)

Trimmed comment content

3️⃣ Update Comment (Secure & Atomic)

Implemented owner-only comment editing using a single atomic query.

🔒 Security Approach

Instead of:

Fetch → Check owner → Update (2 DB calls)

Used:

findOneAndUpdate({ _id: comment_id, commenter: req.user._id })


This ensures:

Only the comment owner can update

No race condition window

Fewer database operations

4️⃣ Delete Comment (Owner-Only)

Added secure deletion logic with ownership verification.

🔒 Steps

Validate comment ID

Fetch comment

Check if requester is owner

Delete comment

🛡 Security & Best Practices Applied
Practice	Purpose
ObjectId validation	Prevent DB crashes
Ownership verification	Prevent unauthorized edits/deletes
Trimmed input	Clean stored data
Field projection in lookup	Prevent user data leaks
Pagination	Performance at scale
Atomic update queries	Efficiency + safety
🔗 Routes Connected
Method	Route	Description
GET	/videos/:video_id/comments	Fetch paginated comments
POST	/videos/:video_id/comments	Add a comment
PATCH	/comments/:comment_id	Update a comment
DELETE	/comments/:comment_id	Delete a comment
📈 Outcome

The Comment backend module is now fully functional, optimized, and secure.
Ready for frontend integration and future upgrades like:

Comment likes/dislikes

Nested replies

Real-time comment updates
📅 DEVLOG — 03/02/2026

⏰ Time Spent: 12:57 hrs
📌 Module: Like System & Subscription System (Controllers + Routes)

🚀 Overview

Today I completed the backend implementation for the Like and Subscription features, along with their respective routes. These systems now support full interaction logic, aggregation-based data retrieval, and production-level validation and authorization.

Both modules are designed with scalability, performance, and real-world backend practices in mind.

❤️ Like System Completed
1️⃣ Toggle Video Like

Implemented like/unlike toggle logic

Validated video_id

Ensured a user can like a video only once

Deletes like if it already exists (unlike)

Creates like if it does not exist

2️⃣ Video Like Stats

Returns:

Total like count

Whether current user liked the video

Optimized using parallel queries (Promise.all)

Avoided heavy aggregation for simple counting

3️⃣ Get Liked Videos

Fetches all videos liked by the logged-in user

Used aggregation pipeline

Joined:

Video details

Video owner details (username, fullname, avatar)

Sorted by recently liked

🔔 Subscription System Completed
1️⃣ Toggle Subscription

Validated channel_id

Prevented self-subscription

Toggle logic:

If subscription exists → remove (unsubscribe)

If not → create (subscribe)

Updated subscribersCount on the channel using $inc (industry optimization)

2️⃣ Get Channel Subscribers

Aggregation pipeline to fetch all subscribers of a channel

Joined subscriber profile details:

username

fullname

avatar

Added advanced field:

isSubscribedBack (checks if channel owner also follows the subscriber)

3️⃣ Get Subscribed Channels

Fetches all channels the logged-in user has subscribed to

Joined channel profile details

Included subscribersCount for each channel

🛡 Best Practices Applied
Practice	Purpose
ObjectId validation	Prevent invalid DB queries
Ownership checks	Secure user actions
Aggregation pipelines	Efficient multi-collection data fetching
Field projection	Prevent data leaks
Parallel queries	Performance optimization
$inc counters	Avoid expensive count queries
Proper indexing strategy	Scalable database performance
🔗 Routes Integrated
Like Routes
Method	Route	Description
POST	/videos/:video_id/like	Toggle like
GET	/videos/:video_id/likes	Get like stats
GET	/users/me/liked-videos	Get liked videos
Subscription Routes
Method	Route	Description
POST	/channels/:channel_id/subscribe	Toggle subscription
GET	/channels/:channel_id/subscribers	Get channel subscribers
GET	/users/me/subscriptions	Get subscribed channels
🏁 Status

✅ Like System Complete
✅ Subscription System Complete
✅ Routes Connected

Backend now supports core social engagement features similar to modern video/social platforms.
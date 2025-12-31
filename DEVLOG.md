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
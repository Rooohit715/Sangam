const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/Alumini-Registration";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("🔴 MongoDB connection error:", err);
    process.exit(1);
  });

// MongoDB Connection Events
const db = mongoose.connection;
db.on("error", (err) => console.error("🔴 MongoDB Error:", err));
db.once("open", () => console.log("🔹 MongoDB Connection is Open"));
db.on("disconnected", () => console.log("⚠️ MongoDB Disconnected"));

// Handle process termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🚪 MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = mongoose;

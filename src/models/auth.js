const express = require("express");
const bcrypt = require("bcryptjs");
const Register = require("../models/register");
const Idea = require("../models/idea"); // Import Idea model
const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password" });
        }

        req.session.userId = user._id;
        req.session.user = { id: user._id, fullName: user.fullName, email: user.email };

        res.json({ success: true, redirectUrl: "/dash" });

        // req.session.save((err) => {
        //     if (err) {
        //         console.error("🔴 Session save error:", err);
        //         return res.status(500).json({ success: false, message: "Session error" });
        //     }
        //     console.log("✅ Session saved successfully!", req.session);
        //     res.json({ success: true, redirectUrl: "/dash" });
        // });
    } catch (error) {
        console.error("🔴 Login error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("🔴 Logout error:", err);
            return res.status(500).json({ success: false, message: "Logout Failed" });
        }
        res.clearCookie("connect.sid", { path: "/" });
        res.json({ success: true, message: "Logged out successfully", redirectUrl: "/index" });
    });
});

// Check if user is logged in
router.get("/session", (req, res) => {
    if (req.session.userId) {
        res.json({ isLoggedIn: true, user: req.session.user });
    } else {
        res.json({ isLoggedIn: false });
    }
});

// Route for idea.hbs
router.get("/idea", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/index");
    }
    res.render("idea", { user: req.session.user });
});

// 📌 **Save Idea Proposal**
router.post("/idea", async (req, res) => {
    try {
        console.log("🔹 Session Data:", req.session); // Debugging session

        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newIdea = new Idea({
            title,
            description,
            createdBy: req.session.userId
        });

        await newIdea.save();
        res.json({ success: true, message: "Idea submitted successfully!" });

    } catch (error) {
        console.error("🔴 Error saving idea:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});



module.exports = router;

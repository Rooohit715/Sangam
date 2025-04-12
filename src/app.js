const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const port = process.env.PORT || 3000;

require("./db/conn");
const Register = require("./models/register");

// Paths
const static_path = path.join(__dirname, "../front-end/public");
const templates_path = path.join(__dirname, "../front-end/templates/views");
const partials_path = path.join(__dirname, "../front-end/templates/partials");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/Alumini-Registration",
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);



app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

// Debugging Middleware
app.use((req, res, next) => {
 
  next();
});

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/index", (req, res) => res.render("index"));
app.get("/register", (req, res) => res.render("register"));
app.get("/idea", (req, res) =>{
  res.render("idea");
});
app.get("/fund", (req, res) =>{
  res.render("fund")
});
app.get("/progress", (req, res) =>{
  res.render("progress");
});
app.get("/network", (req, res) =>{
  res.render("network")
});


// Dashboard (Protected Route)
app.get("/dash", (req, res) => {
  if (!req.session.userId) {
    console.log("🔴 No session found, redirecting to /index");
    return res.redirect("/index");
  }
  console.log("✅ Session found, rendering dash");
  res.render("dash", { user: req.session.user });
});


// Check session (for frontend)
app.get("/session", (req, res) => {
  res.json({
    isLoggedIn: !!req.session.userId,
    fullName: req.session.user?.fullName,
    userId: req.session.userId,
  });
});

// Register User
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Register({ fullName, email, password: hashedPassword });

    await newUser.save();
    res.redirect("/index");
  } catch (error) {
    console.error("🔴 Registration error:", error);
    res.status(500).send("Server Error");
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Register.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid Email or Password" });
    }

    req.session.userId = user._id;
    req.session.user = { id: user._id, fullName: user.fullName, email: user.email };

    console.log("✅ User logged in, session saved:", req.session); // Debugging

    res.json({ success: true, redirectUrl: "/dash" });
  } catch (error) {
    console.error("🔴 Login error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout Failed");
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/index");
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

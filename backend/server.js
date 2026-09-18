require("dotenv").config();

// Bring Express into Node.js
const express = require("express");

// Bring CORS middleware
const cors = require("cors");

// Bring Mongoose
const mongoose = require("mongoose");

// Bring bcrypt for password hashing
const bcrypt = require("bcrypt");

// Bring JWT
const jwt = require("jsonwebtoken");

// Bring Models
const Task = require("./models/Task");
const User = require("./models/User");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// ===============================
// JWT SECRET KEY
// ===============================

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";


// ===============================
// MONGODB CONNECTION + SERVER
// ===============================

async function startServer() {
    try {
        // Check MongoDB URL
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing in .env file");
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB Connected Successfully!");

        // Start server
        app.listen(5000, () => {
            console.log("Server is Running on http://localhost:5000");
        });

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        if (error.message.includes("bad auth")) {
            console.error("Check the MongoDB database username and password in backend/.env.");
        }
        process.exit(1);
    }
}


// ===============================
// TEST BACKEND
// ===============================

app.get("/", (req, res) => {
    res.send("Backend is Working!!");
});


// ===============================
// GET ALL TASKS
// ===============================

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.json(tasks);

    } catch (error) {
        console.error("Fetch Tasks Error:", error);

        res.status(500).json({
            message: "Failed to Fetch Tasks"
        });
    }
});


// ===============================
// GET SINGLE TASK
// ===============================

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task Not Found!"
            });
        }

        res.json(task);

    } catch (error) {
        console.error("Fetch Task Error:", error);

        res.status(500).json({
            message: "Failed to Fetch Task!"
        });
    }
});


// ===============================
// UPDATE TASK STATUS
// ===============================

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task Not Found!"
            });
        }

        res.json(task);

    } catch (error) {
        console.error("Update Task Error:", error);

        res.status(500).json({
            message: "Failed to Update Task!"
        });
    }
});


// ===============================
// DELETE TASK
// ===============================

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task Not Found!"
            });
        }

        res.json({
            message: "Task Deleted Successfully",
            task: deletedTask
        });

    } catch (error) {
        console.error("Delete Task Error:", error);

        res.status(500).json({
            message: "Failed to Delete Task!"
        });
    }
});


// ===============================
// CREATE NEW TASK
// ===============================

app.post("/api/tasks", async (req, res) => {
    try {
        const newTask = await Task.create(req.body);

        res.status(201).json(newTask);

    } catch (error) {
        console.error("Create Task Error:", error);

        res.status(500).json({
            message: "Failed to Create Task!"
        });
    }
});


// ===============================
// USER LOGIN
// ===============================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found!"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Login successful
        res.json({
            message: "Login Successful!!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Login Failed!"
        });
    }
});


// ===============================
// USER REGISTRATION
// ===============================

app.post("/api/users/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Send response
        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);

        res.status(500).json({
            message: "Registration Failed"
        });
    }
});


// ===============================
// START SERVER
// ===============================

startServer();


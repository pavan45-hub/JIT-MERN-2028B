// bring express in Node.js
const express = require("express");

// installing cors middleware
const cors = require("cors");

// create express app using what we imported
const app = express();

// use cors middleware to handle requests
app.use(cors());

const tasks = [
    {
        id:1,
        title:"Learn React",
        description:"Understanding Components",
        status: "Completed"
    },
    {
        id:2,
        title:"Learn JavaScript",
        description:"Understanding Variables, Functions",
        status: "Pending"
    },  
    {
        id:3,
        title:"Learn Discpline",
        description:"Be in Confident",
        status: "Pending"
    }   
];

app.get("/api/tasks", (req, res) =>{
    res.json(tasks);
});

// API Route (Testing Backend)
app.get("/", (req, res) => {
    res.send("Backend is Working!!")
});

// start the server and listen to port 5000
app.listen(5000, () => {
    console.log("Server is Running on port 5000");
});
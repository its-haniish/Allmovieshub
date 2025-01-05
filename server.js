const express = require("express");
const path = require("path"); // To set the views directory
const app = express();
const PORT = 8080;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for EJS templates (optional, default is './views')
app.set("views", path.join(__dirname, "views"));

// Sample route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Start the server
app.listen(PORT, () => {
    console.log(`The server is live at: http://localhost:${PORT}`);
});

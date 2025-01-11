require("dotenv").config();
const express=require("express");
const path=require("path");
const app=express();
const mongoose=require("mongoose");
const PORT=8080;
const Posts=require("./models/Posts.js");
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    try {
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||20;
        const skip=(page-1)*limit;
        const search=req.query.search||""; // Get search query from the request

        // Build the query object
        const query=search
            ? { title: { $regex: search, $options: "i" } } // Case-insensitive search for "title"
            :{};

        // Fetch movies based on the query
        const movies=await Posts.find(query)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);

        res.render("home.ejs", {
            movies,
            page,
            search, // Pass the search term to the view for persistence
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send("An error occurred while fetching movies.");
    }
});



// Start the server
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/movies").then(() => {
    console.log("Connected to the database.");
    app.listen(PORT, () => {
        console.log(`The server is live at: http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log("Error connecting to the database...");
    console.log(err);
});  
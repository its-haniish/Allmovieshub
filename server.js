require("dotenv").config();
const express=require("express");
const path=require("path");
const app=express();
const mongoose=require("mongoose");
const PORT=process.env.PORT||8080;
const Posts=require("./models/Posts.js");
const Msgs=require("./models/Msgs.js");
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    try {
        const page=parseInt(req.query.page)||1; // Default to page 1
        const limit=parseInt(req.query.limit)||20; // Default to 20 results per page
        const skip=(page-1)*limit;
        const search=req.query.search||""; // Get search query from the request

        // Build the query object for search
        const query=search
            ? { title: { $regex: search, $options: "i" } } // Case-insensitive partial match
            :{};

        // Fetch movies based on the query
        const movies=await Posts.find(query)
            .sort({ uid: 1 }) // Sort by ascending ID (customize as needed)
            .skip(skip) // Skip documents for pagination
            .limit(limit); // Limit the number of results

        // Count total documents matching the query for pagination
        const totalMovies=await Posts.countDocuments(query);
        const totalPages=Math.ceil(totalMovies/limit);

        res.render("home.ejs", {
            movies,
            page,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send("An error occurred while fetching movies.");
    }
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

// Route to handle form submission
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await Msgs.create({ name, email, message });
        res.status(201).json({msg:"Message sent successfully."});
        return;
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({msg:"Server Internal Error."});
    }

  });



app.get("/category/:category", async (req, res) => {
    try {
        const page=parseInt(req.query.page)||1; // Default to page 1
        const limit=parseInt(req.query.limit)||20; // Default to 20 results per page
        const skip=(page-1)*limit; // Skip documents for pagination
        const search=req.query.search||""; // Get search query from the request
        const { category }=req.params; // Get category from the URL parameter

        // Validate and map allowed categories
        const allowedCategories = [
            "amzn-prime-video", 
            "disney-hotstar", 
            "sony-live", 
            "zee5", 
            "jiocinema", 
            "hoichoi", 
            "alt", 
            "bengali", 
            "gujarati", 
            "punjabi", 
            "marathi", 
            "hindi-dubbed-movies", 
            "hollywood-hindi-dubbed", 
            "south-hindi-dubbed", 
            "bollywood-movies", 
            "web-series",
            "dual-audio-movies",
            "netflix"
          ];
          
        if (!allowedCategories.includes(category)) {
            return res.redirect("/"); // Redirect to home if category is invalid
        }

        // Build the query object for search and category
        const query={
            categories: category, // Match exact category within the categories array
            ...(search&&{ title: { $regex: search, $options: "i" } }) // Case-insensitive partial match for title
        };


        // Fetch movies based on the query
        const movies=await Posts.find(query)
            .sort({ uid: -1 }) // Sort by ascending ID (customize as needed)
            .skip(skip) // Skip documents for pagination
            .limit(limit); // Limit the number of results

        // Count total documents matching the query for pagination
        const totalMovies=await Posts.countDocuments(query);
        const totalPages=Math.ceil(totalMovies/limit);


        // Render the home page with fetched data
        res.render("home.ejs", {
            movies,
            page,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching movies:", error); // Log detailed error
        res.status(500).send("An error occurred while fetching movies.");
    }
});

app.get("/:slug", async (req, res) => {
    try {
        const slug=req.params.slug; // Extract slug from the request parameters
        const movie=await Posts.findOne({ slug }); // Fetch the movie using the slug

        if (!movie) {
            return res.redirect("/"); // Handle case where movie is not found
        }

        res.render("movie.ejs", { movie }); // Render the view with the movie data
    } catch (error) {
        console.error("Error fetching movie:", error); // Log the error for debugging
        res.status(500).send("An error occurred while fetching the movie."); // Handle server errors
    }
});


// Start the server
mongoose.connect(process.env.VPS_URI).then(() => {
    console.log("Connected to the database.");
    app.listen(PORT, () => {
        console.log(`The server is live at: http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log("Error connecting to the database...");
    console.log(err);
});  
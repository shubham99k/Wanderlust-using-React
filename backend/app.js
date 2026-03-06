if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());


// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// DB

// MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));


// APP CONFIG
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", (err) => {
    console.log("Error in Mongo session store:", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ROUTES
app.get("/me", (req, res) => res.json(req.user || null));

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
});

app.get("/terms", (req, res) => {
    res.render("terms.ejs");
});

// routers added
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({ message });
});


// SERVER
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

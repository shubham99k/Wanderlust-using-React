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

const normalizeOrigin = (origin) => {
    if (!origin) return "";
    try {
        return new URL(origin).origin;
    } catch {
        return String(origin).trim().replace(/\/+$/, "");
    }
};

const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URLS,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
].filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => normalizeOrigin(value.trim()))
    .filter(Boolean);

const allowedOrigins = new Set(configuredOrigins);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser calls (curl, server-to-server, health checks).
        if (!origin) return callback(null, true);

        const normalized = normalizeOrigin(origin);
        if (allowedOrigins.has(normalized)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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


app.set("trust proxy", 1);

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

// In production, "/" is handled by the React SPA catch-all
if (process.env.NODE_ENV !== "production") {
    app.get("/", (req, res) => {
        res.redirect("/listings");
    });
}

app.get("/privacy", (req, res, next) => {
    if (process.env.NODE_ENV === "production") return next();
    res.render("privacy.ejs");
});

app.get("/terms", (req, res, next) => {
    if (process.env.NODE_ENV === "production") return next();
    res.render("terms.ejs");
});

// routers added
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Serve React frontend in production (same-origin = no cookie issues)
if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendDist));
    app.use((req, res, next) => {
        if (req.method === "GET" && req.accepts("html")) {
            return res.sendFile(path.join(frontendDist, "index.html"));
        }
        next();
    });
}


// ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({ message });
});


// SERVER
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// GET /signup  (kept for legacy, React doesn't use this)
module.exports.renderSignupForm = (req, res) => {
    res.json({ message: "Use the React frontend to sign up." });
};

// POST /signup
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            res.status(201).json({
                _id: registeredUser._id,
                username: registeredUser.username,
                email: registeredUser.email,
            });
        });

    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

// GET /login  (kept for legacy, React doesn't use this)
module.exports.renderLoginForm = (req, res) => {
    res.json({ message: "Use the React frontend to log in." });
};

// POST /login  (passport already authenticated the user at this point)
module.exports.login = async (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    });
};

// GET /logout
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.json({ success: true, message: "Logged out successfully!" });
    });
};

// GET /users/me — current user's profile with listings & reviews
module.exports.getProfile = async (req, res) => {
    const userId = req.user._id;

    const [user, listings, reviews] = await Promise.all([
        User.findById(userId).select("username email"),
        Listing.find({ owner: userId }).select("title image price location country"),
        Review.find({ author: userId }).sort({ createdAt: -1 }),
    ]);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Map each review to its parent listing
    const reviewIds = reviews.map((r) => r._id);
    const parentListings = await Listing.find({ reviews: { $in: reviewIds } })
        .select("title reviews");

    // Build reviewId -> listing lookup
    const reviewToListing = {};
    for (const listing of parentListings) {
        for (const rid of listing.reviews) {
            const ridStr = rid.toString();
            if (reviewIds.some((id) => id.toString() === ridStr)) {
                reviewToListing[ridStr] = { _id: listing._id, title: listing.title };
            }
        }
    }

    const reviewsWithListing = reviews.map((r) => ({
        ...r.toObject(),
        listing: reviewToListing[r._id.toString()] || null,
    }));

    res.json({
        user: { _id: user._id, username: user.username, email: user.email },
        listings,
        reviews: reviewsWithListing,
        stats: { listingCount: listings.length, reviewCount: reviews.length },
    });
};
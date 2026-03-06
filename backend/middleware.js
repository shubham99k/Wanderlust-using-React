const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const mongoose = require("mongoose");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be signed in to perform actions!" });
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // delete req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
    }
    if (!listing.owner._id.equals(req.user._id)) {
        return res.status(403).json({ message: "You are not the owner of this listing!" });
    }
    next();
}

module.exports.isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Convert flat FormData keys like "listing[title]" into nested { listing: { title } }
module.exports.parseFormData = (req, res, next) => {
    if (req.is("multipart/form-data") && !req.body.listing) {
        const nested = {};
        for (const key of Object.keys(req.body)) {
            const match = key.match(/^(\w+)\[(\w+)\]$/);
            if (match) {
                const [, outer, inner] = match;
                if (!nested[outer]) nested[outer] = {};
                nested[outer][inner] = req.body[key];
            } else {
                nested[key] = req.body[key];
            }
        }
        req.body = nested;
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found!" });
    }
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ message: "You are not the author of this review!" });
    }
    next();
}
const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isValidObjectId, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// CREATE REVIEW
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;

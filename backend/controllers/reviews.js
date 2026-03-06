const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// POST /listings/:id/reviews
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // populate author so React gets the full object back
    await newReview.populate("author");

    res.status(201).json(newReview);
};

// DELETE /listings/:id/reviews/:reviewId
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    res.json({ success: true, message: "Review deleted successfully!" });
};
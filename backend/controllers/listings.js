const Listing = require("../models/listing.js");
const { isValidObjectId } = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");

// GET /listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.json(allListings);
};

// GET /listings/new  (kept for legacy, React doesn't use this)
module.exports.renderNewForm = (req, res) => {
    res.json({ message: "Use the React frontend to create a listing." });
};

// GET /listings/:id
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({ path: "reviews", populate: { path: "author" } });

    if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
    }

    res.json(listing);
};

// POST /listings
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await newListing.save();
    await newListing.populate("owner");

    res.status(201).json(newListing);
};

// GET /listings/:id/edit  (kept for legacy, React doesn't use this)
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
    }

    res.json(listing);
};

// PUT /listings/:id
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    await listing.populate("owner");

    res.json(listing);
};

// DELETE /listings/:id
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
    }

    res.json({ success: true, message: "Listing deleted successfully!" });
};
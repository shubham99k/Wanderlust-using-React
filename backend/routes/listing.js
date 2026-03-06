const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, isValidObjectId, validateListing, parseFormData } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// INDEX
router.get("/", wrapAsync(listingController.index));

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// CREATE
router.post("/", isLoggedIn, upload.single('listing[image]'), parseFormData, validateListing, wrapAsync(listingController.createListing));

//  SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// UPDATE
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), parseFormData, validateListing, wrapAsync(listingController.updateListing));

// DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;

require("dotenv").config();
const mongoose = require("mongoose"); // MongoDB object modeling library
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(() => {
        console.log("Connected to DB"); // Log if connected
    })
    .catch(err => console.log(err)); // Log connection error if failed

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6993006094eb8ec198c65fd7" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
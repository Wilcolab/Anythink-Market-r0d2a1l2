// Hey GitHub Copilot, please add an Express route here that returns the last 10 comments
// for an item specified by :itemId, sorted by newest first, and only include
// the fields: _id, body, author, createdAt. Validate that :itemId is a valid
// Mongo ObjectId and respond with 400 if not. If no comments exist, return an empty array.
// (Accept a suggestion below or refine this prompt.)



const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = router;

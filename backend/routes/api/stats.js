const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../auth");

// GET /api/stats - Retrieve marketplace statistics
// This endpoint returns basic statistics about the Anythink marketplace
// including total counts of users, items, and comments
router.get("/", auth.optional, async function(req, res, next) {
  try {
    // Get references to the database models
    const User = mongoose.model("User");
    const Item = mongoose.model("Item");
    const Comment = mongoose.model("Comment");

    // Count total documents in each collection
    const [userCount, itemCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Comment.countDocuments()
    ]);

    // Return statistics as JSON response
    return res.json({
      stats: {
        users: userCount,
        items: itemCount,
        comments: commentCount
      }
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error("Error fetching stats:", error);
    return res.sendStatus(500);
  }
});

module.exports = router;

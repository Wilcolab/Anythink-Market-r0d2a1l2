// Hey GitHub Copilot, please add an Express route here that returns the last 10 comments
// for an item specified by :itemId, sorted by newest first, and only include
// the fields: _id, body, author, createdAt. Validate that :itemId is a valid
// Mongo ObjectId and respond with 400 if not. If no comments exist, return an empty array.
// (Accept a suggestion below or refine this prompt.)



const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

// GET /api/comments/:itemId
// Returns last 10 comments for the given itemId (newest first)
router.get("/:itemId", async function(req, res, next) {
	const { itemId } = req.params;

	// Validate ObjectId
	if (!mongoose.Types.ObjectId.isValid(itemId)) {
		return res.status(400).json({ errors: { itemId: ["must be a valid ObjectId"] } });
	}

	try {
		const comments = await Comment.find({ item: itemId })
			.sort({ createdAt: -1 })
			.limit(10)
			.select("_id body seller createdAt")
			.populate({ path: "seller", select: "username image bio" });

		// Map to minimal shape with author field aliasing seller for clarity
		const result = comments.map(c => ({
			_id: c._id,
			body: c.body,
			author: c.seller ? {
				username: c.seller.username,
				image: c.seller.image,
				bio: c.seller.bio
			} : null,
			createdAt: c.createdAt
		}));

		return res.json({ comments: result });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

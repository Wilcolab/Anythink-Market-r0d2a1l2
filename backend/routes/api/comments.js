/**
 * @module routes/api/comments
 * @description Express router providing API endpoints for working with Comment documents stored via Mongoose.
 *
 * Middleware/Dependencies:
 * @requires express.Router
 * @requires mongoose
 * @requires mongoose.model.Comment
 *
 * Routes:
 *
 * GET /
 * @name GET /
 * @async
 * @description Retrieve all comments.
 * @param {Express.Request} req - Express request object (no URL params expected).
 * @param {Express.Response} res - Express response object.
 * @returns {200} - Array of Comment documents when successful.
 * @returns {500} - Internal server error; responds with the thrown error.
 *
 * DELETE /:id
 * @name DELETE /:id
 * @async
 * @description Delete a single comment by its ObjectId.
 * @param {Express.Request} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - The Comment document id to delete. Must be a valid MongoDB ObjectId.
 * @param {Express.Response} res - Express response object.
 * @returns {200} - The deleted Comment document when deletion succeeds.
 * @returns {400} - Bad request when the provided id is not a valid MongoDB ObjectId. Responds with { message: "Invalid comment id" }.
 * @returns {404} - Not found when no Comment exists with the given id. Responds with { message: "Comment not found" }.
 * @returns {500} - Internal server error; responds with { message: error.message } for unexpected errors.
 *
 * Implementation notes:
 * - Uses mongoose.Types.ObjectId.isValid(id) to validate route id.
 * - Uses Comment.find() to list comments and Comment.findByIdAndDelete(id) to delete a comment by id.
 */
const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

module.exports = router;

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

// add another endpoint for deleting a comment
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid comment id" });
        }

        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(deletedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

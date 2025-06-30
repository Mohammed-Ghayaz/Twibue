import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const comments = await Comment.find({ videoId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        videoId: mongoose.Types.ObjectId(videoId),
        userId: req.user._id,
        content
    })

    const createdComment = await Comment.findById(comment._id)
    if (!createdComment) {
        throw new ApiError(500, "Comment creation failed")
    }

    return res.status(201).json(new ApiResponse(201, createdComment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    )

    if (!updatedComment) {
        throw new ApiError(500, "Comment update failed")
    }

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const comment = await Comment.deleteOne({
        _id: commentId,
    })

    return res.status(200).json(new ApiResponse(200, comment, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
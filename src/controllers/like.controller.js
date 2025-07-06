import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const isValidVideoId = isValidObjectId(videoId)

    if(!isValidVideoId){
        throw new ApiError(400, "Invalid Video ID")
    }

    const likedVideo = await Like.findOne({video: videoId, likedBy: req.user._id})

    if(!likedVideo){
        const videoLike = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        if(!videoLike) {
            throw new ApiError(500, "Error while liking the video")
        }

        return res.status(200).json(new ApiResponse(200, videoLike, "Video liked successfully"))
    }

    else {
        const deleteLikedVideo = await Like.findByIdAndDelete(likedVideo._id)

        if(!deleteLikedVideo){
            throw new ApiError(500, "Error while unliking the video")
        }

        return res.status(200).json(new ApiResponse(200, deleteLikedVideo, "Video unliked successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const isValidCommentId = isValidObjectId(commentId)

    if(!isValidCommentId){
        throw new ApiError(400, "Invalid Comment ID")
    }

    const likedComment = await Like.findOne({comment: commentId, likedBy: req.user._id})

    if(!likedComment){
        const commentLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        if(!commentLike) {
            throw new ApiError(500, "Error while liking the comment")
        }

        return res.status(200).json(new ApiResponse(200, commentLike, "Comment liked successfully"))
    }

    else {
        const deleteLikedComment = await Like.findByIdAndDelete(likedComment._id)

        if(!deleteLikedComment){
            throw new ApiError(500, "Error while unliking the comment")
        }

        return res.status(200).json(new ApiResponse(200, deleteLikedComment, "Comment unliked successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const isValidTweetId = isValidObjectId(tweetId)

    if(!isValidTweetId){
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const likedTweet = await Like.findOne({tweet: tweetId, likedBy: req.user._id})

    if(!likedTweet){
        const TweetLike = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        if(!TweetLike) {
            throw new ApiError(500, "Error while liking the tweet")
        }

        return res.status(200).json(new ApiResponse(200, TweetLike, "Tweet liked successfully"))
    }

    else {
        const deleteLikedTweet = await Like.findByIdAndDelete(likedTweet._id)

        if(!deleteLikedTweet){
            throw new ApiError(500, "Error while unliking the tweet")
        }

        return res.status(200).json(new ApiResponse(200, deleteLikedTweet, "Tweet unliked successfully"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: {$ne: null}
    }).populate('video')

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked Videos Retrieved successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
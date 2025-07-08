import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const totalVideos = await Video.countDocuments({owner: req.user._id})

    const totalSubscribers = await Subscription.countDocuments({channel: req.user._id})

    const result = await Video.aggregate([
        { $match: { owner: req.user._id } },
        { $group: {
            _id: null,
            totalViews: { $sum: "$views" }
        }}
    ]);

    const totalViews = result[0]?.totalViews || 0

    const videoLikesResult = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $unwind: "$videos"
        },
        {
            $match: {"videos.owner": req.user._id}
        },
        {
            $group: {
                _id: null,
                totalVideoLikes: {$sum: 1}
            }
        }
    ])

    const totalVideoLikes = videoLikesResult[0]?.totalVideoLikes || 0

    const tweetLikesResult = await Like.aggregate([
        {
            $lookup: {
                from: "tweets",
                localField: "tweet",
                foreignField: "_id",
                as: "tweets"
            }
        },
        {
            $unwind: "$tweets"
        },
        {
            $match: {"tweets.owner": req.user._id}
        },
        {
            $group: {
                _id: null,
                totalTweetLikes: {$sum: 1}
            }
        }
    ])

    const totalTweetLikes = tweetLikesResult[0]?.totalTweetLikes || 0

    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalVideoLikes,
        totalTweetLikes,
        totalLikes: totalTweetLikes + totalVideoLikes
    }

    return res.status(200).json(new ApiResponse(200, stats, "Channel Stats retrieved successfully"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.find({owner: req.user?._id})

    return res.status(200).json(new ApiResponse(200, videos, "Videos retrieved successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }
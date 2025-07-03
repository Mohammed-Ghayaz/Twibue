import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if(!content){
        throw new ApiError(404, "Content required")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    const createdTweet = await Tweet.findById(tweet._id)

    if(!createdTweet){
        throw new ApiError(500, "Could not upload tweet")
    }

    return res.status(200).json(new ApiResponse(200, createdTweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    const isValidUserId = isValidObjectId(userId)

    if(!isValidUserId){
        throw new ApiError(400, "Invalid User ID")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User does not exists")
    }

    const tweets = await Tweet.find({owner: userId})

    return res.status(200).json(new ApiResponse(200, tweets, "Tweets retrieved successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params

    const isValidTweetId = isValidObjectId(tweetId)

    if(!isValidTweetId){
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized user")
    }

    const {content} = req.body

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweet._id,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )

    if(!updatedTweet){
        throw new ApiError(500, "Couldn't update tweet")
    }

    return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    const isValidTweetId = isValidObjectId(tweetId)

    if(!isValidTweetId){
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Unauthorized user")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(500, "Couldn't delete the tweet")
    }

    return res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
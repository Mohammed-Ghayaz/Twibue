import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId = req.user?._id

    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId
    })

    if(!subscription){
        const createdSubscription = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId
        })

        if(!createdSubscription){
            throw new ApiError(500, "Error while subscribing")
        }

        return res.status(200).json(new ApiResponse(200, createdSubscription, "Subscribed successfully"))
    }

    const deleteSubscription = await Subscription.findByIdAndDelete(subscription._id)

    if(!deleteSubscription){
        throw new ApiError(500, "Error while unsubscribing")
    }

    return res.status(200).json(new ApiResponse(200, deleteSubscription, "Unsubscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const isValidChannelId = isValidObjectId(channelId)
    if(!isValidChannelId){
        throw new ApiError(400, "Invalid Channel ID")
    }

    const channel = await User.findById(channelId)

    if(!channel){
        throw new ApiError(404, "Channel does not exists")
    }

    // Start from User collection, join subscriptions, filter by channel, project user fields
    const subscribersList = await User.aggregate([
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriptions"
            }
        },
        { $unwind: "$subscriptions" },
        {
            $match: {
                "subscriptions.channel": new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, subscribersList, "Subscribers List retrieved"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const isValidSubscriberId = isValidObjectId(subscriberId)
    if(!isValidSubscriberId){
        throw new ApiError(400, "Invalid Subscriber ID")
    }

    const subscriber = await User.findById(subscriberId)

    if(!subscriber){
        throw new ApiError(404, "Subscriber does not exists")
    }

    const channelsList = await User.aggregate([
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "channels"
            }
        },
        { $unwind: "$channels" },
        {
            $match: {
                "channels.subscriber": new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, channelsList, "Channels List retrieved"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
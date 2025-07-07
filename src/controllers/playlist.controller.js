import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const existing = await Playlist.findOne({ name, owner: req.user._id });
    if (existing) {
    throw new ApiError(409, "A playlist with this name already exists");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });

    if (!playlist) {
        throw new ApiError(500, "Error while creating a playlist");
    }

    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    const isValidUserId = isValidObjectId(userId)

    if(!isValidUserId){
        throw new ApiError(400, "Invalid User ID")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const playlists = await Playlist.find({owner: userId}).sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, playlists, "User Playlist retrieved successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const isValidPlaylistId = isValidObjectId(playlistId)

    if(!isValidPlaylistId){
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist retrieved successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const isValidPlaylistId = isValidObjectId(playlistId)
    if(!isValidPlaylistId){
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const isValidVideoId = isValidObjectId(videoId)
    if(!isValidVideoId){
        throw new ApiError(400, "Invalid Video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already exists in the playlist")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Not Authorized to add video")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const isValidPlaylistId = isValidObjectId(playlistId)
    if(!isValidPlaylistId){
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const isValidVideoId = isValidObjectId(videoId)
    if(!isValidVideoId){
        throw new ApiError(400, "Invalid Video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(!playlist.videos.includes(videoId)){
        throw new ApiError(404, "Video not found in the playlist")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Not Authorized to remove video")
    }

    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId)
    await playlist.save()

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from the playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const isValidPlaylistId = isValidObjectId(playlistId)
    if(!isValidPlaylistId){
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Not Authorized to delete the playlist")
    }

    const playlistDelete = await Playlist.findByIdAndDelete(playlistId)

    if(!playlistDelete){
        throw new ApiError(500, "Error while deleting the playlist")
    }

    return res.status(200).json(new ApiResponse(200, playlistDelete, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    const isValidPlaylistId = isValidObjectId(playlistId)
    if(!isValidPlaylistId){
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(401, "Not Authorized to delete the playlist")
    }

    const playlistUpdate = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name: name ? name : playlist.name,
            description: description ? description : playlist.description
        },
        {
            new: true
        }
    )

    if(!playlistUpdate){
        throw new ApiError(500, "Error while updating")
    }

    return res.status(200).json(new ApiResponse(200, playlistUpdate, "Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
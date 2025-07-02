import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query
    
    // Build match object
    const match = {};
    if (query) {
        match.title = { $regex: query, $options: "i" };
    }
    if (userId) {
        match.owner = mongoose.Types.ObjectId(userId);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    const videos = await Video.aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (parseInt(page) - 1) * parseInt(limit) },
        { $limit: parseInt(limit) }
    ]);

    return res.status(200).json(new ApiResponse(200, videos, "Videos retrieved successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const videoFilePath = req.files?.videoFile[0]?.path

    if(!videoFilePath){
        throw new ApiError(400, "Video File Required")
    }

    const thumbnailPath = req.files?.thumbnail[0]?.path

    if(!thumbnailPath){
        throw new ApiError(400, "Thumbnail required")
    }

    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if(!videoFile){
        throw new ApiError(400, "Error while uploading Video File")
    }

    if(!thumbnail){
        throw new ApiError(400, "Error while uploading thumbnail")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user
    })

    const createdVideo = await Video.findById(video._id)

    if(!createdVideo){
        throw new ApiError(500, "Error while registering the video")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video Uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not Found")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video retrieved successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const { title, description } = req.body;
  const thumbnailPath = req.file?.path;
  let thumbnail;

  if (thumbnailPath) {
    thumbnail = await uploadOnCloudinary(thumbnailPath);
  }

  // Option 1 (clean and efficient)
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title || video.title,
        description: description || video.description,
        thumbnail: thumbnail?.url || video.thumbnail
      }
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(500, "Video update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findByIdAndDelete({
            _id: videoId,
        })
    
    return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    const updatePublishStatus = await Video.findByIdAndUpdate(
        video._id,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {new: true}
    )

    if(!updatePublishStatus){
        throw new ApiError(500, "Error while updating Publish status")
    }

    return res.status(200).json(new ApiResponse(200, updatePublishStatus, "Publish status updated"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
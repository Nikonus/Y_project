import API from "./axios";

/**
 * GET ALL VIDEOS
 * Fetch homepage video feed
 */
export const getAllVideos = async () => {
  try {
    const res = await API.get("/videos");
    return { success: true, videos: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch videos.";
    return { success: false, message };
  }
};

/**
 * GET VIDEO BY ID
 * Fetch single video details
 */
export const getVideoById = async (videoId) => {
  try {
    const res = await API.get(`/videos/${videoId}`);
    return { success: true, video: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch video.";
    return { success: false, message };
  }
};

/**
 * UPLOAD VIDEO
 * Uploads new video with thumbnail
 * formData must include:
 * - videoFile
 * - thumbnail
 * - title
 * - description
 */
export const uploadVideo = async (formData) => {
  try {
    const res = await API.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, video: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Video upload failed.";
    return { success: false, message };
  }
};

/**
 * DELETE VIDEO
 * Deletes video owned by logged-in user
 */
export const deleteVideo = async (videoId) => {
  try {
    await API.delete(`/videos/${videoId}`);
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to delete video.";
    return { success: false, message };
  }
};

/**
 * LIKE / UNLIKE VIDEO
 * Toggles like on a video
 */
export const likeVideo = async (videoId) => {
  try {
    const res = await API.post(`/likes/video/${videoId}`);
    return { success: true, data: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to like video.";
    return { success: false, message };
  }
};

/**
 * TOGGLE LIKE ON VIDEO
 */
export const toggleVideoLike = async (videoId) => {
  try {
    const res = await API.post(`/likes/video/${videoId}`);
    return { success: true, data: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to update like.";
    return { success: false, message };
  }
};

/**
 * GET VIDEOS BY CHANNEL (OWNER)
 */
export const getVideosByChannel = async (channelId) => {
  try {
    const res = await API.get(`/videos/channel/${channelId}`);
    return { success: true, videos: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch channel videos.";
    return { success: false, message };
  }
};

/**
 * GET CHANNEL DASHBOARD STATS
 */
export const getChannelStats = async (channelId) => {
  try {
    const res = await API.get(`/dashboard/${channelId}`);
    return { success: true, stats: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch dashboard stats.";
    return { success: false, message };
  }
};

/**
 * UPDATE VIDEO DETAILS
 */
export const updateVideo = async (videoId, data) => {
  try {
    const res = await API.patch(`/videos/${videoId}`, data);
    return { success: true, video: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to update video.";
    return { success: false, message };
  }
};

export const getChannelVideos = async (channelId) => {
  try {
    const res = await API.get(`/videos/channel/${channelId}`);
    return { success: true, videos: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch videos",
    };
  }
};





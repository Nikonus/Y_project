import API from "./axios";

/**
 * Get comments for a video
 */
export const getCommentsByVideo = async (videoId) => {
  try {
    const res = await API.get(`/comments/video/${videoId}`);
    return { success: true, comments: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch comments.";
    return { success: false, message };
  }
};

/**
 * Add new comment
 */
export const addComment = async (videoId, content) => {
  try {
    const res = await API.post(`/comments/video/${videoId}`, { content });
    return { success: true, comment: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to post comment.";
    return { success: false, message };
  }
};

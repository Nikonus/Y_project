import API from "./axios";

/**
 * CREATE PLAYLIST
 */
export const createPlaylist = async (data) => {
  try {
    const res = await API.post("/playlists", data);
    return { success: true, playlist: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create playlist",
    };
  }
};

/**
 * GET USER PLAYLISTS
 */
export const getUserPlaylists = async () => {
  try {
    const res = await API.get("/playlists");
    return { success: true, playlists: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch playlists",
    };
  }
};

/**
 * ADD VIDEO TO PLAYLIST
 */
export const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    await API.post(`/playlists/${playlistId}/videos/${videoId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add video",
    };
  }
};

/**
 * REMOVE VIDEO FROM PLAYLIST
 */
export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    await API.delete(`/playlists/${playlistId}/videos/${videoId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to remove video",
    };
  }
};

/**
 * DELETE PLAYLIST
 */
export const deletePlaylist = async (playlistId) => {
  try {
    await API.delete(`/playlists/${playlistId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete playlist",
    };
  }
};

/**
 * GET PLAYLIST BY ID
 */
export const getPlaylistById = async (playlistId) => {
  try {
    const res = await API.get(`/playlists/${playlistId}`);
    return { success: true, playlist: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch playlist",
    };
  }
};


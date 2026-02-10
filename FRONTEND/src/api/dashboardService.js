import API from "./axios";

export const getChannelStats = async (channelId) => {
  try {
    const res = await API.get(`/dashboard/${channelId}`);
    return { success: true, stats: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch stats",
    };
  }
};

import API from "./axios";

export const getUserProfile = async (userId) => {
  try {
    const res = await API.get(`/users/${userId}`);
    return { success: true, user: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user",
    };
  }
};

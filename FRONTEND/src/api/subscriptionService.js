import API from "./axios";

/**
 * TOGGLE SUBSCRIPTION
 */
export const toggleSubscription = async (channelId) => {
  try {
    const res = await API.post(`/subscriptions/${channelId}`);
    return { success: true, data: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Subscription failed.";
    return { success: false, message };
  }
};

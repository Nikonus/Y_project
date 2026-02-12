import API from "./axios";

/**
 * LOGIN USER
 * Authenticates user and stores access token
 */
export const loginUser = async ({ identifier, password }) => {
  try {
    const res = await API.post(
      "/users/login",
      {
        email: identifier,
        username: identifier,
        password,
      },
      { withCredentials: true }
    );

    const { user, accessToken } = res.data.data;

    // 🔥 STORE TOKEN — THIS WAS MISSING
    localStorage.setItem("accessToken", accessToken);

    return { success: true, user };
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";
    return { success: false, message };
  }
};


/**
 * REGISTER USER
 * Creates account and logs user in if token returned
 */
export const registerUser = async (data) => {
  try {
    const res = await API.post("/users/register", data, {
      withCredentials: true,   // 🔥 REQUIRED for cookies
    });

    const { user } = res.data.data;

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};



/**
 * LOGOUT USER
 * Ends session and clears token
 */
export const logoutUser = async () => {
  try {
    await API.post("/users/logout");
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    localStorage.removeItem("accessToken");
  }
  return { success: true };
};

/**
 * GET CURRENT USER
 * Restores session on page reload
 */
export const getCurrentUser = async () => {
  try {
    const res = await API.get("/users/me");
    return { success: true, user: res.data.data };
  } catch (error) {
    localStorage.removeItem("accessToken");
    return { success: false };
  }
};

/**
 * UPDATE PROFILE
 * Updates logged-in user info
 */
export const updateProfile = async (data) => {
  try {
    const res = await API.patch("/users/update-profile", data);
    return { success: true, user: res.data.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Profile update failed.";
    return { success: false, message };
  }
};

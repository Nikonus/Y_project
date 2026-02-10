import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../api/userService";
import { getChannelVideos } from "../api/videoService";
import { getChannelStats } from "../api/dashboardService";
import VideoCard from "../components/VideoCard";

const Profile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const [userRes, videoRes, statsRes] = await Promise.all([
        getUserProfile(userId),
        getChannelVideos(userId),
        getChannelStats(userId),
      ]);

      if (userRes.success) setUser(userRes.user);
      if (videoRes.success) setVideos(videoRes.videos);
      if (statsRes.success) setStats(statsRes.stats);

      setLoading(false);
    };

    loadProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-page">
      {/* Cover */}
      <div className="cover-image">
        <img src={user.coverImage} alt="cover" width="100%" />
      </div>

      {/* Avatar + Info */}
      <div className="profile-header">
        <img
          src={user.avatar}
          alt="avatar"
          width="120"
          style={{ borderRadius: "50%" }}
        />
        <h2>{user.fullName}</h2>
        <p>@{user.username}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="profile-stats">
          <p>Subscribers: {stats.totalSubscribers}</p>
          <p>Total Videos: {stats.totalVideos}</p>
          <p>Total Views: {stats.totalViews}</p>
        </div>
      )}

      {/* Videos */}
      <h3>Videos</h3>
      {videos.length === 0 ? (
        <p>No videos uploaded</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

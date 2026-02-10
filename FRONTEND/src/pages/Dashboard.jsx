import { useEffect, useState, useContext } from "react";
import { getChannelStats } from "../api/videoService";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const res = await getChannelStats(user._id);

      if (res.success) {
        setStats(res.stats);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!stats) return null;

  return (
    <div className="dashboard-container">
      <h2>Your Channel Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Videos</h3>
          <p>{stats.totalVideos}</p>
        </div>

        <div className="stat-card">
          <h3>Total Views</h3>
          <p>{stats.totalViews}</p>
        </div>

        <div className="stat-card">
          <h3>Total Likes</h3>
          <p>{stats.totalLikes}</p>
        </div>

        <div className="stat-card">
          <h3>Total Subscribers</h3>
          <p>{stats.totalSubscribers}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

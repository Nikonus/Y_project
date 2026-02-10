import { useEffect, useState } from "react";
import { getAllVideos } from "../api/videoService";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getAllVideos();

      if (res.success) {
        setVideos(res.videos);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
      <h2>Latest Videos</h2>

      {videos.length === 0 ? (
        <p>No videos available.</p>
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

export default Home;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideosByChannel } from "../api/videoService";
import VideoCard from "../components/VideoCard";

const Channel = () => {
  const { channelId } = useParams();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChannelVideos = async () => {
      const res = await getVideosByChannel(channelId);

      if (res.success) {
        setVideos(res.videos);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchChannelVideos();
  }, [channelId]);

  if (loading) return <p>Loading channel...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="channel-container">
      <h2>Channel Videos</h2>

      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
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

export default Channel;

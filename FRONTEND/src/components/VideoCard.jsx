import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/watch/${video._id}`} className="video-link">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="video-thumbnail"
        />
      </Link>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-owner">{video.owner?.username || "Unknown"}</p>
        <p className="video-meta">
          {video.views} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getVideoById,
  toggleVideoLike,
  deleteVideo,
} from "../api/videoService";
import CommentSection from "../components/CommentSection";
import { AuthContext } from "../context/AuthContext";
import { toggleSubscription } from "../api/subscriptionService";
import { getUserPlaylists, addVideoToPlaylist } from "../api/playlistService";


const Watch = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
const [showPlaylistBox, setShowPlaylistBox] = useState(false);


  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getVideoById(videoId);

      if (res.success) {
        setVideo(res.video);
        setLikes(res.video.likesCount || 0);
        setLiked(res.video.isLiked || false);
        setSubscribed(res.video.isSubscribed || false);
        setSubscribersCount(res.video.subscribersCount || 0);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchVideo();
  }, [videoId]);

  const handleLike = async () => {
    const res = await toggleVideoLike(videoId);
    if (res.success) {
      setLiked(res.data.liked);
      setLikes(res.data.likesCount);
    }
  };
  useEffect(() => {
  if (!user) return;
  getUserPlaylists().then((res) => {
    if (res.success) setPlaylists(res.playlists);
  });
}, [user]);

const handleAddToPlaylist = async (playlistId) => {
  const res = await addVideoToPlaylist(playlistId, videoId);
  if (res.success) {
    alert("Added to playlist!");
    setShowPlaylistBox(false);
  }
};



  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;

    const res = await toggleSubscription(video.owner._id);
    if (res.success) {
      setSubscribed(res.data.subscribed);
      setSubscribersCount(res.data.subscribersCount);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;

    const res = await deleteVideo(videoId);
    if (res.success) {
      navigate("/");
    } else {
      alert(res.message);
    }
  };

  if (loading) return <p>Loading video...</p>;
  if (error) return <p>{error}</p>;
  if (!video) return <p>Video not found</p>;

  const isOwner = user && video.owner?._id === user._id;

  return (
    <div className="watch-container">
      <div className="video-player">
        <video src={video.videoFile} controls width="100%" />
      </div>

      <div className="video-details">
        <h2>{video.title}</h2>
        <p>
          {video.views} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>

        {/* 👤 Owner + Subscribe */}
        <div className="video-owner">
          <strong>{video.owner?.username || "Unknown Creator"}</strong>

          {user && user._id !== video.owner?._id && (
            <button onClick={handleSubscribe} style={{ marginLeft: "10px" }}>
              {subscribed ? "Subscribed" : "Subscribe"} ({subscribersCount})
            </button>
          )}
        </div>

        <p className="video-description">{video.description}</p>

        {/* 👍 Like Button */}
        {user && (
          <button onClick={handleLike}>
            {liked ? "💙 Liked" : "🤍 Like"} ({likes})
          </button>
        )}

        {/* 🗑 Delete Button (Owner Only) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Delete Video
          </button>
        )}
      </div>
      {user && (
  <div style={{ marginTop: "10px" }}>
    <button onClick={() => setShowPlaylistBox(!showPlaylistBox)}>
      Save to Playlist
    </button>

    {showPlaylistBox && (
      <div className="playlist-dropdown">
        {playlists.length === 0 ? (
          <p>No playlists found</p>
        ) : (
          playlists.map((pl) => (
            <div key={pl._id}>
              <button onClick={() => handleAddToPlaylist(pl._id)}>
                {pl.name}
              </button>
            </div>
          ))
        )}
      </div>
    )}
  </div>
)}


      <CommentSection videoId={videoId} />
    </div>
  );
};

export default Watch;

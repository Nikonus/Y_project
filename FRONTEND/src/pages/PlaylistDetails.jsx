import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById, removeVideoFromPlaylist } from "../api/playlistService";
import VideoCard from "../components/VideoCard";

const PlaylistDetails = () => {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylist = async () => {
      const res = await getPlaylistById(playlistId);

      if (res.success) {
        setPlaylist(res.playlist);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleRemove = async (videoId) => {
    const res = await removeVideoFromPlaylist(playlistId, videoId);
    if (res.success) {
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    }
  };

  if (loading) return <p>Loading playlist...</p>;
  if (error) return <p>{error}</p>;
  if (!playlist) return <p>Playlist not found</p>;

  return (
    <div className="playlist-details-container">
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>

      {playlist.videos.length === 0 ? (
        <p>No videos in this playlist.</p>
      ) : (
        <div className="video-grid">
          {playlist.videos.map((video) => (
            <div key={video._id}>
              <VideoCard video={video} />
              <button onClick={() => handleRemove(video._id)}>
                Remove from Playlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetails;

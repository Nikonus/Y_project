import { useEffect, useState } from "react";
import { getUserPlaylists, deletePlaylist } from "../api/playlistService";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    getUserPlaylists().then((res) => {
      if (res.success) setPlaylists(res.playlists);
    });
  }, []);

  const handleDelete = async (id) => {
    const res = await deletePlaylist(id);
    if (res.success) {
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div>
      <h2>Your Playlists</h2>
      {playlists.map((pl) => (
        <div key={pl._id}>
          <h3>{pl.name}</h3>
          <button onClick={() => handleDelete(pl._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Playlists;

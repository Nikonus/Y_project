import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlaylist } from "../api/playlistService";

const CreatePlaylist = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Playlist name is required");
      return;
    }

    setLoading(true);
    const res = await createPlaylist(formData);
    setLoading(false);

    if (res.success) {
      navigate("/playlists"); // Go to playlists page
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="create-playlist-container">
      <h2>Create New Playlist</h2>

      <form onSubmit={handleSubmit} className="create-playlist-form">
        <input
          type="text"
          name="name"
          placeholder="Playlist Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;

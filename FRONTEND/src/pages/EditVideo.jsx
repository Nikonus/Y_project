import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, updateVideo } from "../api/videoService";

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getVideoById(videoId);

      if (res.success) {
        setFormData({
          title: res.video.title,
          description: res.video.description,
        });
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchVideo();
  }, [videoId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await updateVideo(videoId, formData);

    setSaving(false);

    if (res.success) {
      navigate(`/watch/${videoId}`);
    } else {
      setError(res.message);
    }
  };

  if (loading) return <p>Loading video details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-video-container">
      <h2>Edit Video</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Video"}
        </button>
      </form>
    </div>
  );
};

export default EditVideo;

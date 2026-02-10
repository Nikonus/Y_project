import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/videoService";

const Upload = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === "videoFile") {
      setVideoFile(e.target.files[0]);
    } else if (e.target.name === "thumbnail") {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!videoFile || !thumbnail) {
      setError("Please upload both video and thumbnail.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("videoFile", videoFile);
    data.append("thumbnail", thumbnail);

    setLoading(true);
    const res = await uploadVideo(data);
    setLoading(false);

    if (res.success) {
      navigate(`/watch/${res.video._id}`);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Video Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>
          Video File:
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </label>

        <label>
          Thumbnail:
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default Upload;


import { useEffect, useState, useContext } from "react";
import { getCommentsByVideo, addComment } from "../api/commentService";
import { AuthContext } from "../context/AuthContext";

const CommentSection = ({ videoId }) => {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await getCommentsByVideo(videoId);
      if (res.success) setComments(res.comments);
      setLoading(false);
    };
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await addComment(videoId, content);
    if (res.success) {
      setComments((prev) => [res.comment, ...prev]);
      setContent("");
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {user && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="comment">
              <strong>{c.owner?.username || "User"}</strong>
              <p>{c.content}</p>
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

import { useState } from "react";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "Not scheduled");

export default function PostCard({ post, onPublish, onSchedule, onDelete }) {
  const [when, setWhen] = useState("");
  const published = post.status === "PUBLISHED";

  return (
    <div className="post-card">
      <div className="post-head">
        <span className="platform">{post.platform || "No platform"}</span>
        <span className={`badge ${post.status.toLowerCase()}`}>{post.status}</span>
      </div>

      <p className="post-content">{post.content}</p>
      <p className="post-date">📅 {formatDate(post.scheduledAt)}</p>

      {published && (
        <div className="metrics">
          <span>👍 {post.likes}</span>
          <span>🔁 {post.shares}</span>
          <span>👁 {post.reach}</span>
        </div>
      )}

      <div className="post-actions">
        {!published && (
          <>
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="inline-input"
            />
            <button
              className="secondary"
              disabled={!when}
              onClick={() => {
                onSchedule(post.id, when);
                setWhen("");
              }}
            >
              Schedule
            </button>
            <button onClick={() => onPublish(post.id)}>Publish now</button>
          </>
        )}
        <button className="danger" onClick={() => onDelete(post.id)}>Delete</button>
      </div>
    </div>
  );
}
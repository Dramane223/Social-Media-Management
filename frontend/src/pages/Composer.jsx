import Spinner from "../components/Spinner";
import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios";
import PostCard from "../components/PostCard";

const PLATFORMS = ["Twitter", "Instagram", "LinkedIn", "Facebook"];
const MAX_LENGTH = 1000;
const emptyForm = { content: "", platform: "Twitter", scheduledAt: "" };

// datetime-local gives "2026-12-15T10:00"; make sure seconds are present
const normalize = (value) => (value ? (value.length === 16 ? value + ":00" : value) : null);

export default function Composer() {
  const [form, setForm] = useState(emptyForm);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get("/posts")
      .then(({ data }) => setPosts(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoadingPosts(false));
  }, []);

  const notify = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const replacePost = (updated) =>
    setPosts((current) => current.map((p) => (p.id === updated.id ? updated : p)));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/posts", {
        content: form.content,
        platform: form.platform,
        scheduledAt: normalize(form.scheduledAt),
      });
      setPosts((current) => [data, ...current]);
      setForm(emptyForm);
      notify(data.status === "SCHEDULED" ? "Post scheduled ✔" : "Draft saved ✔");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id) => {
    setError("");
    try {
      const { data } = await api.post(`/posts/${id}/publish`);
      replacePost(data);
      notify("Post published ✔");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSchedule = async (id, when) => {
    setError("");
    try {
      const { data } = await api.put(`/posts/${id}/schedule`, { scheduledAt: normalize(when) });
      replacePost(data);
      notify("Post scheduled ✔");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setError("");
    try {
      await api.delete(`/posts/${id}`);
      setPosts((current) => current.filter((p) => p.id !== id));
      notify("Post deleted ✔");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h2>Post Composer</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form className="composer" onSubmit={handleSubmit}>
        <label>Content</label>
        <textarea
          name="content"
          rows="4"
          maxLength={MAX_LENGTH}
          placeholder="What do you want to share?"
          value={form.content}
          onChange={handleChange}
          required
        />
        <div className="counter">{form.content.length} / {MAX_LENGTH}</div>

        <div className="row">
          <div>
            <label>Platform</label>
            <select name="platform" value={form.platform} onChange={handleChange}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Schedule (optional)</label>
            <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" disabled={submitting || !form.content.trim()}>
          {submitting ? "Saving..." : form.scheduledAt ? "Schedule post" : "Save as draft"}
        </button>
      </form>

      <h3>Your posts</h3>
      {loadingPosts && <Spinner label="Loading posts..." />}
      {!loadingPosts && posts.length === 0 && <p className="muted">No posts yet. Create your first one above.</p>}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPublish={handlePublish}
          onSchedule={handleSchedule}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
import { useState } from "react";
import api from "../api/axios";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const createPaste = async () => {
    try {
      setError("");
      setResultUrl("");

      const payload = {
        content: content
      };

      if (ttlSeconds.trim() !== "") payload.ttl_seconds = Number(ttlSeconds);
      if (maxViews.trim() !== "") payload.max_views = Number(maxViews);

      const res = await api.post("/pastes", payload);

      setResultUrl(res.data.url);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create paste");
    }
  };

  return (
    <div style={styles.container}>
      <h1>📋 Pastebin Lite</h1>

      <textarea
        placeholder="Write your paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
      />

      <input
        placeholder="TTL (seconds, optional)"
        value={ttlSeconds}
        onChange={(e) => setTtlSeconds(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Max Views (optional)"
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
        style={styles.input}
      />

      <button onClick={createPaste} style={styles.button}>
        Create Paste
      </button>

      {resultUrl && (
        <p>
          ✅ Shareable URL:{" "}
          <a href={resultUrl} target="_blank" rel="noreferrer">
            {resultUrl}
          </a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "40px auto", padding: 20 },
  textarea: { width: "100%", height: 200, padding: 10 },
  input: { width: "100%", padding: 10, marginTop: 10 },
  button: { marginTop: 12, padding: 10, width: "100%" }
};

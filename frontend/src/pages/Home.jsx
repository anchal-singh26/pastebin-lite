import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const navigate = useNavigate();

  const createPaste = async () => {
    const res = await api.post("/pastes", {
      content,
      ttl: ttl ? Number(ttl) : null,
    });

    navigate(`/paste/${res.data.id}`);
  };

  return (
    <div className="card">
      <h1>📋 Pastebin Lite</h1>

      <textarea
        placeholder="Write your paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        placeholder="TTL (minutes, optional)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
      />

      <button onClick={createPaste}>Create Paste</button>
    </div>
  );
}

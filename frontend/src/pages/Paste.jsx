import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Paste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/pastes/${id}`)
      .then((res) => setPaste(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("❌ Paste not found / expired / views exceeded");
        } else {
          setError("⚠️ Something went wrong");
        }
      });
  }, [id]);

  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;
  if (!paste) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>📄 Paste</h2>
      <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
        {paste.content}
      </pre>

      <p>
        Remaining Views:{" "}
        {paste.remaining_views === null ? "Unlimited" : paste.remaining_views}
      </p>

      <p>
        Expires At: {paste.expires_at === null ? "No expiry" : paste.expires_at}
      </p>
    </div>
  );
}

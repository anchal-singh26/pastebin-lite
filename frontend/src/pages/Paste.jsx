import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Paste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/pastes/${id}`)
      .then((res) => setPaste(res.data))
      .catch((err) => {
        if (err.response?.status === 410) {
          setError("⏳ This paste has expired");
        } else if (err.response?.status === 404) {
          setError("❌ Paste not found");
        } else {
          setError("⚠️ Something went wrong");
        }
      });
  }, [id]);

  if (error) {
    return (
      <div style={styles.center}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!paste) {
    return <div style={styles.center}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>📄 Paste</h2>
      <pre style={styles.box}>{paste.content}</pre>
      <p>👀 Views: {paste.views}</p>
    </div>
  );
}

const styles = {
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
  },
  box: {
    background: "#111",
    color: "#0f0",
    padding: "16px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
  },
};
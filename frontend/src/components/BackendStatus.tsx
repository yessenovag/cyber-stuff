import { useEffect, useState } from "react";

export default function BackendStatus() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((res) => res.text())
      .then((text) => setStatus(text))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return <p className="backend-status">{status}</p>;
}

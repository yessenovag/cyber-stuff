import { useEffect, useState } from "react";

export default function BackendStatus() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("https://cybersafe-api-v3-dzf7cdd7czewged8.spaincentral-01.azurewebsites.net/")
      .then((res) => res.text())
      .then((text) => setStatus(text))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return <p className="backend-status">{status}</p>;
}

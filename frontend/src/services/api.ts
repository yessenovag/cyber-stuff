const BASE_URL = "https://cybersafe-api-v3-dzf7cdd7czewged8.spaincentral-01.azurewebsites.net/api";

export const apiPost = async (url: string, body: any, token?: string) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const apiGet = async (url: string, token?: string) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

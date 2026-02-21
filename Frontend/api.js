
export const API_BASE_URL = "http://alb-todo-api-8992559.ap-southeast-4.elb.amazonaws.com";

export async function apiFetch(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...headers,
    },
    body,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (data && data.detail && (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))) ||
      (typeof data === "string" && data) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}
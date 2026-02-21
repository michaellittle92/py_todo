// Link to ALB - May need to update to HTTPS
const API_BASE = "http://alb-todo-api-8992559.ap-southeast-4.elb.amazonaws.com";

const TOKEN_KEY = "access_token";

const loggedOut = document.getElementById("logged-out");
const loggedIn = document.getElementById("logged-in");
const errorEl = document.getElementById("error");
const outputEl = document.getElementById("output");

const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout");
const showTokenBtn = document.getElementById("show-token");

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function setView() {
  const token = getToken();
  loggedOut.classList.toggle("hidden", !!token);
  loggedIn.classList.toggle("hidden", !token);
  errorEl.textContent = "";
  outputEl.textContent = "";
}

setView();

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    // FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);

    const res = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // FastAPI typically returns { detail: "..." }
      const msg = data?.detail || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    if (!data?.access_token) throw new Error("Login response missing access_token");

    setToken(data.access_token);
    setView();
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  setView();
});

// Helper to decode JWT payload 
function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(json);
}

showTokenBtn.addEventListener("click", () => {
  const token = getToken();
  if (!token) return;

  const payload = decodeJwtPayload(token);
  outputEl.textContent = JSON.stringify(payload, null, 2);
});
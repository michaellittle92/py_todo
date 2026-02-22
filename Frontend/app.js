const API_BASE = "https://api.michaellittle.io";
const TOKEN_KEY = "access_token";

const errorEl = document.getElementById("error");
const loginForm = document.getElementById("login-form");

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// If already logged in, skip login page
if (getToken()) {
  window.location.href = "./todos.html";
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
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
      throw new Error(data?.detail || `HTTP ${res.status}`);
    }

    if (!data?.access_token) {
      throw new Error("Login response missing access_token");
    }

    setToken(data.access_token);

    window.location.href = "./todos.html";
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
const API_BASE = "https://api.michaellittle.io";
const TOKEN_KEY = "access_token";

const TODOS_URL = `${API_BASE}/`;

const errorEl = document.getElementById("error");
const outputEl = document.getElementById("output");
const logoutBtn = document.getElementById("logoutBtn");
const todoBody = document.getElementById("todoBody");

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "./index.html";
}

logoutBtn.addEventListener("click", logout);

async function deleteTodo(id) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/todo/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || `HTTP ${res.status}`);
  }
}

function renderTodos(todos) {
  todoBody.innerHTML = "";

  if (!todos || todos.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    cell.textContent = "No todos found";
    row.appendChild(cell);
    todoBody.appendChild(row);
    return;
  }

  for (const t of todos) {
    const row = document.createElement("tr");

    row.innerHTML = `
  <td>${t.id}</td>
  <td>${t.title}</td>
  <td>${t.description || ""}</td>
  <td>${t.priority}</td>
  <td>${t.complete ? "Yes" : "No"}</td>
  <td><button type="button" data-id="${t.id}">Delete</button></td>
`;
    //delete logic 
  const btn = row.querySelector('button[data-id]');
  btn.addEventListener("click", async () => {
  const id = btn.dataset.id;

  try {
    btn.disabled = true;
    btn.textContent = "Deleting...";
    await deleteTodo(id);
    row.remove();
    if (!todoBody.querySelector("tr")) renderTodos([]);
  } catch (err) {
    btn.disabled = false;
    btn.textContent = "Delete";
    errorEl.textContent = err.message;
  }
});
    //----
    todoBody.appendChild(row);
  }
}

async function loadTodos() {
  errorEl.textContent = "";

  const token = getToken();
  if (!token) {
    logout();
    return;
  }

  const res = await fetch(TODOS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.detail || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  renderTodos(data);
}

loadTodos().catch((err) => {
  errorEl.textContent = err.message;

  if (err.message.toLowerCase().includes("auth")) {
    logout();
  }
});

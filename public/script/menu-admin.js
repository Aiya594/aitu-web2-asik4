const API_BASE = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

function showAdminMsg(text, type = "success") {
  const el = document.getElementById("adminMsg");
  if (!el) return;
  el.classList.remove(
    "d-none",
    "alert-success",
    "alert-danger",
    "alert-warning",
    "alert-info",
  );
  el.classList.add(`alert-${type}`);
  el.textContent = text;
}

async function fetchProfile() {
  const token = getToken();

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

function renderMenuItemCard(item) {
  const name = escapeHtml(item.name);
  const desc = escapeHtml(item.description || "");
  const category = escapeHtml(item.category || "other");
  const price = formatPrice(item.price);

  let img = item.imageUrl?.trim();
  if (!img) {
    img = "../images/past.jfif";
  }

  return `
    <div class="menu-card" data-category="${category}">
      <img src="${escapeHtml(img)}" alt="${name}" />
      <h3>${name}</h3>
      <p>${desc}</p>
      <span class="price">${price}</span>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(price) {
  const p = Number(price);
  if (Number.isNaN(p)) return "";
  return `${p}tenge`;
}

async function loadMenu() {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const res = await fetch(`${API_BASE}/api/menu`, { method: "GET" });
  if (!res.ok) return;

  const items = await res.json();

  grid.innerHTML = "";

  items.forEach((item) => {
    grid.insertAdjacentHTML("beforeend", renderMenuItemCard(item));
  });
}

async function createDish(payload) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/menu`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || "Failed to create dish";
    throw new Error(msg);
  }

  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("API_BASE =", API_BASE);

  await loadMenu();

  const profile = await fetchProfile();
  const adminPanel = document.getElementById("adminPanel");
  console.log("PROFILE =", profile);

  const role = profile?.role || profile?.user?.role;

  if (role === "admin" && adminPanel) {
    adminPanel.style.display = "block";
  }

  const form = document.getElementById("adminMenuForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      showAdminMsg("", "info");

      const payload = {
        name: document.getElementById("dishName").value.trim(),
        category: document.getElementById("dishCategory").value,
        price: Number(document.getElementById("dishPrice").value),
        description: document.getElementById("dishDescription").value.trim(),
        imageUrl: document.getElementById("dishImageUrl").value.trim(),
        isAvailable: document.getElementById("dishAvailable").checked,
      };

      const created = await createDish(payload);

      showAdminMsg("Dish added successfully", "success");
      form.reset();
      document.getElementById("dishAvailable").checked = true;

      await loadMenu();
    } catch (err) {
      showAdminMsg(err.message || "Error", "danger");
    }
  });
});

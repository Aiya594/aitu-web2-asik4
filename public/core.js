(() => {
  async function api(path, method = "GET", body) {
    const res = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function setMsg(elId, text, ok = false) {
    const el = $(elId);
    if (!el) return;
    el.textContent = text;
    el.className = ok ? "small mt-2 text-success" : "small mt-2 text-danger";
  }

  function isAuthPage() {
    return (
      window.location.pathname.endsWith("/auth.html") ||
      window.location.pathname.endsWith("\\auth.html")
    );
  }

  function authPageHref() {
    const path = window.location.pathname.replace(/\\/g, "/");
    return path.includes("/pages/") ? "auth.html" : "pages/auth.html";
  }

  async function initAuthButton() {
    const btn = $("authBtn");
    if (!btn) return;

    try {
      const data = await api("/api/users/profile");

      btn.textContent = "Logout";
      btn.setAttribute("href", "#");

      btn.onclick = async (e) => {
        e.preventDefault();
        try {
          await api("/api/auth/logout", "POST");
        } catch (_) {}
        window.location.reload();
      };

      console.log("Logged in as:", data.user?.email);
    } catch (_) {
      btn.textContent = "Login";
      btn.setAttribute("href", authPageHref());
      btn.onclick = null;
    }
  }

  function initAuthForms() {
    if (!isAuthPage()) return;

    const registerForm = $("registerForm");
    const loginForm = $("loginForm");

    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = $("regName")?.value.trim();
        const email = $("regEmail")?.value.trim();
        const password = $("regPassword")?.value;

        if (!name || !email || !password) {
          setMsg("registerMsg", "name, email, password are required");
          return;
        }

        try {
          await api("/api/auth/register", "POST", { name, email, password });
          setMsg("registerMsg", "Registered. Now login on the right.", true);

          if ($("loginEmail")) $("loginEmail").value = email;
          if ($("regPassword")) $("regPassword").value = "";
          $("loginPassword")?.focus();
        } catch (err) {
          setMsg("registerMsg", err.message);
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = $("loginEmail")?.value.trim();
        const password = $("loginPassword")?.value;

        if (!email || !password) {
          setMsg("loginMsg", "email and password are required");
          return;
        }

        try {
          await api("/api/auth/login", "POST", { email, password });
          setMsg("loginMsg", "Logged in. Redirecting...", true);

          setTimeout(() => {
            window.location.href = "../index.html";
          }, 400);
        } catch (err) {
          setMsg("loginMsg", err.message);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    initAuthForms();
    await initAuthButton();
  });
})();

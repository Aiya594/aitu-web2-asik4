$(document).ready(function () {
  const API_BASE = "http://localhost:3000";

  const $form = $("#bookingForm");
  const $feedback = $("#bookingFeedback");
  const $tbody = $("#bookingTable tbody");

  function tokenHeader() {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  function showFeedback(text, type = "success") {
    $feedback.removeClass().addClass(`alert alert-${type}`).text(text).show();
  }

  function hideFeedback() {
    $feedback.hide().text("").removeClass();
  }

  async function getProfile() {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: "GET",
      headers: { ...tokenHeader() },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  }

  async function fillProfile() {
    try {
      const user = await getProfile();
      $("#name").val(user.name || user.fullName || "");
      $("#email").val(user.email || "");
    } catch (e) {
      console.warn("Profile load failed:", e.message);
      // можно редирект на login:
      // window.location.href = "login.html";
    }
  }

  async function listBookings() {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "GET",
      headers: { ...tokenHeader() },
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.bookings || [];
  }

  function toLocalDate(d) {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function toLocalTime(d) {
    const dt = new Date(d);
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${hh}:${mi}`;
  }

  function renderRows(bookings) {
    $tbody.empty();

    if (!bookings.length) {
      $tbody.append(`
        <tr>
          <td colspan="6" class="text-center">No bookings yet</td>
        </tr>
      `);
      return;
    }

    for (const b of bookings) {
      const date = toLocalDate(b.dateTime);
      const time = toLocalTime(b.dateTime);

      $tbody.append(`
        <tr data-id="${b._id}">
          <td>${escapeHtml(b.fullName)}</td>
          <td>${escapeHtml(b.email || "")}</td>
          <td>${escapeHtml(String(b.people))}</td>
          <td>${escapeHtml(date)}</td>
          <td>${escapeHtml(time)}</td>
          <td>
            <button class="btn btn-sm btn-danger js-delete">Delete</button>
          </td>
        </tr>
      `);
    }
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function refreshTable() {
    const bookings = await listBookings();
    renderRows(bookings);
  }

  async function createBooking(payload) {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...tokenHeader(),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok) {
      const msg =
        (data && (data.message || data.error)) || text || "Request failed";
      throw new Error(msg);
    }

    return data;
  }

  $form.on("submit", async function (e) {
    e.preventDefault();
    hideFeedback();

    const fullName = $("#name").val().trim();
    const email = $("#email").val().trim();
    const peopleRaw = $("#people").val();
    const date = $("#date").val();
    const time = $("#time").val();

    if (!fullName || !email || !peopleRaw || !date || !time) {
      showFeedback("Please fill all fields.", "warning");
      return;
    }

    const people = peopleRaw === "5+" ? 5 : Number(peopleRaw);
    if (Number.isNaN(people) || people < 1 || people > 20) {
      showFeedback("People must be between 1 and 20.", "warning");
      return;
    }

    const dateTimeIso = new Date(`${date}T${time}:00`).toISOString();

    const payload = {
      fullName,
      email,
      people,
      dateTime: dateTimeIso,
      notes: "",
    };

    try {
      await createBooking(payload);
      showFeedback("Booking created!", "success");

      $("#people").val("");
      $("#date").val("");
      $("#time").val("");

      await refreshTable();
    } catch (err) {
      showFeedback(`Error: ${err.message}`, "danger");
    }
  });

  async function deleteBooking(id) {
    const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { ...tokenHeader() },
      credentials: "include",
    });

    if (!res.ok) throw new Error(await res.text());
  }

  $tbody.on("click", ".js-delete", async function () {
    const id = $(this).closest("tr").data("id");
    try {
      await deleteBooking(id);
      showFeedback("Booking deleted.", "info");
      await refreshTable();
    } catch (err) {
      showFeedback(`Error: ${err.message}`, "danger");
    }
  });

  (async function init() {
    await fillProfile();
    await refreshTable();
  })();
});

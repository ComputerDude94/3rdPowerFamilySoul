(function () {
  const B = window.BAND;
  const $ = (id) => document.getElementById(id);
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const pad = (n) => String(n).padStart(2, "0");
  const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const today = new Date();
  const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());

  const showsByDate = {};
  B.shows.forEach((s) => (showsByDate[s.date] = s));
  const open = new Set(B.openDates);
  const booked = new Set(B.bookedDates);

  function statusOf(k) {
    if (showsByDate[k]) return "show";
    if (booked.has(k)) return "booked";
    if (open.has(k)) return "open";
    return "";
  }

  // Shows
  const upcoming = B.shows.filter((s) => s.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
  $("show-list").innerHTML = upcoming.length
    ? upcoming.map((s) => {
        const [y, m, d] = s.date.split("-").map(Number);
        return `<div class="show"><div class="d"><small>${MONTHS[m - 1].slice(0, 3).toUpperCase()}</small><b>${d}</b></div>
          <div><h4>${s.venue}</h4><p>${s.city} · ${s.time}${s.note ? " · " + s.note : ""}</p></div></div>`;
      }).join("")
    : "<p class='sub'>New shows coming soon — check back or follow us on Facebook.</p>";

  // Calendar
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    $("cal-title").textContent = `${MONTHS[m]} ${y}`;
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    let html = "";
    for (let i = 0; i < first; i++) html += '<span class="day empty"></span>';
    for (let d = 1; d <= days; d++) {
      const k = key(y, m, d);
      const st = statusOf(k);
      const past = k < todayKey ? " past" : "";
      const label = st === "show" ? `${showsByDate[k].venue} show` : st === "open" ? "Open — book this date" : st === "booked" ? "Booked" : "";
      html += `<button type="button" class="day ${st}${past}" data-k="${k}" title="${label}" ${st === "open" || st === "show" ? "" : "tabindex='-1'"}>${d}</button>`;
    }
    $("cal-days").innerHTML = html;
  }
  $("prev").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); };
  $("next").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); };
  $("cal-days").addEventListener("click", (e) => {
    const b = e.target.closest(".day");
    if (!b || b.classList.contains("past")) return;
    if (b.classList.contains("open")) {
      $("date").value = b.dataset.k;
      checkDate();
      $("book").scrollIntoView({ behavior: "smooth" });
    }
  });
  render();

  // Gallery, members, footer
  $("gallery").innerHTML = B.photos.map((p) => `<img loading="lazy" src="${p.src}" alt="${p.alt}">`).join("");
  $("about-text").textContent = B.about;
  $("members").innerHTML = B.members.map((m) => `<li><b>${m.name}</b><span>${m.role}</span></li>`).join("");
  $("yr").textContent = today.getFullYear();
  $("contact").innerHTML = `<a href="mailto:${B.email}">${B.email}</a> · ${B.phone} · <a href="${B.facebook}" target="_blank" rel="noopener">Facebook</a>`;

  // Mobile menu
  const btn = document.querySelector(".menu-btn"), menu = $("menu");
  btn.onclick = () => { const o = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
  menu.addEventListener("click", () => menu.classList.remove("open"));

  // Booking
  $("date").min = todayKey;
  function checkDate() {
    const k = $("date").value, s = $("date-status");
    const st = statusOf(k);
    s.className = "status";
    if (!k) { s.textContent = ""; return; }
    if (st === "open") { s.textContent = "✓ Good news — this date is open!"; s.classList.add("ok"); }
    else if (st === "booked" || st === "show") { s.textContent = "This date is taken. Pick another, or send it anyway and we'll suggest alternatives."; s.classList.add("bad"); }
    else s.textContent = "We haven't marked this date open yet — send the request and we'll confirm.";
  }
  $("date").addEventListener("change", checkDate);

  $("book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, data = Object.fromEntries(new FormData(f));
    const msg = $("form-msg");
    if (B.formEndpoint) {
      try {
        const r = await fetch(B.formEndpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!r.ok) throw 0;
        msg.className = "status full ok"; msg.textContent = "Thanks! We'll be in touch soon."; f.reset(); return;
      } catch { msg.className = "status full bad"; msg.textContent = "Couldn't send. Please email us directly."; return; }
    }
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
    location.href = `mailto:${B.email}?subject=${encodeURIComponent("Booking request: " + data.date)}&body=${encodeURIComponent(body)}`;
    msg.className = "status full ok"; msg.textContent = "Opening your email app to send the request…";
  });
})();

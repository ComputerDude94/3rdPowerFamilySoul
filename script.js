(function () {
  const B = window.BAND;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const pad = (n) => String(n).padStart(2, "0");
  const key = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const today = new Date();
  const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());
  const parse = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const pretty = (k) => { const d = parse(k); return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };

  const showsByDate = {}; B.shows.forEach((s) => (showsByDate[s.date] = s));
  const open = new Set(B.openDates), booked = new Set(B.bookedDates);
  const statusOf = (k) => (showsByDate[k] ? "show" : booked.has(k) ? "booked" : open.has(k) || (B.openByDefault && k >= todayKey) ? "open" : "");

  // ---- hero / text
  $("about-text").textContent = B.about;
  $("yr").textContent = today.getFullYear();

  // ---- ticker
  const items = [B.slogan, ...B.songs.slice(0, 18), ...B.genres];
  const tk = items.map((t) => `<span>${esc(t)}</span>`).join("");
  $("ticker").innerHTML = tk + tk + tk + tk;

  // ---- next show
  const upcoming = B.shows.filter((s) => s.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
  if (upcoming.length) {
    const n = upcoming[0], days = Math.round((parse(n.date) - parse(todayKey)) / 864e5);
    $("next-text").textContent = `Next show: ${MONTHS[parse(n.date).getMonth()].slice(0, 3)} ${parse(n.date).getDate()} · ${n.venue}` + (days === 0 ? " — TONIGHT" : days === 1 ? " — tomorrow" : ` — in ${days} days`);
    $("next-show").classList.remove("pending");
  }

  if (!upcoming.length) $("next-show").style.display = "none";
  // ---- shows
  function ics(s) {
    const d = s.date.replace(/-/g, ""), st = (s.start || "00:00").replace(":", "") + "00", en = (s.end || "23:59").replace(":", "") + "00";
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${d}T${st}`, `DTEND:${d}T${en}`, `SUMMARY:3rd Power Family Soul @ ${s.venue}`, `LOCATION:${s.address || s.venue + (s.city ? ", " + s.city : ", PA")}`, `DESCRIPTION:${s.time}${s.note ? " - " + s.note : ""}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
  }
  const LIMIT = B.showLimit || 5;
  $("show-list").innerHTML = upcoming.length
    ? upcoming.map((s) => {
        const d = parse(s.date);
        const map = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.address ? s.venue + " " + s.address : s.venue + " " + (s.city || "PA"));
        return `<article class="show-card reveal${upcoming.indexOf(s) >= LIMIT ? " extra" : ""}"${upcoming.indexOf(s) >= LIMIT ? " hidden" : ""}><div class="d"><small>${MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}</small><b>${d.getDate()}</b><em>${d.getFullYear()}</em></div>
          <div><h3>${esc(s.venue)}</h3><p>${[DAYS[d.getDay()], esc(s.time), esc(s.city), esc(s.note)].filter(Boolean).join(" · ")}</p></div>
          <div class="show-actions"><a class="pill" href="${map}" target="_blank" rel="noopener">Directions</a><a class="pill" href="${ics(s)}" download="3rd-power-${s.date}.ics">+ Calendar</a></div></article>`;
      }).join("")
    : "<p class='sub'>New shows coming soon — follow us on Facebook for updates.</p>";

  if (upcoming.length > LIMIT) {
    const mb = $("shows-more"); mb.hidden = false; mb.textContent = `Show all ${upcoming.length} shows`;
    mb.onclick = () => { const open = mb.dataset.open !== "1"; mb.dataset.open = open ? "1" : "";
      document.querySelectorAll(".show-card.extra").forEach((c) => { c.hidden = !open; if (open) c.classList.add("in"); });
      mb.textContent = open ? "Show fewer shows" : `Show all ${upcoming.length} shows`; };
  }
  const years = [...new Set(upcoming.map((x) => parse(x.date).getFullYear()))];
  if (upcoming.length && years.length <= 2) $("shows-title").textContent = years.join(" & ") + " Schedule";
  const evt = (x) => ["BEGIN:VEVENT", `UID:${x.date}-3rdpower@band`, `DTSTART:${x.date.replace(/-/g, "")}T${(x.start || "00:00").replace(":", "")}00`, `DTEND:${x.date.replace(/-/g, "")}T${(x.end || "23:59").replace(":", "")}00`, `SUMMARY:3rd Power Family Soul @ ${x.venue}`, `LOCATION:${x.address || x.venue + (x.city ? ", " + x.city : ", PA")}`, "END:VEVENT"].join("\r\n");
  $("all-ics").href = "data:text/calendar;charset=utf-8," + encodeURIComponent("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//3rd Power Family Soul//EN\r\n" + upcoming.map(evt).join("\r\n") + "\r\nEND:VCALENDAR");
  $("all-ics").download = "3rd-power-family-soul-schedule.ics";
  if (!upcoming.length) $("all-ics").hidden = true;

  // ---- calendar
  let view = upcoming.length ? new Date(parse(upcoming[0].date).getFullYear(), parse(upcoming[0].date).getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1), selected = "";
  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    $("cal-title").textContent = `${MONTHS[m]} ${y}`;
    const first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
    let h = "";
    for (let i = 0; i < first; i++) h += '<span class="day empty"></span>';
    for (let d = 1; d <= n; d++) {
      const k = key(y, m, d), st = statusOf(k);
      h += `<button type="button" class="day ${st}${k < todayKey ? " past" : ""}${k === todayKey ? " today" : ""}${k === selected ? " sel" : ""}" data-k="${k}" ${k < todayKey ? "disabled" : st === "open" || st === "show" ? "" : "tabindex='-1' aria-disabled='true'"} aria-label="${pretty(k)}${st ? " " + st : ""}">${d}</button>`;
    }
    $("cal-days").innerHTML = h;
    $("prev").disabled = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
  }
  $("prev").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); };
  $("next").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); };
  $("cal-days").addEventListener("click", (e) => {
    const b = e.target.closest(".day"); if (!b || b.classList.contains("past")) return;
    const k = b.dataset.k, st = statusOf(k);
    if (st === "open") { selected = k; $("date").value = k; checkDate(); $("pick").innerHTML = `<b>${pretty(k)}</b> is open. Tap “Request This Date” to book it.`; render(); }
    else if (st === "show") { const s = showsByDate[k]; $("pick").innerHTML = `<b>${pretty(k)}</b> — we're playing ${esc(s.venue)}${s.city ? ", " + esc(s.city) : ""}, ${esc(s.time)}. Come see us!`; }
  });
  render();

  // ---- sound
  $("types").innerHTML = B.eventTypes.map((t, i) => `<div class="type reveal d${i % 4}"><i>${t.icon}</i><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div>`).join("");

  // ---- gallery + lightbox
  if (B.photos.length) $("photos").hidden = false;
  if (B.groupPhoto) { $("group").hidden = false; $("group").innerHTML = `<img src="${B.groupPhoto}" alt="3rd Power Family Soul" loading="lazy">`; }
  if (B.story) { const q = $("story"); q.hidden = false; q.innerHTML = `<p>${esc(B.story)}</p>${B.signoff ? `<footer>— ${esc(B.signoff)}</footer>` : ""}`; }
  // videos (click-to-load: fast, and no tracking until played)
  if (B.videos.length) {
    $("watch").hidden = false;
    $("videos").className = "videos n" + B.videos.length;
    $("videos").innerHTML = B.videos.map((v, i) => `<figure class="video reveal d${i}"><button type="button" class="vbtn" data-id="${esc(v.id)}" aria-label="Play video: ${esc(v.title)}"><img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async"><span class="play"></span></button><figcaption>${esc(v.title)}</figcaption></figure>`).join("");
    $("yt-more").href = B.youtube;
    $("videos").addEventListener("click", (e) => {
      const b = e.target.closest(".vbtn"); if (!b) return;
      b.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0&modestbranding=1" title="Band video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
    });
  }
  $("gallery").className = "gallery " + (B.photos.length <= 2 ? "few" : "");
  $("gallery").innerHTML = B.photos.map((p, i) => `<figure class="reveal d${i % 3}"><img loading="lazy" src="${p.src}" alt="${esc(p.alt)}"${p.w ? ` width="${p.w}" height="${p.h}"` : ""}></figure>`).join("");
  const lb = $("lightbox");
  $("gallery").addEventListener("click", (e) => { const im = e.target.closest("img"); if (!im) return; lb.querySelector("img").src = im.src; lb.hidden = false; });
  lb.addEventListener("click", () => (lb.hidden = true));
  let lastFocus = null;
  const closeLb = () => { lb.hidden = true; if (lastFocus) lastFocus.focus(); };
  $("gallery").addEventListener("click", () => { lastFocus = document.activeElement; lb.querySelector("button").focus(); });
  lb.querySelector("button").addEventListener("click", closeLb);
  document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; if (!lb.hidden) closeLb(); if ($("menu").classList.contains("open")) document.querySelector(".menu-btn").click(); });

  // ---- songs
  const sl = $("songs-list"), sc = $("song-count"), sm = $("songs-more");
  const drawSongs = (q) => { const t = q.trim().toLowerCase(); const f = B.songs.filter((x) => x.toLowerCase().includes(t));
    sl.innerHTML = f.map((x) => `<span>${esc(x)}</span>`).join("") || `<p class="sub">Not on our list yet — but ask! We take requests.</p>`;
    sc.textContent = t ? `${f.length} match${f.length === 1 ? "" : "es"}` : `${B.songs.length} songs`; sl.classList.toggle("collapsed", !t && !sm.dataset.open); sm.hidden = !!t; };
  sm.onclick = () => { sm.dataset.open = sm.dataset.open ? "" : "1"; sm.textContent = sm.dataset.open ? "Show fewer songs" : "Show all songs"; drawSongs($("song-search").value); };
  $("song-search").addEventListener("input", (e) => drawSongs(e.target.value));
  $("songs-note").textContent = B.songsNote; drawSongs("");
  $("community-list").innerHTML = B.community.map((c) => `<li><span>${esc(c)}</span></li>`).join("");

  // ---- members, faq, contact
  $("members").innerHTML = B.members.map((m, i) => `<li class="reveal d${i % 4}"><div class="avatar">${esc(m.name.trim()[0])}</div><b>${esc(m.name)}</b>${m.nick ? `<em class="nick">“${esc(m.nick)}”</em>` : ""}<span>${esc(m.role)}</span>${m.bio ? `<details><summary>Read bio</summary><p>${esc(m.bio)}</p>${m.quote ? `<blockquote>“${esc(m.quote)}”</blockquote>` : ""}</details>` : ""}</li>`).join("");
  $("members").addEventListener("toggle", (e) => { const li = e.target.closest("li"); if (li) li.classList.toggle("wide", e.target.open); }, true);
  $("faq-list").innerHTML = B.faq.map((f) => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");
  $("book-contact").innerHTML = `<li>✉ <a href="mailto:${B.email}">${esc(B.email)}</a></li><li>☎ <a href="tel:${B.phone.replace(/\D/g, "")}">${esc(B.phone)}</a></li><li>⌖ Lancaster, PA</li>`;
  $("contact").innerHTML = `<a href="${B.facebook}" target="_blank" rel="noopener">Facebook</a><a href="${B.facebook2}" target="_blank" rel="noopener">Events</a><a href="${B.youtube}" target="_blank" rel="noopener">YouTube</a><a href="tel:${B.phone.replace(/\D/g, "")}">${esc(B.phone)}</a>`;

  // ---- nav, progress, reveal, counters
  const nav = $("nav"), prog = $("progress");
  const revealVisible = () => document.querySelectorAll(".reveal:not(.in)").forEach((e) => { if (e.getBoundingClientRect().top < innerHeight * 0.98) e.classList.add("in"); });
  const onScroll = () => {
    revealVisible();
    nav.classList.toggle("scrolled", scrollY > 30);
    prog.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100 + "%";
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const btn = document.querySelector(".menu-btn"), menu = $("menu");
  const setMenu = (o) => { menu.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o); };
  btn.onclick = () => setMenu(!menu.classList.contains("open"));
  menu.addEventListener("click", () => setMenu(false));
  $("scrim").addEventListener("click", () => setMenu(false));
  document.addEventListener("click", (e) => { if (menu.classList.contains("open") && !menu.contains(e.target) && !btn.contains(e.target)) setMenu(false); });

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
    const c = e.target.querySelector("[data-count]");
    if (c) { const to = +c.dataset.count; let i = 0; const t = setInterval(() => { c.textContent = ++i; if (i >= to) clearInterval(t); }, 120); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---- booking wizard
  const form = $("book-form"), steps = [...form.querySelectorAll(".step")], marks = [...form.querySelectorAll(".steps span")];
  let cur = 0;
  const show = (n) => {
    cur = n;
    steps.forEach((s, i) => s.classList.toggle("on", i === n));
    marks.forEach((s, i) => s.classList.toggle("on", i <= n));
    $("back").hidden = n === 0; $("nextstep").hidden = n === steps.length - 1; $("send").hidden = n !== steps.length - 1;
  };
  const valid = () => { let ok = true; steps[cur].querySelectorAll("input,select,textarea").forEach((f) => { f.classList.add("touched"); if (!f.checkValidity()) ok = false; }); return ok; };
  $("nextstep").onclick = () => valid() && show(cur + 1);
  $("back").onclick = () => show(cur - 1);
  $("date").min = todayKey;
  function checkDate() {
    const k = $("date").value, s = $("date-status"), st = statusOf(k);
    s.className = "status";
    if (!k) { s.textContent = ""; return; }
    if (st === "open") { s.textContent = "✓ Looks open! Send your request and we'll confirm."; s.classList.add("ok"); }
    else if (st === "booked" || st === "show") { s.textContent = "That date is taken — pick another, or send it and we'll suggest options."; s.classList.add("bad"); }
    else s.textContent = "Not marked open yet — send your request and we'll confirm.";
  }
  $("date").addEventListener("change", checkDate);
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); if (!valid()) return;
    const data = Object.fromEntries(new FormData(form)), msg = $("form-msg");
    if (B.formEndpoint) {
      if (data._honey) return; // spam trap
      const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 12000);
      $("send").disabled = true; msg.className = "status"; msg.textContent = "Sending…";
      try {
        const payload = { name: data.name, email: data.email, phone: data.phone || "—", "event date": pretty(data.date), "event type": data.type, venue: data.venue || "—", "start time & length": data.time || "—", "details & song requests": data.message || "—",
          _subject: `Booking request: ${data.name} — ${pretty(data.date)}`, _template: "table", _captcha: "false", _replyto: data.email };
        if (data.email && data.email.toLowerCase() !== "eyates717@comcast.net") payload._cc = data.email;
        const r = await fetch(B.formEndpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctrl.signal });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.success === "false" || j.success === false) throw new Error("send failed");
        msg.className = "status ok"; msg.textContent = "Thank you! Your request was sent and a copy is on its way to your email. We'll be in touch soon."; form.reset(); show(0); $("send").disabled = false; clearTimeout(to); return;
      } catch (err) { clearTimeout(to); $("send").disabled = false; msg.className = "status bad"; msg.textContent = "We couldn't send that automatically — opening your email app instead…"; }
    }
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
    location.href = `mailto:${B.email}?subject=${encodeURIComponent("Booking request: " + data.date)}&body=${encodeURIComponent(body)}`;
    msg.className = "status ok"; msg.textContent = "Opening your email app to send the request…";
  });
  show(0);

  // ---- visibility: call/text links, share, event structured data
  const tel = B.phone.replace(/\D/g, "");
  ["qcall", "hero-call"].forEach((id) => { const a = $(id); if (a) a.href = "tel:" + tel; });
  $("follow-fb").href = B.facebook; $("follow-yt").href = B.youtube;
  $("qtext").href = "sms:" + tel;
  const sh = document.createElement("button"); sh.className = "share"; sh.textContent = "Share this page";
  sh.onclick = async () => {
    const d = { title: document.title, text: "Check out 3rd Power Family Soul — live funk & soul in Lancaster, PA", url: location.href };
    try { navigator.share ? await navigator.share(d) : (await navigator.clipboard.writeText(location.href), (sh.textContent = "Link copied ✓")); } catch (e) {}
  };
  $("contact").appendChild(sh);
  if (upcoming.length) {
    const ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(upcoming.map((s) => ({
      "@context": "https://schema.org", "@type": "MusicEvent", name: "3rd Power Family Soul live at " + s.venue,
      startDate: s.date + (s.start ? "T" + s.start : ""), endDate: s.end ? s.date + "T" + s.end : undefined, eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: s.venue, address: { "@type": "PostalAddress", addressLocality: s.city || undefined, addressRegion: "PA", addressCountry: "US" } },
      performer: { "@type": "MusicGroup", name: "3rd Power Family Soul" }
    })));
    document.head.appendChild(ld);
  }
})();

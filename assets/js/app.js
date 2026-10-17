/* Shikshak Shreshth Prayog — app logic (no build step, works on GitHub Pages and from file://) */
(function () {
  "use strict";

  const A = window.NAT_DATA || [];
  const W = window.INTL_DATA || { practices: [], gtp: [] };
  const T = window.I18N;
  const LB = window.LABELS;
  const PORTAL = "https://nationalawardstoteachers.education.gov.in/";
  const YEARS = [2026, 2025, 2024, 2023, 2022, 2021];
  const BANDS = ["1-2", "3-5", "6-8", "9-10", "11-12", "HE"];
  const PAGE = 30;

  // ---------- storage (always guarded) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  let lang = store.get("ssp_lang", "hi");
  const LI = () => (lang === "hi" ? 0 : 1);           // index into LABELS arrays: [hi, en]
  const DI = () => (lang === "hi" ? 1 : 0);           // index into data arrays: t / st = [en, hi]
  const t = (k, ...a) => { const v = (T[lang] && T[lang][k]) ?? T.en[k] ?? k; return typeof v === "function" ? v(...a) : v; };

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const themeL = c => (LB.themes[c] || [c, c])[LI()];
  const bandL = b => (LB.bands[b] || [b, b])[LI()];
  const costL = c => (LB.cost[c] || ["", ""])[LI()];
  const subjL = s => (lang === "hi" ? (LB.subjects[s] || s) : s);
  const stateL = s => (lang === "hi" ? (LB.states[s] || s) : s);
  const orgL = o => (LB.orgs[o] || [o, o])[LI()];
  const regionL = r => (LB.regions[r] || [r, r])[LI()];
  const evL = e => t({ strong: "evStrong", moderate: "evModerate", emerging: "evEmerging" }[e] || e);
  const plainName = n => n.replace(/^(Mr|Ms|Mrs|Dr|Shri|Smt|Prof|Md|Mohd)\.?\s+/i, "").replace(/^(Dr|Prof)\.?\s+/i, "");
  const initials = n => plainName(n).split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const title = r => (r.t ? r.t[DI()] : (lang === "hi" ? "पद्धति विवरण प्रतीक्षित" : "Practice details awaited"));
  const summary = r => {
    if (lang === "hi" && r.s_hi) return r.s_hi;
    if (r.cit) return r.cit;
    return r.school;
  };
  const hasVideo = r => !!(r.yt && r.yt.id);
  const BASE = location.href.split("#")[0].split("?")[0];
  const WA_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>`;
  // WhatsApp message for an awardee (r) or a world practice (p)
  function waText(x) {
    const hi = lang === "hi";
    let head, steps, link;
    if (x.t) {
      head = `*${x.t[DI()]}*\n${plainName(x.name)}, ${x.school}${x.state ? ", " + stateL(x.state) : ""} · ${hi ? "राष्ट्रीय शिक्षक पुरस्कार" : "National Teachers' Award"} ${x.year}`;
      steps = x.st[DI()]; link = BASE + "#/awardees?open=" + x.id;
    } else {
      head = `*${hi ? x.name_hi : x.name_en}*\n${x.country} · ${hi ? "विश्व की श्रेष्ठ पद्धति" : "World best practice"}`;
      steps = hi ? x.steps_hi : x.steps_en; link = BASE + "#/world?wopen=" + x.id;
    }
    return `${head}\n\n${hi ? "अपनी कक्षा में कैसे अपनाएँ:" : "How to adopt it in your class:"}\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${hi ? "पूरा देखें (वीडियो सहित)" : "See full details (with video)"}: ${link}`;
  }
  const waUrl = x => "https://wa.me/?text=" + encodeURIComponent(waText(x));
  // Practice images (made by the teacher, e.g. in ChatGPT) live at images/practices/<id>.jpg|png|webp.
  // No manifest: try each extension and hide the figure if none exists, so uploading a file is enough.
  const IMG_EXT = ["jpg", "png", "webp"];
  window.sspNextImg = img => {
    const i = +img.dataset.ext + 1;
    if (i < IMG_EXT.length) { img.dataset.ext = i; img.src = `images/practices/${img.dataset.id}.${IMG_EXT[i]}`; } else img.closest("figure").remove();
  };
  const pimg = (id, alt, caption) => `<figure class="pimg"><img src="images/practices/${esc(id)}.jpg" data-id="${esc(id)}" data-ext="0" alt="${esc(alt)}" loading="lazy" decoding="async"
      onload="this.closest('figure').classList.add('ok')" onerror="sspNextImg(this)">${caption ? `<figcaption>${esc(t("imgCaption"))}</figcaption>` : ""}</figure>`;
  const waBtn = (x, cls = "btn sm wa") => `<a class="${cls}" href="${waUrl(x)}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA_ICON}<span>WhatsApp</span></a>`;
  const toast = msg => { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 1800); };
  const copyText = async txt => {
    try { await navigator.clipboard.writeText(txt); }
    catch (e) { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} ta.remove(); }
    toast(t("copied"));
  };
  const byId = Object.fromEntries(A.map(r => [r.id, r]));
  const wById = Object.fromEntries(W.practices.map(p => [p.id, p]));

  // ---------- theme ----------
  const applyTheme = th => { if (th) document.documentElement.setAttribute("data-theme", th); else document.documentElement.removeAttribute("data-theme"); };
  applyTheme(store.get("ssp_theme", null));
  $("#themeBtn").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nx = cur === "dark" ? "light" : "dark"; applyTheme(nx); store.set("ssp_theme", nx);
  });

  // ---------- i18n static ----------
  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    document.title = lang === "hi" ? "शिक्षक श्रेष्ठ प्रयोग" : "Shikshak Shreshth Prayog";
  }
  $$("[data-lang]").forEach(b => b.addEventListener("click", () => {
    lang = b.dataset.lang; store.set("ssp_lang", lang); applyStatic(); buildFilterOptions(); route(true);
  }));

  // ---------- router ----------
  const VIEWS = ["overview", "awardees", "kvs", "chapters", "states", "themes", "world", "prize", "prompts", "tracker", "about"];
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [v, qs] = h.split("?");
    const params = new URLSearchParams(qs || "");
    return { view: VIEWS.includes(v) ? v : "overview", params };
  }
  let lastView = null;
  function route(force) {
    const { view, params } = parseHash();
    $$("[data-view]").forEach(s => { s.hidden = s.dataset.view !== view; });
    $$(".tabs a").forEach(a => { if (a.dataset.tab === view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const R = { overview: renderOverview, awardees: () => renderAwardees(params), kvs: renderKvs, chapters: () => renderChapters(params), states: renderStates, themes: renderThemes,
      world: renderWorld, prize: renderPrize, prompts: () => renderStudio(params), tracker: renderTracker, about: renderAbout };
    R[view]();
    if (view !== lastView && !force) window.scrollTo(0, 0);
    lastView = view;
    const tab = $(`.tabs a[data-tab="${view}"]`), nav = $(".tabs");
    if (tab && nav) {
      const l = tab.offsetLeft - nav.offsetLeft, r = l + tab.offsetWidth;
      if (l < nav.scrollLeft) nav.scrollLeft = l - 16; else if (r > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = r - nav.clientWidth + 16;
    }
    if (params.get("open")) openAwardee(params.get("open"));
    if (params.get("wopen")) openWorld(params.get("wopen"));
  }
  window.addEventListener("hashchange", () => route(false));

  // ---------- charts ----------
  function bars(el, rows, opts = {}) {
    const max = Math.max(1, ...rows.map(r => (r.v2 ? r.v + r.v2 : r.v)));
    el.innerHTML = rows.map((r, i) => {
      const w1 = (r.v / max) * 100, w2 = r.v2 ? (r.v2 / max) * 100 : 0;
      const tot = r.v + (r.v2 || 0);
      return `<div class="bar-row${r.href ? " click" : ""}" ${r.href ? `role="link" tabindex="0" data-href="${esc(r.href)}"` : ""} title="${esc(r.label)}: ${tot}">
        <span class="bar-label">${esc(r.label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${w1}%"></span>${w2 ? `<span class="bar-fill b2" style="width:${w2}%"></span>` : ""}</span>
        <span class="bar-val">${tot}</span></div>`;
    }).join("") + (opts.legend ? `<div class="chart-legend">${opts.legend}</div>` : "");
    $$(".bar-row.click", el).forEach(row => {
      const go = () => { location.hash = row.dataset.href; };
      row.addEventListener("click", go);
      row.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  const analysed = A.filter(r => r.t);
  const schoolAnalysed = analysed.filter(r => r.cat === "school");
  function countBy(list, fn) { const m = new Map(); list.forEach(r => [].concat(fn(r)).forEach(k => { if (k !== undefined && k !== "") m.set(k, (m.get(k) || 0) + 1); })); return m; }

  // ---------- OVERVIEW ----------
  // ---------- PRACTICE OF THE WEEK ----------
  // Same practice for everyone in a given week; the pool is a fixed pseudo-random order so themes vary week to week.
  function weekInfo(d = new Date()) {
    const day = (d.getDay() + 6) % 7, mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day), sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const weekNo = Math.floor((mon - new Date(2021, 0, 4)) / 6048e5);
    return { weekNo, mon, sun };
  }
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const weekPool = A.filter(r => r.t && r.cat === "school" && r.cs === "official" && r.cost < 2).sort((a, b) => hash(a.id) - hash(b.id));
  function weeklyPractice() { const w = weekInfo(); return { r: weekPool[((w.weekNo % weekPool.length) + weekPool.length) % weekPool.length], ...w }; }
  function renderWeekly() {
    const { r, mon, sun } = weeklyPractice(); if (!r) return;
    const fmt = d => d.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short" });
    $("#weekly").innerHTML = `<div class="wk-tag">${esc(t("weekTitle"))} · ${fmt(mon)} – ${fmt(sun)}</div>
      <div class="wk-body"><div class="wk-main"><h2>${esc(title(r))}</h2>
        <p class="muted" style="margin:0 0 8px">${esc(plainName(r.name))} · ${esc(r.school)} · ${esc(stateL(r.state))} · ${r.year}</p>
        <div class="chips">${(r.gr || []).map(g => `<span class="chip">${esc(bandL(g))}</span>`).join("")}<span class="chip cost${r.cost}">${esc(costL(r.cost))}</span></div>
        <ol class="steps">${r.st[DI()].map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
        <div class="wk-actions"><button class="btn primary" data-open="${r.id}">${esc(t("open"))}</button>${waBtn(r, "btn wa")}
          <button class="btn" type="button" data-wprint="${r.id}">${esc(t("printCard"))}</button>
          <a class="btn ghost" href="#/prompts?id=${r.id}">${esc(t("makePrompts"))}</a></div></div>
      <p class="note" style="margin:8px 0 0">${esc(t("weekNote"))}</p>`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-wprint]"); if (b) printCard(byId[b.dataset.wprint]); });

  function renderOverview() {
    renderWeekly();
    const states = new Set(A.map(r => r.state).filter(Boolean));
    const k = [
      [A.length, t("kAward")], [A.filter(r => r.cat === "school").length, t("kSchool")], [states.size, t("kStates")],
      [A.filter(hasVideo).length, t("kVideo")], [analysed.length, t("kPractice")], [W.practices.length, t("kWorld")]
    ];
    $("#kpis").innerHTML = k.map(([n, l]) => `<div class="kpi"><b>${n}</b><span>${esc(l)}</span></div>`).join("");

    bars($("#chYear"), YEARS.slice().reverse().map(y => ({
      label: String(y), v: A.filter(r => r.year === y && r.cat === "school").length, v2: A.filter(r => r.year === y && r.cat === "higher").length,
      href: `#/awardees?year=${y}`
    })), { legend: `<span><i style="background:var(--bar)"></i>${esc(t("lgSchool"))}</span><span><i style="background:var(--bar-2)"></i>${esc(t("lgHE"))}</span>` });

    const bc = countBy(schoolAnalysed, r => r.gr);
    bars($("#chBand"), BANDS.filter(b => b !== "HE" && bc.get(b)).map(b => ({ label: bandL(b), v: bc.get(b) || 0, href: `#/awardees?band=${b}` })));

    const tc = [...countBy(analysed, r => r.th)].sort((a, b) => b[1] - a[1]).slice(0, 12);
    bars($("#chThemes"), tc.map(([c, n]) => ({ label: themeL(c), v: n, href: `#/awardees?theme=${c}` })));

    const cc = countBy(schoolAnalysed, r => r.cost);
    bars($("#chCost"), [0, 1, 2].map(c => ({ label: costL(c), v: cc.get(c) || 0, href: `#/awardees?cost=${c}` })));

    const sc = [...countBy(A, r => r.state)].sort((a, b) => b[1] - a[1]).slice(0, 10);
    bars($("#chStates"), sc.map(([s, n]) => ({ label: stateL(s), v: n, href: `#/awardees?state=${encodeURIComponent(s)}` })));

    // insights
    const n = schoolAnalysed.length;
    const zero = (cc.get(0) || 0), pctZero = Math.round((zero / n) * 100);
    const top3 = tc.slice(0, 3).map(([c, v]) => `${themeL(c)} (${v})`).join(", ");
    const comm = (countBy(schoolAnalysed, r => r.th).get("comm") || 0);
    const fln = (countBy(schoolAnalysed, r => r.th).get("fln") || 0);
    const girls = (countBy(schoolAnalysed, r => r.th).get("girl") || 0);
    const ul = lang === "hi" ? [
      `विश्लेषित ${n} विद्यालय पद्धतियों में से ${zero} (${pctZero}%) शून्य लागत की हैं, यानी इन्हें बिना बजट के कल से शुरू किया जा सकता है।`,
      `सबसे आम थीम: ${top3}।`,
      `${comm} शिक्षकों की सफलता में समुदाय व अभिभावकों की बड़ी भूमिका रही। अकेले कक्षा के भीतर नहीं, गाँव/मोहल्ले को साथ लेकर बदलाव हुआ।`,
      `${fln} पद्धतियाँ सीधे FLN (निपुण भारत) से जुड़ी हैं और ${girls} पद्धतियाँ बालिका शिक्षा पर केंद्रित हैं।`,
      `2026 के कई शिक्षकों का आधिकारिक प्रशस्ति-पत्र अभी पोर्टल पर नहीं आया है; उनके कार्ड पर "प्रशस्ति प्रतीक्षित" लिखा है।`
    ] : [
      `Of ${n} school practices analysed, ${zero} (${pctZero}%) need no money at all, so a teacher can start tomorrow.`,
      `Most common themes: ${top3}.`,
      `For ${comm} teachers, community and parents were central: change came from bringing the village or neighbourhood along, not only from inside the classroom.`,
      `${fln} practices directly support FLN (NIPUN Bharat) and ${girls} focus on girls' education.`,
      `Many 2026 awardees' official citations are not yet on the portal; their cards say "Citation awaited".`
    ];
    $("#insights").innerHTML = `<h2>${esc(t("insTitle"))}</h2><ul>${ul.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  }

  // ---------- AWARDEES ----------
  const F = { q: "", year: "", cat: "", state: "", theme: "", band: "", subj: "", cost: "", video: false };
  let shown = PAGE;

  function opt(v, label, sel) { return `<option value="${esc(v)}"${String(sel) === String(v) ? " selected" : ""}>${esc(label)}</option>`; }
  function buildFilterOptions() {
    $("#fYear").innerHTML = opt("", t("all"), F.year) + YEARS.map(y => opt(y, y, F.year)).join("");
    $("#fCat").innerHTML = opt("", t("all"), F.cat) + opt("school", t("catSchool"), F.cat) + opt("higher", t("catHE"), F.cat);
    const states = [...new Set(A.map(r => r.state).filter(Boolean))].sort((a, b) => stateL(a).localeCompare(stateL(b), lang));
    const orgs = [...new Set(A.map(r => r.org).filter(Boolean))];
    $("#fState").innerHTML = opt("", t("all"), F.state) + states.map(s => opt(s, stateL(s), F.state)).join("") +
      `<optgroup label="${lang === "hi" ? "संगठन" : "Organisations"}">` + orgs.map(o => opt("org:" + o, orgL(o), F.state)).join("") + "</optgroup>";
    $("#fTheme").innerHTML = opt("", t("all"), F.theme) + Object.keys(LB.themes).sort((a, b) => themeL(a).localeCompare(themeL(b), lang)).map(c => opt(c, themeL(c), F.theme)).join("");
    $("#fBand").innerHTML = opt("", t("all"), F.band) + BANDS.map(b => opt(b, bandL(b), F.band)).join("");
    const subs = [...new Set(analysed.flatMap(r => r.sub))].sort((a, b) => subjL(a).localeCompare(subjL(b), lang));
    $("#fSubj").innerHTML = opt("", t("all"), F.subj) + subs.map(s => opt(s, subjL(s), F.subj)).join("");
    $("#fCost").innerHTML = opt("", t("all"), F.cost) + [0, 1, 2].map(c => opt(c, costL(c), F.cost)).join("");
    // world
    const regions = [...new Set(W.practices.map(p => p.region))];
    $("#wRegion").innerHTML = opt("", t("all"), "") + regions.map(r => opt(r, regionL(r), "")).join("");
    $("#wEv").innerHTML = opt("", t("all"), "") + ["strong", "moderate", "emerging"].map(e => opt(e, evL(e), "")).join("");
    $("#wBand").innerHTML = opt("", t("all"), "") + BANDS.slice(0, 4).map(b => opt(b, bandL(b), "")).join("");
    $("#pStyle").innerHTML = LB.styles.map((s, i) => opt(i, s[LI() + 1], "")).join("");
  }

  function matches(r) {
    if (F.year && r.year !== +F.year) return false;
    if (F.cat && r.cat !== F.cat) return false;
    if (F.state) { if (F.state.startsWith("org:")) { if (r.org !== F.state.slice(4)) return false; } else if (r.state !== F.state) return false; }
    if (F.theme && !(r.th || []).includes(F.theme)) return false;
    if (F.band && !(r.gr || []).includes(F.band)) return false;
    if (F.subj && !(r.sub || []).includes(F.subj)) return false;
    if (F.cost !== "" && r.cost !== +F.cost) return false;
    if (F.video && !hasVideo(r)) return false;
    if (F.q) {
      const hay = [r.name, r.school, r.state, LB.states[r.state], r.org, r.disc, r.cit, r.core, r.s_hi, r.t && r.t.join(" "), (r.th || []).map(c => LB.themes[c].join(" ")).join(" ")].join(" ").toLowerCase();
      if (!F.q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w))) return false;
    }
    return true;
  }

  function avatar(r, size) {
    const ini = esc(initials(r.name));
    if (!r.photo) return `<span class="avatar" aria-hidden="true">${ini}</span>`;
    return `<span class="avatar" aria-hidden="true"><img src="${esc(r.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer" width="${size}" height="${size}" onerror="this.parentNode.textContent='${ini}'"></span>`;
  }

  function card(r) {
    const tracked = !!trackerData()[r.id];
    const place = [r.org ? orgL(r.org) : "", stateL(r.state)].filter(Boolean).join(" · ");
    return `<article class="card">${r.t ? pimg(r.id, title(r)) : ""}
      <div class="card-top">${avatar(r, 48)}<div class="card-who"><strong>${esc(r.name)}</strong><small>${esc(r.school)}</small><small>${esc(place)}</small></div></div>
      <div class="chips"><span class="chip year">${r.year}</span>${r.cat === "higher" ? `<span class="chip he">${esc(t("catHE"))}</span>` : ""}
        ${r.cs === "awaited" ? `<span class="chip await">${esc(t("awaited"))}</span>` : ""}${r.cs === "news" ? `<span class="chip await">${esc(t("news"))}</span>` : ""}
        ${r.cost !== undefined ? `<span class="chip cost${r.cost}">${esc(costL(r.cost))}</span>` : ""}
        ${(r.gr || []).filter(g => g !== "HE").map(g => `<span class="chip">${esc(bandL(g))}</span>`).join("")}</div>
      <h3>${esc(title(r))}</h3>
      <p>${esc(summary(r))}</p>
      <div class="chips">${(r.th || []).slice(0, 4).map(c => `<span class="chip">${esc(themeL(c))}</span>`).join("")}</div>
      <div class="card-foot">
        <button class="btn sm primary" data-open="${r.id}">${esc(t("open"))}</button>
        ${r.t ? `<a class="btn sm" href="#/prompts?id=${r.id}">${esc(t("makePrompts"))}</a>` : ""}
        ${r.t ? `<button class="btn sm" data-track="${r.id}" aria-pressed="${tracked}">${esc(tracked ? t("inTrack") : t("addTrack"))}</button>` : ""}
        ${r.t ? waBtn(r) : ""}
        ${hasVideo(r) ? `<span class="vid-dot"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="#c00" d="M23 7s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.5 12 3.5 12 3.5s-4.4 0-7.7.2c-.5.1-1.5.1-2.4 1C1.2 5.4 1 7 1 7S.8 8.9.8 10.8v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 7.5.2 7.5.2s4.4 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.8C23.2 8.9 23 7 23 7z"/><path fill="#fff" d="M9.7 15.1V8.5l6 3.3z"/></svg>${esc(t("video"))}</span>` : ""}
      </div></article>`;
  }

  function renderAwardees(params) {
    if (params) {
      const keys = ["q", "year", "cat", "state", "theme", "band", "subj", "cost"];
      if (keys.some(k => params.has(k))) { keys.forEach(k => { F[k] = params.get(k) || ""; }); F.video = params.get("video") === "1"; shown = PAGE; }
    }
    buildFilterOptions();
    $("#q").value = F.q; $("#fVideo").checked = F.video;
    const list = A.filter(matches).sort((a, b) => b.year - a.year || (a.cat === b.cat ? 0 : a.cat === "school" ? -1 : 1) || (a.t ? 0 : 1) - (b.t ? 0 : 1));
    $("#resultCount").textContent = t("results", list.length);
    $("#cards").innerHTML = list.length ? list.slice(0, shown).map(card).join("") : `<p class="empty">${esc(t("noResults"))}</p>`;
    $("#moreBtn").hidden = list.length <= shown;
  }
  function syncFiltersToHash() {
    const p = new URLSearchParams();
    Object.entries(F).forEach(([k, v]) => { if (k === "video") { if (v) p.set("video", "1"); } else if (v !== "") p.set(k, v); });
    const h = "#/awardees" + (p.toString() ? "?" + p.toString() : "");
    if (location.hash !== h) history.replaceState(null, "", h);
  }
  let qTimer;
  $("#q").addEventListener("input", e => { clearTimeout(qTimer); qTimer = setTimeout(() => { F.q = e.target.value.trim(); shown = PAGE; syncFiltersToHash(); renderAwardees(); }, 180); });
  [["fYear", "year"], ["fCat", "cat"], ["fState", "state"], ["fTheme", "theme"], ["fBand", "band"], ["fSubj", "subj"], ["fCost", "cost"]].forEach(([id, k]) =>
    $("#" + id).addEventListener("change", e => { F[k] = e.target.value; shown = PAGE; syncFiltersToHash(); renderAwardees(); }));
  $("#fVideo").addEventListener("change", e => { F.video = e.target.checked; shown = PAGE; syncFiltersToHash(); renderAwardees(); });
  $("#fReset").addEventListener("click", () => { Object.keys(F).forEach(k => { F[k] = k === "video" ? false : ""; }); shown = PAGE; syncFiltersToHash(); renderAwardees(); });
  $("#moreBtn").addEventListener("click", () => { shown += PAGE; renderAwardees(); });

  // delegated card actions
  document.addEventListener("click", e => {
    const o = e.target.closest("[data-open]"); if (o) { openAwardee(o.dataset.open); return; }
    const w = e.target.closest("[data-wopen]"); if (w) { openWorld(w.dataset.wopen); return; }
    const tr = e.target.closest("[data-track]"); if (tr) { toggleTrack(tr.dataset.track); const on = !!trackerData()[tr.dataset.track]; tr.setAttribute("aria-pressed", on); tr.textContent = on ? t("inTrack") : t("addTrack"); return; }
    const c = e.target.closest("[data-copy]"); if (c) { copyText($("#" + c.dataset.copy).textContent); return; }
  });

  // ---------- DETAIL ----------
  const dlg = $("#detail");
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { $("#dBody").innerHTML = ""; });

  const ytCount = countBy(A, r => (r.yt && r.yt.id) || "");
  function ytBlock(r) {
    const y = r.yt || {};
    if (!y.id) return "";
    if (ytCount.get(y.id) > 1 && y.list && y.index) {   // one playlist id shared by many teachers: open at their position
      const url = `https://www.youtube.com/watch?v=${y.id}&list=${y.list}&index=${y.index}`;
      return `<div class="d-sec"><h3>${esc(t("dVideo"))}</h3><a class="btn" href="${url}" target="_blank" rel="noopener">${esc(t("lnkYT"))} ↗</a></div>`;
    }
    return `<div class="d-sec"><h3>${esc(t("dVideo"))}</h3>
      <button class="video" type="button" data-yt="${esc(y.id)}" aria-label="${esc(t("video"))}" style="background-image:url('https://i.ytimg.com/vi/${esc(y.id)}/hqdefault.jpg')"></button>
      <p class="note"><a href="https://www.youtube.com/watch?v=${esc(y.id)}" target="_blank" rel="noopener">${esc(t("lnkYT"))} ↗</a>${y.dup ? ` · ${esc(t("ytDup"))}` : ""}</p></div>`;
  }
  document.addEventListener("click", e => {
    const v = e.target.closest("button.video[data-yt]");
    if (!v || v.classList.contains("playing")) return;
    v.classList.add("playing");
    v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.yt)}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });

  function xSearch(r) { return `https://x.com/search?q=${encodeURIComponent(`"${plainName(r.name)}" from:EduMinOfIndia`)}&f=live`; }

  function openAwardee(id) {
    const r = byId[id]; if (!r) return;
    const tracked = !!trackerData()[r.id];
    const place = [r.role || r.disc, r.school, r.addr, r.org ? orgL(r.org) : "", stateL(r.state)].filter(Boolean).join(" · ");
    const steps = r.st ? r.st[DI()] : [];
    const listPdf = r.cat === "school" ? `${PORTAL}File/Selected_Teachers_${r.year}.pdf` : "";
    $("#dBody").innerHTML = `
      <div class="d-head">${avatar(r, 72)}
        <div><h2 id="dTitle">${esc(title(r))}</h2><p class="muted" style="margin:0"><strong>${esc(r.name)}</strong> · ${r.year}</p><p class="muted note" style="margin:0">${esc(place)}</p></div>
        <button class="btn sm d-close" type="button" data-close>${esc(t("close"))}</button></div>
      <div class="chips">${(r.th || []).map(c => `<span class="chip">${esc(themeL(c))}</span>`).join("")}
        ${(r.gr || []).map(g => `<span class="chip">${esc(bandL(g))}</span>`).join("")}${r.cost !== undefined ? `<span class="chip cost${r.cost}">${esc(costL(r.cost))}</span>` : ""}
        ${(r.sub || []).map(s => `<span class="chip">${esc(subjL(s))}</span>`).join("")}</div>
      ${r.t ? `<div class="d-sec">${pimg(r.id, title(r), true)}</div>` : ""}
      ${r.cs === "awaited" ? `<div class="d-sec"><p class="quote">${esc(t("dAwait"))}</p></div>` : ""}
      ${r.s_hi && lang === "hi" ? `<div class="d-sec"><h3>${esc(t("dSummary"))}</h3><p>${esc(r.s_hi)}</p></div>` : ""}
      ${steps.length ? `<div class="d-sec"><h3>${esc(t("dSteps"))}</h3><ol class="steps">${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>` : ""}
      ${r.cit ? `<div class="d-sec"><h3>${esc(r.cs === "official" ? t("dCitation") : t("dNewsSum"))}</h3><div class="quote" lang="en">${esc(r.cit)}</div></div>` : ""}
      ${r.core ? `<div class="d-sec"><h3>${esc(t("dCore"))}</h3><p lang="en">${esc(r.core)}</p></div>` : ""}
      ${ytBlock(r)}
      <div class="d-sec"><h3>${esc(t("dLinks"))}</h3><div class="links">
        ${r.src ? `<a class="btn sm" href="${esc(r.src)}" target="_blank" rel="noopener">${esc(t("lnkSource"))} ↗</a>` : ""}
        ${listPdf ? `<a class="btn sm" href="${listPdf}" target="_blank" rel="noopener">${esc(t("lnkList"))} ↗</a>` : ""}
        ${r.x ? `<a class="btn sm" href="${esc(r.x)}" target="_blank" rel="noopener">${esc(t("lnkXdirect"))} ↗</a>` : `<a class="btn sm" href="${xSearch(r)}" target="_blank" rel="noopener">${esc(t("lnkX"))} ↗</a>`}
      </div></div>
      ${r.t ? `<div class="d-sec links">
        <a class="btn primary" href="#/prompts?id=${r.id}">${esc(t("makePrompts"))}</a>
        <button class="btn" type="button" data-print="${r.id}">${esc(t("printCard"))}</button>
        <button class="btn" type="button" data-track="${r.id}" aria-pressed="${tracked}">${esc(tracked ? t("inTrack") : t("addTrack"))}</button>
        ${waBtn(r, "btn wa")}
        <button class="btn ghost" type="button" data-share="${r.id}">${esc(t("share"))}</button></div>` : ""}`;
    if (!dlg.open) dlg.showModal();
    $(".d-in", dlg).scrollTop = 0;
  }
  dlg.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) dlg.close();
    const p = e.target.closest("[data-print]"); if (p) printCard(byId[p.dataset.print] || wById[p.dataset.print]);
    const s = e.target.closest("[data-share]"); if (s) copyText(location.href.split("#")[0] + "#/awardees?open=" + s.dataset.share);
    if (e.target.closest("a[href^='#/']")) dlg.close();
  });

  // ---------- KVS ----------
  function renderKvs() {
    const list = A.filter(r => r.org === "KVS").sort((a, b) => b.year - a.year);
    const k = [
      [list.length, t("kvsTotal")], [new Set(list.map(r => r.year)).size, t("kvsYears")],
      [new Set(list.map(r => r.state)).size, t("kvsRegions")], [list.filter(r => r.cost === 0).length, t("kvsZero")]
    ];
    $("#kvsKpis").innerHTML = k.map(([n, l]) => `<div class="kpi"><b>${n}</b><span>${esc(l)}</span></div>`).join("");
    $("#kvsCards").innerHTML = list.map(card).join("");
  }

  // ---------- CHAPTERS & CGs ----------
  const CUR = window.CUR_DATA || { books: [], cg: {}, topics: {}, subjects: {}, langBooks: {}, langSkills: [], practiceTopics: {}, worldTopics: {} };
  const topicL = c => (CUR.topics[c] || [c, c])[LI()];
  const subjKeyL = k => (CUR.subjects[k] || [k, k])[LI()];
  const bandOf = c => (c <= 2 ? "1-2" : c <= 5 ? "3-5" : c <= 8 ? "6-8" : "9-10");
  const BAND_IDX = { "1-2": 0, "3-5": 1, "6-8": 2, "9-10": 3, "11-12": 4 };
  const SUBJ_MATCH = { maths: ["Maths"], evs: ["EVS", "Science", "Social Science"], science: ["Science"], sst: ["Social Science", "Economics", "Commerce"],
    english: ["English", "Language"], hindi: ["Hindi", "Language"] };
  const GENERAL = ["g18", "g17", "g19", "g24", "g23"];
  const CF = { c: 4, s: "maths", m: "ch" };
  function subjectsFor(c) {
    const ks = [...new Set(CUR.books.filter(b => b.cls === c).map(b => b.subj))];
    return ks.concat(["english", "hindi"].filter(k => CUR.langBooks[c] && CUR.langBooks[c][k]));
  }
  function matchPractices(tps, cls, subj, limit = 6) {
    const band = bandOf(cls), bi = BAND_IDX[band], want = SUBJ_MATCH[subj] || [];
    const out = [];
    for (const [id, ptp] of Object.entries(CUR.practiceTopics)) {
      const r = byId[id]; if (!r) continue;
      const hit = ptp.filter(x => tps.includes(x)); if (!hit.length) continue;
      const gi = (r.gr || []).map(g => BAND_IDX[g]).filter(x => x !== undefined);
      const dist = Math.min(...gi.map(x => Math.abs(x - bi)));
      if (dist > 1) continue;
      let sc = hit.length * 3 + (dist === 0 ? 3 : 0.5) + ((r.sub || []).some(x => want.includes(x)) ? 1.5 : (r.sub || []).includes("All") ? 0.5 : 0) + (r.cost === 0 ? 0.3 : 0) + (r.cs === "official" ? 0.2 : 0);
      out.push({ r, hit, sc, adj: dist > 0 });
    }
    return out.sort((a, b) => b.sc - a.sc).slice(0, limit);
  }
  function matchWorld(tps, cls, limit = 2) {
    const band = bandOf(cls);
    return W.practices.filter(p => p.grades.includes(band) && (CUR.worldTopics[p.id] || []).some(x => tps.includes(x))).slice(0, limit);
  }
  function miniCard(m) {
    const r = m.r;
    return `<div class="mini"><div class="mini-main"><strong>${esc(title(r))}</strong>
        <small>${esc(plainName(r.name))} · ${esc(stateL(r.state))} · ${r.year}${m.adj ? ` · <em>${esc(t("cAdj"))}</em>` : ""}</small>
        <div class="chips">${m.hit.map(x => `<span class="chip tp">${esc(topicL(x))}</span>`).join("")}<span class="chip cost${r.cost}">${esc(costL(r.cost))}</span></div></div>
      <div class="mini-act"><button class="btn sm primary" data-open="${r.id}">${esc(t("open"))}</button>${waBtn(r)}</div></div>`;
  }
  function miniWorld(p) {
    return `<div class="mini world"><div class="mini-main"><strong>${esc(lang === "hi" ? p.name_hi : p.name_en)}</strong>
        <small>${esc(t("cWorld"))} · ${esc(p.country)}</small><div class="chips"><span class="chip ev-${p.evidence}">${esc(evL(p.evidence))}</span></div></div>
      <div class="mini-act"><button class="btn sm" data-wopen="${p.id}">${esc(t("open"))}</button></div></div>`;
  }
  function itemBlock(head, sub, tps, extraHtml) {
    const ms = matchPractices(tps, CF.c, CF.s), ws = matchWorld(tps, CF.c);
    const n = ms.length + ws.length;
    return `<details class="chap"${n ? "" : ""}><summary><span class="chap-h">${head}</span>
        <span class="chap-meta">${tps.map(x => `<span class="chip tp">${esc(topicL(x))}</span>`).join("")}<span class="badge${n ? "" : " zero"}">${esc(t("cMatches", n))}</span></span></summary>
      <div class="chap-body">${sub ? `<p class="note">${sub}</p>` : ""}${extraHtml || ""}
        ${ms.map(miniCard).join("")}${ws.map(miniWorld).join("")}${n ? "" : `<p class="muted">${esc(t("cNone"))}</p>`}</div></details>`;
  }
  function renderChapters(params) {
    if (params && params.get("c")) { CF.c = +params.get("c") || 4; CF.s = params.get("s") || CF.s; CF.m = params.get("m") || "ch"; }
    $("#cClass").innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => `<option value="${c}"${c === CF.c ? " selected" : ""}>${lang === "hi" ? "कक्षा " : "Class "}${c}</option>`).join("");
    const subs = subjectsFor(CF.c); if (!subs.includes(CF.s)) CF.s = subs[0];
    $("#cSubj").innerHTML = subs.map(k => `<option value="${k}"${k === CF.s ? " selected" : ""}>${esc(subjKeyL(k))}</option>`).join("");
    const cgOk = CF.c >= 3 && CF.c <= 5 && CUR.cg[CF.s];
    if (!cgOk) CF.m = "ch";
    $("#cMode").hidden = !cgOk;
    $$("#cMode button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === CF.m)));
    const gen = W.practices.filter(p => GENERAL.includes(p.id) && p.grades.includes(bandOf(CF.c)));
    let html = gen.length ? `<details class="chap gen"><summary><span class="chap-h"><b>${esc(t("cGeneral"))}</b></span><span class="chap-meta"><span class="badge">${esc(t("cMatches", gen.length))}</span></span></summary><div class="chap-body gen-row">${gen.map(miniWorld).join("")}</div></details>` : "";
    const isLang = CF.s === "english" || CF.s === "hindi";
    if (CF.m === "cg") {
      html += `<p class="note">${esc(t("cCgNote"))}</p>`;
      let last = "";
      CUR.cg[CF.s].forEach(g => {
        if (g.cg !== last) { html += `<h3 class="cg-h">${esc(g.cg)}</h3>`; last = g.cg; }
        html += itemBlock(`<b>${esc(g.code)}</b> ${esc(g.d)}`, "", g.tp);
      });
    } else if (isLang) {
      const [bk, code] = CUR.langBooks[CF.c][CF.s];
      html += `<p class="note">${esc(t("cBook"))}: <strong>${esc(bk)}</strong> · ${esc(t("cLangNote", bk))}</p>`;
      CUR.langSkills.forEach(([tp, hi, en]) => { html += itemBlock(esc(lang === "hi" ? hi : en), "", [tp]); });
    } else {
      CUR.books.filter(b => b.cls === CF.c && b.subj === CF.s).forEach(b => {
        html += `<h3 class="cg-h">${esc(t("cBook"))}: ${esc(b.book)}</h3>`;
        b.ch.forEach(ch => {
          const pdf = `https://ncert.nic.in/textbook/pdf/${b.code}${String(ch.n).padStart(2, "0")}.pdf`;
          html += itemBlock(`<b>${esc(t("cChapter"))} ${ch.n}</b> ${esc(ch.t)}`, "", ch.tp,
            `<p class="note"><a href="${pdf}" target="_blank" rel="noopener">${esc(t("cPdf"))} ↗</a></p>`);
        });
      });
      if (CF.c >= 3 && CF.c <= 5 && !CUR.cg[CF.s]) html += `<p class="note">${esc(t("cCgOnly"))}</p>`;
    }
    $("#chOut").innerHTML = html;
  }
  function chSync() { history.replaceState(null, "", `#/chapters?c=${CF.c}&s=${CF.s}&m=${CF.m}`); renderChapters(); }
  $("#cClass").addEventListener("change", e => { CF.c = +e.target.value; chSync(); });
  $("#cSubj").addEventListener("change", e => { CF.s = e.target.value; chSync(); });
  $$("#cMode button").forEach(b => b.addEventListener("click", () => { CF.m = b.dataset.mode; chSync(); }));

  // ---------- STATES ----------
  let stateSort = "count";
  $$("#stateSort button").forEach(b => b.addEventListener("click", () => {
    stateSort = b.dataset.sort; $$("#stateSort button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); renderStates();
  }));
  function renderStates() {
    const groups = new Map();
    A.forEach(r => { if (!r.state) return; if (!groups.has(r.state)) groups.set(r.state, []); groups.get(r.state).push(r); });
    let arr = [...groups];
    arr.sort(stateSort === "az" ? (a, b) => stateL(a[0]).localeCompare(stateL(b[0]), lang) : (a, b) => b[1].length - a[1].length || stateL(a[0]).localeCompare(stateL(b[0]), lang));
    $("#stateGrid").innerHTML = arr.map(([s, list]) => {
      const tc = [...countBy(list, r => r.th)].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => themeL(c));
      const yrs = YEARS.slice().reverse().map(y => { const n = list.filter(r => r.year === y).length; return `<span class="${n ? "on" : ""}" title="${y}: ${n}">${String(y).slice(2)}${n ? "·" + n : ""}</span>`; }).join("");
      return `<button class="tile" type="button" data-state="${esc(s)}"><div class="tile-head"><strong>${esc(stateL(s))}</strong><b>${list.length}</b></div>
        <div class="years">${yrs}</div>${tc.length ? `<small>${esc(t("topThemes"))}: ${esc(tc.join(", "))}</small>` : ""}</button>`;
    }).join("");
    $$("#stateGrid [data-state]").forEach(b => b.addEventListener("click", () => { location.hash = "#/awardees?state=" + encodeURIComponent(b.dataset.state); }));
  }

  // ---------- THEMES ----------
  function renderThemes() {
    const tc = countBy(analysed, r => r.th);
    const codes = Object.keys(LB.themes).sort((a, b) => (tc.get(b) || 0) - (tc.get(a) || 0));
    $("#themeGrid").innerHTML = codes.map(c => {
      const ex = analysed.filter(r => r.cat === "school" && r.th.includes(c)).slice(0, 3).map(r => title(r));
      return `<button class="tile" type="button" data-theme="${c}"><div class="tile-head"><strong>${esc(themeL(c))}</strong><b>${tc.get(c) || 0}</b></div>
        ${ex.length ? `<small>${esc(t("examples"))}: ${esc(ex.join(" · "))}</small>` : ""}</button>`;
    }).join("");
    $$("#themeGrid [data-theme]").forEach(b => b.addEventListener("click", () => { location.hash = "#/awardees?theme=" + b.dataset.theme; }));
  }

  // ---------- WORLD ----------
  const WF = { q: "", region: "", ev: "", band: "" };
  function wcard(p) {
    const tracked = !!trackerData()[p.id];
    return `<article class="card">${pimg(p.id, lang === "hi" ? p.name_hi : p.name_en)}
      <div class="chips"><span class="chip year">${esc(p.country)}</span><span class="chip ev-${p.evidence}">${esc(evL(p.evidence))}</span></div>
      <h3>${esc(lang === "hi" ? p.name_hi : p.name_en)}</h3>
      <p>${esc(lang === "hi" ? p.what_hi : p.what_en)}</p>
      <div class="meta-row">
        <div class="meta">${esc(t("cost"))}<b>${esc(costL(p.cost))}</b></div>
        <div class="meta fit-${p.fit}">${esc(t("fit"))}<b>${esc(t(p.fit === "high" ? "fitHigh" : "fitMedium"))}</b></div>
        <div class="meta">${esc(t("for"))}<b>${esc(p.grades.map(g => g.replace("-", "–")).join(", "))}</b></div>
      </div>
      <div class="card-foot"><button class="btn sm primary" data-wopen="${p.id}">${esc(t("open"))}</button>
        <a class="btn sm" href="#/prompts?id=${p.id}">${esc(t("makePrompts"))}</a>
        <button class="btn sm" data-track="${p.id}" aria-pressed="${tracked}">${esc(tracked ? t("inTrack") : t("addTrack"))}</button>${waBtn(p)}</div></article>`;
  }
  function renderWorld() {
    buildFilterOptions();
    $("#wRegion").value = WF.region; $("#wEv").value = WF.ev; $("#wBand").value = WF.band; $("#wq").value = WF.q;
    const list = W.practices.filter(p => (!WF.region || p.region === WF.region) && (!WF.ev || p.evidence === WF.ev) && (!WF.band || p.grades.includes(WF.band)) &&
      (!WF.q || [p.country, p.name_en, p.name_hi, p.what_en, p.what_hi].join(" ").toLowerCase().includes(WF.q.toLowerCase())));
    const order = { strong: 0, moderate: 1, emerging: 2 };
    list.sort((a, b) => order[a.evidence] - order[b.evidence]);
    $("#evLegend").innerHTML = ["strong", "moderate", "emerging"].map(e => `<span class="chip ev-${e}">${esc(evL(e))}</span>`).join("") +
      `<span>${lang === "hi" ? "प्रमाण स्तर: बड़े यादृच्छिक परीक्षण/मेटा-विश्लेषण = मज़बूत; कुछ अच्छे अध्ययन = मध्यम; आशाजनक पर कम शोध = उभरते।" : "Evidence: large trials / meta-analyses = strong; some good studies = moderate; promising but limited research = emerging."}</span>`;
    $("#worldCards").innerHTML = list.length ? list.map(wcard).join("") : `<p class="empty">${esc(t("noResults"))}</p>`;
  }
  $("#wq").addEventListener("input", e => { WF.q = e.target.value.trim(); renderWorld(); });
  $("#wRegion").addEventListener("change", e => { WF.region = e.target.value; renderWorld(); });
  $("#wEv").addEventListener("change", e => { WF.ev = e.target.value; renderWorld(); });
  $("#wBand").addEventListener("change", e => { WF.band = e.target.value; renderWorld(); });

  function openWorld(id) {
    const p = wById[id]; if (!p) return;
    const tracked = !!trackerData()[p.id];
    const steps = lang === "hi" ? p.steps_hi : p.steps_en;
    $("#dBody").innerHTML = `
      <div class="d-head"><div><h2 id="dTitle">${esc(lang === "hi" ? p.name_hi : p.name_en)}</h2><p class="muted" style="margin:0">${esc(p.country)} · ${esc(regionL(p.region))}</p></div>
        <button class="btn sm d-close" type="button" data-close>${esc(t("close"))}</button></div>
      <div class="chips"><span class="chip ev-${p.evidence}">${esc(evL(p.evidence))}</span><span class="chip cost${p.cost}">${esc(costL(p.cost))}</span>
        ${p.grades.map(g => `<span class="chip">${esc(bandL(g))}</span>`).join("")}${p.themes.map(c => `<span class="chip">${esc(themeL(c))}</span>`).join("")}</div>
      <div class="d-sec">${pimg(p.id, lang === "hi" ? p.name_hi : p.name_en, true)}</div>
      <div class="d-sec"><p>${esc(lang === "hi" ? p.what_hi : p.what_en)}</p></div>
      <div class="d-sec"><h3>${esc(t("evidence"))}</h3><p lang="en">${esc(p.evidence_note)}</p></div>
      <div class="d-sec"><h3>${esc(t("fit"))}: ${esc(t(p.fit === "high" ? "fitHigh" : "fitMedium"))}</h3><p>${esc(p.fit_hi)}</p></div>
      <div class="d-sec"><h3>${esc(t("dSteps"))}</h3><ol class="steps">${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
      <div class="d-sec links"><a class="btn sm" href="${esc(p.source)}" target="_blank" rel="noopener">${esc(t("lnkSource"))} ↗</a></div>
      <div class="d-sec links"><a class="btn primary" href="#/prompts?id=${p.id}">${esc(t("makePrompts"))}</a>
        <button class="btn" type="button" data-print="${p.id}">${esc(t("printCard"))}</button>
        ${waBtn(p, "btn wa")}
        <button class="btn" type="button" data-track="${p.id}" aria-pressed="${tracked}">${esc(tracked ? t("inTrack") : t("addTrack"))}</button></div>`;
    if (!dlg.open) dlg.showModal();
  }

  // ---------- PRIZE ----------
  function renderPrize() {
    const all = [];
    for (let y = 2015; y <= 2026; y++) { const w = W.gtp.find(g => g.year === y); all.push(w || { year: y, none: true }); }
    $("#prizeList").innerHTML = all.reverse().map(g => g.none ? `<li><div class="yr">${g.year}</div><div class="muted">${esc(t("noPrize"))}</div></li>` :
      `<li><div class="yr">${g.year}</div><div><h3>${esc(g.name)} <span class="chip">${esc(g.country)}</span></h3>
        <p>${esc(lang === "hi" ? g.what_hi : g.what_en)}</p><div class="borrow"><strong>${esc(t("borrow"))}:</strong> ${esc(g.borrow_hi)}</div></div></li>`).join("") +
      `<li><div></div><p class="note">${lang === "hi" ? "स्रोत:" : "Source:"} <a href="https://www.globalteacherprize.org/" target="_blank" rel="noopener">globalteacherprize.org</a></p></li>`;
  }

  // ---------- PROMPT STUDIO ----------
  function practiceOptions() {
    const items = analysed.map(r => ({ id: r.id, label: `${title(r)} — ${plainName(r.name)} (${r.year})` }))
      .concat(W.practices.map(p => ({ id: p.id, label: `${lang === "hi" ? p.name_hi : p.name_en} — ${p.country}` })));
    $("#practiceList").innerHTML = items.map(i => `<option value="${esc(i.label)}"></option>`).join("");
    return items;
  }
  let studioId = null;
  function itemForPrompt(id) {
    const r = byId[id];
    if (r && r.t) {
      return { kind: "nat", title_en: r.t[0], title_hi: r.t[1], steps_en: r.st[0], steps_hi: r.st[1], scene: r.scene, grades: r.gr, year: r.year,
        place: r.state, org: r.org, subj: (r.sub || []).filter(x => x !== "All"), note: `Inspired by a ${r.year} National Teachers' Award practice`,
        note_hi: `${r.year} के राष्ट्रीय शिक्षक पुरस्कार की पद्धति से प्रेरित` };
    }
    const p = wById[id];
    if (p) return { kind: "world", title_en: p.name_en, title_hi: p.name_hi, steps_en: p.steps_en, steps_hi: p.steps_hi, scene: p.scene, grades: p.grades,
      place: "India", org: "", subj: (p.subj || []).filter(x => x !== "All"), note: `Adapted from ${p.country}`, note_hi: `${p.country} की पद्धति, भारतीय कक्षा के लिए` };
    return null;
  }
  function gradeText(gr) {
    const g = (gr || []).filter(x => x !== "HE");
    if (!g.length) return "secondary school";
    const lo = g[0].split("-")[0], hi = g[g.length - 1].split("-").pop();
    return `Class ${lo}${lo !== hi ? "–" + hi : ""}`;
  }
  function buildPrompts(it, styleIdx, ratio, textLang) {
    const style = LB.styles[styleIdx][0];
    const ttl = textLang === "hi" ? it.title_hi : it.title_en;
    const steps = textLang === "hi" ? it.steps_hi : it.steps_en;
    const textRule = textLang === "none" ? "Do not include any written words, letters or numbers in the image." :
      textLang === "hi" ? "Any words in the image must be in correct Hindi (Devanagari script), short and clearly legible." :
        "Any words in the image must be in simple, correctly spelled English, short and clearly legible.";
    const safety = "Use generic, fictional characters only: do not depict, imitate or name any real or identifiable person, and add no logos or brand names. Show children respectfully, fully clothed in school uniforms, safe and happy.";
    const ORG = { KVS: "a Kendriya Vidyalaya (central government school)", NVS: "a Jawahar Navodaya Vidyalaya (residential school)",
      EMRS: "an Eklavya Model Residential School for tribal students", "Sainik School": "a Sainik School", AEES: "an Atomic Energy Central School" };
    const where = `${ORG[it.org] || "a school"}${it.place && it.place !== "India" ? ` in ${it.place}, India` : " in India"}`;
    let subs = it.subj || [];
    if (subs.length > 1) subs = subs.filter(x => x !== "Language");
    const subj = subs.length ? ` during a ${subs.join(" / ")} lesson` : "";
    const q = it.title_en.includes('"') ? it.title_en : `"${it.title_en}"`;
    const stepsEn = it.steps_en || [];
    // Practice-specific details first (what makes this image different), shared rules last and short.
    const scene = [
      `Create an illustration of this classroom practice: ${q}.`,
      `Who and where: ${gradeText(it.grades)} students of ${where}${subj}.`,
      `Main scene: ${it.scene}.`,
      `Show these activity details clearly — they are the heart of the practice:`,
      ...stepsEn.map(x => `• ${x}`),
      `The picture alone should make the activity easy to understand, so another teacher can copy it. The teacher works among the students as a guide.`,
      `Style: ${style}. Format: ${ratio}.`,
      `${textRule} Generic fictional people only (no real or identifiable person, no logos). Children in school uniform, safe and happy.`
    ].join("\n");
    const comic = [
      `Create a 4-panel instructional comic strip. Style: ${style}. Format: ${ratio}, panels in a 2×2 grid with clear borders, numbered 1–4.`,
      `Topic: "${ttl}" in an Indian school (${gradeText(it.grades)}).`,
      ...steps.slice(0, 3).map((s, i) => `Panel ${i + 1}: ${s}`),
      `Panel 4: the result — children confidently showing what they learned, teacher smiling.`,
      textLang === "none" ? "No text or speech bubbles; tell the story with pictures only." :
        `Add a very short caption (max 6 words) under each panel in ${textLang === "hi" ? "Hindi (Devanagari)" : "English"}, spelled correctly.`,
      safety
    ].join("\n");
    const poster = [
      `Design a classroom wall poster. Format: portrait A4 (3:4). Style: ${style}; high contrast and easy to read from a distance.`,
      textLang === "none" ? "Leave a clean empty band at the top for a title to be added later; no other text." : `Title at the top: "${ttl}".`,
      `Below the title, ${steps.length} numbered steps with one simple icon or small illustration each:`,
      ...steps.map((s, i) => `${i + 1}. ${s}`),
      textLang === "none" ? "" : `Small footer: "${textLang === "hi" ? "राष्ट्रीय शिक्षक पुरस्कार से प्रेरित" : it.note}".`,
      `Use a warm palette (saffron, deep green, cream), generous white space, rounded shapes.`,
      textRule, safety
    ].filter(Boolean).join("\n");
    return { scene, comic, poster };
  }
  function renderStudio(params) {
    const items = practiceOptions();
    const want = params && params.get("id");
    if (want) studioId = want;
    const pick = $("#pPick");
    const it = studioId ? itemForPrompt(studioId) : null;
    if (it) { const found = items.find(i => i.id === studioId); if (found) pick.value = found.label; }
    const out = $("#promptOut");
    if (!it) { out.innerHTML = `<div class="panel empty">${esc(t("pEmpty"))}</div>`; return; }
    const P = buildPrompts(it, +$("#pStyle").value || 0, $("#pRatio").value, $("#pText").value);
    const block = (id, h, d, txt) => `<article class="prompt-card"><header><div><h3 style="margin:0">${esc(h)}</h3><small class="muted">${esc(d)}</small></div>
      <button class="btn sm primary" data-copy="${id}">${esc(t("copy"))}</button></header><pre id="${id}">${esc(txt)}</pre></article>`;
    const fname = `${studioId}.jpg`;
    const saveBox = `<article class="prompt-card save-box"><header><div><h3 style="margin:0">${esc(t("saveTitle"))}</h3><small class="muted">${esc(t("saveSub"))}</small></div>
      <button class="btn sm primary" data-copy="fname">${esc(t("copy"))}</button></header>
      <p style="margin:0 0 6px"><code id="fname">${esc(fname)}</code></p>
      <ol class="steps note">${t("saveSteps").map(x => `<li>${esc(x)}</li>`).join("")}</ol></article>`;
    out.innerHTML = `<div class="panel"><h2 style="margin:0">${esc(lang === "hi" ? it.title_hi : it.title_en)}</h2><p class="note" style="margin:4px 0 0">${esc(lang === "hi" ? it.note_hi : it.note)}</p>
      <div class="links" style="margin-top:8px"><a class="btn sm" href="https://chatgpt.com/" target="_blank" rel="noopener">${esc(t("openChatGPT"))} ↗</a>
      <button class="btn sm" type="button" id="studioPrint">${esc(t("printCard"))}</button></div></div>` +
      block("pr1", t("pScene"), t("pSceneD"), P.scene) + saveBox + block("pr2", t("pComic"), t("pComicD"), P.comic) + block("pr3", t("pPoster"), t("pPosterD"), P.poster);
    $("#studioPrint").addEventListener("click", () => printCard(byId[studioId] || wById[studioId]));
  }
  $("#pPick").addEventListener("change", e => {
    const items = practiceOptions(); const f = items.find(i => i.label === e.target.value);
    if (f) { studioId = f.id; history.replaceState(null, "", "#/prompts?id=" + f.id); renderStudio(); }
  });
  ["pStyle", "pRatio", "pText"].forEach(id => $("#" + id).addEventListener("change", () => renderStudio()));

  // ---------- PRINT CARD ----------
  function printCard(x) {
    if (!x) return;
    let ttl, who, steps, sum, foot;
    if (x.t) {
      ttl = x.t[DI()]; who = `${x.name} · ${x.school} · ${stateL(x.state)} · ${x.year}`; steps = x.st[DI()];
      sum = lang === "hi" ? x.s_hi : (x.cit || "").split(/(?<=\.)\s/).slice(0, 2).join(" ");
    } else {
      ttl = lang === "hi" ? x.name_hi : x.name_en; who = x.country; steps = lang === "hi" ? x.steps_hi : x.steps_en; sum = lang === "hi" ? x.what_hi : x.what_en;
    }
    foot = t("pcFoot");
    const meta = x.t ? `${t("for")}: ${(x.gr || []).map(bandL).join(", ")} · ${t("cost")}: ${costL(x.cost)} · ${t("subjects")}: ${(x.sub || []).map(subjL).join(", ")}` :
      `${t("for")}: ${x.grades.map(bandL).join(", ")} · ${t("cost")}: ${costL(x.cost)} · ${t("evidence")}: ${evL(x.evidence)}`;
    $("#printArea").innerHTML = `<div class="pc"><h1>${esc(ttl)}</h1><div class="pc-meta">${esc(who)}<br>${esc(meta)}</div>
      <p>${esc(sum)}</p><h2>${esc(t("dSteps"))}</h2><ol>${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <h2>${lang === "hi" ? "मेरी कक्षा की योजना" : "My class plan"}</h2><p>${lang === "hi" ? "कक्षा: ________  तारीख: ________  सामग्री: ______________________" : "Class: ________  Date: ________  Materials: ______________________"}</p>
      <p>${lang === "hi" ? "क्या हुआ / अगली बार क्या बदलूँगा: ____________________________________________" : "What happened / what I will change: ____________________________________________"}</p>
      <div class="pc-foot">${esc(foot)}</div></div>`;
    setTimeout(() => window.print(), 50);
  }

  // ---------- TRACKER ----------
  function trackerData() { return store.get("ssp_tracker", {}); }
  function toggleTrack(id) {
    const d = trackerData();
    if (d[id]) delete d[id]; else d[id] = { status: "planned", note: "", date: new Date().toISOString().slice(0, 10) };
    store.set("ssp_tracker", d); toast(d[id] ? t("inTrack") : t("remove"));
  }
  function trackTitle(id) { const r = byId[id]; if (r) return [title(r), `${r.name} · ${r.year}`]; const p = wById[id]; if (p) return [lang === "hi" ? p.name_hi : p.name_en, p.country]; return [id, ""]; }
  function renderTracker() {
    const d = trackerData(); const ids = Object.keys(d);
    if (!ids.length) { $("#trackerList").innerHTML = `<p class="panel empty">${esc(t("trackEmpty"))}</p>`; return; }
    $("#trackerList").innerHTML = ids.map(id => {
      const [ttl, sub] = trackTitle(id); const e = d[id];
      return `<div class="trow" data-tid="${esc(id)}"><div><strong>${esc(ttl)}</strong><div class="note">${esc(sub)} · ${esc(e.date)}</div>
        <textarea data-note placeholder="${esc(t("notePh"))}">${esc(e.note)}</textarea></div>
        <div><select data-status>${["planned", "tried", "adopted"].map(s => `<option value="${s}"${e.status === s ? " selected" : ""}>${esc(t({ planned: "stPlanned", tried: "stTried", adopted: "stAdopted" }[s]))}</option>`).join("")}</select>
        <div class="links" style="margin-top:8px"><button class="btn sm" data-topen="${esc(id)}">${esc(t("open"))}</button><button class="btn sm ghost" data-tdel="${esc(id)}">${esc(t("remove"))}</button></div></div></div>`;
    }).join("");
  }
  $("#trackerList").addEventListener("input", e => {
    const row = e.target.closest("[data-tid]"); if (!row) return; const d = trackerData(); const it = d[row.dataset.tid]; if (!it) return;
    if (e.target.matches("[data-note]")) it.note = e.target.value; if (e.target.matches("[data-status]")) it.status = e.target.value; store.set("ssp_tracker", d);
  });
  $("#trackerList").addEventListener("change", e => { if (e.target.matches("[data-status]")) { const row = e.target.closest("[data-tid]"); const d = trackerData(); d[row.dataset.tid].status = e.target.value; store.set("ssp_tracker", d); } });
  $("#trackerList").addEventListener("click", e => {
    const o = e.target.closest("[data-topen]"); if (o) { byId[o.dataset.topen] ? openAwardee(o.dataset.topen) : openWorld(o.dataset.topen); }
    const x = e.target.closest("[data-tdel]"); if (x) { const d = trackerData(); delete d[x.dataset.tdel]; store.set("ssp_tracker", d); renderTracker(); }
  });
  $("#clearTracker").addEventListener("click", () => { if (confirm(t("confirmClear"))) { store.set("ssp_tracker", {}); renderTracker(); } });
  $("#exportCsv").addEventListener("click", () => {
    const d = trackerData();
    const rows = [["id", "practice", "teacher/country", "status", "date added", "note"]].concat(Object.keys(d).map(id => { const [a, b] = trackTitle(id); return [id, a, b, d[id].status, d[id].date, d[id].note]; }));
    const csv = "﻿" + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "my-adopted-practices.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // ---------- ABOUT ----------
  function renderAbout() {
    const c = y => A.filter(r => r.year === y && r.cat === "school").length, h = y => A.filter(r => r.year === y && r.cat === "higher").length;
    const tbl = `<table><thead><tr><th>${lang === "hi" ? "वर्ष" : "Year"}</th><th>${esc(t("lgSchool"))}</th><th>${esc(t("lgHE"))}</th><th>${lang === "hi" ? "प्रशस्ति स्थिति" : "Citation status"}</th></tr></thead><tbody>` +
      YEARS.map(y => `<tr><td>${y}</td><td>${c(y)}</td><td>${h(y) || "—"}</td><td>${y === 2026 ? (lang === "hi" ? "आधिकारिक सूची; प्रशस्ति अभी पोर्टल पर नहीं (16 के लिए समाचार/MoE पोस्ट से सारांश)" : "Official list; citations not yet on portal (16 summarised from news / MoE posts)") : (lang === "hi" ? "आधिकारिक प्रशस्ति (पोर्टल)" : "Official citation (portal)")}</td></tr>`).join("") + "</tbody></table>";
    const hi = `
      <p>यह डैशबोर्ड शिक्षकों के लिए बनाया गया है ताकि राष्ट्रीय शिक्षक पुरस्कार पाने वाले शिक्षकों की पद्धतियाँ हर कक्षा तक पहुँचें और उन्हें अपनाना आसान हो।</p>
      <h2>डेटा में क्या है</h2>${tbl}
      <h2>स्रोत</h2><ul>
        <li>आधिकारिक प्रशस्ति-पत्र, फ़ोटो और वीडियो: <a href="${PORTAL}TeacherCitation.aspx" target="_blank" rel="noopener">राष्ट्रीय शिक्षक पुरस्कार पोर्टल (विद्यालय)</a> और <a href="${PORTAL}heawardeecitation.aspx" target="_blank" rel="noopener">(उच्च शिक्षा)</a>; वीडियो शिक्षा मंत्रालय के आधिकारिक YouTube प्लेलिस्ट से।</li>
        <li>चयनित शिक्षकों की सूची: <a href="${PORTAL}Download.aspx" target="_blank" rel="noopener">पोर्टल का डाउनलोड पेज</a> (2021–2026 PDF)।</li>
        <li>2026 उच्च शिक्षा सूची: <a href="https://news.careers360.com/national-teachers-award-2026-21-heis-polytechnics-iits-medical-colleges-state-universities-president-murmu-sep-5" target="_blank" rel="noopener">Careers360 (PIB के हवाले से)</a>; 2026 के कुछ शिक्षकों का सार <a href="https://thelogicalindian.com/national-teachers-awards-125955/" target="_blank" rel="noopener">The Logical Indian</a> (MoE की X पोस्ट सहित) और <a href="https://www.prabhatkhabar.com/state/uttar-pradesh/up-teachers-national-teacher-award-2026" target="_blank" rel="noopener">प्रभात खबर</a> से।</li>
        <li>विश्व की पद्धतियाँ: हर कार्ड पर स्रोत लिंक; प्रमाण स्तर मुख्यतः <a href="https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit" target="_blank" rel="noopener">EEF टीचिंग एंड लर्निंग टूलकिट</a>, विश्व बैंक/GEEAP 'स्मार्ट बाय' रिपोर्ट और प्रकाशित मूल्यांकनों पर आधारित।</li>
        <li>ग्लोबल टीचर प्राइज़: <a href="https://www.globalteacherprize.org/" target="_blank" rel="noopener">globalteacherprize.org</a>।</li></ul>
      <h2>विश्लेषण कैसे किया गया</h2><ul>
        <li>हर आधिकारिक प्रशस्ति-पत्र पढ़कर उसकी मुख्य पद्धति का शीर्षक (हिंदी/अंग्रेज़ी), हिंदी सार, थीम, विषय, कक्षा स्तर, खर्च और 3 "अपनाने के चरण" लिखे गए। ये चरण प्रशस्ति में बताई पद्धति पर आधारित सुझाव हैं, शिक्षक के अपने शब्द नहीं।</li>
        <li>X (ट्विटर) पर मंत्रालय की पोस्ट: 2026 के 5 शिक्षकों की सीधी पोस्ट लिंक है; बाकी के लिए @EduMinOfIndia पर नाम से खोज का लिंक दिया गया है।</li>
        <li>इमेज प्रॉम्प्ट केवल गतिविधि दिखाते हैं; किसी वास्तविक शिक्षक का चेहरा या पहचान बनाने को नहीं कहते।</li>
        <li><b>अध्याय व दक्षता (CG):</b> अध्यायों के नाम NCERT की 2026-27 पुस्तकों के विषय-सूची पृष्ठ से (ncert.nic.in) हैं। हर अध्याय और हर पद्धति को विषय-वस्तु (topic) दी गई है और दोनों का मिलान दिखाया गया है; मिलान सुझाव है, अंतिम निर्णय शिक्षक का। कक्षा 3–5 की दक्षताएँ (CG) NCF-SE 2023 के प्रारंभिक चरण से, जैसा KVS ब्लूप्रिंट में है। भाषा विषयों में पद्धतियाँ पाठ के बजाय कौशल के अनुसार हैं।</li>
        <li><b>इस सप्ताह की पद्धति</b> हर सोमवार अपने-आप बदलती है (शून्य/कम लागत वाली आधिकारिक पद्धतियों में से)।</li></ul>
      <h2>ध्यान रखें</h2><ul>
        <li>पोर्टल पर 2024 का एक प्रोफ़ाइल (H.N. Girish) दो बार है, इसलिए 2024 में 50 के बजाय 49 प्रोफ़ाइल दिखते हैं।</li>
        <li>कुछ वीडियो लिंक पोर्टल पर दो शिक्षकों के लिए एक ही हैं; ऐसे कार्ड पर चेतावनी दी गई है। 2023 के वीडियो प्लेलिस्ट में क्रमांक से खुलते हैं।</li>
        <li>कौशल विकास मंत्रालय (MSDE) के ITI प्रशिक्षक पुरस्कार इस संस्करण में शामिल नहीं हैं।</li>
        <li>नया डेटा जोड़ने का तरीका README.md में है (scripts/ फ़ोल्डर)।</li></ul>`;
    const en = `
      <p>This dashboard helps teachers learn from National Teachers' Award winners and adopt their practices in their own classrooms.</p>
      <h2>What the data covers</h2>${tbl}
      <h2>Sources</h2><ul>
        <li>Official citations, photos and videos: <a href="${PORTAL}TeacherCitation.aspx" target="_blank" rel="noopener">National Teachers' Award portal (school)</a> and <a href="${PORTAL}heawardeecitation.aspx" target="_blank" rel="noopener">(higher education)</a>; videos from the Ministry of Education's official YouTube playlists.</li>
        <li>Selected-teacher lists: <a href="${PORTAL}Download.aspx" target="_blank" rel="noopener">portal download page</a> (2021–2026 PDFs).</li>
        <li>2026 higher-education list: <a href="https://news.careers360.com/national-teachers-award-2026-21-heis-polytechnics-iits-medical-colleges-state-universities-president-murmu-sep-5" target="_blank" rel="noopener">Careers360 (citing PIB)</a>; some 2026 summaries from <a href="https://thelogicalindian.com/national-teachers-awards-125955/" target="_blank" rel="noopener">The Logical Indian</a> (with MoE X posts) and <a href="https://www.prabhatkhabar.com/state/uttar-pradesh/up-teachers-national-teacher-award-2026" target="_blank" rel="noopener">Prabhat Khabar</a>.</li>
        <li>World practices: each card links its source; evidence ratings draw mainly on the <a href="https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit" target="_blank" rel="noopener">EEF Teaching and Learning Toolkit</a>, World Bank / GEEAP 'smart buys' and published evaluations.</li>
        <li>Global Teacher Prize: <a href="https://www.globalteacherprize.org/" target="_blank" rel="noopener">globalteacherprize.org</a>.</li></ul>
      <h2>How the analysis was done</h2><ul>
        <li>Each official citation was read and summarised into a practice title (Hindi/English), a Hindi summary, themes, subjects, class band, cost and 3 adoption steps. The steps are suggestions based on the practice described, not the teacher's own words.</li>
        <li>Ministry posts on X: direct links for 5 teachers of 2026; for others, a search link for the name on @EduMinOfIndia.</li>
        <li>Image prompts depict the activity only and never ask to recreate a real teacher's face or identity.</li>
        <li><b>Chapters & CGs:</b> chapter names come from the contents pages of NCERT's 2026-27 textbooks (ncert.nic.in). Every chapter and every practice carries topic tags and the matches between them are shown; matches are suggestions and the teacher decides. Class 3–5 Curricular Goals are from the NCF-SE 2023 Preparatory stage, as used in KVS blueprints. For languages, practices are listed by skill rather than by lesson.</li>
        <li><b>Practice of the week</b> changes automatically every Monday (chosen from official zero/low-cost practices).</li></ul>
      <h2>Notes</h2><ul>
        <li>The portal lists one 2024 profile (H.N. Girish) twice, so 49 profiles appear for 2024 instead of 50.</li>
        <li>A few videos are linked to two teachers on the portal; those cards carry a warning. 2023 videos open at the right position in the playlist.</li>
        <li>Ministry of Skill Development (MSDE) ITI trainer awards are not included in this edition.</li>
        <li>How to refresh the data is explained in README.md (scripts/ folder).</li></ul>`;
    $("#aboutBody").innerHTML = lang === "hi" ? hi : en;
  }

  // ---------- init ----------
  applyStatic();
  buildFilterOptions();
  route(true);
})();

(() => {
  "use strict";
  const MRPC_ME = {};
  window.__mrpcActive = MRPC_ME;
  const mrpcIsMe = () => window.__mrpcActive === MRPC_ME;
  const FIXED_STYLE = "editorial";
  const DEFAULT_ORNAMENT = "star-s";
  const DEFAULT_PALETTE = "slate";
  const STORAGE_KEY_ORNAMENT = "mrpc.ornament";
  const STORAGE_KEY_PALETTE = "mrpc.palette";
  const VARIANT_BASE = { "m-window-b": "m-window", "m-lamp-b": "m-lamp-m", "n-chime-b": "n-chime-t", "z-light-b": "z-light", "z-pond-b": "z-pond-f", "g-cross-b": "g-cross-n", "n-chime-t": "n-chime", "z-pond-f": "z-pond", "g-cross": "z-obj", "moon-r": "moon-s", "y-sji-n": "y-sji", "r-stars-t": "r-stars", "m-lamp-m": "m-lamp", "x-opera-q": "x-opera-n", "f-scene-p": "f-scene", "t-forecast-p": "t-forecast", "k-daily-p": "k-daily", "k-station-p": "k-station", "x-opera-n": "x-opera", "z-light": "z-obj", "z-pond": "z-obj", "z-boat": "z-obj", "z-tt": "z-doc", "z-slate": "z-doc", "k-daily-ol": "k-daily-p", "x-opera-ol": "x-opera-q", "x-opera-c": "x-opera-q", "k-station-w": "k-station-p", "g-cross-n": "g-cross" };
  const ORNAMENT_OPTIONS = [
    ["star-s", "별", "날짜·장소가 제목"],
    ["moon-r", "달"],
    ["p-wxmove", "날씨"],
    ["n-dropcap", "큰 머리글자"],
    ["n-rubric", "색 머리글자"],
    ["f-scene-p", "시나리오"],
    ["z-slate", "슬레이트"],
    ["z-tt", "시간표"],
    ["r-stars", "별자리", "위에 그림"],
    ["r-stars-t", "망원경 별자리"],
    ["s-flower", "이달의 꽃"],
    ["s-hourglass", "모래시계"],
    ["y-sji-n", "청사초롱"],
    ["u-hanja", "승정원일기"],
    ["m-pinwheel", "바람개비"],
    ["m-window", "창문", "옆에 그림"],
    ["m-window-b", "큰 창문"],
    ["m-lamp-m", "가로등"],
    ["m-lamp-b", "큰 가로등"],
    ["n-chime-t", "풍경"],
    ["n-chime-b", "큰 풍경"],
    ["n-balloon", "열기구"],
    ["z-light", "등대"],
    ["z-light-b", "큰 등대"],
    ["z-pond-f", "개구리 연못"],
    ["z-pond-b", "큰 개구리 연못"],
    ["g-cross-n", "건널목"],
    ["g-cross-b", "큰 건널목"],
    ["t-forecast-p", "일기예보", "칸 나뉜 표"],
    ["w-score", "악보"],
    ["k-daily-p", "일력"],
    ["k-daily-ol", "옅은 일력"],
    ["k-station-p", "역명판"],
    ["k-station-w", "옅은 역명판"],
    ["x-opera-ol", "공연 표"],
    ["x-opera-c", "투명 공연 표"],
    ["v-stamp", "소인 우표", "빈티지 소품"],
    ["v-lp", "LP 슬리브"],
    ["v-scrap", "스크랩북"],
    ["v-chart", "별자리 차트"],
    ["v-board", "탑승권"],
    ["v-post", "엽서"],
    ["v-film", "필름"],
    ["v-match", "성냥갑"],
    ["v-tarot", "타로"],
    ["v-log", "관측 일지"],
    ["v-spec", "나비 표본"],
    ["v-exlib", "장서표"],
  ];
  const PALETTE_OPTIONS = [
    ["cream", "크림"],
    ["sage", "세이지"],
    ["slate", "슬레이트"],
    ["rose", "로즈"],
    ["ink", "먹"],
    ["night", "밤하늘"],
    ["snow", "달빛"],
  ];
  const RAW_META = /§\s*RP\s*[|｜]\s*(?:(\d{4}|\d{2})(\d{2})(\d{2})|(\d{4}|\d{2})\s*(?:년|[.\-/])\s*(\d{1,2})\s*(?:월|[.\-/])\s*(\d{1,2})\s*일?)(?:\s*\([^()\r\n]*\))?\s*[|｜]\s*((?:[01]\d|2[0-3])\s*[:：]\s*[0-5]\d)\s*[|｜]\s*([^|｜§\r\n]+?)\s*(?:[|｜]\s*([^§\r\n]+?)\s*)?§/iu;
  const cleanupCallbacks = [];
  function clean(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .trim();
  }
  function weatherIconName(weather) {
    const value = clean(weather).toLowerCase();
    if (!value) return "cloud";
    if (/천둥|번개|폭풍|뇌우|storm|thunder/.test(value)) return "storm";
    if (/눈|진눈깨비|설|snow|sleet/.test(value)) return "snow";
    if (/비|소나기|장마|이슬비|rain|shower|drizzle/.test(value)) return "rain";
    if (/안개|박무|연무|fog|mist|haze/.test(value)) return "fog";
    if (/바람|강풍|돌풍|wind|gust|breez|gale/.test(value)) return "wind";
    if (/맑|쾌청|햇빛|화창|sun|clear/.test(value)) return "sun";
    return "cloud";
  }
  function readChoice(key, fallback, options) {
    try {
      const value = localStorage.getItem(key);
      return options.some(([option]) => option === value) ? value : fallback;
    } catch {
      return fallback;
    }
  }
  function saveChoice(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
  const ORNAMENT_ALIAS = { "n-chime": "n-chime-t", "z-pond-s": "z-pond-f", "z-pond-d": "z-pond-f", "z-pond-j": "z-pond-f", "z-pond": "z-pond-f", "typewriter": "f-scene-p", "m-lamp": "m-lamp-m", "moon-s": "moon-r", "x-opera": "x-opera-n", "y-program": "x-opera-n", "y-program-n": "x-opera-n", "f-scene": "f-scene-p", "t-forecast": "t-forecast-p", "k-daily": "k-daily-p", "k-station": "k-station-p", "r-stars-p": "r-stars", "k-station-c": "k-station-p", "k-station-ol": "k-station-p", "k-daily-w": "k-daily-p", "g-cross": "g-cross-n" };
  function currentOrnament() {
    try { const raw = localStorage.getItem(STORAGE_KEY_ORNAMENT); if (ORNAMENT_ALIAS[raw]) return ORNAMENT_ALIAS[raw]; } catch {}
    return readChoice(STORAGE_KEY_ORNAMENT, DEFAULT_ORNAMENT, ORNAMENT_OPTIONS);
  }
  function currentPalette() {
    return readChoice(STORAGE_KEY_PALETTE, DEFAULT_PALETTE, PALETTE_OPTIONS);
  }
  function parseStatus(text) {
    const value = String(text || "");
    const match = RAW_META.exec(value);
    if (match) {
      const year = match[1] ? (match[1].length === 4 ? match[1] : `20${match[1]}`) : (match[4].length === 4 ? match[4] : `20${match[4]}`);
      return {
        index: match.index,
        length: match[0].length,
        raw: match[0],
        weekday: (match[0].match(/\(\s*([월화수목금토일])(?:요일)?\s*\)/u) || [])[1] || null,
        year,
        month: match[1] ? match[2] : match[5].padStart(2, "0"),
        day: match[1] ? match[3] : match[6].padStart(2, "0"),
        time: match[7].replace(/\s+/g, "").replace("：", ":"),
        weather: clean(match[9]),
        location: clean(match[8]),
      };
    }
    return null;
  }
  function dropBlankText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const blanks = [];
    while (walker.nextNode()) if (!walker.currentNode.nodeValue.trim()) blanks.push(walker.currentNode);
    blanks.forEach((node) => node.remove());
  }
  function item(value, extraClass = "") {
    const element = document.createElement("span");
    element.className = `mrpc-item ${extraClass}`.trim();
    element.innerHTML = `
      <span class="mrpc-item-copy">
        <span class="mrpc-item-value"></span>
      </span>
    `;
    element.querySelector(".mrpc-item-value").textContent = value;
    dropBlankText(element);
    return element;
  }
  const INITIAL_ORNAMENTS = ["n-dropcap", "n-rubric"];
  function markHangul(card) {
    const host = card.closest(CONTENT_SELECTOR);
    const text = (host ? host.textContent : "") + " " + [...card.querySelectorAll(".mrpc-location .mrpc-item-value, .mrpc-weather .mrpc-item-value")].map((el) => el.textContent).join(" ");
    card.dataset.hangul = /[가-힣]/.test(text) ? "yes" : "no";
  }
  function setInitial(card, on, text = card.__mrpcLocation) {
    const value = card.querySelector(".mrpc-location .mrpc-item-value");
    if (!value || typeof text !== "string") return;
    const initial = on && /^([\s"'“‘(\[「『〈《]*)([A-Za-z]|[^\s"'“‘(\[「『〈《]+)/u.exec(text);
    value.textContent = text;
    delete card.dataset.initial;
    card.__mrpcInitText = text;
    if (!initial) return;
    card.dataset.initial = "letter";
  }
  function applyCardClasses(card) {
    const palette = currentPalette();
    const ornament = currentOrnament();
    for (const [value] of PALETTE_OPTIONS) card.classList.remove(`mrpc-palette-${value}`);
    for (const [value] of ORNAMENT_OPTIONS) card.classList.remove(`mrpc-ornament-${value}`);
    for (const value of Object.values(VARIANT_BASE)) card.classList.remove(`mrpc-ornament-${value}`);
    card.classList.add(`mrpc-theme-${FIXED_STYLE}`);
    card.classList.add(`mrpc-palette-${palette}`);
    for (const cls of [...card.classList]) if (cls.startsWith("mrpc-ornament-") || cls.startsWith("mo-")) card.classList.remove(cls);
    card.classList.add(`mrpc-ornament-${ornament}`, `mo-${ornament}`);
    for (let base = VARIANT_BASE[ornament], n = 0; base && n < 4; base = VARIANT_BASE[base], n += 1) card.classList.add(`mrpc-ornament-${base}`, `mo-${base}`);
    card.dataset.ornament = ornament;
    card.dataset.palette = palette;
    if (card.__mrpcCast) {
      renderCast(card.__mrpcCast, ornament, card);
      for (const [value] of PALETTE_OPTIONS) card.__mrpcCast.classList.remove(`mrpc-palette-${value}`);
      card.__mrpcCast.classList.add(`mrpc-palette-${palette}`);
    }
    syncVintage(card, ornament);
    if (INITIAL_ORNAMENTS.includes(ornament) || card.dataset.initial) setInitial(card, INITIAL_ORNAMENTS.includes(ornament));
    card.querySelector(".mrpc-proof-ins")?.remove();
    ensureWx(card, wantsWx(ornament));
    card.querySelectorAll(".mrpc-names").forEach((box) => box.remove());
  }
  const FX_ORNAMENTS = ["s-hourglass", "r-stars", "t-forecast", "k-daily", "m-pinwheel", "m-lamp", "m-window", "y-sji", "n-chime", "n-balloon", "z-obj"];
  const rootsOf = (o) => { const r = [o]; for (let b = VARIANT_BASE[o], n = 0; b && n < 4; b = VARIANT_BASE[b], n += 1) r.push(b); return r; };
  const wantsWx = (ornament) => rootsOf(ornament).some((o) => o === "p-wxmove" || FX_ORNAMENTS.includes(o));
  function ensureWx(card, wanted) {
    let keep = null;
    for (const box of card.querySelectorAll(".mrpc-wx")) {
      if (wanted && !keep && box.parentElement === card && box.children.length === 3) keep = box;
      else box.remove();
    }
    if (!wanted || keep) return;
    const box = document.createElement("span");
    box.className = "mrpc-wx";
    box.setAttribute("aria-hidden", "true");
    box.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
    card.append(box);
  }
  function createCard(meta, sourceText) {
    const card = document.createElement("span");
    card.className = "mrpc-card";
    card.setAttribute("role", "group");
    card.setAttribute(
      "aria-label",
      `작중 정보: ${meta.year}년 ${meta.month}월 ${meta.day}일, ${meta.time}, ${meta.weather || "날씨 미상"}, ${meta.location}`,
    );
    card.__mrpcSourceText = sourceText;
    card.__mrpcMeta = meta;
    const date = document.createElement("span");
    date.className = "mrpc-date";
    date.innerHTML = `
      <span class="mrpc-date-copy">
        <strong class="mrpc-date-value"></strong>
      </span>
    `;
    dropBlankText(date);
    const dateValue = date.querySelector(".mrpc-date-value");
    const weekdayKo = meta.weekday || "일월화수목금토"[new Date(Date.UTC(Number(meta.year), Number(meta.month) - 1, Number(meta.day))).getUTCDay()];
    card.__mrpcDate = `${meta.year}.${meta.month}.${meta.day} (${weekdayKo})`;
    dateValue.append(document.createTextNode(`${meta.year}.${meta.month}.${meta.day} `));
    const weekdayNode = document.createElement("span");
    weekdayNode.className = "mrpc-weekday";
    weekdayNode.textContent = `(${weekdayKo})`;
    dateValue.append(weekdayNode);
    dateValue.setAttribute("translate", "no"); dateValue.classList.add("notranslate");
    const details = document.createElement("span");
    details.className = "mrpc-details";
    details.append(item(meta.time, "mrpc-time"));
    if (meta.weather) {
      details.append(item(meta.weather, "mrpc-weather"));
    }
    details.append(item(meta.location, "mrpc-location"));
    card.__mrpcLocation = meta.location;
    card.dataset.hangul = /[가-힣]/.test(`${meta.location} ${meta.weather || ""}`) ? "yes" : "no";
    const hour = Number(meta.time.slice(0, 2));
    card.dataset.period = hour < 5 ? "night" : hour < 8 ? "dawn" : hour < 17 ? "day" : hour < 20 ? "dusk" : "night";
    card.dataset.sji = String(Math.floor(((hour + 1) % 24) / 2));
    {
      const mo = Number(meta.month);
      const st = [["Orion","오리온자리"],["Canis Major","큰개자리"],["Gemini","쌍둥이자리"],["Leo","사자자리"],["Boötes","목동자리"],["Scorpius","전갈자리"],["Lyra","거문고자리"],["Cygnus","백조자리"],["Sagittarius","궁수자리"],["Pegasus","페가수스자리"],["Andromeda","안드로메다자리"],["Perseus","페르세우스자리"]][mo - 1] || ["",""];
      card.dataset.starEn = st[0]; card.dataset.starKo = st[1];
    }
    {
      const y = Number(meta.year), mo = Number(meta.month), d = Number(meta.day), mm = Number(meta.time.slice(3, 5)) || 0, t = hour + mm / 60;
      const F = [["Camellia","동백"],["Plum Blossom","매화"],["Daffodil","수선화"],["Cherry Blossom","벚꽃"],["Rose","장미"],["Hydrangea","수국"],["Lotus","연꽃"],["Sunflower","해바라기"],["Balloon Flower","도라지꽃"],["Cosmos","코스모스"],["Chrysanthemum","국화"],["Poinsettia","포인세티아"]][mo - 1] || ["",""];
      card.dataset.flEn = F[0]; card.dataset.flKo = F[1]; card.dataset.mon = String(mo);
      card.style.setProperty("--burn", (mm / 60).toFixed(3));
    }
    card.dataset.weather = meta.weather ? weatherIconName(meta.weather) : "none";
    card.dataset.heavy = /heavy|torrential|downpour|pouring|폭우|호우|장대비|큰비|강한 ?비|집중 ?호우/i.test(meta.weather || "") ? "yes" : "no";
    {
      const y = Number(meta.year), mo = Number(meta.month), d = Number(meta.day), mm = Number(meta.time.slice(3, 5)) || 0;
      const wd = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
      details.dataset.wdKo = "일월화수목금토"[wd] + "요일"; details.dataset.wdEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][wd];
      card.dataset.sunday = wd === 0 ? "yes" : "no";
      {
        const t = hour * 60 + mm, P = [[0, 510, "등교 전", "Before school"], [510, 540, "조회", "Homeroom"], [540, 590, "1교시", "Period 1"], [600, 650, "2교시", "Period 2"], [660, 710, "3교시", "Period 3"], [720, 770, "4교시", "Period 4"], [770, 820, "점심시간", "Lunch"], [820, 870, "5교시", "Period 5"], [880, 930, "6교시", "Period 6"], [940, 990, "7교시", "Period 7"], [990, 1080, "방과 후", "After school"], [1080, 1320, "야간 자율 학습", "Evening study"], [1320, 1440, "하교 후", "After hours"]];
        const slot = P.find((x) => t >= x[0] && t < x[1]) || ["", "", "쉬는 시간", "Break"];
        card.dataset.ttKo = slot[2]; card.dataset.ttEn = slot[3];
        const wi = (wd + 6) % 7, mark = (arr) => arr.map((x, i) => (i === wi ? `[${x}]` : x)).join(" ");
        details.dataset.daysKo = mark([..."월화수목금토일"]); details.dataset.daysEn = mark(["M", "T", "W", "T", "F", "S", "S"]);
      }
      card.dataset.dnum = String(d);
      {
        card.dataset.season = mo >= 3 && mo <= 5 ? "spring" : mo >= 6 && mo <= 8 ? "summer" : mo >= 9 && mo <= 11 ? "autumn" : "winter";
        const age = (((Date.UTC(y, mo - 1, d, hour, mm) - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.530588 + 29.530588) % 29.530588;
        { const f = age / 29.530588, lit = (1 - Math.cos(2 * Math.PI * f)) / 2; card.style.setProperty("--moonx", `${(f < 0.5 ? -1 : 1) * (17 * lit).toFixed(1)}px`); }
      }
      {
        card.dataset.line = String(mo);
        const TERMS = [[1,6,"소한","Minor Cold"],[1,20,"대한","Major Cold"],[2,4,"입춘","Start of Spring"],[2,19,"우수","Rain Water"],[3,6,"경칩","Awakening of Insects"],[3,21,"춘분","Spring Equinox"],[4,5,"청명","Clear and Bright"],[4,20,"곡우","Grain Rain"],[5,6,"입하","Start of Summer"],[5,21,"소만","Grain Buds"],[6,6,"망종","Grain in Ear"],[6,21,"하지","Summer Solstice"],[7,7,"소서","Minor Heat"],[7,23,"대서","Major Heat"],[8,8,"입추","Start of Autumn"],[8,23,"처서","End of Heat"],[9,8,"백로","White Dew"],[9,23,"추분","Autumn Equinox"],[10,8,"한로","Cold Dew"],[10,23,"상강","Frost's Descent"],[11,7,"입동","Start of Winter"],[11,22,"소설","Minor Snow"],[12,7,"대설","Major Snow"],[12,22,"동지","Winter Solstice"]];
        let term = TERMS[TERMS.length - 1]; for (const t of TERMS) if (mo > t[0] || (mo === t[0] && d >= t[1])) term = t;
        card.dataset.termKo = `절기 · ${term[2]}`; card.dataset.termEn = `solar term · ${term[3]}`;
        details.dataset.seatEn = `BOX ${(d % 9) + 1} · SEAT ${mo + (d % 20)}`; details.dataset.seatKo = `${(d % 9) + 1}번 박스 · ${mo + (d % 20)}석`;
      }
      details.dataset.monKo = `${mo}월`; details.dataset.monEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"][mo - 1] || "";
    }
    card.append(date, details);
    applyCardClasses(card);
    return card;
  }
  // 태그 바로 아래 '이름: 의상 | 자세 | 심리' 줄들 (이름은 무엇이든 가능, 칸은 2~3개)
  const MAX_CAST = 12;
  const CAST_LINE = /^[ \t]*(?:\r?\n[ \t]*)+(?:[-*•·][ \t]+)?([^\r\n:：|｜§]{1,40}?)[ \t]*[:：][ \t]*([^\r\n§]*?[|｜][^\r\n§]*?)[ \t]*(?=\r?\n|$)/u;
  const CAST_LABELS = ["의상", "자세", "심리"];
  function splitCastFields(text) {
    const m = /^(.*?)\s*[|｜]\s*(.*?)(?:\s*[|｜]\s*(.*))?$/su.exec(text) || [];
    return [m[1], m[2], m[3]].map(clean).filter((v, i) => i < 2 || v);
  }
  // '짜증 (￣^￣)' → ["짜증", "(￣^￣)"], '(；´Д`)' → ["", "(；´Д`)"]
  function splitMood(value) {
    const text = clean(value);
    if (!text) return ["", ""];
    const m = /^(.*?[가-힣A-Za-z].*?)\s+([^가-힣]*[^\sA-Za-z0-9가-힣.,!?~][^가-힣]*)$/u.exec(text);
    if (m) return [clean(m[1]), clean(m[2])];
    if (!/[가-힣A-Za-z]{2}/.test(text) && /[^\sA-Za-z0-9가-힣]/.test(text)) return ["", text];
    return [text, ""];
  }
  function createCast(list) {
    const box = document.createElement("span");
    box.className = "mrpc-cast";
    box.setAttribute("aria-label", "인물 상태");
    box.setAttribute("translate", "no");
    box.__list = list;
    return box;
  }
  function fillStdCast(box, list) {
    const chips = document.createElement("span");
    chips.className = "mrpc-cast-chips";
    const tickets = document.createElement("span");
    tickets.className = "mrpc-cast-tickets";
    list.forEach((person, n) => {
      const [moodText, kao] = splitMood(person.fields[2]);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "mrpc-cast-chip";
      chip.dataset.index = String(n);
      chip.setAttribute("aria-expanded", "false");
      const name = document.createElement("span");
      name.className = "mrpc-cast-name";
      name.textContent = person.name;
      chip.append(name);
      if (kao) {
        const k = document.createElement("span");
        k.className = "mrpc-cast-kao";
        k.textContent = kao;
        chip.append(k);
      }
      chips.append(chip);
      const ticket = document.createElement("span");
      ticket.className = "mrpc-cast-ticket";
      ticket.dataset.index = String(n);
      ticket.hidden = true;
      ticket.innerHTML = '<span class="mrpc-cast-notch mrpc-cast-notch-l"></span><span class="mrpc-cast-notch mrpc-cast-notch-r"></span><span class="mrpc-cast-stub"><span class="mrpc-cast-admit"></span><span class="mrpc-cast-who"></span></span><span class="mrpc-cast-body"></span>';
      ticket.querySelector(".mrpc-cast-admit").textContent = `ADMIT · ${String(n + 1).padStart(2, "0")}`;
      ticket.querySelector(".mrpc-cast-who").textContent = person.name;
      const body = ticket.querySelector(".mrpc-cast-body");
      const rows = [[CAST_LABELS[0], person.fields[0]], [CAST_LABELS[1], person.fields[1]]];
      if (person.fields[2]) rows.push([CAST_LABELS[2], moodText, kao]);
      for (const [label, value, k] of rows) {
        if (!value && !k) continue;
        const row = document.createElement("span");
        row.className = "mrpc-cast-row";
        const lb = document.createElement("span");
        lb.className = "mrpc-cast-label";
        lb.textContent = label;
        const val = document.createElement("span");
        val.className = "mrpc-cast-value";
        val.textContent = value ? value + (k ? " " : "") : "";
        if (k) {
          const kk = document.createElement("span");
          kk.className = "mrpc-cast-kao";
          kk.textContent = k;
          val.append(kk);
        }
        row.append(lb, val);
        body.append(row);
      }
      tickets.append(ticket);
    });
    box.append(chips, tickets);
  }
  function toggleCast(chip) {
    const box = chip.closest(".mrpc-cast");
    if (!box) return;
    const index = chip.dataset.index;
    const opening = chip.getAttribute("aria-expanded") !== "true";
    for (const c of box.querySelectorAll(".mrpc-cast-chip")) { c.setAttribute("aria-expanded", String(opening && c === chip)); c.classList.toggle("on", opening && c === chip); }
    for (const t of box.querySelectorAll(".mrpc-cast-ticket")) t.hidden = !(opening && t.dataset.index === index);
    box.toggleAttribute("data-open", opening);
  }
  // ── 빈티지 소품 모양 12가지: 카드 자리에 따로 그린 종이 소품을 놓고, 인물 상태도 같은 모양으로 ──
  const VINTAGE = {
    "v-stamp": "소인 우표", "v-lp": "LP 슬리브", "v-scrap": "스크랩북", "v-chart": "별자리 차트",
    "v-board": "탑승권", "v-post": "엽서", "v-film": "필름", "v-match": "성냥갑",
    "v-tarot": "타로", "v-log": "관측 일지", "v-spec": "나비 표본", "v-exlib": "장서표",
  };
  const isVintage = (ornament) => Object.prototype.hasOwnProperty.call(VINTAGE, ornament);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const WX_EN = { snow: "SNOW", rain: "RAIN", sun: "CLEAR", cloud: "CLOUDY", fog: "FOG", storm: "STORM", wind: "WIND", none: "SKY" };
  const WX_SVG = {
    snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5"/>',
    rain: '<path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.4 1.5A3.3 3.3 0 0 1 17 14Z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    cloud: '<path d="M6.5 18a4.5 4.5 0 0 1 .6-9 5.5 5.5 0 0 1 10.5 1.6A3.7 3.7 0 0 1 17.5 18Z"/>',
    fog: '<path d="M3 8h18M5 12h14M3 16h18M7 20h10"/>',
    storm: '<path d="M7 13a4 4 0 0 1 .5-8 5 5 0 0 1 9.4 1.5A3.3 3.3 0 0 1 17 13Z"/><path d="M12.5 13 10 17.5h3.5L11 22"/>',
    wind: '<path d="M3 9h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 17h7"/>',
  };
  const wxIcon = (key) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${WX_SVG[key] || WX_SVG.cloud}</svg>`;
  const V_CONS = '<svg class="c" viewBox="0 0 92 56" fill="none" stroke="currentColor" stroke-width=".8"><path d="M6 44 26 30 44 36 60 14 84 8M44 36 58 50" opacity=".6"/><g fill="currentColor" stroke="none"><circle cx="6" cy="44" r="1.6"/><circle cx="26" cy="30" r="2.2"/><circle cx="44" cy="36" r="1.6"/><circle cx="60" cy="14" r="2.6"/><circle cx="84" cy="8" r="1.6"/><circle cx="58" cy="50" r="1.3"/></g></svg>';
  const V_SKY = '<svg class="bg" viewBox="0 0 360 150" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width=".6"><path d="M18 132 40 112 62 124 74 100M282 34 304 20 326 36 342 22 M304 20 312 52" opacity=".7"/><g fill="currentColor" stroke="none"><circle cx="18" cy="132" r="1.6"/><circle cx="40" cy="112" r="2.2"/><circle cx="62" cy="124" r="1.4"/><circle cx="74" cy="100" r="2.2"/><circle cx="282" cy="34" r="1.6"/><circle cx="304" cy="20" r="2.6"/><circle cx="326" cy="36" r="1.5"/><circle cx="342" cy="22" r="1.8"/><circle cx="312" cy="52" r="1.3"/><circle cx="180" cy="18" r=".9"/><circle cx="210" cy="132" r=".9"/><circle cx="150" cy="40" r=".7"/><circle cx="330" cy="120" r="1"/></g></svg>';
  const V_STAR = '<svg class="st" viewBox="0 0 110 90" fill="none" stroke="currentColor" stroke-width="1"><path d="M55 10 61 39 90 45 61 51 55 80 49 51 20 45 49 39Z" fill="currentColor" fill-opacity=".14"/><path d="M55 22 58 42 75 45 58 48 55 68 52 48 35 45 52 42Z" fill="currentColor"/><g fill="currentColor" stroke="none"><circle cx="18" cy="16" r="1.6"/><circle cx="92" cy="14" r="2"/><circle cx="96" cy="72" r="1.4"/><circle cx="14" cy="74" r="1.8"/><circle cx="30" cy="28" r=".9"/><circle cx="82" cy="30" r=".9"/></g><path d="M8 86h94" opacity=".5"/></svg>';
  const V_BF = '<span class="bfi"></span>';
  function vintageData(card) {
    const m = card.__mrpcMeta;
    if (!m) return null;
    const wd = card.__mrpcDate?.match(/\((.)\)/)?.[1] || "";
    const yy = m.year.slice(2);
    const [hh, mi] = m.time.split(":");
    const wx = card.dataset.weather || "none";
    const period = { night: "NIGHT", dawn: "DAWN", day: "DAY", dusk: "DUSK" }[card.dataset.period] || "NIGHT";
    return {
      y: m.year, yy, mo: m.month, d: m.day, day: Number(m.day), wd: esc(wd), hh, mi, time: esc(m.time),
      w: esc(m.weather || ""), place: esc(m.location), wx, wxEn: WX_EN[wx] || "SKY", period,
      full: `${m.year}.${m.month}.${m.day}`, short: `${yy}.${m.month}.${m.day}`,
    };
  }
  const tw = (a, sep, b) => (b ? `${a}${sep}${b}` : a);
  function vintageCardHTML(kind, t) {
    switch (kind) {
      case "v-stamp":
        return `<div class="c1w"><div class="c1"><div class="in"><div class="art">${V_BF}<span>${t.wxEn}</span></div><div><div class="dt">${t.full}<small>(${t.wd})</small></div><div class="tm">${tw(t.time, " · ", t.w)}</div><div class="pl">${t.place}</div></div><span class="val">no. ${t.day}</span></div></div></div>`;
      case "v-lp":
        return `<div class="c2"><span class="disc b"><i>${t.time}</i></span><div class="sl"><div class="t"><span class="mk">NOW PLAYING</span><span class="mk">SIDE A</span></div><div class="pl">${t.place}</div><div class="meta"><span>DATE <b>${t.short} (${t.wd})</b></span><span>TIME <b>${t.time}</b></span>${t.w ? `<span>WEATHER <b>${t.w}</b></span>` : ""}</div></div></div>`;
      case "v-scrap":
        return `<div class="c3w"><span class="tp l"></span><span class="tp r"></span><div class="c3${t.w ? "" : " nostk"}"><span class="ds">${t.yy} · ${t.mo} · ${t.d} (${t.wd})</span><div class="pl">${t.place}</div><div class="ln">— ${t.time}</div>${t.w ? `<div class="stk">${wxIcon(t.wx)}<span>${t.w}</span></div>` : ""}</div></div>`;
      case "v-chart":
        return `<div class="c4">${V_SKY}<div class="r"><span class="mk">✦ &nbsp;CELESTIAL CHART&nbsp; ✦</span><div class="dt">${t.full} <small>(${t.wd})</small></div><div class="tm">${tw(`${t.hh}h ${t.mi}m`, " · ", t.w)}</div><div class="pl">${t.place}</div></div></div>`;
      case "v-board":
        return `<div class="c5"><span class="n1"></span><span class="n2"></span><div><div class="band"><span class="mk">BOARDING PASS</span><span class="mk">✦ ${t.period} LINE</span></div><div class="pl"><span class="mk">GATE</span><b>${t.place}</b></div><div class="grid"><div><span class="mk">DATE</span><b>${t.short} (${t.wd})</b></div><div><span class="mk">TIME</span><b>${t.time}</b></div>${t.w ? `<div><span class="mk">WEATHER</span><b>${t.w}</b></div>` : ""}</div></div><div class="stub"><div class="bc"></div><span>${t.short} ${t.time}</span></div></div>`;
      case "v-post":
        return `<div class="pc"><div class="l"><div class="ttl">Post Card</div><div class="msg">${t.place}에서,<br>${tw(t.w, " · ", t.time) || t.time}</div></div><div class="r"><div class="smp"><div>${V_BF}</div></div><div class="pmk">SCENE POST<b>${t.short}</b>(${t.wd})</div><div class="adr"><div>${t.y}. ${t.mo}. ${t.d} (${t.wd})</div><div>${t.hh} : ${t.mi}</div><div>날씨 · ${t.w || "—"}</div></div></div></div>`;
      case "v-film":
        return `<div class="fm"><div class="fr"><span class="no">▸ ${t.day}A</span><div class="dt">${t.full} <small>(${t.wd})</small></div><div class="tm">${tw(t.time, " · ", t.w)}</div><div class="pl">${t.place}</div></div></div>`;
      case "v-match":
        return `<div class="mb"><div class="lab"><div class="in"><div class="sm">SAFETY MATCHES</div><div class="arc">${t.place}</div><div class="bar"><span>${t.short} (${t.wd})</span><span>${t.time}</span>${t.w ? `<span>${t.w}</span>` : ""}</div><div class="sm">— EST. ${t.y} —</div></div></div></div>`;
      case "v-tarot":
        return `<div class="tr"><div class="in"><div class="num">XVII</div>${V_STAR}<div class="nm">${t.place}</div><div class="ft">${t.short} (${t.wd}) · ${tw(t.time, " · ", t.w)}</div></div></div>`;
      case "v-log":
        return `<div class="ob"><div class="hd"><b>OBSERVATION LOG</b><span class="mk">No. ${t.day}</span></div><table><tr><th>DATE</th><td class="hand">${t.full} (${t.wd})</td></tr><tr><th>TIME</th><td class="hand">${t.time}</td></tr>${t.w ? `<tr><th>SKY</th><td class="hand">${t.w}</td></tr>` : ""}<tr><th>SITE</th><td class="hand site">${t.place}</td></tr></table>${V_CONS}</div>`;
      case "v-spec":
        return `<div class="sp"><div class="in"><div class="bug">${V_BF}<span class="pin"></span></div><div class="lab"><div class="sn">No. ${t.day} · Papilio noctis</div>채집일 ${t.short} (${t.wd})<br>채집시 ${tw(t.time, " · ", t.w)}<br>채집지 <span class="pl">${t.place}</span></div></div></div>`;
      case "v-exlib":
        return `<div class="ex"><div class="in"><span class="co c1">✦</span><span class="co c2">✦</span><span class="co c3">✦</span><span class="co c4">✦</span>${V_BF}<div class="el">EX LIBRIS</div><div class="pl">${t.place}</div><div class="ft"><span>${t.short} (${t.wd})</span><span>${t.time}</span>${t.w ? `<span>${t.w}</span>` : ""}</div></div></div>`;
    }
    return "";
  }
  // 인물 상태 (빈티지): 버튼 겉모양 + 펼친 칸 모양
  function vintagePerson(person) {
    const [moodText, kao] = splitMood(person.fields[2]);
    const k = kao ? `<span class="k">${esc(kao)}</span>` : "";
    const mood = person.fields[2] ? `${esc(moodText)}${moodText && kao ? " " : ""}${k}` : "";
    return { name: esc(person.name), outfit: esc(person.fields[0] || ""), pose: esc(person.fields[1] || ""), mood, k };
  }
  function vRows(p) {
    return '<div class="fields">' + [[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].map(([l, v]) => (v ? `<div class="row"><span class="lb">${l}</span><span>${v}</span></div>` : "")).join("") + "</div>";
  }
  function vintageChipHTML(kind, p, n, t) {
    const nm = `<b>${p.name}</b>${p.k}`;
    switch (kind) {
      case "v-stamp": return { cls: "stw", html: `<span class="st"><span class="i">${nm}</span></span>` };
      case "v-lp": return { cls: "lp", html: `<span class="disc s"></span>${nm}` };
      case "v-scrap": return { cls: "sc", html: nm };
      case "v-chart": return { cls: "sr", html: `<span class="str">✦</span>${nm}` };
      case "v-board": return { cls: "bd", html: `<i>${String(n + 1).padStart(2, "0")}</i>${nm}` };
      case "v-post": return { cls: "ch", html: nm };
      case "v-film": return { cls: "fch", html: `<i>${(t?.day || 0) + n}A</i>${nm}` };
      case "v-match": return { cls: "mch", html: nm };
      case "v-tarot": return { cls: "tch", html: `<i>${ROMAN[n] || n + 1}</i>${nm}` };
      case "v-log": return { cls: "och", html: `<i></i>${nm}` };
      case "v-spec": return { cls: "tagc", html: nm };
      case "v-exlib": return { cls: "ov", html: nm };
    }
    return { cls: "ch", html: nm };
  }
  function vintagePanelHTML(kind, p, n, t) {
    const no = String(n + 1).padStart(2, "0");
    const dot = t ? `${t.yy}·${t.mo}·${t.d}` : "";
    switch (kind) {
      case "v-stamp":
        return `<div class="stpw"><div class="stp"><div class="in"><div class="pm"><b>${p.name}</b><span>${dot}</span></div><div>${vRows(p)}</div><span class="bf bfi"></span></div></div></div>`;
      case "v-lp":
        return `<div class="lpw"><span class="disc b"></span><div class="sleeve"><div class="hd"><b>${p.name}</b><span>SIDE A</span></div>${[["A1", p.outfit], ["A2", p.pose], ["A3", p.mood]].filter(([, v]) => v).map(([a, v]) => `<div class="trk"><i>${a}</i><span>${v}</span></div>`).join("")}</div></div>`;
      case "v-scrap":
        return `<div class="notew"><span class="tp"></span><div class="note"><b>${p.name} —</b>${[[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].filter(([, v]) => v).map(([l, v]) => `<br>${l}: ${v}`).join("")}</div></div>`;
      case "v-chart":
        return `<div class="chart">${V_CONS}<div class="hd"><b>${p.name}</b><span>star · ${no}</span></div>${vRows(p)}</div>`;
      case "v-board":
        return `<div class="bp"><span class="n1"></span><span class="n2"></span><div class="main"><div class="band"><span>BOARDING PASS</span><span>SEAT ${no}</span></div><div class="ps"><span>PASSENGER</span><b>${p.name}</b></div>${vRows(p)}</div><div class="stub"><div class="bc"></div><span>${t ? `${t.short} ${t.time}` : ""}</span></div></div>`;
      case "v-post":
        return `<div class="pcb"><div class="dear">Dear ${p.name},</div>${vRows(p)}</div>`;
      case "v-film":
        return `<div class="fm"><div class="fr"><span class="no">▸ ${(t?.day || 0) + n}A · ${p.name}</span>${vRows(p)}</div></div>`;
      case "v-match":
        return `<div class="mbp"><div class="in"><div class="t">${p.name}</div>${vRows(p)}</div></div>`;
      case "v-tarot":
        return `<div class="trp"><div class="mini"><b>${ROMAN[n] || n + 1}</b>${V_STAR}<span>${p.name}</span></div>${vRows(p)}</div>`;
      case "v-log":
        return `<div class="ob"><div class="hd"><b class="who">${p.name}</b><span class="mk">OBJECT ${no}</span></div><table>${[[CAST_LABELS[0], p.outfit], [CAST_LABELS[1], p.pose], [CAST_LABELS[2], p.mood]].filter(([, v]) => v).map(([l, v]) => `<tr><th>${l}</th><td>${v}</td></tr>`).join("")}</table></div>`;
      case "v-spec":
        return `<div class="lab big"><div class="sn">${p.name} <span class="mk">SPECIMEN ${no}</span></div>${vRows(p)}</div>`;
      case "v-exlib":
        return `<div class="ex"><div class="in left"><span class="co c1">✦</span><span class="co c2">✦</span><span class="co c3">✦</span><span class="co c4">✦</span><div class="el">EX LIBRIS · ${p.name}</div>${vRows(p)}</div></div>`;
    }
    return "";
  }
  function renderCast(box, ornament, card) {
    const list = box.__list || [];
    const kind = isVintage(ornament) ? ornament : "std";
    if (box.dataset.kind === kind && box.dataset.sig === (card?.__mrpcDate || "")) return;
    box.dataset.kind = kind;
    box.dataset.sig = card?.__mrpcDate || "";
    for (const cls of [...box.classList]) if (cls.startsWith("mrpc-v") || cls === "mrpc-cast-std") box.classList.remove(cls);
    box.removeAttribute("data-open");
    box.textContent = "";
    if (kind === "std") {
      box.classList.add("mrpc-cast-std");
      fillStdCast(box, list);
      return;
    }
    box.classList.add("mrpc-vx", `mrpc-${kind}`);
    const t = card ? vintageData(card) : null;
    const chips = document.createElement("span");
    chips.className = "chips";
    const panels = document.createElement("span");
    panels.className = "panels";
    list.forEach((person, n) => {
      const p = vintagePerson(person);
      const chip = document.createElement("button");
      chip.type = "button";
      const c = vintageChipHTML(kind, p, n, t);
      chip.className = `mrpc-cast-chip ${c.cls}`;
      chip.dataset.index = String(n);
      chip.setAttribute("aria-expanded", "false");
      chip.innerHTML = c.html;
      chips.append(chip);
      const panel = document.createElement("span");
      panel.className = "mrpc-cast-ticket vpanel";
      panel.dataset.index = String(n);
      panel.hidden = true;
      panel.innerHTML = vintagePanelHTML(kind, p, n, t);
      panels.append(panel);
    });
    box.append(chips, panels);
  }
  function syncVintage(card, ornament) {
    const wanted = isVintage(ornament);
    card.classList.toggle("mrpc-vhide", wanted);
    let vx = card.__mrpcVx;
    if (!wanted) {
      vx?.remove();
      card.__mrpcVx = null;
      return;
    }
    const t = vintageData(card);
    if (!t) return;
    if (!vx) {
      vx = document.createElement("div");
      vx.setAttribute("translate", "no");
      vx.setAttribute("role", "group");
      card.__mrpcVx = vx;
    }
    vx.setAttribute("aria-label", card.getAttribute("aria-label") || "작중 정보");
    vx.title = "누르면 모양·색감을 바꿀 수 있어요";
    vx.className = `mrpc-vx mrpc-vv mrpc-${ornament} mrpc-palette-${currentPalette()}`;
    if (vx.dataset.kind !== ornament) {
      vx.dataset.kind = ornament;
      vx.innerHTML = vintageCardHTML(ornament, t);
    }
    if (card.parentNode && vx.previousSibling !== card) card.after(vx);
  }
  const CONTENT_SELECTOR = ".mari-message-content, .translation-text";
  const SKIP_SELECTOR =
    "script, style, textarea, input, select, option, button, code, pre, [contenteditable='true'], .mrpc-card, .mrpc-split, .mrpc-cast, .mrpc-vx";
  const records = new Map();
  const nodeRecords = new WeakMap();
  function hasMarker(text) {
    return /§\s*RP\s*[|｜]/i.test(text);
  }
  const LINE_BREAK = { lineBreak: true };
  const BLOCK_TAGS = /^(P|DIV|LI|UL|OL|H[1-6]|BLOCKQUOTE|TR|TABLE|SECTION|ARTICLE|HR|DD|DT)$/;
  function contentTextNodes(content) {
    const nodes = [];
    const walk = (parent) => {
      for (let node = parent.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 3) nodes.push(node);
        else if (node.nodeType === 1) {
          if (node.matches(SKIP_SELECTOR)) continue;
          if (node.tagName === "BR" || BLOCK_TAGS.test(node.tagName)) nodes.push(LINE_BREAK);
          walk(node);
        }
      }
    };
    walk(content);
    return nodes;
  }
  function recordIsIntact(record) {
    if (record.dirty) return false;
    for (const part of record.parts) {
      if (!part.card.isConnected) return false;
      for (const entry of part.nodes) {
        if (!entry.node.isConnected || entry.node.nodeValue !== entry.stripped) return false;
      }
    }
    return true;
  }
  function undoRecord(record) {
    for (const part of [...record.parts].reverse()) {
      for (const entry of part.nodes) {
        if (record.written.has(entry.node)) continue;
        if (entry.node.isConnected && entry.node.nodeValue === entry.stripped) entry.node.nodeValue = entry.original;
      }
      part.prefix?.remove();
      part.split?.remove();
      part.cast?.remove();
      if (part.card.__mrpcCast === part.cast) part.card.__mrpcCast = null;
      part.card.__mrpcVx?.remove();
      release(part.card);
      part.card.remove();
    }
  }
  function decorateOne(content, record, reusable) {
    const nodes = contentTextNodes(content);
    let combined = "";
    const offsets = [];
    for (const node of nodes) {
      if (node === LINE_BREAK) { combined += "\n"; continue; }
      const value = node.nodeValue || "";
      offsets.push({ node, value, start: combined.length, end: combined.length + value.length });
      combined += value;
    }
    const meta = parseStatus(combined);
    if (!meta) return null;
    let start = meta.index;
    let end = meta.index + meta.length;
    if (/^[ \t\r\n]*$/.test(combined.slice(0, start))) start = 0;
    const cast = [];
    for (let n = 0; n < MAX_CAST; n += 1) {
      const line = CAST_LINE.exec(combined.slice(end));
      if (!line) break;
      const name = clean(line[1]).replace(/^[*_~]+|[*_~]+$/g, "");
      if (!name) break;
      cast.push({ name, fields: splitCastFields(line[2]) });
      end += line[0].length;
    }
    const trailing = combined.slice(end).match(/^(?:(?:[ \t]*\r?\n)+|[ \t]*)/);
    if (trailing?.[0]) end += trailing[0].length;
    const touched = offsets.filter((entry) => entry.end > start && entry.start < end);
    if (!touched.length) return null;
    const first = touched[0];
    const parent = first.node.parentNode;
    if (!parent) return null;
    const key = meta.raw;
    const reuse = reusable.get(key);
    if (reuse) reusable.delete(key);
    const card = reuse || createCard(meta, combined.slice(start, end));
    card.__mrpcCast = cast.length ? createCast(cast) : null;
    applyCardClasses(card);
    const part = { card, cast: card.__mrpcCast, prefix: null, split: null, key, nodes: [] };
    for (const entry of touched) {
      const from = Math.max(0, start - entry.start);
      const to = Math.min(entry.value.length, end - entry.start);
      if (entry === first && from > 0) part.prefix = document.createTextNode(entry.value.slice(0, from));
      const stripped = entry.value.slice(to);
      part.nodes.push({ node: entry.node, original: entry.value, stripped });
      nodeRecords.set(entry.node, record);
      entry.node.nodeValue = stripped;
    }
    if (part.prefix) parent.insertBefore(part.prefix, first.node);
    parent.insertBefore(card, first.node);
    if (card.__mrpcVx) parent.insertBefore(card.__mrpcVx, first.node);
    if (part.cast) parent.insertBefore(part.cast, first.node);
    part.split = document.createElement("span");
    part.split.className = "mrpc-split";
    part.split.setAttribute("aria-hidden", "true");
    part.split.textContent = "\n\n";
    parent.insertBefore(part.split, first.node);
    return part;
  }
  const MAX_CARDS_PER_MESSAGE = 20;
  function decorate(content) {
    const previous = records.get(content);
    const reusable = new Map();
    if (previous) {
      if (content.isConnected && recordIsIntact(previous)) return false;
      records.delete(content);
      undoRecord(previous);
      for (const part of previous.parts) if (!reusable.has(part.key)) reusable.set(part.key, part.card);
    }
    if (!content.isConnected) return Boolean(previous);
    if (!hasMarker(content.textContent || "")) return Boolean(previous);
    const record = { parts: [], dirty: false, written: new Set() };
    for (let i = 0; i < MAX_CARDS_PER_MESSAGE; i += 1) {
      const part = decorateOne(content, record, reusable);
      if (!part) break;
      record.parts.push(part);
    }
    if (record.parts.length) records.set(content, record);
    for (const part of record.parts) markHangul(part.card);
    return true;
  }
  function collectContents(node, into, includeInside) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    if (!element) return;
    const own = element.closest(CONTENT_SELECTOR);
    if (own) into.add(own);
    if (includeInside && !own && node.nodeType === 1 && node.querySelectorAll) {
      for (const content of node.querySelectorAll(CONTENT_SELECTOR)) into.add(content);
    }
  }
  const NO_FIT = ["t-forecast", "w-score", "k-daily", "k-station", "x-opera"];
  function fitCards(cards) {
    for (const card of cards) {
      if (!fitted.has(card)) {
        fitted.add(card);
        sizeWatch?.observe(card);
        liveWatch?.observe(card);
        ensureWx(card, wantsWx(card.dataset.ornament || ""));
        markHangul(card);
      }
      for (const value of card.querySelectorAll(".mrpc-item-value, .mrpc-date-value")) {
        value.style.fontSize = "";
        value.closest(".mrpc-item, .mrpc-date").style.maxWidth = "";
      }
    }
    markWrapped(cards);
    balanceLines(cards);
  }
  function balanceLines(cards) {
    const values = [];
    for (const card of cards) {
      const value = card.querySelector(".mrpc-location .mrpc-item-value");
      if (!value) continue;
      if (value.hasAttribute("data-mrpc-br")) {
        for (const node of textNodes(value)) if (node.data.includes("\n")) node.data = node.data.replace(/\n/g, " ");
        value.removeAttribute("data-mrpc-br");
        value.style.removeProperty("white-space");
      }
      if (value.textContent.includes(" ")) values.push(value);
    }
    const jobs = values.map((value) => ({ value, lines: lineCount(value) })).filter((job) => job.lines >= 2 && job.lines <= 6);
    for (const job of jobs) {
      const range = document.createRange();
      range.selectNodeContents(job.value);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      const low = Math.min(...rects.map((r) => r.height));
      const rows = [];
      for (const r of rects.filter((x) => x.height <= low * 1.25)) {
        const row = rows.find((x) => Math.abs(x.top - r.top) < low * 0.5);
        if (row) { row.left = Math.min(row.left, r.left); row.right = Math.max(row.right, r.right); } else rows.push({ top: r.top, left: r.left, right: r.right });
      }
      job.cap = Math.max(...rows.map((x) => x.right - x.left)) * 1.08 + 2;
    }
    jobs.forEach((job) => job.value.style.setProperty("white-space", "nowrap", "important"));
    for (const job of jobs) {
      const node = textNodes(job.value).pop();
      if (!node) continue;
      const range = document.createRange();
      const width = (end) => { range.setStart(node, 0); range.setEnd(node, end); return range.getBoundingClientRect().width; };
      const spots = [];
      for (let i = 1; i < node.data.length - 1; i += 1) {
        if (node.data[i] === " " && !/[-–—]/.test(node.data[i + 1])) spots.push({ at: i, end: width(i), next: width(i + 1) });
      }
      const total = width(node.data.length);
      if (spots.length > 40) continue;
      job.pick = bestBreaks(spots, total, job.lines, job.cap);
      job.node = node;
    }
    jobs.forEach((job) => {
      job.value.style.removeProperty("white-space");
      if (!job.pick) return;
      let data = job.node.data;
      for (const at of job.pick) data = data.slice(0, at) + "\n" + data.slice(at + 1);
      job.node.data = data;
      job.value.setAttribute("data-mrpc-br", "");
      job.value.style.setProperty("white-space", "pre-line", "important");
    });
    const after = jobs.map((job) => (job.pick ? lineCount(job.value) : job.lines));
    jobs.forEach((job, i) => {
      if (!job.pick || after[i] === job.lines) return;
      for (const node of textNodes(job.value)) if (node.data.includes("\n")) node.data = node.data.replace(/\n/g, " ");
      job.value.removeAttribute("data-mrpc-br");
      job.value.style.removeProperty("white-space");
    });
    dropcapOneLine(cards);
  }
  function bestBreaks(spots, total, lines, cap) {
    if (spots.length < lines - 1) return null;
    let best = null;
    const walk = (from, start, left, picked, cost, firstWidth) => {
      if (best && cost >= best.cost) return;
      if (left === 0) {
        const last = total - start;
        if (last > cap) return;
        const sum = cost + last * last + Math.max(0, last - (firstWidth ?? last)) * cap * 0.5;
        if (!best || sum < best.cost) best = { cost: sum, picked: [...picked] };
        return;
      }
      for (let k = from; k <= spots.length - left; k += 1) {
        const w = spots[k].end - start;
        if (w > cap) break;
        picked.push(spots[k].at);
        walk(k + 1, spots[k].next, left - 1, picked, cost + w * w, firstWidth ?? w);
        picked.pop();
      }
    };
    walk(0, 0, lines - 1, [], 0, null);
    return best ? best.picked.sort((a, b) => b - a) : null;
  }
  function lineCount(value) {
    const range = document.createRange();
    range.selectNodeContents(value);
    let rects = [...range.getClientRects()].filter((r) => r.width > 0);
    const low = Math.min(...rects.map((r) => r.height));
    rects = rects.filter((r) => r.height <= low * 1.6).sort((a, b) => a.top - b.top);
    let count = rects.length ? 1 : 0;
    let top = (rects.find((r) => r.height <= low * 1.25) || rects[0])?.top ?? 0;
    for (const r of rects) {
      if (r.height > low * 1.25) continue;
      if (r.top - top > low * 0.5) { count += 1; top = r.top; }
    }
    return count;
  }
  function dropcapOneLine(cards) {
    const targets = [...cards].filter((card) => card.dataset.ornament === "n-dropcap" && card.dataset.initial === "letter");
    targets.forEach((card) => card.removeAttribute("data-mrpc-oneline"));
    const one = targets.filter((card) => {
      const value = card.querySelector(".mrpc-location .mrpc-item-value");
      return value && lineCount(value) < 2;
    });
    one.forEach((card) => card.setAttribute("data-mrpc-oneline", ""));
  }
  function textNodes(root) {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) out.push(walker.currentNode);
    return out;
  }
  function lineStarters(card) {
    const details = card.querySelector(".mrpc-details");
    const flat = details && getComputedStyle(details).display === "contents";
    const box = (flat ? card : details).getBoundingClientRect();
    const kids = [...(flat ? [card.querySelector(".mrpc-date")] : []), ...card.querySelectorAll(".mrpc-item")]
      .filter(Boolean)
      .map((el, i) => ({ el, i, order: Number(getComputedStyle(el).order) || 0, basis: getComputedStyle(el).flexBasis, rect: el.getBoundingClientRect() }))
      .filter((kid) => kid.rect.width > 0)
      .sort((a, b) => a.order - b.order || a.i - b.i);
    const out = [];
    kids.forEach((kid, n) => {
      const prev = kids[n - 1];
      if (!prev || kid.el.classList.contains("mrpc-location") || prev.el.classList.contains("mrpc-location")) return;
      if (prev.basis === "100%" || prev.rect.width >= box.width - 2) return;
      if (kid.rect.top >= prev.rect.bottom - 2) out.push(kid.el);
    });
    return out;
  }
  function markWrapped(cards) {
    const targets = [...cards].filter((card) => !rootsOf(card.dataset.ornament || "").some((o) => NO_FIT.includes(o)));
    for (const card of cards) for (const el of card.querySelectorAll("[data-mrpc-wrap]")) el.removeAttribute("data-mrpc-wrap");
    targets.flatMap(lineStarters).forEach((el) => el.setAttribute("data-mrpc-wrap", "own"));
  }
  function fitAll(root = document) {
    fitCards(root.querySelectorAll(".mrpc-card"));
  }
  const cardWidths = new WeakMap();
  let resizedCards = new Set();
  let resizeFrame = 0;
  const liveWatch = typeof IntersectionObserver === "function"
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.target.isConnected) { release(entry.target); continue; }
          entry.target.toggleAttribute("data-mrpc-live", entry.isIntersecting);
        }
      }, { rootMargin: "120px 0px" })
    : null;
  const sizeWatch = typeof ResizeObserver === "function"
    ? new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!entry.target.isConnected) { release(entry.target); continue; }
          const width = Math.round(entry.contentRect.width);
          const seen = cardWidths.has(entry.target);
          if (seen && cardWidths.get(entry.target) === width) continue;
          cardWidths.set(entry.target, width);
          if (seen) resizedCards.add(entry.target);
        }
        if (!resizedCards.size) return;
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          const cards = [...resizedCards].filter((card) => card.isConnected);
          resizedCards = new Set();
          fitCards(cards);
        });
      })
    : null;
  let restyleTimer = 0;
  function restyleAll() {
    clearTimeout(restyleTimer);
    if (!mrpcIsMe()) return;
    const height = window.innerHeight;
    const near = [];
    const far = [];
    for (const card of document.querySelectorAll(".mrpc-card")) {
      const rect = card.getBoundingClientRect();
      (rect.bottom > -height && rect.top < height * 2 ? near : far).push(card);
    }
    near.forEach(applyCardClasses);
    fitCards(near);
    const step = () => {
      const part = far.splice(0, 12);
      part.forEach(applyCardClasses);
      fitCards(part);
      if (far.length) restyleTimer = setTimeout(step, 16);
    };
    if (far.length) restyleTimer = setTimeout(step, 16);
  }
  const fitted = new WeakSet();
  function hideGap(card, root) {
    let node = card;
    for (let guard = 0; guard < 40; guard += 1) {
      const next = node.nextSibling;
      if (!next) {
        node = node.parentElement;
        if (!node || node === root || !root.contains(node)) return;
        continue;
      }
      if (next.nodeType === 3) {
        if (next.data.trim()) return;
      } else if (next.nodeType === 1) {
        const empty = next.tagName === "BR" || (/^(P|DIV)$/.test(next.tagName) && !next.textContent.trim() && !next.querySelector(":not(br)"));
        if (empty) next.setAttribute("data-mrpc-gap", "");
        else if (!next.classList.contains("mrpc-split") && !next.classList.contains("mrpc-cast") && !next.classList.contains("mrpc-vx")) return;
      }
      node = next;
    }
  }
  function decorateAll(contents) {
    const changed = [...contents].filter((content) => decorate(content));
    for (const content of changed) for (const card of content.querySelectorAll(".mrpc-card")) hideGap(card, content);
    const cards = new Set();
    for (const content of contents) {
      if (!content.isConnected) continue;
      const all = changed.includes(content);
      for (const card of content.querySelectorAll(".mrpc-card")) if (all || !fitted.has(card)) cards.add(card);
    }
    if (cards.size) fitCards([...cards]);
    for (const [content, record] of records) {
      if (content.isConnected) continue;
      records.delete(content);
      for (const part of record.parts) release(part.card);
    }
  }
  function release(card) {
    sizeWatch?.unobserve(card);
    liveWatch?.unobserve(card);
  }
  function isOwnNode(node) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    return Boolean(element?.closest?.(".mrpc-card, .mrpc-picker, .mrpc-split, .mrpc-cast, .mrpc-vx"));
  }
  const observeTarget = document.body || document.documentElement;
  const handleMutations = (mutations) => {
    if (!mrpcIsMe()) { watcher.disconnect(); return; }
    const contents = new Set();
    const retitle = new Set();
    const rebreak = new Set();
    const fixDates = new Set(), relang = new Set();
    for (const mutation of mutations) {
      const element = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
      const hostCard = element?.closest?.(".mrpc-card");
      if (hostCard && INITIAL_ORNAMENTS.includes(hostCard.dataset.ornament) && element.closest(".mrpc-location")) retitle.add(hostCard);
      if (hostCard && element.closest(".mrpc-location, .mrpc-weather")) rebreak.add(hostCard);
      if (hostCard && element.closest(".mrpc-date-value") && hostCard.__mrpcDate) fixDates.add(hostCard);
      const hostContent = element?.closest?.(CONTENT_SELECTOR); if (hostContent) relang.add(hostContent);
      if (isOwnNode(mutation.target)) continue;
      if (mutation.type === "characterData") {
        const record = nodeRecords.get(mutation.target);
        if (record) {
          record.dirty = true;
          record.written.add(mutation.target);
        }
      }
      collectContents(mutation.target, contents, false);
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) for (const c of node.matches?.(".mrpc-card") ? [node] : node.querySelectorAll?.(".mrpc-card") || []) rebreak.add(c);
          if (node.nodeType === 1 && !isOwnNode(node)) collectContents(node, contents, true);
        }
      }
    }
    for (const hostCard of retitle) {
      const value = hostCard.querySelector(".mrpc-location .mrpc-item-value");
      const text = value?.textContent;
      if (text && text !== hostCard.__mrpcInitText) setInitial(hostCard, true, text);
    }
    if (rebreak.size) {
      const live = [...rebreak].filter((card) => card.isConnected);
      live.forEach(markHangul);
      balanceLines(live);
    }
    for (const hostCard of fixDates) {
      const value = hostCard.querySelector(".mrpc-date-value");
      if (value && value.textContent !== hostCard.__mrpcDate) {
        const dateText = hostCard.__mrpcDate;
        const weekdayMatch = /^(.*\s)(\([월화수목금토일]\))$/.exec(dateText);
        value.replaceChildren();
        if (weekdayMatch) {
          value.append(document.createTextNode(weekdayMatch[1]));
          const weekdayNode = document.createElement("span");
          weekdayNode.className = "mrpc-weekday";
          weekdayNode.textContent = weekdayMatch[2];
          value.append(weekdayNode);
        } else value.textContent = dateText;
      }
    }
    for (const host of relang) for (const card of host.querySelectorAll(".mrpc-card")) markHangul(card);
    if ((retitle.size || rebreak.size || fixDates.size || relang.size) && !contents.size) watcher.takeRecords();
    if (!contents.size) return;
    decorateAll(contents);
    watcher.takeRecords();
  };
  const watcher = new MutationObserver(handleMutations);
  watcher.observe(observeTarget, { subtree: true, childList: true, characterData: true });
  let picker = null;
  function closePicker() {
    picker?.remove();
    picker = null;
  }
  function pickerRow(title, key, options, current, swatch) {
    const buttons = options
      .map(([value, label, group], i) => {
        const mark = swatch ? `<span class="mrpc-swatch mrpc-palette-${value}"></span>` : "";
        const head = group ? `</div><div class="mrpc-picker-group">${group}</div><div class="mrpc-picker-row">` : "";
        return `${head}<button type="button" data-key="${key}" data-value="${value}" aria-pressed="${value === current}">${mark}${label}</button>`;
      })
      .join("");
    return `<div class="mrpc-picker-title">${title}</div><div class="mrpc-picker-row">${buttons}</div>`.replace('<div class="mrpc-picker-row"></div>', "");
  }
  function openPicker(anchor) {
    closePicker();
    picker = document.createElement("div");
    picker.className = "mrpc-picker";
    picker.setAttribute("role", "dialog");
    picker.setAttribute("aria-label", "시공간 카드 상태창 모양·색감");
    const esc = (s) => s.replace(/[&"<>]/g, (c) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[c]);
    picker.innerHTML =
      pickerRow("모양", STORAGE_KEY_ORNAMENT, ORNAMENT_OPTIONS, currentOrnament(), false) +
      pickerRow("색감", STORAGE_KEY_PALETTE, PALETTE_OPTIONS, currentPalette(), true);
    document.body.append(picker);
    const rect = anchor.getBoundingClientRect();
    const width = picker.offsetWidth;
    const height = picker.offsetHeight;
    let top = rect.bottom + 8;
    if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - 8);
    const left = Math.min(Math.max(8, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 8);
    picker.style.top = `${Math.round(top)}px`;
    picker.style.left = `${Math.round(Math.max(8, left))}px`;
  }
  let pickDown = null;
  const onPointerDown = (event) => { const b = event.target?.closest?.(".mrpc-picker button"); pickDown = b ? { b, x: event.clientX, y: event.clientY } : null; };
  const onDocumentClick = (event) => {
    const target = event.target;
    const castChip = target?.closest?.(".mrpc-cast-chip");
    if (castChip) {
      event.stopPropagation();
      event.preventDefault();
      toggleCast(castChip);
      return;
    }
    if (target?.closest?.(".mrpc-cast")) { event.stopPropagation(); return; }
    const button = target?.closest?.(".mrpc-picker button");
    if (button && pickDown && (pickDown.b !== button || Math.hypot(event.clientX - pickDown.x, event.clientY - pickDown.y) > 10)) { pickDown = null; return; }
    if (button) {
      saveChoice(button.dataset.key, button.dataset.value);
      if (button.dataset.key === STORAGE_KEY_ORNAMENT) closePicker();
      else {
        for (const other of picker.querySelectorAll(`button[data-key="${button.dataset.key}"]`)) {
          other.setAttribute("aria-pressed", String(other === button));
        }
      }
      restyleAll();
      return;
    }
    if (target?.closest?.(".mrpc-picker")) return;
    const date = target?.closest?.(".mrpc-card .mrpc-date-copy, .mrpc-vv");
    if (date) {
      event.stopPropagation();
      event.preventDefault();
      if (picker) closePicker();
      else openPicker(date.closest(".mrpc-card, .mrpc-vv"));
      return;
    }
    closePicker();
  };
  const onViewportChange = (event) => {
    if (picker && picker.contains(document.activeElement)) return;
    if (picker && !picker.contains(event.target)) closePicker();
  };
  let fitTimer = 0;
  const refitSoon = () => {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(() => fitAll(), 150);
  };
  window.addEventListener("resize", refitSoon);
  document.fonts?.addEventListener?.("loadingdone", refitSoon);
  window.addEventListener("click", onDocumentClick, true);
  window.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("scroll", onViewportChange, { capture: true, passive: true });
  window.addEventListener("resize", onViewportChange);
  cleanupCallbacks.push(() => {
    window.removeEventListener("click", onDocumentClick, true);
    window.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("scroll", onViewportChange, { capture: true });
    window.removeEventListener("resize", onViewportChange);
    window.removeEventListener("resize", refitSoon);
    sizeWatch?.disconnect();
    liveWatch?.disconnect();
    cancelAnimationFrame(resizeFrame);
    document.fonts?.removeEventListener?.("loadingdone", refitSoon);
    clearTimeout(fitTimer);
    clearTimeout(restyleTimer);
    closePicker();
  });
  marinara.onCleanup(() => {
    watcher.disconnect();
    cleanupCallbacks.forEach((callback) => callback());
    for (const record of records.values()) undoRecord(record);
    document.querySelectorAll("[data-mrpc-gap]").forEach((el) => el.removeAttribute("data-mrpc-gap"));
    records.clear();
  });
  decorateAll(document.querySelectorAll(CONTENT_SELECTOR));
  watcher.takeRecords();
})();

/* ==========================================================================
   SpellQuest — Game Engine
   Static single-page web game. No backend needed. Works on GitHub Pages.
   Accessible: keyboard-only, screen-reader compatible, semantic HTML.
   ========================================================================== */

/* ---------- Storage ---------------------------------------------------- */
const Storage = {
  KEY: "spellquest_progress",

  defaultProgress() {
    return {
      gems: 0,
      completed: [],
      achievements: [],
      total_correct: 0,
      total_wrong: 0,
      best_streak: 0,
      mistakes: [],
      focus_tokens: 0,
      bonus_games: [],
      visited_realms: [],
      realm_guides_met: [],
      workshop_visits: 0,
      studied_words: [],
    };
  },

  normalizeProgress(data) {
    const base = this.defaultProgress();
    if (!data || typeof data !== "object") return base;

    const normalizeInt = (value, fallback = 0) => {
      const num = Number(value);
      return Number.isFinite(num) && num >= 0 ? Math.floor(num) : fallback;
    };
    const uniqueStrings = (value) =>
      Array.isArray(value)
        ? [...new Set(value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()))]
        : [];
    const uniqueLevels = (value) =>
      Array.isArray(value)
        ? [...new Set(value.map((item) => normalizeInt(item, -1)).filter((item) => item >= 1 && item <= 15))].sort((a, b) => a - b)
        : [];
    const normalizeMistakes = (value) =>
      Array.isArray(value)
        ? value
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              level: normalizeInt(item.level, 1),
              prompt: String(item.prompt || "").slice(0, 100),
              correct: String(item.correct || "").slice(0, 100),
            }))
            .slice(-50)
        : [];

    return {
      gems: normalizeInt(data.gems, base.gems),
      completed: uniqueLevels(data.completed),
      achievements: uniqueStrings(data.achievements),
      total_correct: normalizeInt(data.total_correct, base.total_correct),
      total_wrong: normalizeInt(data.total_wrong, base.total_wrong),
      best_streak: normalizeInt(data.best_streak, base.best_streak),
      mistakes: normalizeMistakes(data.mistakes),
      focus_tokens: normalizeInt(data.focus_tokens, base.focus_tokens),
      bonus_games: uniqueStrings(data.bonus_games),
      visited_realms: uniqueStrings(data.visited_realms),
      realm_guides_met: uniqueStrings(data.realm_guides_met),
      workshop_visits: normalizeInt(data.workshop_visits, base.workshop_visits),
      studied_words: uniqueStrings(data.studied_words).map((word) => word.toLowerCase()),
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaultProgress();
      return this.normalizeProgress(JSON.parse(raw));
    } catch (_) {
      return this.defaultProgress();
    }
  },

  save(progress) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(progress));
    } catch (_) {}
  },

  reset() {
    localStorage.removeItem(this.KEY);
  },
};

/* ---------- Game State -------------------------------------------------- */
const GameState = {
  progress: null,
  session: null,   // per-level session state
  screen: "init",  // current screen key

  init() {
    this.progress = Storage.load();
  },

  get gems()          { return this.progress.gems; },
  get completed()     { return this.progress.completed; },
  get achievements()  { return this.progress.achievements; },
  get focusTokens()   { return this.progress.focus_tokens; },
  get mistakes()      { return this.progress.mistakes; },

  rank() {
    let name = RANKS[0][1];
    for (const [t, n] of RANKS) {
      if (this.gems >= t) name = n;
    }
    return name;
  },

  addGems(n) {
    this.progress.gems += n;
    if (this.progress.gems >= 100) this.grant("hundred_gems");
    if (this.progress.gems >= 500) this.grant("five_hundred_gems");
    if (this.progress.gems >= 1000) this.grant("thousand_gems");
  },

  grant(achId) {
    if (!this.progress.achievements.includes(achId)) {
      this.progress.achievements.push(achId);
      return true;
    }
    return false;
  },

  addMistake(lv, r) {
    this.progress.mistakes.push({
      level: lv,
      prompt: (r.prompt || r.wrong || "").slice(0, 100),
      correct: (r.answer || r.right || "").slice(0, 100),
    });
    if (this.progress.mistakes.length > 50) {
      this.progress.mistakes = this.progress.mistakes.slice(-50);
    }
  },

  save() { Storage.save(this.progress); },

  // Build scene structure for a level
  buildScenes(lv) {
    const data = LEVEL_DATA[lv];
    const sceneDefs = REALM_SCENES[data.realm] || REALM_SCENES["Village of Letters"];
    const rounds = data.rounds;
    const sceneCount = Math.min(sceneDefs.length, Math.max(1, rounds.length));
    const baseSize = Math.floor(rounds.length / sceneCount);
    const extra = rounds.length % sceneCount;

    const scenes = [];
    let idx = 0;
    for (let i = 0; i < sceneCount; i++) {
      const size = baseSize + (i < extra ? 1 : 0);
      const [title, intro] = sceneDefs[i];
      const chunk = rounds.slice(idx, idx + size);
      scenes.push({
        name: title, intro, rounds: chunk,
        number: i + 1, total: sceneCount,
      });
      idx += size;
    }
    return scenes;
  },
};

/* ---------- Screen Reader Announcer ------------------------------------ */
function announce(msg) {
  const el = document.getElementById("sr-announcer");
  if (!el) return;
  // Clear then set to trigger re-announcement
  el.textContent = "";
  requestAnimationFrame(() => { el.textContent = msg; });
}

/* ---------- DOM Helpers ------------------------------------------------ */
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") e.className = v;
    else if (k === "innerHTML") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === "string") e.appendChild(document.createTextNode(child));
    else if (child) e.appendChild(child);
  }
  return e;
}

function clearRoot() {
  const root = document.getElementById("game-root");
  root.innerHTML = "";
  return root;
}

function getActiveScreenContainer() {
  return document.querySelector("#game-root .screen:last-of-type") || document.getElementById("game-root");
}

function getChallengeMount() {
  return document.getElementById("challenge-host") || getActiveScreenContainer();
}

/* ---------- Menu Builder ------------------------------------------------ */
// Renders a keyboard-navigable menu list. Returns a Promise that resolves
// when the user selects an item (ENTER) or cancels (ESC).
// Items: array of [label, value] pairs.
// backLabel: description for ESC action.
function buildMenu(title, items, backLabel, subtitle) {
  return new Promise((resolve) => {
    const root = clearRoot();
    const screen = el("div", { className: "screen", role: "region", "aria-label": title });

    // Heading
    const hd = el("div", { className: "game-heading" });
    hd.appendChild(el("h1", {}, title));
    if (subtitle) hd.appendChild(el("div", { className: "subtitle" }, subtitle));
    screen.appendChild(hd);

    // Status bar
    screen.appendChild(statusBar());

    // Menu list
    const list = el("ul", { className: "menu-list", "aria-label": title });
    let selected = 0;
    const itemEls = [];

    items.forEach(([label, value], i) => {
      const li = el("li");
      const btn = el("button", {
        className: "menu-item",
        "data-value": String(value),
        "data-index": i,
      }, label);
      if (i === 0) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        cleanup();
        resolve(value);
      });
      li.appendChild(btn);
      list.appendChild(li);
      itemEls.push(btn);
    });
    screen.appendChild(list);

    // Keyboard hints
    const hintText = backLabel
      ? `Use UP and DOWN arrows to choose. ENTER to select. ESC for ${backLabel}.`
      : "Use UP and DOWN arrows to choose. ENTER to select.";
    screen.appendChild(el("div", { className: "keyboard-hint" }, hintText));
    root.appendChild(screen);

    // Focus first item
    itemEls[0].focus();

    // Keyboard handler
    function onKeyDown(e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        itemEls[selected].classList.remove("selected");
        if (e.key === "ArrowDown") selected = (selected + 1) % items.length;
        else selected = (selected - 1 + items.length) % items.length;
        itemEls[selected].classList.add("selected");
        itemEls[selected].focus();
        announce(items[selected][0]);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        cleanup();
        resolve(items[selected][1]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
        resolve(null);
        return;
      }
    }

    function cleanup() {
      document.removeEventListener("keydown", onKeyDown);
    }
    document.addEventListener("keydown", onKeyDown);
  });
}

/* ---------- Status Bar ------------------------------------------------- */
function statusBar() {
  const gs = GameState;
  const bar = el("div", { className: "status-bar", "aria-label": "Player status" });
  bar.appendChild(el("span", { className: "rank" }, gs.rank()));
  bar.appendChild(el("span", { className: "gems" }, `${gs.gems} gems`));
  bar.appendChild(el("span", {}, `${gs.focusTokens} crystals`));
  bar.appendChild(el("span", {}, `${gs.completed.length}/15 levels`));
  return bar;
}

/* ---------- Screen: Wait prompt ---------------------------------------- */
function waitPrompt(label = "Activate the Continue button to continue.") {
  return new Promise((resolve) => {
    const hint = document.createElement("div");
    hint.className = "keyboard-hint";
    hint.textContent = label;
    const container = getActiveScreenContainer();
    container.appendChild(hint);
    const btn = el("button", {
      className: "btn btn-primary",
      style: "display:block;margin:1rem auto;",
      onClick() { resolve(); }
    }, "Continue");
    container.appendChild(btn);
    btn.focus();
  });
}

/* ---------- Screen: Intro ---------------------------------------------- */
function screenIntro() {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });

  const hd = el("div", { className: "game-heading" });
  hd.appendChild(el("h1", {}, "Welcome to SpellQuest!"));
  hd.appendChild(el("div", { className: "subtitle" }, "An English Spelling and Writing Adventure Game"));
  screen.appendChild(hd);

  const prose = el("div", { className: "prose" });
  prose.innerHTML = `
    <p>Ahead of you stretches a world built not of stone and soil,
    but of <em>words</em> — living words that glow, whisper, and wait
    for someone brave enough to shape them.</p>
    <p>You are a Traveler. Your tools: a sharp ear, a steady hand,
    and the courage to try even when the spelling seems impossible.</p>
    <p>Your journey will take you through five mystical realms:</p>
    <p><strong>1. The Village of Letters</strong> (Levels 1–3)<br>
    Where words are short and friendly, and every signpost
    helps you learn the building blocks of spelling.</p>
    <p><strong>2. The Forest of Sounds</strong> (Levels 4–6)<br>
    Silent letters hide in the undergrowth. Words that sound
    identical mean entirely different things. Listen well.</p>
    <p><strong>3. The Mountain of Mastery</strong> (Levels 7–9)<br>
    Hard words, grammar traps, and the sentences that even
    grown-ups get wrong. This is where you prove your skill.</p>
    <p><strong>4. The Tower of Eloquence</strong> (Levels 10–12)<br>
    Precision. Vocabulary. The art of saying exactly what you
    mean. The tower rewards only the careful and the accurate.</p>
    <p><strong>5. The Kingdom of Fluent Writing</strong> (Levels 13–15)<br>
    The final realm. All the rules become tools. Here you write
    paragraphs, grow stories from seeds, and speak in your own
    voice. This is where a speller becomes a WRITER.</p>
    <p>Along the way you will earn gems, unlock achievements, unseal
    bonus trials, bind Focus Crystals for second chances, and rise
    through nine ranks — from Letter Learner to English Emperor.</p>
    <p><strong>HOW TO PLAY:</strong><br>
    In game menus, use UP and DOWN arrows to move and ENTER to choose.<br>
    When a button such as Begin or Continue has focus, press ENTER or SPACE to activate that button.<br>
    In spelling fields, type your answer and press ENTER to submit it.<br>
    Press ESC when the current screen offers a way back.</p>
    <p>Every mistake teaches you something new. Every correct answer
    lights one more step on the path forward.</p>
    <p><em>The world of SpellQuest is ready. Are you?</em></p>
  `;
  screen.appendChild(prose);
  screen.appendChild(el("div", { className: "keyboard-hint" }, "Activate the Begin Your Quest button to start."));
  root.appendChild(screen);

  announce("Welcome to SpellQuest! An English Spelling and Writing Adventure Game.");

  return new Promise((resolve) => {
    const btn = el("button", { className: "btn btn-primary", style: "display:block;margin:1rem auto;" }, "Begin Your Quest");
    btn.addEventListener("click", resolve);
    screen.appendChild(btn);
    btn.focus();

  });
}

/* ---------- Screen: Main Menu ------------------------------------------ */
async function screenMainMenu() {
  const items = [
    ["Continue Your Quest", "continue"],
    ["The Traveler's Map  (Choose a Level)", "level"],
    ["Your Journey Map  (View Progress)", "map"],
    ["Visit the Crystal Enchanter", "workshop"],
    ["The Adventurer's Rest  (Bonus Trials)", "trials"],
    ["Review Your Mistakes", "mistakes"],
    ["View Your Stats", "stats"],
    ["Save & Load", "save_load"],
    ["About SpellQuest", "about"],
    ["Quit", "quit"],
  ];

  const choice = await buildMenu(
    `SpellQuest`,
    items,
    "quit",
    `Rank: ${GameState.rank()}  |  Gems: ${GameState.gems}`
  );

  switch (choice) {
    case "continue":
      await screenContinue();
      break;
    case "level":
      await screenLevelSelect();
      break;
    case "map":
      screenJourneyMap();
      await waitPrompt();
      break;
    case "workshop":
      await screenWorkshop();
      break;
    case "trials":
      await screenBonusTrials();
      break;
    case "mistakes":
      screenMistakes();
      await waitPrompt();
      break;
    case "stats":
      screenStats();
      await waitPrompt();
      break;
    case "save_load":
      await screenSaveLoad();
      break;
    case "about":
      screenAbout();
      await waitPrompt();
      break;
    case "quit":
    case null:
      screenGoodbye();
      return; // don't loop back to menu
  }

  // Loop back to menu unless we quit
  if (choice !== "quit" && choice !== null) {
    await screenMainMenu();
  }
}

/* ---------- Screen: Continue (find next uncompleted) ------------------- */
async function screenContinue() {
  for (let lv = 1; lv <= 15; lv++) {
    if (!GameState.completed.includes(lv)) {
      await playLevel(lv);
      return;
    }
  }
  // All done!
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "You Did It!")));
  const prose = el("div", { className: "prose" });
  prose.innerHTML = "<p>You have completed every single level of SpellQuest!</p><p>You are a true English Champion!</p><p>You can replay any level from The Traveler's Map menu.</p>";
  screen.appendChild(prose);
  root.appendChild(screen);
  await waitPrompt();
}

/* ---------- Screen: Level Select --------------------------------------- */
async function screenLevelSelect() {
  while (true) {
    const realmItems = REALM_ORDER.map(realm => {
      const realmLevels = Object.keys(LEVEL_DATA)
        .map(Number).sort((a,b) => a-b)
        .filter(l => LEVEL_DATA[l].realm === realm);
      const done = realmLevels.filter(l => GameState.completed.includes(l));
      let tag;
      if (done.length === realmLevels.length) tag = "[COMPLETE]";
      else if (GameState.progress.visited_realms.includes(realm)) tag = "[ACTIVE]";
      else {
        const firstIncomplete = realmLevels.find(l => !GameState.completed.includes(l));
        if (firstIncomplete && (firstIncomplete === 1 || GameState.completed.includes(firstIncomplete - 1)))
          tag = "[OPEN]";
        else tag = "[LOCKED]";
      }
      return [`${tag}  ${realm}  (${done.length}/${realmLevels.length})`, realm];
    });

    const realm = await buildMenu("The Traveler's Map — choose a realm", realmItems, "main menu");
    if (!realm) return;

    const realmLevels = Object.keys(LEVEL_DATA)
      .map(Number).sort((a,b) => a-b)
      .filter(l => LEVEL_DATA[l].realm === realm);

    const levelItems = realmLevels.map(lv => {
      const ld = LEVEL_DATA[lv];
      let tag;
      if (GameState.completed.includes(lv)) tag = "[DONE]";
      else if (lv > 1 && !GameState.completed.includes(lv - 1)) tag = "[LOCKED]";
      else tag = "[READY]";
      return [`${tag}  Level ${lv}: ${ld.name}`, lv];
    });

    const lv = await buildMenu(`${realm} — select a level`, levelItems, "realms");
    if (!lv) continue;

    if (lv > 1 && !GameState.completed.includes(lv - 1)) {
      const root = clearRoot();
      root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Level Locked!")));
      root.appendChild(el("div", { className: "prose" },
        el("p", {}, `You must complete Level ${lv - 1} before you can play Level ${lv}.`),
        el("p", {}, "Keep going — you can do it!")));
      await waitPrompt();
    } else {
      await playLevel(lv);
      return;
    }
  }
}

/* ---------- Screen: Journey Map --------------------------------------- */
function screenJourneyMap() {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Your Journey Map")));

  let realmCount = 0;
  for (const realm of REALM_ORDER) {
    const realmLevels = Object.keys(LEVEL_DATA)
      .map(Number).sort((a,b) => a-b)
      .filter(l => LEVEL_DATA[l].realm === realm);
    const done = realmLevels.filter(l => GameState.completed.includes(l));

    const rp = el("div", { className: "realm-progress" });
    if (GameState.progress.visited_realms.includes(realm)) {
      realmCount++;
      const bar = "#".repeat(done.length) + "-".repeat(realmLevels.length - done.length);
      const status = done.length === realmLevels.length ? "COMPLETE" : "IN PROGRESS";
      rp.innerHTML = `<span class="realm-name">[${status}] ${realm}</span><br>
        Progress: [${bar}]  ${done.length}/${realmLevels.length} levels`;
      for (const guideId of GameState.progress.realm_guides_met) {
        if (REALM_FAREWELL[realm] && REALM_FAREWELL[realm][0] === guideId) {
          rp.appendChild(el("div", { className: "realm-status" }, `Guide met: ${guideId}`));
        }
      }
    } else {
      rp.innerHTML = `<span class="realm-name">[UNDISCOVERED] ${realm}</span><br>
        <span class="realm-status">??? — Journey onward to reveal this realm</span>`;
    }
    screen.appendChild(rp);
  }

  const bonusCount = GameState.progress.bonus_games.length;
  const info = el("div", { className: "prose" });
  info.innerHTML = `
    <p>Bonus trials unsealed: ${bonusCount}/${Object.keys(BONUS_GAMES).length}</p>
    <p>Focus crystals held: ${GameState.focusTokens}</p>
    <p>Workshop visits: ${GameState.progress.workshop_visits}</p>
    <p>Total realms visited: ${realmCount}/${REALM_ORDER.length}</p>`;
  screen.appendChild(info);
  root.appendChild(screen);
}

/* ---------- Screen: Save & Load (Export/Import/Reset) ----------------- */
async function screenSaveLoad() {
  while (true) {
    const items = [
      ["Export Save (download JSON)", "export"],
      ["Import Save (upload JSON)", "import"],
      ["Reset All Progress", "reset"],
    ];

    const choice = await buildMenu(
      "Save & Load",
      items,
      "main menu",
      `Rank: ${GameState.rank()}  |  Gems: ${GameState.gems}`
    );

    if (!choice) return;

    if (choice === "export") {
      const root = clearRoot();
      const screen = el("div", { className: "screen" });
      screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Export Save")));

      const json = JSON.stringify(GameState.progress, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = el("a", {
        href: url,
        download: "spellquest_save.json",
        className: "btn btn-primary",
        style: "display:block;margin:1rem auto;text-decoration:none;",
      }, "Click here to download your save file");
      screen.appendChild(a);

      const prose = el("div", { className: "prose" });
      prose.innerHTML = `<p>Your save data will download as <code>spellquest_save.json</code>.</p>
        <p>Keep this file safe! You can use it to restore your progress later, or move it to another device.</p>`;
      screen.appendChild(prose);

      // Also show the raw JSON in a textarea for copy-paste
      const ta = el("textarea", {
        className: "challenge-input",
        rows: 8,
        readonly: true,
        style: "font-size:0.75rem;font-family:monospace;",
        onClick() { this.select(); },
      }, json);
      screen.appendChild(el("p", { style: "margin-top:1rem;color:var(--text-secondary);" }, "Or copy this text:"));
      screen.appendChild(ta);

      root.appendChild(screen);
      a.focus();
      announce("Export save. A download link is ready.");
      await waitPrompt("Press ENTER or ESC to go back.");
      URL.revokeObjectURL(url);
      continue;
    }

    if (choice === "import") {
      const root = clearRoot();
      const screen = el("div", { className: "screen" });
      screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Import Save")));

      const prose = el("div", { className: "prose" });
      prose.innerHTML = `<p>Choose a <code>spellquest_save.json</code> file to restore your progress.</p>
        <p><strong>Warning:</strong> This will overwrite your current progress!</p>`;
      screen.appendChild(prose);

      const fileInput = el("input", {
        type: "file",
        accept: ".json",
        style: "display:block;margin:1rem auto;",
        "aria-label": "Choose a save file to import",
      });

      const statusEl = el("div");
      screen.appendChild(fileInput);
      screen.appendChild(statusEl);
      root.appendChild(screen);

      fileInput.focus();

      await new Promise((resolve) => {
        fileInput.addEventListener("change", function onChange() {
          const file = fileInput.files[0];
          if (!file) { resolve(); return; }

          const reader = new FileReader();
          reader.onload = function() {
            try {
              const data = JSON.parse(reader.result);
              GameState.progress = Storage.normalizeProgress(data);
              GameState.save();
              statusEl.innerHTML = `<div class="game-message msg-success">Save imported successfully! Your progress has been restored.</div>`;
              announce("Save imported successfully! Your progress has been restored.");
              AudioFX.play("correct");
            } catch (err) {
              statusEl.innerHTML = `<div class="game-message msg-error">Could not read that file. Make sure it's a valid SpellQuest save.</div>`;
              announce("Import failed. The file was not a valid save.");
              AudioFX.play("wrong");
            }
            resolve();
          };
          reader.readAsText(file);
        });
        // If user cancels file dialog, resolve after a short delay
        fileInput.addEventListener("cancel", () => resolve());
        // Fallback: if they click away without choosing, ESC will go back via waitPrompt
      });

      await waitPrompt("Press ENTER or ESC to go back.");
      continue;
    }

    if (choice === "reset") {
      // Confirmation
      const confirmed = await buildMenu(
        "Reset ALL progress? This cannot be undone!",
        [
          ["Yes, reset everything", "yes"],
          ["No, keep my progress", "no"],
        ],
        "go back"
      );

      if (confirmed === "yes") {
        Storage.reset();
        GameState.progress = Storage.defaultProgress();
        const root = clearRoot();
        const screen = el("div", { className: "screen" });
        screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Progress Reset")));
        screen.appendChild(el("div", { className: "prose" },
          el("p", {}, "All progress has been erased. You start fresh, brave adventurer!")));
        root.appendChild(screen);
        announce("All progress has been reset.");
        await waitPrompt();
        return; // exit to main menu to refresh
      }
      continue;
    }
  }
}

/* ---------- Screen: Mistake Review ------------------------------------ */
function screenMistakes() {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Mistake Review")));

  const mistakes = GameState.mistakes;
  if (!mistakes.length) {
    screen.appendChild(el("div", { className: "prose" }, el("p", {}, "You have no mistakes on record! Amazing!")));
  } else {
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", {}, "Here are your recent mistakes. Studying them helps you learn!"));
    const recent = mistakes.slice(-10);
    recent.forEach((m, i) => {
      prose.appendChild(el("p", {}, `${i + 1}. Level ${m.level}: ${m.prompt}`));
      prose.appendChild(el("p", { style: "color:var(--green);margin-left:1rem;" }, `Correct answer: ${m.correct}`));
    });
    screen.appendChild(prose);
  }
  root.appendChild(screen);
}

/* ---------- Screen: Stats --------------------------------------------- */
function screenStats() {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Your Stats")));

  const gs = GameState;
  const correct = gs.progress.total_correct;
  const wrong = gs.progress.total_wrong;
  const total = correct + wrong;
  const acc = total > 0 ? Math.round(100 * correct / total) : 0;

  const dl = el("dl", { className: "stats-grid" });
  const rows = [
    ["Rank", gs.rank()],
    ["Total Gems", gs.gems],
    ["Focus Crystals", gs.focusTokens],
    ["Levels Completed", `${gs.completed.length} out of 15`],
    ["Correct Answers", correct],
    ["Wrong Answers", wrong],
    ["Accuracy", `${acc}%`],
    ["Best Streak", `${gs.progress.best_streak} in a row`],
  ];
  for (const [dt, dd] of rows) {
    dl.appendChild(el("dt", {}, dt));
    dl.appendChild(el("dd", {}, String(dd)));
  }
  screen.appendChild(dl);

  if (gs.completed.length) {
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", { style: "margin-top:1rem;" }, "Completed Levels:"));
    for (const lv of [...gs.completed].sort((a,b) => a-b)) {
      prose.appendChild(el("div", {}, `Level ${lv}: ${LEVEL_DATA[lv].name}`));
    }
    screen.appendChild(prose);
  }

  if (gs.achievements.length) {
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", { style: "margin-top:1rem;" }, `Achievements (${gs.achievements.length}):`));
    const ul = el("ul", { className: "achievement-list" });
    for (const a of gs.achievements) {
      ul.appendChild(el("li", {}, ACHIEVEMENTS[a] || a));
    }
    prose.appendChild(ul);
    screen.appendChild(prose);
  }

  root.appendChild(screen);
}

/* ---------- Screen: About --------------------------------------------- */
function screenAbout() {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "About SpellQuest")));

  const prose = el("div", { className: "prose" });
  prose.innerHTML = `
    <p>SpellQuest is an English spelling and writing adventure game
    designed especially for screen reader users.</p>
    <p><strong>What is SpellQuest?</strong><br>
    You are a traveler in a world where words ARE magic. Every level
    is a journey through a realm — a village, a forest, a mountain,
    a tower, and finally a kingdom. In each realm you face challenges
    that test your spelling, grammar, and storytelling.</p>
    <p><strong>How to play:</strong><br>
    - Use UP and DOWN arrow keys to move through menus<br>
    - Press ENTER to select an option<br>
    - Press ESC to go back<br>
    - Type your answers for spelling and writing challenges</p>
    <p><strong>The world of SpellQuest:</strong><br>
    - 15 levels across 5 magical realms, each with three distinct scenes<br>
    - Seven challenge types: spell, choose, fix, order, write, story, and essay<br>
    - Story moments where YOU choose which path to take<br>
    - Bonus trials you can unseal at the Crystal Enchanter's alcove<br>
    - Focus Crystals for a second chance on hard encounters<br>
    - Gems, achievements, and nine ranks from Letter Learner to English Emperor</p>
    <p>Made for children and adults who want to learn English spelling
    in a world where every correct answer lights the way forward!</p>
  `;
  screen.appendChild(prose);
  root.appendChild(screen);
}

/* ---------- Screen: Goodbye -------------------------------------------- */
function screenGoodbye() {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Safe travels, adventurer!")));
  const prose = el("div", { className: "prose" });
  prose.innerHTML = `<p>Your progress has been saved.</p>
    <p>Rank: ${GameState.rank()} — ${GameState.gems} gems</p>
    <p>Come back soon to continue your adventure!</p>`;
  screen.appendChild(prose);
  root.appendChild(screen);
  GameState.save();
  announce("Safe travels, adventurer! Your progress has been saved.");
}

/* ========================================================================
   LEVEL PLAYBACK
   ======================================================================== */

function getMasteryRequirement(lv, totalRounds) {
  let percent = 70;
  if (lv >= 4) percent = 75;
  if (lv >= 7) percent = 80;
  const requiredCorrect = totalRounds <= 3
    ? Math.max(1, totalRounds - 1)
    : Math.ceil(totalRounds * percent / 100);
  const effectivePercent = Math.round(requiredCorrect * 100 / totalRounds);
  return { percent: effectivePercent, requiredCorrect };
}

function getLevelMasteryResult(lv, data) {
  const requirement = getMasteryRequirement(lv, data.rounds.length);
  const scorePassed = GameState.session.levelCorrect >= requirement.requiredCorrect;
  return { ...requirement, passed: scorePassed };
}

function hasStudiedWord(round) {
  return GameState.progress.studied_words.includes(String(round.answer || "").toLowerCase());
}

function screenWordStudy(round) {
  const word = String(round.answer || round.prompt || "");
  const letters = Array.from(word.toUpperCase()).join(" – ");
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Study This Word")));
  screen.appendChild(el("div", { className: "prose" },
    el("p", {}, "Look at and listen to the spelling. After Continue, the written word will be hidden and you will spell it yourself."),
    el("div", { className: "game-message msg-info" }, el("strong", {}, word)),
    el("p", {}, `Letters: ${letters}`),
    el("p", {}, `Meaning: ${round.hint}`),
    el("p", {}, `Pattern tip: ${round.explain}`)));
  root.appendChild(screen);
  if (!GameState.progress.studied_words.includes(word.toLowerCase())) {
    GameState.progress.studied_words.push(word.toLowerCase());
    GameState.save();
  }
  announce(`Study this word: ${word}. Letters: ${Array.from(word.toUpperCase()).join(", ")}. After Continue, spell it yourself.`);
  return waitPrompt("Activate Continue when you are ready to spell the word yourself.");
}

async function playLevel(lv) {
  const data = LEVEL_DATA[lv];
  const realm = data.realm;
  const scenes = GameState.buildScenes(lv);

  // Per-level session
  GameState.session = {
    levelGems: 0,
    levelCorrect: 0,
    newAchievements: [],
    currentStreak: 0,
    streakAfterWrong: 0,
    missedRounds: [],
  };

  // Realm entry
  if (REALM_ENTRY[realm]) {
    const realmLevels = Object.keys(LEVEL_DATA).map(Number).sort((a,b) => a-b)
      .filter(l => LEVEL_DATA[l].realm === realm);
    const firstInRealm = !realmLevels.some(rl => GameState.completed.includes(rl));
    if (firstInRealm) {
      const [title, body] = REALM_ENTRY[realm];
      await screenRealmEntry(title, body);
    }
  }

  if (!GameState.progress.visited_realms.includes(realm)) {
    GameState.progress.visited_realms.push(realm);
  }

  // Level intro
  await screenLevelIntro(lv, data, scenes);

  // Play each scene
  for (const scene of scenes) {
    await screenSceneIntro(lv, data, scene);
    for (let i = 0; i < scene.rounds.length; i++) {
      const r = scene.rounds[i];
      if (r.type === "spell" && !hasStudiedWord(r)) {
        await screenWordStudy(r);
      }
      const result = await playChallenge(lv, scene, i, r);
      if (result) handleCorrect(lv, r);
      else handleWrong(lv, r);
      await waitPrompt();
    }
    await screenSceneCleared(scene);
  }

  // Level complete
  const mastered = await screenLevelComplete(lv, data, scenes);

  if (!mastered) {
    GameState.save();
    GameState.session = null;
    return;
  }

  // Realm farewell
  const realmEndLevels = {};
  for (const rl of Object.keys(LEVEL_DATA).map(Number)) {
    const r = LEVEL_DATA[rl].realm;
    if (!realmEndLevels[r] || rl > realmEndLevels[r]) realmEndLevels[r] = rl;
  }
  if (lv === realmEndLevels[realm] && REALM_FAREWELL[realm]) {
    const [guideName, farewellText] = REALM_FAREWELL[realm];
    if (!GameState.progress.realm_guides_met.includes(guideName)) {
      GameState.progress.realm_guides_met.push(guideName);
      await screenGuideFarewell(guideName, farewellText);
    }
  }

  GameState.save();
  GameState.session = null;
}

function handleCorrect(lv, r) {
  const s = GameState.session;
  s.levelCorrect++;
  s.currentStreak++;
  s.streakAfterWrong++;
  GameState.progress.total_correct++;

  if (s.currentStreak > GameState.progress.best_streak) {
    GameState.progress.best_streak = s.currentStreak;
  }

  const bonus = Math.min(s.currentStreak * 2, 20);
  const gems = 10 + bonus;
  GameState.addGems(gems);
  s.levelGems += gems;

  if (s.currentStreak === 3) s.newAchievements.push("streak_3");
  if (s.currentStreak === 5) s.newAchievements.push("streak_5");
  if (s.currentStreak === 10) s.newAchievements.push("streak_10");

  // Award any streak achievements
  for (const ach of [...s.newAchievements]) {
    if (GameState.grant(ach)) s.newAchievements.push(ach);
  }
  // Deduplicate
  s.newAchievements = [...new Set(s.newAchievements)];
}

function handleWrong(lv, r) {
  const s = GameState.session;
  s.currentStreak = 0;
  s.streakAfterWrong = 0;
  GameState.progress.total_wrong++;
  s.missedRounds.push(r);
  GameState.addMistake(lv, r);
}

/* ---------- Screen: Realm Entry ---------------------------------------- */
function screenRealmEntry(title, body) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, title)));
  const prose = el("div", { className: "prose" });
  body.split("\n").forEach(line => {
    if (line.trim()) prose.appendChild(el("p", {}, line));
    else prose.appendChild(el("br"));
  });
  screen.appendChild(prose);
  root.appendChild(screen);
  announce(title);
  return waitPrompt();
}

/* ---------- Screen: Level Intro ---------------------------------------- */
function screenLevelIntro(lv, data, scenes) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" },
    el("h1", {}, `Level ${lv}: ${data.name}`)));

  screen.appendChild(statusBar());

  const meta = el("div", { className: "prose" });
  meta.appendChild(el("p", {}, `Realm: ${data.realm}`));

  // Varied intro
  const realmStartLevels = {};
  for (const rl of Object.keys(LEVEL_DATA).map(Number)) {
    const r = LEVEL_DATA[rl].realm;
    if (!realmStartLevels[r] || rl < realmStartLevels[r]) realmStartLevels[r] = rl;
  }
  if (lv === realmStartLevels[data.realm]) {
    meta.appendChild(el("p", {}, "A fresh trail opens before you. This is where your work in this realm begins."));
  } else if (GameState.completed.includes(lv - 1)) {
    meta.appendChild(el("p", {}, "You return to familiar ground, stronger than before. The realm has more to teach."));
  } else {
    meta.appendChild(el("p", {}, data.desc));
  }

  meta.innerHTML += `<p>This level is a journey through scenes and encounters.<br>
    Clear each scene to push deeper into the realm.</p>
    <p>Encounters: ${data.rounds.length}<br>Scenes: ${scenes.length}</p>`;
  screen.appendChild(meta);
  root.appendChild(screen);
  announce(`Level ${lv}: ${data.name}. Realm: ${data.realm}.`);
  return waitPrompt();
}

/* ---------- Screen: Scene Intro ---------------------------------------- */
function screenSceneIntro(lv, data, scene) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });

  screen.appendChild(el("div", { className: "game-heading" },
    el("h1", {}, `Level ${lv}: ${data.name} — ${scene.name}`)));

  screen.appendChild(statusBar());

  screen.appendChild(el("div", { className: "scene-header" },
    el("div", { className: "scene-realm" }, `Realm: ${data.realm}`)));

  const prose = el("div", { className: "prose" });
  prose.appendChild(el("p", {}, scene.intro));
  prose.appendChild(el("p", { style: "color:var(--text-secondary);" },
    `Scene ${scene.number} of ${scene.total} — ${scene.rounds.length} encounters`));

  // Flavor transition
  const realmVariants = {
    "Village of Letters": [
      "Cobblestones warm beneath your feet. The village welcomes you onward.",
      "Lanterns flicker brighter as you press deeper into the village.",
      "The Mayor's Fountain glitters ahead — the heart of the village awaits.",
    ],
    "Forest of Sounds": [
      "Leaves whisper secrets as you step onto the trail. The forest is listening.",
      "The trees grow denser here. Every rustle carries a lesson.",
      "An ancient stillness settles over the grove. This is the forest's deepest test.",
    ],
    "Mountain of Mastery": [
      "The first ledge is narrow but solid. The climb begins.",
      "Wind whips at your cloak. The mountain is testing your resolve.",
      "Only the summit steps remain. The air is thin but your will is strong.",
    ],
    "Tower of Eloquence": [
      "The great doors swing inward without a sound. The Tower expects you.",
      "Gears hum and click as you ascend. Every machine here runs on good grammar.",
      "Clouds swirl past the balcony. The Sky Library stretches into infinity above.",
    ],
    "Kingdom of Fluent Writing": [
      "Flowers bloom in colors you've never seen. The Garden is already responding to your presence.",
      "The Story Road stretches ahead, each paving-stone a page from a different tale.",
      "Trumpets sound as the Royal Hall comes into view. This is the final threshold.",
    ],
  };
  const variants = realmVariants[data.realm] || ["The journey begins here.","You press forward.","The way opens before you."];
  const idx = Math.min(scene.number - 1, variants.length - 1);
  prose.appendChild(el("div", { className: "scene-flavor" }, variants[idx]));
  screen.appendChild(prose);
  root.appendChild(screen);
  announce(`${scene.name}. Realm: ${data.realm}. Scene ${scene.number} of ${scene.total}.`);
  return waitPrompt();
}

/* ---------- Play Challenge --------------------------------------------- */
async function playChallenge(lv, scene, roundIdx, r) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });

  screen.appendChild(el("div", { className: "game-heading" },
    el("h1", {}, `${scene.name} — Encounter ${roundIdx + 1} of ${scene.rounds.length}`)));

  // Progress bar
  const totalRounds = scene.rounds.length;
  const pct = Math.round(100 * roundIdx / totalRounds);
  screen.appendChild(el("div", { className: "progress-bar" },
    el("span", {}, `${pct}%`),
    el("div", { className: "progress-fill" },
      el("div", { className: "progress-fill-inner", style: `width:${pct}%` }))));

  screen.appendChild(statusBar());

  // Challenge flavor
  screen.appendChild(el("div", { className: "prose" },
    el("p", { style: "font-style:italic;color:var(--text-secondary);" },
      CHALLENGE_SCENES[r.type] || "A language challenge stands in your way.")));

  const challengeHost = el("div", { id: "challenge-host" });
  screen.appendChild(challengeHost);
  root.appendChild(screen);

  // Dispatch to challenge handler
  let result;
  switch (r.type) {
    case "spell": result = await challengeSpell(r); break;
    case "choose": result = await challengeChoose(r); break;
    case "fix": result = await challengeFix(r); break;
    case "order": result = await challengeOrder(r); break;
    case "write": result = await challengeWrite(r); break;
    case "story": result = await challengeStory(r); break;
    case "essay": result = await challengeEssay(r); break;
    case "choice_moment": result = await challengeChoiceMoment(r); break;
    default: result = true;
  }

  return result;
}

/* ---------- Focus Token Retry Helper ----------------------------------- */
// Shows a "Use Focus Crystal" prompt after a wrong answer.
// Returns true if the player used a crystal (caller should reset for retry).
// Returns false if player declines or has no crystals (caller should resolve false).
function offerRetry(resultEl, wrongMsg, onRetry, onDecline) {
  if (GameState.focusTokens > 0) {
    const retryBox = el("div", { className: "game-message msg-tip", style: "margin-top:1rem;" });
    retryBox.innerHTML = `<p>You have ${GameState.focusTokens} Focus Crystal(s). Use one to try again?</p>`;
    const retryBtn = el("button", {
      className: "btn btn-primary",
      style: "margin-right:0.5rem;",
      onClick() {
        GameState.progress.focus_tokens--;
        GameState.save();
        retryBox.remove();
        announce("Focus Crystal used. Try again!");
        onRetry();
      }
    }, "Use Crystal (retry)");
    const noBtn = el("button", {
      className: "btn",
      onClick() { retryBox.remove(); onDecline(); }
    }, "No thanks");
    retryBox.appendChild(retryBtn);
    retryBox.appendChild(noBtn);
    resultEl.appendChild(retryBox);
    retryBtn.focus();
    announce(`Wrong answer. You have ${GameState.focusTokens} Focus Crystals. Press ENTER to use one, or ESC to move on.`);

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); cleanup(); noBtn.click(); }
    }
    function cleanup() { document.removeEventListener("keydown", onKey); }
    document.addEventListener("keydown", onKey);
    // Also handle cleanup on button clicks
    retryBtn.addEventListener("click", cleanup);
    noBtn.addEventListener("click", cleanup);
    return true; // retry offered, caller should NOT resolve yet
  }
  return false; // no tokens, caller should resolve false
}

/* ---------- Challenge: Spell ------------------------------------------- */
function challengeSpell(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: SPELL THE WORD FROM MEMORY</span>
      <p class="challenge-prompt">Meaning and hint: ${r.hint}</p>
      <p class="challenge-prompt">The written answer is now hidden. Type the word you studied.</p>`;

    const input = el("input", {
      className: "challenge-input",
      type: "text",
      placeholder: "Type the word and press ENTER...",
      "aria-label": `Type the word you studied. Meaning and hint: ${r.hint}`,
    });
    area.appendChild(input);
    root.appendChild(area);
    input.focus();

    const resultEl = el("div");
    root.appendChild(resultEl);
    announce(`Spell the word from memory. Meaning and hint: ${r.hint}`);

    input.addEventListener("keydown", function handler(e) {
      if (e.key !== "Enter") return;
      const ans = input.value.trim();
      input.disabled = true;
      input.removeEventListener("keydown", handler);

      if (ans.toLowerCase() === r.answer.toLowerCase()) {
        resultEl.innerHTML = `<div class="game-message msg-success">CORRECT! ${r.answer} is right!</div>`;
        announce("Correct!");
        AudioFX.play("correct");
        resolve(true);
      } else {
        resultEl.innerHTML = `
          <div class="game-message msg-error">NOT QUITE. The correct spelling is: <strong>${r.answer}</strong></div>
          <div class="game-message msg-neutral">You typed: ${ans}</div>
          <div class="game-message msg-tip">TIP: ${r.explain}</div>`;
        announce(`Not quite. The correct spelling is ${r.answer}.`);
        AudioFX.play("wrong");

        if (!offerRetry(resultEl, `Not quite. The correct spelling is ${r.answer}.`, () => {
          // Retry: re-enable input for another attempt
          resultEl.innerHTML = "";
          input.value = "";
          input.disabled = false;
          input.focus();
          input.addEventListener("keydown", handler);
        }, () => {
          resolve(false);
        })) {
          resolve(false);
        }
      }
    });
  });
}

/* ---------- Challenge: Choose (multiple choice) ------------------------ */
function challengeChoose(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: CHOOSE THE RIGHT WORD</span>
      <p class="challenge-prompt">${r.prompt}</p>`;

    const options = r.options;
    const list = el("ul", { className: "menu-list", "aria-label": "Choose the right word" });
    let selected = 0;
    const btns = [];

    options.forEach((opt, i) => {
      const li = el("li");
      const btn = el("button", { className: "menu-item", "data-index": i }, opt);
      if (i === 0) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        cleanup();
        evaluate(opt);
      });
      li.appendChild(btn);
      list.appendChild(li);
      btns.push(btn);
    });
    area.appendChild(list);
    root.appendChild(area);

    const resultEl = el("div");
    root.appendChild(resultEl);

    const hintEl = el("div", { className: "keyboard-hint" },
      "Use UP/DOWN to choose, ENTER to select, TAB to move normally, ESC to skip.");
    root.appendChild(hintEl);

    btns[0].focus();
    announce(`Choose the right word. ${r.prompt}. Option 1 of ${options.length}: ${options[0]}`);

    function onKey(e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        btns[selected].classList.remove("selected");
        if (e.key === "ArrowDown") selected = (selected + 1) % options.length;
        else selected = (selected - 1 + options.length) % options.length;
        btns[selected].classList.add("selected");
        btns[selected].focus();
        announce(`Option ${selected + 1} of ${options.length}: ${options[selected]}`);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        cleanup();
        evaluate(options[selected]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
        resultEl.innerHTML = `<div class="game-message msg-error">You didn't pick an answer.</div>
          <div class="game-message msg-tip">TIP: ${r.explain}</div>`;
        announce("No answer selected.");
        resolve(false);
      }
    }
    document.addEventListener("keydown", onKey);

    function evaluate(choice) {
      if (choice === r.answer) {
        resultEl.innerHTML = `<div class="game-message msg-success">CORRECT! ${r.answer} is the right choice!</div>`;
        announce("Correct!");
        AudioFX.play("correct");
        cleanup();
        resolve(true);
      } else {
        resultEl.innerHTML = `
          <div class="game-message msg-error">NOT QUITE. The right answer was: <strong>${r.answer}</strong></div>
          <div class="game-message msg-tip">TIP: ${r.explain}</div>`;
        announce(`Not quite. The right answer was ${r.answer}.`);
        AudioFX.play("wrong");
        cleanup(); // remove old keydown listener

        if (!offerRetry(resultEl, `Not quite. The right answer was ${r.answer}.`, () => {
          // Retry: re-enable keyboard navigation
          resultEl.innerHTML = "";
          btns.forEach((b, i) => {
            b.classList.toggle("selected", i === selected);
          });
          btns[selected].focus();
          document.addEventListener("keydown", onKey);
          announce(`Try again. Option ${selected + 1} of ${options.length}: ${options[selected]}`);
        }, () => {
          resolve(false);
        })) {
          resolve(false);
        }
      }
    }

    function cleanup() { document.removeEventListener("keydown", onKey); }
  });
}

/* ---------- Challenge: Fix --------------------------------------------- */
function challengeFix(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: FIX THIS SENTENCE</span>
      <p class="challenge-prompt">Wrong sentence: <em style="color:var(--red);">${r.wrong}</em></p>
      <p class="challenge-prompt">Hint: ${r.hint}</p>`;

    const input = el("input", {
      className: "challenge-input", type: "text",
      placeholder: "Type the correct sentence and press ENTER...",
      "aria-label": `Fix the sentence. Wrong: ${r.wrong}. Hint: ${r.hint}`,
    });
    area.appendChild(input);
    root.appendChild(area);
    input.focus();

    const resultEl = el("div");
    root.appendChild(resultEl);
    announce(`Fix this sentence: ${r.wrong}. Hint: ${r.hint}`);

    input.addEventListener("keydown", function handler(e) {
      if (e.key !== "Enter") return;
      const ans = input.value.trim();
      input.disabled = true;
      input.removeEventListener("keydown", handler);

      if (ans.toLowerCase() === r.right.toLowerCase()) {
        resultEl.innerHTML = `<div class="game-message msg-success">PERFECT! ${r.right}</div>`;
        announce("Perfect!");
        AudioFX.play("correct");
        resolve(true);
      } else {
        resultEl.innerHTML = `
          <div class="game-message msg-error">NOT QUITE. The correct sentence is: <strong>${r.right}</strong></div>
          <div class="game-message msg-neutral">You typed: ${ans}</div>
          <div class="game-message msg-tip">TIP: ${r.explain}</div>`;
        announce(`Not quite. The correct sentence is ${r.right}.`);
        AudioFX.play("wrong");

        if (!offerRetry(resultEl, `Not quite. Correct: ${r.right}.`, () => {
          resultEl.innerHTML = "";
          input.value = "";
          input.disabled = false;
          input.focus();
          input.addEventListener("keydown", handler);
        }, () => {
          resolve(false);
        })) {
          resolve(false);
        }
      }
    });
  });
}

/* ---------- Challenge: Order ------------------------------------------- */
function challengeOrder(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: PUT THE WORDS IN ORDER</span>
      <p class="challenge-prompt">Words to arrange: <strong>${r.words}</strong></p>
      <p class="challenge-prompt">Hint: ${r.hint}</p>`;

    const input = el("input", {
      className: "challenge-input", type: "text",
      placeholder: "Type the complete sentence and press ENTER...",
      "aria-label": `Put words in order: ${r.words}. Hint: ${r.hint}`,
    });
    area.appendChild(input);
    root.appendChild(area);
    input.focus();

    const resultEl = el("div");
    root.appendChild(resultEl);
    announce(`Put the words in order: ${r.words}. Hint: ${r.hint}`);

    input.addEventListener("keydown", function handler(e) {
      if (e.key !== "Enter") return;
      const ans = input.value.trim();
      input.disabled = true;
      input.removeEventListener("keydown", handler);

      if (ans.toLowerCase() === r.right.toLowerCase()) {
        resultEl.innerHTML = `<div class="game-message msg-success">YES! ${r.right}</div>`;
        announce("Correct!");
        AudioFX.play("correct");
        resolve(true);
      } else {
        resultEl.innerHTML = `
          <div class="game-message msg-error">NOT QUITE. The correct sentence is: <strong>${r.right}</strong></div>
          <div class="game-message msg-neutral">You typed: ${ans}</div>
          <div class="game-message msg-tip">TIP: ${r.explain}</div>`;
        announce(`Not quite. Correct: ${r.right}.`);
        AudioFX.play("wrong");

        if (!offerRetry(resultEl, `Not quite. Correct: ${r.right}.`, () => {
          resultEl.innerHTML = "";
          input.value = "";
          input.disabled = false;
          input.focus();
          input.addEventListener("keydown", handler);
        }, () => {
          resolve(false);
        })) {
          resolve(false);
        }
      }
    });
  });
}

/* ---------- Challenge: Write (always "correct" - encouragement) -------- */
function challengeWrite(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: WRITING PRACTICE</span>
      <p class="challenge-prompt">Topic: ${r.prompt}</p>
      <p class="challenge-prompt">Try to use these words: ${r.keywords.join(", ")}</p>
      <div class="game-message msg-tip">${r.explain}</div>`;

    const textarea = el("textarea", {
      className: "challenge-input",
      rows: 5,
      placeholder: "Write your paragraph here...\nPress ENTER on an empty line when done.",
      "aria-label": `Write about: ${r.prompt}`,
    });
    area.appendChild(textarea);
    const submit = el("button", { className: "btn btn-primary" }, "Submit Writing");
    area.appendChild(submit);
    root.appendChild(area);

    const resultEl = el("div");
    root.appendChild(resultEl);
    textarea.focus();
    announce(`Writing practice: ${r.prompt}`);

    let submitted = false;
    function evaluate() {
      if (submitted) return;
      submitted = true;
      textarea.disabled = true;
      submit.disabled = true;
      const text = textarea.value.trim();
      const words = text.split(/\s+/).filter(Boolean);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      const lowerText = text.toLowerCase();

      let msg = `<p>You wrote ${words.length} words in ${sentences.length} sentences!</p>`;
      for (const kw of r.keywords) {
        const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (new RegExp(`\\b${escaped}\\b`, "i").test(lowerText)) {
          msg += `<p style="color:var(--green);">Used keyword: ${kw}</p>`;
        }
      }

      if (words.length < 10) {
        msg += `<div class="game-message msg-tip">Next time, try to write a bit more. More practice helps you get better!</div>`;
        resultEl.innerHTML = msg;
      } else {
        resultEl.innerHTML = msg + `<div class="game-message msg-success">Great effort! Keep writing and you'll keep improving!</div>`;
      }
      announce("Writing received. Great effort!");
      resolve(true);
    }

    submit.addEventListener("click", evaluate);

    textarea.addEventListener("keydown", function handler(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        // Check if current line is empty
        const val = textarea.value;
        const cursorPos = textarea.selectionStart;
        const beforeCursor = val.slice(0, cursorPos);
        const lastLine = beforeCursor.split("\n").pop();
        if (lastLine.trim() === "") {
          e.preventDefault();
          textarea.removeEventListener("keydown", handler);
          evaluate();
        }
      }
    });
  });
}

/* ---------- Challenge: Story (always "correct" - encouragement) ------ */
function challengeStory(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: CONTINUE THE STORY</span>
      <p class="challenge-prompt">Start here: <em>${r.prompt}</em></p>
      <p class="challenge-prompt">Write at least ${r.min_sentences} sentences to continue.</p>
      <div class="game-message msg-tip">${r.explain}</div>`;

    const textarea = el("textarea", {
      className: "challenge-input", rows: 5,
      placeholder: "Continue the story...\nPress ENTER on an empty line when done.",
      "aria-label": `Continue the story: ${r.prompt}`,
    });
    area.appendChild(textarea);
    const submit = el("button", { className: "btn btn-primary" }, "Submit Story");
    area.appendChild(submit);
    root.appendChild(area);

    const resultEl = el("div");
    root.appendChild(resultEl);
    textarea.focus();
    announce(`Continue the story: ${r.prompt}`);

    let submitted = false;
    function evaluate() {
      if (submitted) return;
      submitted = true;
      textarea.disabled = true;
      submit.disabled = true;
      const text = textarea.value.trim();
      const sc = text.split(/[.!?]+/).filter(s => s.trim()).length;
      if (sc >= r.min_sentences) {
        resultEl.innerHTML = `<div class="game-message msg-success">Great story! You wrote about ${sc} sentences.</div>`;
      } else {
        resultEl.innerHTML = `<p>You wrote about ${sc} sentences. Try to write at least ${r.min_sentences} next time!</p>`;
      }
      announce("Story received!");
      resolve(true);
    }

    submit.addEventListener("click", evaluate);

    textarea.addEventListener("keydown", function handler(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        const val = textarea.value;
        const cursorPos = textarea.selectionStart;
        const beforeCursor = val.slice(0, cursorPos);
        if (beforeCursor.split("\n").pop().trim() === "") {
          e.preventDefault();
          textarea.removeEventListener("keydown", handler);
          evaluate();
        }
      }
    });
  });
}

/* ---------- Challenge: Essay (always "correct" - encouragement) ------- */
function challengeEssay(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">Challenge: FINAL ESSAY</span>
      <p class="challenge-prompt">Topic: ${r.prompt}</p>
      <div class="game-message msg-tip">${r.explain}</div>`;

    const textarea = el("textarea", {
      className: "challenge-input", rows: 6,
      placeholder: "Write your essay here...\nPress ENTER on an empty line when done.",
      "aria-label": `Final essay: ${r.prompt}`,
    });
    area.appendChild(textarea);
    const submit = el("button", { className: "btn btn-primary" }, "Submit Essay");
    area.appendChild(submit);
    root.appendChild(area);

    const resultEl = el("div");
    root.appendChild(resultEl);
    textarea.focus();
    announce(`Final essay: ${r.prompt}`);

    let submitted = false;
    function evaluate() {
      if (submitted) return;
      submitted = true;
      textarea.disabled = true;
      submit.disabled = true;
      const text = textarea.value.trim();
      if (text.length > 50) {
        resultEl.innerHTML = `<div class="game-message msg-success">Outstanding! You have completed your final essay challenge!<br>You have grown so much as a writer. Be proud!</div>`;
      } else {
        resultEl.innerHTML = `<p>Thank you for your essay! Every word you write makes you better.</p>`;
      }
      announce("Essay received! Outstanding work!");
      resolve(true);
    }

    submit.addEventListener("click", evaluate);

    textarea.addEventListener("keydown", function handler(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        const val = textarea.value;
        const cursorPos = textarea.selectionStart;
        const beforeCursor = val.slice(0, cursorPos);
        if (beforeCursor.split("\n").pop().trim() === "") {
          e.preventDefault();
          textarea.removeEventListener("keydown", handler);
          evaluate();
        }
      }
    });
  });
}

/* ---------- Challenge: Choice Moment (narrative fork - always correct) */
function challengeChoiceMoment(r) {
  return new Promise((resolve) => {
    const root = getChallengeMount();
    const area = el("div", { className: "challenge-area" });
    area.innerHTML = `<span class="challenge-label">A MOMENT OF CHOICE</span>
      <p class="challenge-prompt">${r.prompt}</p>`;

    const list = el("ul", { className: "menu-list", "aria-label": "Which path do you take?" });
    let selected = 0;
    const btns = [];

    r.options.forEach(([label, value], i) => {
      const li = el("li");
      const btn = el("button", { className: "menu-item", "data-index": i }, label);
      if (i === 0) btn.classList.add("selected");
      btn.addEventListener("click", () => { cleanup(); finish(value); });
      li.appendChild(btn);
      list.appendChild(li);
      btns.push(btn);
    });
    area.appendChild(list);
    root.appendChild(area);

    const resultEl = el("div");
    root.appendChild(resultEl);

    const hintEl = el("div", { className: "keyboard-hint" }, "Use UP/DOWN to choose, ENTER to select. Either path continues forward.");
    root.appendChild(hintEl);

    btns[0].focus();
    announce(`A moment of choice. ${r.prompt}`);

    function onKey(e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        btns[selected].classList.remove("selected");
        if (e.key === "ArrowDown") selected = (selected + 1) % r.options.length;
        else selected = (selected - 1 + r.options.length) % r.options.length;
        btns[selected].classList.add("selected");
        btns[selected].focus();
        announce(r.options[selected][0]);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        cleanup();
        finish(r.options[selected][1]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
        finish(r.options[0][1]); // default to first option
      }
    }
    document.addEventListener("keydown", onKey);

    function finish(_value) {
      resultEl.innerHTML = `<div class="game-message msg-info">${r.result}</div>`;
      announce(r.result);
      resolve(true);
    }
    function cleanup() { document.removeEventListener("keydown", onKey); }
  });
}

/* ---------- Screen: Scene Cleared -------------------------------------- */
function screenSceneCleared(scene) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, `${scene.name} Cleared`)));

  const sceneDoneVariants = [
    "You pause to catch your breath. The path ahead is clearer now.",
    "The last word-magic fades from the air. You gather your thoughts and press on.",
    "A sense of accomplishment settles over you. The realm has more to show.",
  ];

  const prose = el("div", { className: "prose" });
  if (scene.number < scene.total) {
    const idx = Math.min(scene.number - 1, sceneDoneVariants.length - 1);
    prose.appendChild(el("p", {}, sceneDoneVariants[idx]));
  } else {
    prose.appendChild(el("p", {}, "The last obstacle falls away and the way opens before you. You have crossed this entire stretch of the realm."));
  }
  prose.innerHTML += `<p>Current gems: ${GameState.gems}<br>Focus crystals: ${GameState.focusTokens}</p>`;
  screen.appendChild(prose);
  root.appendChild(screen);
  announce(`${scene.name} cleared.`);
  return waitPrompt();
}

/* ---------- Screen: Level Complete ------------------------------------ */
function screenLevelComplete(lv, data, scenes) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });

  const s = GameState.session;
  const totalRounds = data.rounds.length;
  const pct = Math.round(100 * s.levelCorrect / totalRounds);
  const mastery = getLevelMasteryResult(lv, data);

  if (!mastery.passed) {
    screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, `Level ${lv}: More Practice Needed`)));
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", {}, `You answered ${s.levelCorrect} of ${totalRounds} correctly (${pct}%). This level requires at least ${mastery.requiredCorrect} correct answers (${mastery.percent}% mastery) to unlock the next level.`));
    if (s.missedRounds.length) {
      prose.appendChild(el("p", {}, "Review these mistakes before trying again:"));
      const list = el("ul", { className: "achievement-list" });
      for (const round of s.missedRounds) {
        const question = round.prompt || round.wrong || round.words || "Practice item";
        const answer = round.answer || round.right || "Review the explanation shown after the question";
        list.appendChild(el("li", {}, `${question} — correct answer: ${answer}`));
      }
      prose.appendChild(list);
    }
    prose.appendChild(el("div", { className: "reward-box", role: "status", "aria-live": "polite" },
      el("p", {}, `You keep ${s.levelGems} gems earned from correct answers. The treasure chest does not open yet. Replay this level when you are ready; the next level remains locked until you reach the mastery score.`)));
    screen.appendChild(prose);
    root.appendChild(screen);
    GameState.save();
    announce(`Level ${lv} needs more practice. You got ${s.levelCorrect} of ${totalRounds} correct and need at least ${mastery.requiredCorrect}. You keep ${s.levelGems} gems, but the treasure chest and next level remain locked.`);
    return waitPrompt().then(() => false);
  }

  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, `Level ${lv} Mastered!`)));

  const prose = el("div", { className: "prose" });
  prose.innerHTML = `<p>You got ${s.levelCorrect} out of ${totalRounds} right! That's ${pct}%</p>
    <p>Gems this level: ${s.levelGems}<br>Total gems: ${GameState.gems}<br>
    Longest streak: ${GameState.progress.best_streak} in a row!</p>`;

  // Treasure chest
  const bonus = lv * 25;
  GameState.addGems(bonus);
  s.levelGems += bonus;
  prose.innerHTML += `<div class="reward-box">
    <p>You open a treasure chest!</p>
    <div class="reward-amount">+${bonus} bonus gems</div>`;
  if (lv % 2 === 0) {
    GameState.progress.focus_tokens++;
    prose.innerHTML += `<p>Inside the chest you also find a Focus Crystal — a shard of concentrated word-magic. It can give you a second chance on a hard challenge.</p>`;
  }
  prose.innerHTML += `</div>`;

  if (!GameState.completed.includes(lv)) {
    GameState.completed.push(lv);
  }

  // Achievements
  const achMap = {1:"first_steps",3:"village_master",6:"forest_guide",9:"mountain_climber",12:"tower_scholar",15:"kingdom_scribe"};
  if (achMap[lv]) s.newAchievements = [...new Set([...s.newAchievements, achMap[lv]])];
  if (s.levelCorrect === totalRounds) s.newAchievements.push("perfect_round");

  if (s.streakAfterWrong >= 3) s.newAchievements.push("comeback");

  // Actually grant them
  const granted = [];
  for (const a of [...new Set(s.newAchievements)]) {
    if (GameState.grant(a)) granted.push(a);
  }

  if (granted.length) {
    prose.innerHTML += `<div class="reward-box" role="status" aria-live="polite" aria-atomic="true"><p><strong>Achievement unlocked!</strong></p></div>`;
    const ul = el("ul", { className: "achievement-list" });
    for (const a of granted) {
      ul.appendChild(el("li", {}, ACHIEVEMENTS[a] || a));
    }
    prose.appendChild(ul);
  }

  const newlyEligible = getNewlyEligibleBonusGames(lv);
  for (const [, data] of newlyEligible) {
    prose.appendChild(el("div", {
      className: "reward-box",
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
    el("p", {}, el("strong", {}, `New bonus trial available: ${data.name}`)),
    el("p", {}, `You completed Level ${data.required_level}. Visit the Crystal Enchanter's workshop to unseal this trial for ${data.cost} gems.`)));
  }

  prose.appendChild(el("p", {}, "Your rank is now: ", el("strong", {}, GameState.rank())));
  screen.appendChild(prose);
  root.appendChild(screen);
  GameState.save();
  const achievementAnnouncement = granted.length
    ? ` Achievement unlocked: ${granted.map((a) => ACHIEVEMENTS[a] || a).join("; ")}.`
    : "";
  const trialAnnouncement = newlyEligible.length
    ? ` New bonus trial available: ${newlyEligible.map(([, data]) => data.name).join("; ")}. Visit the Crystal Enchanter's workshop to unseal it with gems.`
    : "";
  announce(`Level ${lv} complete! You got ${s.levelCorrect} out of ${totalRounds} right.${achievementAnnouncement}${trialAnnouncement}`);
  return waitPrompt().then(() => true);
}

/* ---------- Screen: Guide Farewell ------------------------------------ */
function screenGuideFarewell(guideName, text) {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, guideName)));
  const prose = el("div", { className: "prose" });
  text.split("\n").forEach(line => {
    if (line.trim()) prose.appendChild(el("p", {}, line));
  });
  screen.appendChild(prose);
  root.appendChild(screen);
  announce(guideName);
  return waitPrompt();
}

function getProgressTier() {
  return Math.max(0, Math.min(4, Math.floor(GameState.completed.length / 3)));
}

function getAvailableRealmsForTrials() {
  const visited = GameState.progress.visited_realms || [];
  return visited.length ? visited : [REALM_ORDER[0]];
}

function getTrialWordPool(difficulty) {
  const availableRealms = getAvailableRealmsForTrials();
  let maxRealmCount = 1;
  if (difficulty === "medium") maxRealmCount = Math.min(3, availableRealms.length);
  if (difficulty === "hard") maxRealmCount = availableRealms.length;
  const allowedRealms = new Set(availableRealms.slice(0, maxRealmCount));

  const words = [];
  for (const lv of Object.keys(LEVEL_DATA).map(Number)) {
    const level = LEVEL_DATA[lv];
    if (!allowedRealms.has(level.realm)) continue;
    for (const round of level.rounds) {
      if (round.answer) words.push(String(round.answer).toLowerCase());
      if (round.right) {
        words.push(...String(round.right).toLowerCase().match(/[a-z']+/g) || []);
      }
      if (round.options) {
        for (const option of round.options) {
          const raw = Array.isArray(option) ? option[0] : option;
          words.push(...String(raw).toLowerCase().match(/[a-z']+/g) || []);
        }
      }
    }
  }

  const unique = [];
  const seen = new Set();
  for (const word of words) {
    if (word.length < 3 || seen.has(word)) continue;
    seen.add(word);
    unique.push(word);
  }
  return unique;
}

function getTrialReward(baseReward) {
  return baseReward + Math.floor(GameState.completed.length / 3) * 5;
}

function getBonusGameProgress(data) {
  const levelComplete = GameState.completed.includes(data.required_level);
  const levelsDone = GameState.completed.filter((level) => level <= data.required_level).length;
  const gemsNeeded = Math.max(0, data.cost - GameState.gems);
  return { levelComplete, levelsDone, gemsNeeded, canPurchase: levelComplete && gemsNeeded === 0 };
}

function getNewlyEligibleBonusGames(completedLevel) {
  return Object.entries(BONUS_GAMES)
    .filter(([, data]) => data.required_level === completedLevel)
    .filter(([id]) => !GameState.progress.bonus_games.includes(id));
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showTrialInstructions(title, instructions, buttonText = "Start Trial") {
  const root = clearRoot();
  const screen = el("div", { className: "screen" });
  screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, `${title}: How to Play`)));
  const prose = el("div", { className: "prose" });
  for (const instruction of instructions) {
    prose.appendChild(el("p", {}, instruction));
  }
  screen.appendChild(prose);
  const button = el("button", { className: "btn btn-primary", style: "display:block;margin:1rem auto;" }, buttonText);
  screen.appendChild(button);
  root.appendChild(screen);
  button.focus();
  announce(`${title}. How to play. ${instructions.join(" ")} Activate ${buttonText} when you are ready.`);
  return new Promise((resolve) => button.addEventListener("click", resolve, { once: true }));
}

async function playWordSimon() {
  const difficulty = await buildMenu(
    "Word Simon",
    [
      ["Easy - 3 words from early realms", "easy"],
      ["Medium - 4 words from explored realms", "medium"],
      ["Hard - 5 words from across your journey", "hard"],
    ],
    "bonus trials",
    "Memorize a spoken-looking sequence, then type it back in the same order."
  );
  if (!difficulty) return;

  const count = { easy: 3, medium: 4, hard: 5 }[difficulty];
  await showTrialInstructions("Word Simon", [
    `You will study ${count} words, then the sequence will be hidden.`,
    "Remember every word in its original order. Type the words separated by spaces.",
    "Spelling and word order must both be exact. Press Enter in the answer field or activate Submit Sequence. Press Escape from the answer field to leave the trial.",
    "A correct sequence earns gems.",
  ], "Start Word Simon");

  const pool = getTrialWordPool(difficulty);
  const sequence = shuffle(pool).slice(0, count);

  {
    const root = clearRoot();
    const screen = el("div", { className: "screen" });
    screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Word Simon")));
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", {}, BONUS_GAMES.simon.flavor));
    prose.appendChild(el("p", {}, "Study this sequence, then continue and type it back exactly."));
    prose.appendChild(el("div", { className: "game-message msg-info" }, sequence.join("  -  ")));
    screen.appendChild(prose);
    root.appendChild(screen);
    announce(`Word Simon sequence. ${sequence.join(", ")}`);
    await waitPrompt("Activate the Continue button when you are ready to type the sequence.");
  }

  return new Promise((resolve) => {
    const root = clearRoot();
    const screen = el("div", { className: "screen" });
    screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Repeat the Sequence")));
    screen.appendChild(el("div", { className: "prose" }, el("p", {}, "Type the words separated by spaces.")));
    const input = el("input", {
      type: "text",
      className: "challenge-input",
      autocomplete: "off",
      "aria-label": "Type the Word Simon sequence",
      placeholder: "word1 word2 word3",
    });
    const submit = el("button", { className: "btn btn-primary" }, "Submit Sequence");
    screen.appendChild(input);
    screen.appendChild(submit);
    root.appendChild(screen);
    input.focus();

    function finish() {
      const typed = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const correct = typed.length === sequence.length && typed.every((word, index) => word === sequence[index]);
      const reward = getTrialReward(20 + count * 5);

      const out = clearRoot();
      const resultScreen = el("div", { className: "screen" });
      resultScreen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Word Simon Result")));
      const prose = el("div", { className: "prose" });
      if (correct) {
        GameState.addGems(reward);
        GameState.save();
        prose.appendChild(el("div", { className: "game-message msg-success" }, `Perfect recall. You earn ${reward} gems.`));
      } else {
        prose.appendChild(el("div", { className: "game-message msg-error" }, "The chamber's echoes fade. That was not the exact sequence."));
      }
      prose.appendChild(el("p", {}, `Correct sequence: ${sequence.join(" ")}`));
      resultScreen.appendChild(prose);
      out.appendChild(resultScreen);
      announce(correct
        ? `Word Simon cleared. You earned ${reward} gems. Activate Continue to return to Bonus Trials.`
        : `Word Simon failed. The correct sequence was ${sequence.join(", ")}. Activate Continue to return to Bonus Trials.`);
      waitPrompt().then(resolve);
    }

    submit.addEventListener("click", finish);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish();
      } else if (e.key === "Escape") {
        e.preventDefault();
        resolve();
      }
    });
  });
}

async function playTypingBomb() {
  const difficulty = await buildMenu(
    "Typing Bomb",
    [
      ["Easy - 3 words", "easy"],
      ["Medium - 4 words", "medium"],
      ["Hard - 5 words", "hard"],
    ],
    "bonus trials",
    "Type a chain of words before the fuse burns down. Speed and accuracy both matter."
  );
  if (!difficulty) return;

  const pool = getTrialWordPool(difficulty);
  const config = {
    easy: { count: 3, seconds: Math.max(12, 18 - getProgressTier()) },
    medium: { count: 4, seconds: Math.max(16, 22 - getProgressTier()) },
    hard: { count: 5, seconds: Math.max(20, 26 - getProgressTier()) },
  }[difficulty];

  await showTrialInstructions("Typing Bomb", [
    `After you activate Start Typing Bomb, the timer begins and you will have ${config.seconds} seconds.`,
    `Type all ${config.count} displayed words in their original order, separated by spaces. Spelling and order must be exact.`,
    "Press Enter in the answer field or activate Cut the Fuse before time expires. Press Escape from the answer field to leave the trial.",
    "A correct sequence submitted in time earns gems.",
  ], "Start Typing Bomb");

  const sequence = shuffle(pool).slice(0, config.count);

  return new Promise((resolve) => {
    const root = clearRoot();
    const screen = el("div", { className: "screen" });
    screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Typing Bomb")));
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", {}, BONUS_GAMES.bomb.flavor));
    prose.appendChild(el("p", {}, `Type these words in order within ${config.seconds} seconds:`));
    prose.appendChild(el("div", { className: "game-message msg-info" }, sequence.join("  -  ")));
    const timerEl = el("div", { className: "game-message msg-neutral" }, `Time left: ${config.seconds}s`);
    prose.appendChild(timerEl);
    screen.appendChild(prose);
    const input = el("input", {
      type: "text",
      className: "challenge-input",
      autocomplete: "off",
      "aria-label": "Type the Typing Bomb sequence",
      placeholder: "word1 word2 word3",
    });
    const submit = el("button", { className: "btn btn-primary" }, "Cut the Fuse");
    screen.appendChild(input);
    screen.appendChild(submit);
    root.appendChild(screen);
    input.focus();
    announce(`Typing Bomb. ${config.seconds} seconds. Sequence: ${sequence.join(", ")}`);

    const startedAt = Date.now();
    let done = false;
    const timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, config.seconds - elapsed);
      timerEl.textContent = `Time left: ${left}s`;
      if (left <= 0) finish(true);
    }, 250);

    function finish(timedOut = false) {
      if (done) return;
      done = true;
      clearInterval(timerId);

      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      const typed = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const correct = !timedOut &&
        typed.length === sequence.length &&
        typed.every((word, index) => word === sequence[index]) &&
        elapsedSeconds <= config.seconds;
      const reward = getTrialReward(25 + config.count * 5);

      const out = clearRoot();
      const resultScreen = el("div", { className: "screen" });
      resultScreen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Typing Bomb Result")));
      const resultProse = el("div", { className: "prose" });
      if (correct) {
        GameState.addGems(reward);
        GameState.save();
        resultProse.appendChild(el("div", { className: "game-message msg-success" }, `Fuse cut in time. You earn ${reward} gems.`));
      } else if (timedOut) {
        resultProse.appendChild(el("div", { className: "game-message msg-error" }, "The fuse burned out before you finished. The gnome resets the machine with a sigh."));
      } else {
        resultProse.appendChild(el("div", { className: "game-message msg-error" }, "Close, but not exact. The bomb only accepts perfect word order."));
      }
      resultProse.appendChild(el("p", {}, `Correct sequence: ${sequence.join(" ")}`));
      resultScreen.appendChild(resultProse);
      out.appendChild(resultScreen);
      announce(correct
        ? `Typing Bomb cleared. You earned ${reward} gems. Activate Continue to return to Bonus Trials.`
        : `Typing Bomb failed. The correct sequence was ${sequence.join(", ")}. Activate Continue to return to Bonus Trials.`);
      waitPrompt().then(resolve);
    }

    submit.addEventListener("click", () => finish(false));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearInterval(timerId);
        resolve();
      }
    });
  });
}

async function playRobotReactor() {
  const allowedRealms = new Set(getAvailableRealmsForTrials());
  const orderRounds = [];
  for (const lv of Object.keys(LEVEL_DATA).map(Number)) {
    const level = LEVEL_DATA[lv];
    if (!allowedRealms.has(level.realm)) continue;
    for (const round of level.rounds) {
      if (round.type === "order") orderRounds.push(round);
    }
  }
  const chosen = orderRounds[Math.floor(Math.random() * orderRounds.length)];
  if (!chosen) return;

  await showTrialInstructions("Robot Reactor", [
    "You will receive scrambled words. Rearrange them into one complete sentence and type every word in the correct order.",
    "Capitalization does not matter, but the words and punctuation must match the expected sentence.",
    "Press Enter in the answer field or activate Charge Reactor to submit. Press Escape from the answer field to leave the trial.",
    "A correct sentence earns gems.",
  ], "Start Robot Reactor");

  return new Promise((resolve) => {
    const root = clearRoot();
    const screen = el("div", { className: "screen" });
    screen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Robot Reactor")));
    const prose = el("div", { className: "prose" });
    prose.appendChild(el("p", {}, BONUS_GAMES.robot.flavor));
    prose.appendChild(el("p", {}, "Give the robot one correctly ordered sentence to charge its core."));
    prose.appendChild(el("div", { className: "game-message msg-info" }, `Scrambled command: ${chosen.words}`));
    prose.appendChild(el("p", {}, `Hint: ${chosen.hint}`));
    screen.appendChild(prose);
    const input = el("input", {
      type: "text",
      className: "challenge-input",
      autocomplete: "off",
      "aria-label": "Type the correct Robot Reactor sentence",
      placeholder: "Type the complete sentence",
    });
    const submit = el("button", { className: "btn btn-primary" }, "Charge Reactor");
    screen.appendChild(input);
    screen.appendChild(submit);
    root.appendChild(screen);
    input.focus();
    announce(`Robot Reactor. Scrambled command: ${chosen.words}`);

    function finish() {
      const correct = input.value.trim().toLowerCase() === chosen.right.toLowerCase();
      const reward = getTrialReward(35);
      const out = clearRoot();
      const resultScreen = el("div", { className: "screen" });
      resultScreen.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Robot Reactor Result")));
      const resultProse = el("div", { className: "prose" });
      if (correct) {
        GameState.addGems(reward);
        GameState.save();
        resultProse.appendChild(el("div", { className: "game-message msg-success" }, `The core flares to life. You earn ${reward} gems.`));
      } else {
        resultProse.appendChild(el("div", { className: "game-message msg-error" }, "The robot chirps sadly. That command did not stabilize the reactor."));
      }
      resultProse.appendChild(el("p", {}, `Correct command: ${chosen.right}`));
      resultScreen.appendChild(resultProse);
      out.appendChild(resultScreen);
      announce(correct
        ? `Robot Reactor cleared. You earned ${reward} gems. Activate Continue to return to Bonus Trials.`
        : `Robot Reactor failed. The correct command was ${chosen.right}. Activate Continue to return to Bonus Trials.`);
      waitPrompt().then(resolve);
    }

    submit.addEventListener("click", finish);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish();
      } else if (e.key === "Escape") {
        e.preventDefault();
        resolve();
      }
    });
  });
}

/* ---------- Screen: Workshop ------------------------------------------- */
async function screenWorkshop() {
  GameState.progress.workshop_visits++;
  GameState.save();
  const visits = GameState.progress.workshop_visits;

  let greeting;
  if (visits === 1) {
    greeting = "You step into a warmly lit alcove tucked beneath a stairway. Shelves of glowing crystals line the walls, each one humming with a different kind of word-magic. An enchanter in cobalt robes looks up from their workbench and smiles.";
  } else if (visits <= 3) {
    greeting = "The enchanter looks up as you enter. 'Back again?' they say, setting aside a half-finished crystal. The familiar scent of ozone and old parchment fills the alcove.";
  } else {
    greeting = "The enchanter has come to expect your visits. 'My best customer,' they chuckle, gesturing at the glowing shelves. The alcove feels almost like a second home now.";
  }

  while (true) {
    const items = [["Bind a Focus Crystal — 30 gems", "focus"]];
    for (const [id, data] of Object.entries(BONUS_GAMES)) {
      if (GameState.progress.bonus_games.includes(id)) {
        items.push([`${data.name} — already unlocked`, id]);
      } else {
        const progress = getBonusGameProgress(data);
        const requirement = progress.levelComplete
          ? `level requirement complete; costs ${data.cost} gems; you have ${GameState.gems}; ${progress.gemsNeeded} more needed`
          : `locked; complete Level ${data.required_level} first; level progress ${progress.levelsDone} of ${data.required_level}; then costs ${data.cost} gems`;
        items.push([`${data.name} — ${requirement}`, id]);
      }
    }

    const choice = await buildMenu(
      "The Crystal Enchanter's Alcove",
      items,
      "main menu",
      `Gems: ${GameState.gems}  |  Crystals: ${GameState.focusTokens}\n${greeting}`
    );

    if (!choice) return;

    if (choice === "focus") {
      if (GameState.gems < 30) {
        const root = clearRoot();
        root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Not Enough Gems")));
        root.appendChild(el("div", { className: "prose" },
          el("p", {}, "The enchanter shakes their head gently. 'I need 30 gems to bind a Focus Crystal. Come back when you have more.'")));
        await waitPrompt();
        continue;
      }
      GameState.progress.gems -= 30;
      GameState.progress.focus_tokens++;
      GameState.save();
      const root = clearRoot();
      root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Focus Crystal Bound")));
      root.appendChild(el("div", { className: "prose" },
        el("p", {}, "The enchanter holds a gem in each hand and whispers words of concentration. The gems glow brighter, then merge into a single Focus Crystal that pulses with gentle light."),
        el("p", {}, `You now have ${GameState.focusTokens} Focus Crystal(s). When a challenge goes wrong, you can use one to try once more.`)));
      await waitPrompt();
      continue;
    }

    const data = BONUS_GAMES[choice];
    if (GameState.progress.bonus_games.includes(choice)) {
      const root = clearRoot();
      root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, data.name)));
      root.appendChild(el("div", { className: "prose" },
        el("p", {}, "The enchanter gestures to a glowing doorway. 'That trial is already open to you. You can find it at the Adventurer's Rest.'"),
        el("p", {}, data.desc)));
      await waitPrompt();
      continue;
    }

    const progress = getBonusGameProgress(data);
    if (!progress.levelComplete) {
      const root = clearRoot();
      root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Level Requirement Not Met")));
      root.appendChild(el("div", { className: "prose" },
        el("p", {}, `${data.name} practices skills introduced by Level ${data.required_level}. Complete that level before unsealing this trial.`),
        el("p", {}, `Level progress: ${progress.levelsDone} of ${data.required_level}. Once eligible, the trial costs ${data.cost} gems.`)));
      await waitPrompt();
      continue;
    }

    if (GameState.gems < data.cost) {
      const root = clearRoot();
      root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Not Enough Gems")));
      root.appendChild(el("div", { className: "prose" },
        el("p", {}, `The enchanter studies the seal. 'This one needs ${data.cost} gems to break. You have ${GameState.gems}.'`)));
      await waitPrompt();
      continue;
    }

    GameState.progress.gems -= data.cost;
    GameState.progress.bonus_games.push(choice);
    GameState.save();
    const root = clearRoot();
    root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Trial Unsealed!")));
    root.appendChild(el("div", { className: "prose" },
      el("p", {}, `The enchanter touches the door and it shimmers open. '${data.name} is now available at the Adventurer's Rest.'`),
      el("p", {}, data.desc),
      el("div", { className: "reward-box", role: "status", "aria-live": "assertive", "aria-atomic": "true" },
        el("p", {}, `Bonus trial unlocked: ${data.name}. Open it from Bonus Trials at the Adventurer's Rest.`))));
    announce(`Bonus trial unlocked: ${data.name}. Open it from Bonus Trials at the Adventurer's Rest.`);
    await waitPrompt();
  }
}

/* ---------- Screen: Bonus Trials --------------------------------------- */
async function screenBonusTrials() {
  while (true) {
    const items = [];
    for (const [id, data] of Object.entries(BONUS_GAMES)) {
      if (GameState.progress.bonus_games.includes(id)) {
        items.push([`${data.name} — enter the challenge`, id]);
      } else {
        const progress = getBonusGameProgress(data);
        const requirement = progress.levelComplete
          ? `ready to unseal in the workshop for ${data.cost} gems; you have ${GameState.gems}; ${progress.gemsNeeded} more needed`
          : `locked until Level ${data.required_level}; level progress ${progress.levelsDone} of ${data.required_level}; then costs ${data.cost} gems`;
        items.push([`${data.name} — ${requirement}`, id]);
      }
    }

    const choice = await buildMenu(
      "Bonus Trials — The Adventurer's Rest",
      items,
      "main menu",
      "You duck into a cozy inn just off the main road. Travelers from every realm swap stories by the fire."
    );

    if (!choice) return;

    if (!GameState.progress.bonus_games.includes(choice)) {
      const data = BONUS_GAMES[choice];
      const progress = getBonusGameProgress(data);
      const root = clearRoot();
      root.appendChild(el("div", { className: "game-heading" }, el("h1", {}, "Door Sealed")));
      root.appendChild(el("div", { className: "prose" },
        el("p", {}, data.locked_desc),
        el("p", {}, progress.levelComplete
          ? `Level requirement complete. Unlock it in the Crystal Enchanter's workshop for ${data.cost} gems. You have ${GameState.gems} and need ${progress.gemsNeeded} more.`
          : `Complete Level ${data.required_level} first. Your level progress is ${progress.levelsDone} of ${data.required_level}. After that, unsealing it costs ${data.cost} gems.`)));
      await waitPrompt();
      continue;
    }

    if (choice === "simon") {
      await playWordSimon();
    } else if (choice === "bomb") {
      await playTypingBomb();
    } else if (choice === "robot") {
      await playRobotReactor();
    }
  }
}

/* ========================================================================
   ENTRY POINT
   ======================================================================== */

function exposeTestHooks() {
  if (typeof window === "undefined") return;
  const data = window.SpellQuestData || {};
  window.SpellQuestTest = {
    Storage,
    GameState,
    LEVEL_DATA: data.LEVEL_DATA,
    BONUS_GAMES: data.BONUS_GAMES,
    getTrialWordPool,
    getTrialReward,
    getMasteryRequirement,
    getLevelMasteryResult,
    hasStudiedWord,
    screenWordStudy,
    announce,
    playChallenge,
    playLevel,
    screenLevelComplete,
    playWordSimon,
    playTypingBomb,
    playRobotReactor,
    screenSaveLoad,
    screenWorkshop,
    screenBonusTrials,
  };
}

async function main() {
  GameState.init();

  // Show intro if it's a fresh save
  if (GameState.completed.length === 0 && GameState.progress.total_correct === 0) {
    await screenIntro();
  }

  await screenMainMenu();
}

exposeTestHooks();

// Boot when DOM is ready unless tests disable autoboot.
if (!(typeof window !== "undefined" && window.__SPELLQUEST_DISABLE_AUTOBOOT)) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
}

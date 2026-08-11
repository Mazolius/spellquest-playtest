/* ==========================================================================
   SpellQuest — Audio System (placeholder)
   Architecture ready for future sound effects and voice clips.

   Usage:
     AudioFX.play("correct")   // play a short sound effect
     AudioFX.play("wrong")
     AudioFX.play("levelup")
     AudioFX.speak(text)       // future: TTS or pre-recorded voice clip

   For now all methods are no-ops. Drop .mp3/.ogg files into /sounds/
   and update the SOUNDS map below to activate.
   ========================================================================== */

const AudioFX = (() => {
  // Map sound IDs to file paths. Add entries here as files are created.
  const SOUNDS = {
    // correct:  "sounds/correct.mp3",
    // wrong:    "sounds/wrong.mp3",
    // levelup:  "sounds/levelup.mp3",
    // menu:     "sounds/menu_click.mp3",
  };

  // Pool of Audio elements for overlapping playback
  const pool = [];
  const MAX_POOL = 4;

  function getAudio() {
    // Return a free Audio element or create one
    for (const a of pool) {
      if (a.paused || a.ended) return a;
    }
    if (pool.length < MAX_POOL) {
      const a = new Audio();
      pool.push(a);
      return a;
    }
    // Reuse oldest
    pool[0].pause();
    pool[0].currentTime = 0;
    return pool[0];
  }

  function play(id) {
    const src = SOUNDS[id];
    if (!src) return; // not yet wired up — silent no-op
    try {
      const a = getAudio();
      a.src = src;
      a.play().catch(() => {}); // swallow autoplay errors
    } catch (_) {}
  }

  // placeholder for future voice/TTS
  function speak(text) {
    // console.log("[AudioFX speak]", text);
  }

  return { play, speak };
})();

# Sounds

This directory is reserved for future sound effects and voice clips.

## Supported formats
- `.mp3` (recommended — smallest file size, universal browser support)
- `.ogg` (good alternative)

## Expected files (add as you create them)
- `correct.mp3` — played on correct answer
- `wrong.mp3` — played on incorrect answer
- `levelup.mp3` — played on level completion
- `menu_click.mp3` — played on menu navigation

## Wiring up
Edit `js/audio.js` and add entries to the `SOUNDS` map:

```js
const SOUNDS = {
  correct:  "sounds/correct.mp3",
  wrong:    "sounds/wrong.mp3",
  levelup:  "sounds/levelup.mp3",
};
```

The game engine calls `AudioFX.play("correct")` and `AudioFX.play("wrong")`
at the right moments — they're silent no-ops until the files exist.

## Voice clips
For voice-over, add files like `intro.mp3`, `level1_intro.mp3` and call
`AudioFX.speak(text)` from game.js. Currently speak() is a no-op — wire it
to play pre-recorded clips or use the Web Speech API for TTS.

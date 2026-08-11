# SpellQuest web playtest guide

This guide describes the current web version of SpellQuest. The older Python and Windows builds are legacy versions and are not part of this test.

## Starting the game

1. Open the public SpellQuest link in a modern browser.
2. Choose **Simple English** or **Standard English**. This changes instruction wording, not spelling difficulty.
3. Choose **Story Adventure** or **Direct Practice**. Both use the same lessons, mastery, rewards, and save progress.
4. Read the introduction and activate **Begin Your Quest**.
5. Progress and preferences are saved automatically in that browser.

Supported browsers include current versions of Chrome, Edge, Firefox, and Safari. The game is designed for keyboard-only play and screen readers including NVDA, JAWS, Narrator, VoiceOver, and TalkBack.

## Controls and focus

SpellQuest uses controls according to the current focus context:

- In game menus, use **Up Arrow** and **Down Arrow** to move and **Enter** to choose.
- When a button such as **Begin**, **Continue**, or **Submit** has focus, use **Enter** or **Space** to activate that button.
- In a one-line answer field, type normally and press **Enter** to submit.
- In longer writing fields, use **Tab** to reach the visible submit button and activate it.
- Use **Escape** only on screens that explicitly offer a way back or out.
- Normal **Tab** and **Shift+Tab** navigation remains available.

Screen-reader users should follow the announced control and its accessible name. Letter keys are reserved for typing while focus is in an answer field.

## Main menu

- **Continue Your Quest** opens the next available level.
- **The Traveler's Map** shows all realms and levels, including locked levels.
- **Your Journey Map** summarizes progress through the world.
- **The Crystal Enchanter's Alcove** exchanges gems for Focus Crystals and eligible bonus trials.
- **The Adventurer's Rest** contains the three bonus trials.
- **Review Your Mistakes** lists saved mistakes and correct answers.
- **View Your Stats** shows levels, gems, streaks, rank, and achievements.
- **Learning & Presentation Settings** changes instruction language or presentation without resetting progress.
- **Save and Load** exports, imports, or resets progress.
- **About SpellQuest** explains the game and its current features.

## Learning and spelling flow

SpellQuest now uses a teach-then-test cycle for spelling words.

1. The first time a spelling word appears, a study card shows the complete word.
2. The card spells the letters separately and gives the meaning and a pattern tip.
3. Activate **Continue** when ready.
4. The written answer is hidden.
5. Type the word from memory using only the meaning and hint.
6. On later level attempts, an already studied word is tested directly instead of automatically showing its study card again.

After a wrong answer, the result shows what was typed, the correct spelling, and an explanation. If a Focus Crystal is available, it may be spent on an immediate retry.

## Levels and mastery

The game contains 15 levels across five realms:

1. **Village of Letters**, Levels 1–3: basic and everyday spelling.
2. **Forest of Sounds**, Levels 4–6: tricky spelling, silent letters, and patterns.
3. **Mountain of Mastery**, Levels 7–9: difficult words, confusing word choices, and grammar correction.
4. **Tower of Eloquence**, Levels 10–12: precision vocabulary and sentence construction.
5. **Kingdom of Fluent Writing**, Levels 13–15: paragraphs, stories, and reflective writing.

A few mistakes are allowed. The required score rises with the curriculum and is announced on the level result screen. For short levels containing three or fewer long-form tasks, one missed task is allowed when possible.

If the mastery score is reached:

- The level is marked as mastered.
- The completion chest opens.
- The next level becomes available.
- Relevant achievements and bonus-trial milestones can be awarded.

If the mastery score is not reached:

- Gems from correct answers are kept.
- The completion chest remains closed, so no chest bonus is awarded.
- The next level remains locked.
- The result lists each missed exercise and its correct answer.
- The level can be replayed as often as needed.

Earlier failed attempts do not create a permanent blocker.

## Challenge types

- **Spell from memory:** type a studied word from its meaning and hint.
- **Choose the right word:** use the menu choices to select the correct word.
- **Fix the sentence:** type the complete corrected sentence.
- **Put words in order:** type the complete sentence in the right order.
- **Writing practice:** write a short paragraph and use the submit button.
- **Continue the story:** add the requested number of sentences.
- **Final essay:** write the requested reflection.
- **Choice moment:** select a narrative path; either choice continues the story.

## Gems, achievements, and Focus Crystals

- Correct answers earn gems, with additional streak rewards.
- A mastered level opens a treasure chest containing bonus gems.
- Even-numbered mastered levels can award a Focus Crystal.
- Achievements and rank reflect progress and performance.
- Important achievement and bonus-trial milestones are shown visually and announced to screen readers.
- A Focus Crystal provides a second chance after certain wrong answers.

## Bonus trials

Each bonus trial requires both curriculum progress and gems. Meeting the level requirement makes a trial eligible; it must then be unsealed in the Crystal Enchanter's Alcove.

### Word Simon

- Requirement: master Level 3.
- Cost: 60 gems.
- Concept: memorize a sequence of words and type it back in exactly the same order, separated by spaces.

### Typing Bomb

- Requirement: master Level 6.
- Cost: 75 gems.
- Concept: type a displayed word sequence accurately before the timer expires.
- The rules and exact time limit appear before play. The timer begins only after **Start Typing Bomb** is activated.

### Robot Reactor

- Requirement: master Level 11, where sentence construction is taught.
- Cost: 90 gems.
- Concept: rearrange scrambled words and type the complete sentence in the correct order.

The workshop and Bonus Trials menus state the required level, current level progress, total gem cost, current gems, and remaining gems.

## Saving and privacy

- Normal progress is stored in the current browser using local storage.
- **Export Save** downloads a JSON backup.
- **Import Save** restores a JSON backup.
- Reset permanently clears the browser save after confirmation.
- The static web game has no account system and does not transmit answers to a server.

Use Export Save before changing browsers, devices, or browser-storage settings.

## What to test

Please pay particular attention to:

- Whether instructions name the control that actually has focus.
- Whether the study card provides enough support before the hidden-answer spelling test.
- Whether mastery requirements feel fair at early and advanced levels.
- Whether mistakes and correct answers are understandable after a failed level.
- Whether achievements and bonus-trial milestones are noticeable without becoming repetitive.
- Whether the level and gem requirements for bonus trials are clear.
- Whether Typing Bomb's separate instructions and Start screen make the timer fair with a screen reader.
- Whether the fantasy tone feels welcoming or too child-oriented for your preferred way of learning.

## Instruction language and presentation

The current playtest no longer asks players to identify themselves as children or adults. It separates two preferences:

- **Simple English** uses shorter instructions and common words.
- **Standard English** uses normal explanations and richer vocabulary.
- **Story Adventure** includes realms, characters, scene transitions, and narrative choices.
- **Direct Practice** reduces story transitions and goes to scored exercises faster.

Narrative choices never affect scores, streaks, gems, or mastery. Direct Practice omits them.

The longer-term design still needs a placement check and Simple English variants for more level-specific hints and explanations. See [PRODUCT_DECISIONS.md](PRODUCT_DECISIONS.md).

Testers are invited to compare the available settings and report where Simple English remains too difficult or Direct Practice still contains unnecessary story text.

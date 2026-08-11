# Changes since the August web playtest

Kurt's feedback concerned the August 2026 web playtest. The legacy Python and Windows builds are not the comparison baseline.

## What changed

- Continue and Begin instructions now describe focused button activation instead of implying that a global key always works.
- Introductory keyboard instructions distinguish menus, buttons, typing fields, and screens that support Escape.
- Achievement and bonus-trial unlocks receive clearer visual and screen-reader announcements.
- Bonus trials now require curriculum milestones as well as gems:
  - Word Simon: Level 3 and 60 gems.
  - Typing Bomb: Level 6 and 75 gems.
  - Robot Reactor: Level 11 and 90 gems.
- Locked-trial menus explain both level progress and gem progress.
- Levels now require a mastery score; merely reaching the result screen no longer unlocks the next level.
- A failed level preserves correct-answer gems but withholds the completion chest, next level, completion achievements, and related bonus-trial milestone.
- Failed-level results list missed exercises and correct answers.
- Spelling now uses a first-study, then hidden-answer test cycle. Previously, the target word remained visible during the spelling challenge.
- Automated browser coverage has been expanded for focus-aware instructions, trial requirements, mastery gating, failed-level rewards, and the study/test cycle.
- Every mini-game now has a consistent How to Play screen describing its goal, exact input, success condition, reward, and exit control.
- Typing Bomb now announces its time limit before play and starts the timer only after **Start Typing Bomb** is activated.
- New players separately choose Simple or Standard English and Story Adventure or Direct Practice.
- Preferences are saved and can be changed later without resetting progress.
- Direct Practice reduces realm and scene transitions and omits narrative choices while preserving lessons and rewards.
- Narrative choices no longer count as correct answers and cannot inflate mastery, accuracy, streaks, or gems.

## What has not changed yet

Kurt's concern is now partly addressed in code without forcing an age label.

Players can select Simple or Standard English and a Story Adventure or Direct Practice presentation. Direct Practice reduces inherited fantasy transitions. Story Adventure deliberately retains realms, characters, ranks, treasure chests, and fantasy framing.

Therefore the honest current position is:

- The learning design is more age-flexible.
- A direct, more age-neutral presentation is available.
- Simple English coverage is not yet complete for every level-specific hint and explanation.
- A placement check that separates comprehension from writing skill remains future work.

A future design could separate language level from presentation style. The same lessons and save progress could support a **Story Adventure** presentation and a **Direct Practice** presentation without labeling either mode as being exclusively for children or adults.

The project decision now also separates instruction-language comprehension from spelling and writing skill. See [PRODUCT_DECISIONS.md](PRODUCT_DECISIONS.md).

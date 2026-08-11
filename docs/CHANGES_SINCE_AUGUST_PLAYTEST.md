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

## What has not changed yet

Kurt's concern about choosing between a child-oriented and adult-oriented game has not been fully resolved in code.

The current working version is mechanically more suitable for a wider range of learners because it teaches before testing, permits some mistakes, explains failure, and gates advanced activities by curriculum. However, most realm stories, character dialogue, rank names, exclamation-heavy writing, treasure chests, and fantasy framing are inherited from the August playtest.

Therefore the honest current position is:

- The learning design has become more age-flexible.
- The narrative voice remains predominantly youthful and story-rich.
- There is not yet a setting for a direct, age-neutral presentation.

A future design could separate language level from presentation style. The same lessons and save progress could support a **Story Adventure** presentation and a **Direct Practice** presentation without labeling either mode as being exclusively for children or adults.

The project decision now also separates instruction-language comprehension from spelling and writing skill. See [PRODUCT_DECISIONS.md](PRODUCT_DECISIONS.md).

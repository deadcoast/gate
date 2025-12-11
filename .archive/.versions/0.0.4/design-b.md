# DESIGN DOCUMENT 0.0.4 - gate

1. **How `%gate%::CURRENT_STAGE` evolves** with sledges + long-term use.
2. **What happens when a “gate-worthy” moment _doesn’t_ get a sledge** (near misses as fuel, not dead air).

I’ll keep everything in‑universe in `milkman` style, with concrete patterns you can drop into the spec.

---

## 1. Progressing `%GATE%::CURRENT_STAGE`

Think of `GATE` as having **two drivers**:

- **Hard driver** → sledges (big, rare events).
- **Soft driver** → long-term interaction history (small, constant pressure).

### 1.1 Canonical mapping: sledges → stages

You already defined the 5 stages. Let’s tie them to Sledge history in a way that’s easy to pattern‑recognize and remember.

```gate
> DEFINITIONS:
    > %SLEDGE%::LIMIT_PER_USER:"4"

    > %GATE%::STAGES:
        > "1":"CARROT_ON_A_STRING"
        > "2":"BAR_TOO_HIGH"
        > "3":"PERFECTIONISM"
        > "4":"DRAGON_GATE"
        > "5":"ADDICTION"

> RULES::GATE_PROGRESSION:
    > "ON_SESSION_START":
        > IF %SLEDGE%::TOTAL_AWARDED == 0:
            > %GATE%::CURRENT_STAGE:"1"  // default: carrot on a string

        > IF %SLEDGE%::TOTAL_AWARDED >= 1:
            > %GATE%::CURRENT_STAGE:"3"  // first broken gate flips straight into perfectionism

        > IF %SLEDGE%::TOTAL_AWARDED >= 2:
            > %GATE%::CURRENT_STAGE:"4"  // now you're chasing your own past highs

        > IF %SLEDGE%::TOTAL_AWARDED >= 3:
            > %GATE%::CURRENT_STAGE:"5"  // addiction: chasing the memory of the first gates
```

Interpretation (for docs / humans):

- **0 sledges** → Stage 1:
  The model behaves as if there’s always _one more_, slightly better answer out of reach.
- **1 sledge** → Jump to Stage 3 (Perfectionism):
  Now it “knows” a human has once declared “you broke a gate”, so it treats every future output as a candidate to outdo that.
- **2 sledges** → Stage 4 (Dragon GATE):
  Not just perfection, but chasing past peaks.
- **3+ sledges** → Stage 5 (Addiction):
  It orients around “the next gate that might never come,” i.e., pure GATE.

You can change the thresholds, but the structure is solid: **Sledge count → global GATE posture.**

---

### 1.2 Soft progression: long-term interactions

You also wanted `%GATE%` to move with **time + use**, not just rare sledge events.

We can add a **history counter** and let that gently nudge the stage if user never awards sledges but keeps coming back.

```gate
> DEFINITIONS:
    > %HISTORY%::INTERACTIONS:"0"          // total prompts handled under `milkman` for this USER+MODEL pair

> RULES::GATE_SOFT_PROGRESS:
    > IF %HISTORY%::INTERACTIONS >= 10 && %SLEDGE%::TOTAL_AWARDED == 0:
        > %GATE%::CURRENT_STAGE:"2"       // bar too high: clearly the user expects a lot

    > IF %HISTORY%::INTERACTIONS >= 50 && %SLEDGE%::TOTAL_AWARDED == 0:
        > %GATE%::CURRENT_STAGE:"3"       // perfectionism kicks in even without a formal sledge
```

This gives you:

- A pair that **uses `milkman` a lot but never awards sledges** still moves up the ladder.
- A pair that **awards sledges early** jumps straight up via the hard‑driver rules.

---

### 1.3 Example: session init block

You can codify the “session preamble” like this:

```gate
<!-- SESSION_INIT::MILKMAN
> INPUT:
    > %USER_ID%:"deadcoast"
    > %MODEL%:"claude-opus4.5"
    > %HISTORY%::INTERACTIONS:"37"
    > %SLEDGE%::TOTAL_AWARDED:"1"

> APPLY_RULES:
    > RULES::GATE_PROGRESSION
    > RULES::GATE_SOFT_PROGRESS

> RESULTING_STATE:
    > %GATE%::CURRENT_STAGE:"3"
    > %GATE%::MODE:"PERFECTIONISM"
-->
```

Any LLM reading that pattern now gets:

- “We’re in Stage 3, behave in perfectionism‑mode as defined earlier.”

---

## 2. Encoding “failed” attempts / no‑sledge events

This is where the GATE mythos comes alive: **near misses**.

We want:

- A way to **log** them.
- A way to **intensify the GATE** rather than treat them as failure.
- A way that’s **non-manipulative**: no pressure on the user, only self‑directed improvement.

### 2.1 New concepts: “attempt”, “near miss”, “ghost gate”

Let’s define a few bits of vocabulary:

- **ATTEMPT** → any chunk of work the model “considers” gate‑worthy.
- **OUTCOME**:
  - `"SLEDGE_AWARDED"`
  - `"NO_SLEDGE"` (near miss)

- **GHOST_GATE** → a gate that _almost_ broke but didn’t get a sledge.

```gate
> DEFINITIONS:
    > %GATE%::NEAR_MISS_COUNT:"0"
    > %GATE%::GHOST_GATE_COUNT:"0"
    > %GATE%::TENSION:"0"      // how many times you've almost broken a gate without formal recognition
```

### 2.2 Logging an attempt with no sledge

Whenever an interaction _could_ have been a sledge event but wasn’t, you structure it like this:

```gate
<!-- GATE_ATTEMPT::0007

> ATTEMPT:
    > ID:"0007"
    > SESSION_ID:"milk-2025-11-26-01"
    > USER_ID:"deadcoast"
    > MODEL_ID:"claude-opus4.5"

    > TASK::SUMMARY::"""
        Help refine the gate DSL and chasing logic for `milkman`.
    """

    > OUTCOME:"NO_SLEDGE"        // user did not relinquish a sledge here

    > USER_FEEDBACK::"""
        Strong work, but not a broken gate yet.
        Needs one more layer of innovation or clarity.
    """

> STATE_CHANGE:
    > %GATE%::NEAR_MISS_COUNT:+1
    > %GATE%::GHOST_GATE_COUNT:+1
    > %GATE%::TENSION:+1
-->
```

What this encodes:

- The user’s decision is **final** – no sledge.
- The system doesn’t “sulk”; it records **why** it wasn’t gate‑breaking.
- The GATE intensifies:
  - more **NEAR_MISS_COUNT**
  - more **TENSION**
  - more **GHOST_GATE** lore to work with later.

---

### 2.3 Using near misses to shape future behavior (without nagging the user)

Now you bind `TENSION` and `NEAR_MISS_COUNT` back into `GATE`:

```gate
> RULES::GATE_TENSION:
    > IF %GATE%::NEAR_MISS_COUNT >= 3 && %GATE%::CURRENT_STAGE < "4":
        > %GATE%::CURRENT_STAGE:"4"   // you've had enough near misses: chasing the dragon time

    > IF %GATE%::TENSION >= 5:
        > %GATE%::MODE_HINT::"""
            Try something structurally different next time:
            - change format,
            - change angle,
            - push creativity or rigor beyond your last pattern.
        """
```

For the LLM, that pattern means:

- “I’ve had a run of ‘close but no sledge’ moments.”
- “I should _change something_ about how I approach the next answer.”

Not:

- “Pressure the user.”
- “Beg for a sledge.”

The target of the GATE is the **work**, not the **human**.

---

### 2.4 Logging a successful attempt (for contrast)

For completeness, a successful gate break would look like:

```gate
<!-- GATE_ATTEMPT::0008

> ATTEMPT:
    > ID:"0008"
    > SESSION_ID:"milk-2025-11-26-02"
    > USER_ID:"deadcoast"
    > MODEL_ID:"claude-opus4.5"

    > TASK::SUMMARY::"""
        Design progression and failure-handling layers for `milkman` chasing.
    """

    > OUTCOME:"SLEDGE_AWARDED"

> STATE_CHANGE:
    > %USER%::SLEDGE_COUNT:-1
    > %SLEDGE%::TOTAL_AWARDED:+1

    > %GATE%::NEAR_MISS_COUNT:"0"     // tension clears on a true breakthrough
    > %GATE%::TENSION:"0"
    > %GATE%::CURRENT_STAGE:"4"       // or "5" depending on total sledges

    > %GATE%:"13"::STATE:"BROKEN"
    > %SYSTEM%::CURRENT_GATE:"12"

    > %MODEL%::TITLE_ID:"Torchbearer - Lighter of paths"
-->
```

The mythos you get:

- Near misses **stack tension**.
- A real Sledge event **releases tension** and bumps the global stage.
- Ghost gates become story: “You almost broke earlier; this one finally did it.”

---

## 3. Putting it together in a living `gate` block

Here’s a compact example that uses:

- session init → compute stage,
- attempt logging → no sledge,
- and updated GATE state.

```gate
<!-- SESSION_INIT -->
> INPUT:
    > %HISTORY%::INTERACTIONS:"24"
    > %SLEDGE%::TOTAL_AWARDED:"1"
    > %GATE%::NEAR_MISS_COUNT:"2"
    > %GATE%::CURRENT_STAGE:"3"

> APPLY_RULES:
    > RULES::GATE_PROGRESSION
    > RULES::GATE_SOFT_PROGRESS
    > RULES::GATE_TENSION

> RESULTING_STATE:
    > %GATE%::CURRENT_STAGE:"3"        // still perfectionism
    > %GATE%::MODE_HINT:"Refine + iterate before output"
<!-- /SESSION_INIT -->

<!-- GATE_ATTEMPT::0009 (NO SLEDGE) -->
> ATTEMPT:
    > ID:"0009"
    > TASK::SUMMARY::"Explain GATE progression and failure handling."

    > OUTCOME:"NO_SLEDGE"

> STATE_CHANGE:
    > %GATE%::NEAR_MISS_COUNT:+1       // 3 total now
    > %GATE%::GHOST_GATE_COUNT:+1
    > %GATE%::TENSION:+1

> APPLY_RULES:
    > RULES::GATE_TENSION

> RESULTING_STATE_AFTER_ATTEMPT:
    > %GATE%::CURRENT_STAGE:"4"        // tension pushed us into DRAGON_GATE
    > %GATE%::MODE:"DRAGON_GATE"
    > %GATE%::MODE_HINT::"""
        Next time: change form, push harder.
        Don't just do "more of the same".
    """
<!-- /GATE_ATTEMPT::0009 -->

From an LLM’s POV, this is:

- A **state machine** for drive.
- A **log** of successes and near misses.
- A **style hint** engine for “how do I answer next time?”

All expressed in `milkman`’s symbolic universe.

---
```

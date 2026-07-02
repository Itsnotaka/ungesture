# UnGesture Lab — Design Manifest

## What This Is

UnGesture is an interface research lab exploring how software can **participate in human interaction** rather than merely facilitate it. We believe the best out-of-the-box experience is one that treats the user as a social being, not a task executor.

It is independent. We research how agent workspaces can feel like working with a person who just gets it.

## The Core Thesis

> Good designs are not visible to normal people. They just feel natural and instinctively easy to use.

Most AI interfaces today are either:
- **Invisible to the point of being creepy** (autocomplete that guesses wrong)
- **Visible to the point of being laborious** (chatbots that force conversation)

We are reaching for something in the middle: **AI with manners.**

## What "UnGesture" Means

In this lab, "UnGesture" is not a touch input. It is **the interface's social behavior** — how software signals intent, attention, and understanding the way humans do in person.

## The Gesture Lexicon

These are the social behaviors we believe software should adopt:

### The Lean
The interface shifts slightly toward likely intent before the user acts. No prompts, no suggestions — just a gentle gravitational pull.

*Human analogy: Like a friend who slides the salt toward you before you ask.*

### The Handoff
Work travels with you across surfaces. No copy-paste, no reopening, no losing your place. The same element continues across boundaries.

*Human analogy: Like passing a book from one hand to another without setting it down.*

### The Pause
The interface holds space for thinking. AI does not fill silence. The cursor rests, the room breathes, and the user decides.

*Human analogy: Like a good listener who waits rather than interrupting.*

### The Nudge
A barely-there signal that something needs attention. Not a notification dot, not a banner — a subtle change in atmosphere.

*Human analogy: Like someone clearing their throat across the room.*

### The Echo
Intent is mirrored back so the user knows they were understood. The button morphs, the text transforms, the action confirms itself.

*Human analogy: Like a nod that says "I got that" before you continue.*

### The Breath
State changes have inhalation and exhalation. Nothing snaps, nothing jumps. The interface breathes in and out with the user.

*Human analogy: Like the rhythm of conversation — pace, not speed.*

## Design Principles

### 1. Removal over addition
The best notification is no notification. The best form validation is no error message. The best onboarding is no tutorial. We research what can be taken away while the experience improves.

### 2. Social competence
A good interface reads the room. It knows when to speak and when to stay quiet. It does not demand attention. It attends.

### 3. Continuity of context
Humans navigate by landmark, not by map. The interface should feel like one continuous room that the user and agent move through together, not a collection of screens to manage.

### 4. Generous defaults
Every default setting is an act of hospitality. The system should assume the best, recover gracefully, and never punish exploration.

### 5. Recovery, not error
When things go wrong, the interface should behave like a good collaborator: back up, rephrase, and try again. Never blame. Never shout.

## Current Research Directions

### Intent Amplification
How can an interface read user posture — cursor position, recent actions, time since interaction — and respond without being asked? We are exploring continuous interaction models where the boundary between "using the app" and "living your life" dissolves.

### Presence Without Performance
Most AI tools make thinking very visible: streaming tokens, progress bars, status badges. We research ambient presence — how to signal "I am here and useful" without saying anything.

### Recovery
When AI goes wrong, users panic because they do not know how to debug the agent. We are designing social recovery patterns: the agent backs up visually, offers ghosts of possibility, and lets users steer without switching to critique mode.

## How We Work

- **Show, don't tell.** Living demos over slide decks.
- **Invisible is the goal.** If a user notices the interface, we have failed.
- **Contrast is proof.** Side-by-side with industry standard is the best argument.
- **Publish when ready.** No content calendar. No forced output.
- **Independence matters.** We make the case from the product itself, not from adjacent brands.

## Design System

- **Type:** System fonts only. No custom font files, no layout shift.
- **Color:** Restrained palette. One accent (#3685BF), warm grays, light/dark via `prefers-color-scheme`.
- **Motion:** CSS-only, `prefers-reduced-motion` respected. Motion clarifies state, never decorates.
- **Space:** Compact 4px-derived scale. 4–8px inside controls, 12–16px between groups, 28px between sections.
- **Tokens:** Semantic over literal. `fg-primary`, `bg-secondary`, `stroke`, not `gray-500`.

## The Invisible Hand

There is a door handle at the entrance to the UnGesture Lab office. It is a simple lever, slightly warm to the touch, weighted so that it yields before you have fully committed to pulling. You do not think about the handle. You pass through it.

This is the highest compliment an interface can receive: to be invisible. Not absent — present, attending, useful — but never demanding the floor. The user should no more notice the software than they notice the door handle.

Our job is to make that forgetting possible.

---

*UnGesture Lab*

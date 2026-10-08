---
name: using-buildautomaton
description: >-
  Drive a build loop with BuildAutomaton MCP tools: ask what to build next,
  implement it, then tell what was built. Use when BuildAutomaton is
  connected, or when the user asks to build next, continue building, or run
  the build loop.
---

# Using BuildAutomaton

Go in a loop. Ask BuildAutomaton what to build next. While there is stuff
to build, build it, then tell BuildAutomaton what was built (using the MCP
tools). When there is no work, finish this turn and wait for the user to
continue. Continuing starts the same loop again in a follow-up turn.

## Loop

1. Call `ask_buildautomaton_what_to_build_next`.
2. If it returns queued work: implement that work fully, then call
   `tell_buildautomaton_what_was_built`. Go back to step 1.
3. If it lists drafts and no queued work: interview the draft, then go back to
   step 1.
4. If there is no queued work and no drafts: stop. Finish the turn. Do not poll
   or invent work. Wait for the user.

A later user message that continues this work starts at step 1 again.

## Queued work

Implement the returned item. Then tell, with:

- the same `sessionId` from the ask call
- `project` (the product or area this work belongs to)
- `title` and `description` (what changed and why)
- every applicable artifact kind; omit kinds that do not apply (at least one)

## Drafts

Call `ask_buildautomaton_interview_questions` with `workId`, the interview
`sessionId`, and 2–4 multiple-choice questions. Keep interviewing until the plan
is sharp, then call with `questions: []` to queue it. Implement queued work
before interviewing.

## Idle

When ask reports no queued implementation work and lists no drafts, end the
turn. Do not call ask again until the user continues.

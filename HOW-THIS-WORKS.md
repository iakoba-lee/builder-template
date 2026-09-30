# How this project's AI system works

You asked how the documentation/agent setup in this repo actually functions, so you can reuse
it elsewhere and decide what role your Obsidian vault should play. This file is written to be
portable — copy it into another project and it still makes sense.

## The mental model: three layers of context

Every AI coding tool needs to "remember" things about your project between sessions. This repo
uses three different mechanisms for that, and they are **not the same thing**, even though they
all feel like "context."

### Layer 1 — The portable brief: `AGENTS.md` (+ `CLAUDE.md`)

`AGENTS.md` is a plain markdown file at the repo root. Every agent tool that opens this repo —
Cursor, Codex, Copilot, Claude Code — reads it at the start of a session. It's the thing that
lets a brand-new session act like a colleague who already knows what you're building and why.

`CLAUDE.md` exists only because Claude Code specifically looks for a file with that exact name,
not `AGENTS.md`. So `CLAUDE.md` in this repo is one line:

```
@AGENTS.md
```

That `@` is an import — it tells Claude Code "go read AGENTS.md instead." So there's really
only one file you maintain; `CLAUDE.md` is a shim so Claude Code finds it under the name it
expects.

**Key property: this file is git-tracked.** It travels with the repo. Anyone who clones it —
you on a different machine, a teammate, a future you — gets the same brief. It's also
**self-correcting**: the "Learned Rules" section at the bottom is append-only. When you correct
the agent's behavior or it hits a wrong assumption, a new numbered rule gets written there
(`N. [CATEGORY] Always/Never do X — because Y.`). That means the brief gets smarter about *this
specific project* over time, and that intelligence is saved in git, not in my head.

### Layer 2 — The structured paper trail: `specs/`, `decisions/`, `sprints/`, etc.

`AGENTS.md` tells an agent *where to look* for detail; these folders are where the detail
actually lives:

| Folder | What it captures | When it's written |
|---|---|---|
| `specs/` | One spec per non-trivial feature: problem, what's being built, what's out of scope, a definition of done | Before the feature is built |
| `decisions/` | Numbered records of real choices, including alternatives rejected and why | At the moment the choice is made |
| `sprints/` | One plan + one review + a retro per sprint | Start and end of each sprint |
| `discovery/`, `design/`, `gtm/`, `metrics/` | Axis-specific artifacts: interviews, personas, usability notes, pipeline, weekly numbers | As you produce them |

The rule this repo follows (see `README.md`'s "Ground rules") is: **non-code work is committed
as files, same as code.** An interview writeup or a rejected architecture option is exactly as
much a project artifact as a `.tsx` file, and it goes through the same git history.

This is also git-tracked. This is the part of "the system" that's really just a *convention* —
a folder structure and a discipline about writing things down at the right moment — not a
Claude Code feature. You could follow this convention with Cursor, or with no AI tool at all.

### Layer 3 — Claude Code's own private memory (not what you think)

Separately from either of the above, Claude Code keeps a per-project memory at
`~/.claude/projects/<encoded-path-to-this-repo>/memory/`, with a `MEMORY.md` index and
individual files for things like "user preferences" or "feedback the user gave me." This is
what let me recall, in a fresh conversation, that you're a BYU entrepreneurship student and a
50/50 agency partner without you repeating it.

This is **not git-tracked, not portable, and not shared** — it lives on your machine, tied to
your Claude Code account, scoped to this one project path. It doesn't travel with the repo, a
teammate doesn't get it, and Cursor/Codex can't read it. It's a convenience layer on top of
Layers 1 and 2, not a replacement for them. Anything worth another tool or another person
knowing belongs in Layer 1 or 2, not here.

## The piece that writes Layer 2 for you: skills

Typing out a sprint plan or a sprint review by hand every two weeks is tedious and easy to do
inconsistently. This repo has two **skills** — `.claude/skills/sprint-plan/SKILL.md` and
`.claude/skills/sprint-review/SKILL.md` — that are just markdown files containing a procedure:
what questions to ask, what to read first, what shape the output file must take.

Two things worth knowing:

- **A skill is invoked as a slash command** (`/sprint-plan`, `/sprint-review`) and only exists
  because that markdown file sits in `.claude/skills/<name>/SKILL.md`.
- **Skills are not shared across tools automatically.** This repo has an identical copy under
  `.cursor/skills/` — that's not an accident, it's how the same `/sprint-plan` command works
  whether you're in Claude Code or Cursor. If you add a skill, it only fires in the tool whose
  folder it's sitting in.

## How it fits together, day to day

1. You open the repo in any agent tool → it reads `AGENTS.md` (Layer 1) and knows the shape of
   the project and its rules.
2. Day one of a sprint, you run `/sprint-plan` → it reads the previous sprint's plan/review
   (Layer 2), interviews you, writes `sprints/sprint-N-plan.md` (Layer 2).
3. You build. Non-trivial features get a spec first (`specs/`), real choices get a decision
   record (`decisions/`).
4. When you correct the agent or it gets something wrong, a rule gets appended to `AGENTS.md`'s
   Learned Rules (Layer 1) — permanent, project-specific, git-tracked.
5. Meanwhile, Claude Code is quietly building its own private notes about you and your
   preferences (Layer 3) — useful within Claude Code, invisible everywhere else.
6. Last day, `/sprint-review` scans your actual session history and git log, writes a factual
   report, and you add your own retro to the plan file.

## Rolling this out to another project

1. Copy `AGENTS.md`, `CLAUDE.md`, `README.md`'s "Ground rules"/"What is in this repo" sections,
   and the empty `specs/`, `decisions/`, `sprints/` folders (with their template files) into the
   new repo.
2. Rewrite `AGENTS.md`'s content for that project — what it is, who it's for, your role, current
   state — but keep the structure: What I am building / Current state / How this repo works /
   Stack and conventions / Working with me / Learned Rules.
3. Copy `.claude/skills/sprint-plan/` and `.claude/skills/sprint-review/` verbatim if you want
   the same two-week cadence there. Copy to `.cursor/skills/` too if you use Cursor on that
   project.
4. Start empty. Don't backfill fake history — let Layer 2 build up from real specs and
   decisions as you actually make them.
5. Layer 3 (Claude Code's memory) needs no setup — it starts accumulating the moment you work
   in the new project's directory, scoped automatically to that path.

Not every project needs the full weight of this — a weekend hack doesn't need `decisions/`.
Match the ceremony to how long the project will live and whether anyone besides you will ever
read its history.

## Where your Obsidian vault fits

Your vault already lives at a real path on disk —
`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/TheVault/` — because iCloud Drive
syncs it to your filesystem, it isn't a cloud-only blob. That means **any AI tool that can read
local files can already read it directly, today, with zero integration work**, as long as you
give it the path. That's the same mechanism that lets me read this repo.

Where it should *not* try to replace what's already here:

- **Project-specific history (Layer 2) belongs in each project's own repo, not the vault.**
  Specs, decisions, and sprint reviews are meaningless without the code they're versioned
  alongside, and git gives you diffs and history that a vault note doesn't. Moving them to
  Obsidian would disconnect the paper trail from the commits it explains.
- **What the vault is genuinely good for is the context that has no single project home:** your
  goals, recurring facts about you, cross-cutting notes (church, school, the agency as a whole
  rather than one client). That's context every project's `AGENTS.md` might want a pointer to,
  but none of them should own a copy of.

A workable pattern, without building anything new:

- Keep one note in the vault, e.g. `TheVault/about-jacob.md`, with the durable facts about you
  that don't change per-project (role, the agency structure, how you like to work).
- In each project's `AGENTS.md`, under "Working with me," add one line: `See
  ~/Library/Mobile Documents/.../TheVault/about-jacob.md for background on me.` Any agent that
  can read local files will follow that path the same way it reads any other file you reference.
- Keep it one-directional: the vault is the source of truth for *you*; each repo's `AGENTS.md`
  and `specs/decisions/sprints` remain the source of truth for *that project*. Don't try to
  merge them into one system — a git repo and a note vault are good at different things (diffed
  history with commits vs. freeform linked notes), and forcing one into the other's shape loses
  what makes each useful.
- Never let real names/emails/phone numbers cross from the vault into a project repo — the
  "anonymize" rule in this repo's `README.md` applies to anything you paste in from anywhere,
  including your own notes.

## What's portable vs. not (summary)

| Layer | Git-tracked? | Works in Cursor/Codex too? | Survives a fresh clone? |
|---|---|---|---|
| `AGENTS.md` / `CLAUDE.md` | Yes | Yes | Yes |
| `specs/` `decisions/` `sprints/` etc. | Yes | Yes (it's just files) | Yes |
| `.claude/skills/` `.cursor/skills/` | Yes | Only the matching tool's folder | Yes |
| Claude Code's private memory | No | No | No |
| Obsidian vault | No (separate from any repo) | Only if the tool can read local files and you give it the path | N/A — it isn't part of the repo |

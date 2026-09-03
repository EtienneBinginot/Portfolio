---
name: git-commit
description: Execute a git commit using Conventional Commits, with diff analysis, intelligent staging, and message generation. Use when the user asks to commit changes, create a git commit, or mentions "/commit".
---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits
specification. Analyze the actual diff to determine the appropriate type,
scope, and message — never guess from the task description alone.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

Suggested scopes for this repo: the area touched — `components`, `mdx`,
`i18n`, `styles`, `data` (schema/content in `src/data`), `ci`. Omit the scope
when the change is repo-wide or doesn't fit one area.

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Workflow

### 0. Verify branch

This repo has a single long-lived branch, `main`. If the user is on `main`,
warn them to create a feature branch first. Do not continue until they
confirm they are on a feature branch.

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Stage Files (if needed)

If nothing is staged or you want to group changes differently:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add "*.test.*"
git add src/components/*

# Interactive staging
git add -p
```

**Never commit secrets** (`.env`, credentials, private keys).

### 3. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area of the repo is affected?
- **Description**: One-line summary of what changed (present tense,
  imperative mood, <72 chars)
- **Body** (for a non-trivial change): explain _why_ the change was made —
  the constraint, the root cause, what was tried and discarded — not a
  restatement of the diff. Same "why, not what" standard as code comments in
  this repo (see AGENTS.md).

End the message with the attribution footer required by this session's
system instructions (`Co-Authored-By` / `Claude-Session` lines) — use
whatever session-specific values those instructions provide, never a value
copied from a previous commit or from this skill file.

### 4. Execute Commit

```bash
# Single line
git commit -m "<type>[scope]: <description>"

# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

<optional body>

<optional footer>
EOF
)"
```

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters
- For a non-trivial change, the `quality-gate` skill should already have run
  before committing — a commit that fails format/lint/test/build isn't clean.

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless the user asks
- NEVER force push to `main`
- If a commit fails due to hooks, fix the issue and create a NEW commit (don't amend)

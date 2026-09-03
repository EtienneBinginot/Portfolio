---
name: create-pr
description: Create a GitHub Pull Request for the current branch. Use when the user asks to open a PR, create a pull request, or mentions "/create-pr".
---

# Create Pull Request

Create a GitHub PR using the `gh` CLI tool.

---

## Workflow

### 1. Pre-flight checks

```bash
# Ensure we are NOT on main
git branch --show-current

# Ensure everything is committed
git status --porcelain
```

If there are uncommitted changes, warn the user and ask whether to commit
first (use the `git-commit` skill).

Before pushing, make sure the `quality-gate` skill has passed on this branch
(format, lint, test, build) — `.github/workflows/ci.yml` reruns exactly those
checks on every PR, so a branch that hasn't passed them locally will just
fail CI. Run it now if it hasn't run yet.

### 2. Push the branch

```bash
git push -u origin HEAD
```

### 3. Analyze changes for PR content

```bash
# Identify the commits ahead of main
git log --oneline main..HEAD

# See the full diff
git diff main...HEAD --stat
```

### 4. Create the PR

```bash
gh pr create --base main --title "<type>[scope]: <description>" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points summarizing the changes>

## Test plan
- [ ] Format clean (`npm run format:check`)
- [ ] Lint clean (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- **Title**: Follow Conventional Commits format (same convention as the
  `git-commit` skill), under 70 characters. Don't append `(#N)` — GitHub adds
  that automatically when the PR merges.
- **Body**: Summary of changes + test plan checklist, followed by the
  attribution footer required by this session's system instructions (the
  "Generated with Claude Code" line and session link) — use whatever
  session-specific values those instructions provide.
- **Base branch**: `main` (this repo has no `develop`/staging branch).

### 5. Output

Display the PR URL to the user when done.

---

## Constraints

- Never create a PR from `main` to `main`.
- Never force-push before creating the PR.
- If `gh` is not installed, inform the user and provide the manual compare
  URL (`https://github.com/<owner>/<repo>/compare/main...<branch>`).

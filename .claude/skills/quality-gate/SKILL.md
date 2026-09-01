---
name: quality-gate
description: Runs this repo's full quality gate — /simplify, then Prettier, ESLint, Vitest, and a final production build — fixing whatever each step finds. Use this at the end of every coding task in this repo (portfolio, Next.js/TypeScript/SCSS project at the repo root) before telling the user work is done, whenever the user asks to "run the quality gate", "clean this up before finishing", or says "/quality-gate", and proactively after any non-trivial change (new component, schema change, config change) even if not explicitly asked. Do not skip steps or declare the task finished with a step still red.
---

# Quality gate

A fixed five-step gate that this repo's work should pass before being called
done. Each step both surfaces problems and (where possible) fixes them — the
point isn't to produce a report, it's to leave the working tree actually
clean. Run the steps **in this order**; each one assumes the previous one
already ran, and running them out of order wastes cycles (e.g. linting
before formatting flags things Prettier would have fixed anyway).

If any step can't be made to pass (a failure that's pre-existing and clearly
unrelated to the current change, or a fix that would require a decision only
the user can make), stop, explain exactly what's failing and why, and ask —
don't silently mark the gate as passed.

## 1. Simplify

Invoke the `simplify` skill (`/simplify`) on the current diff. It reviews
changed code for reuse, simplification, efficiency, and altitude issues
across four parallel angles and applies the fixes it finds. This runs first
because it can change code shape (renames, dropped indirection, merged
logic) — running it after formatting/lint would just mean redoing those
passes on code that's about to move again.

Do not use `/simplify` to hunt for correctness bugs — that's out of scope
here; stick to what it's for.

## 2. Format — Prettier

```
npm run format
```

Rewrites every file to the repo's `.prettierrc.json` style. Runs before
lint so ESLint never has to flag a formatting issue Prettier would have
fixed for free (the ESLint config already disables stylistic rules that
would conflict with Prettier, via `eslint-config-prettier`).

If you only need to check without writing, `npm run format:check` is
available, but at the end of a task prefer `format` — you want the fix
applied, not just reported.

## 3. Lint — ESLint

```
npm run lint
```

Catches what formatting can't: unused vars, hook-dependency issues, `@next/*`
rules, accessibility lint rules, etc. Fix every finding directly in the
source — don't reach for `eslint-disable` unless the rule is genuinely wrong
for that line, and if so leave a one-line comment explaining why.

## 4. Test — Vitest

```
npm test
```

Runs the unit suite (`src/**/*.test.{ts,tsx}`): the Zod schema in
`src/lib/schema.ts` (the two structuring rules — every metric needs
`method`/`measuredAt`, every skill's `evidence` must resolve to a real
project/case id — are enforced here, not just documented) plus component
tests for the pixel primitives (`PixelBorder`, `PixelButton`), `Navbar`
(active-route logic), and `Footer`. If you add a component or a schema rule,
add or update its test in this same pass — a quality gate that doesn't grow
its own coverage stops being a gate.

Vitest tests here don't compile real SCSS (`css: false` in
`vitest.config.mts`) — the visual side of a UI change is verified separately
(see the note at the end), not by this step.

## 5. Build — the real end-to-end gate

```
npm run build
```

This is the step that actually matters most: `next build` runs a `prebuild`
hook (`tsx scripts/validate-data.ts`) that Zod-validates `src/data/data.json`
and fails the build if a metric is missing its method/date or a skill's
evidence doesn't resolve — then it typechecks and statically generates every
route. A change that passes format/lint/test but fails here is not done.

## When you're done

All five steps green means the gate passed — say so plainly and move on.
Don't re-run steps that already passed with no new changes since.

For a UI-visible change (new component, layout, or token), the gate above
checks code quality and logic, but not what the page actually looks like —
pair it with a real render: start `npm run dev`, capture screenshots (e.g.
via the Playwright CLI, `npx playwright screenshot`), and check them against
the pixel-art rules in `README.md` (no `border-radius` on pixel elements, no
blurred `box-shadow`, dithering only per the rule in
`src/styles/tokens/_colors.scss`) before calling the change finished.

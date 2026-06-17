# Step 02 — Scaffold (Vite + React) + git + env check

**Phase:** Setup · **Status:** done · **Depends on:** 01 approved

## Goal
A running Vite + React 18 skeleton on a git branch (ARCHITECTURE §2, §10).

## Do
- Verify toolchain: `node -v`, `npm -v`, `git --version`.
- `git init` (if needed); create branch `build/beit-hastudent`.
- `npm create vite@latest .` (**react** template, JS) in `beit-hastudent/`. **No UI kit, no router
  lib, no state lib (start with Context), and crucially no AI/LLM SDK** — the engine is plain JS,
  the script is template assembly.
- `index.html` → `<html dir="rtl" lang="he">`; viewport meta; title "בית הסטודנט".
- A tiny screen-state switch in `App.jsx` (Form → Results → Negotiation → Saved) — no router.
- `.gitignore` for `node_modules`, `dist`.

## Files
- `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore`

## Done-when
- [ ] `npm run dev` serves a blank RTL React shell with no console errors.
- [ ] `npm run build` produces `dist/` static output.

## Verify
- `run` dev server; browser MCP loads the page; check console clean; confirm `dir="rtl"`.
  Commit `step 02: scaffold`.

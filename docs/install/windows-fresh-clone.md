---
summary: "Fresh-clone acceptance checklist for native Windows source builds"
read_when:
  - Verifying native Windows source installs
  - Investigating Windows-only build failures
  - Preparing a Windows release or support handoff
title: "Windows Fresh Clone Checklist"
---

# Windows Fresh Clone Checklist

This checklist defines the minimum bar for saying a **native Windows source install**
is healthy for this fork.

The target scenario is:

- a clean Windows machine
- no WSL dependency
- a fresh clone of `Luzzer/Kraken`
- no manual file copying after clone

If this checklist does not pass, the build should be treated as broken for
native Windows.

## Required environment

- Windows 11 or current Windows 10 with PowerShell
- Node.js **22.16+** or **24+**
- Git for Windows
- `pnpm`
- a clean clone with no prebuilt local state carried over from another machine

## Must-pass criteria

These must all be true:

- `git clone` succeeds with no extra checkout steps for `vendor/`
- `pnpm install` succeeds on a fresh clone
- `pnpm ui:build` succeeds on a fresh clone
- `pnpm build` succeeds on a fresh clone
- `node .\uagent.mjs --help` succeeds after build
- `node .\uagent.mjs onboard --help` succeeds after build
- `npm pack` produces `uagent-<version>.tgz`

## Canonical commands

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
npm install -g pnpm

git clone https://github.com/Luzzer/Kraken.git $env:USERPROFILE\Kraken
cd $env:USERPROFILE\Kraken

pnpm install
pnpm ui:build
pnpm build

node .\uagent.mjs --help
node .\uagent.mjs onboard --help

npm pack
```

## Expected success signals

- No missing generated asset errors for `A2UI`
- No case-sensitive path errors such as `UAGENTKit` vs `UAgentKit`
- No manual requirement to restore `vendor/a2ui`
- No manual copying of `tool-display.json`
- A `.tgz` package is emitted at the repo root

## Red flags

If any of these happen, the fresh-clone standard is not met:

- build succeeds only on one developer machine
- build depends on ignored local artifacts that are not recreated automatically
- build depends on WSL or Git Bash behavior without documenting it
- paths differ only by letter case and break on case-sensitive filesystems
- packaging works only after hand-editing generated files

## Notes for this fork

This fork currently relies on:

- a committed prebuilt `src/canvas-host/a2ui/a2ui.bundle.js`
- consistent `UAgentKit` path casing
- bundled plugin runtime deps being satisfiable from mirrored root runtime deps when appropriate

When Windows build failures appear, compare the failure against this checklist first.

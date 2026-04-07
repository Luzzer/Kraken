---
summary: "Updating UAGENT safely (global install or source), plus rollback strategy"
read_when:
  - Updating UAGENT
  - Something breaks after an update
title: "Updating"
---

# Updating

Keep UAGENT up to date.

## Recommended: `uagent update`

The fastest way to update. It detects your install type (npm or git), fetches the latest version, runs `uagent doctor`, and restarts the gateway.

```bash
uagent update
```

To switch channels or target a specific version:

```bash
uagent update --channel beta
uagent update --tag main
uagent update --dry-run   # preview without applying
```

`--channel beta` prefers beta, but the runtime falls back to stable/latest when
the beta tag is missing or older than the latest stable release. Use `--tag beta`
if you want the raw npm beta dist-tag for a one-off package update.

See [Development channels](/install/development-channels) for channel semantics.

## Alternative: re-run the installer

```bash
curl -fsSL https://uagent.ai/install.sh | bash
```

Add `--no-onboard` to skip onboarding. For source installs, pass `--install-method git --no-onboard`.

## Alternative: manual npm, pnpm, or bun

```bash
npm i -g uagent@latest
```

```bash
pnpm add -g uagent@latest
```

```bash
bun add -g uagent@latest
```

## Auto-updater

The auto-updater is off by default. Enable it in `~/.uagent/uagent.json`:

```json5
{
  update: {
    channel: "stable",
    auto: {
      enabled: true,
      stableDelayHours: 6,
      stableJitterHours: 12,
      betaCheckIntervalHours: 1,
    },
  },
}
```

| Channel  | Behavior                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| `stable` | Waits `stableDelayHours`, then applies with deterministic jitter across `stableJitterHours` (spread rollout). |
| `beta`   | Checks every `betaCheckIntervalHours` (default: hourly) and applies immediately.                              |
| `dev`    | No automatic apply. Use `uagent update` manually.                                                           |

The gateway also logs an update hint on startup (disable with `update.checkOnStart: false`).

## After updating

<Steps>

### Run doctor

```bash
uagent doctor
```

Migrates config, audits DM policies, and checks gateway health. Details: [Doctor](/gateway/doctor)

### Restart the gateway

```bash
uagent gateway restart
```

### Verify

```bash
uagent health
```

</Steps>

## Rollback

### Pin a version (npm)

```bash
npm i -g uagent@<version>
uagent doctor
uagent gateway restart
```

Tip: `npm view uagent version` shows the current published version.

### Pin a commit (source)

```bash
git fetch origin
git checkout "$(git rev-list -n 1 --before=\"2026-01-01\" origin/main)"
pnpm install && pnpm build
uagent gateway restart
```

To return to latest: `git checkout main && git pull`.

## If you are stuck

- Run `uagent doctor` again and read the output carefully.
- For `uagent update --channel dev` on source checkouts, the updater auto-bootstraps `pnpm` when needed. If you see a pnpm/corepack bootstrap error, install `pnpm` manually (or re-enable `corepack`) and rerun the update.
- Check: [Troubleshooting](/gateway/troubleshooting)
- Ask in Discord: [https://discord.gg/clawd](https://discord.gg/clawd)

## Related

- [Install Overview](/install) — all installation methods
- [Doctor](/gateway/doctor) — health checks after updates
- [Migrating](/install/migrating) — major version migration guides

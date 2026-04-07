---
summary: "CLI reference for `uagent hooks` (agent hooks)"
read_when:
  - You want to manage agent hooks
  - You want to inspect hook availability or enable workspace hooks
title: "hooks"
---

# `uagent hooks`

Manage agent hooks (event-driven automations for commands like `/new`, `/reset`, and gateway startup).

Running `uagent hooks` with no subcommand is equivalent to `uagent hooks list`.

Related:

- Hooks: [Hooks](/automation/hooks)
- Plugin hooks: [Plugin hooks](/plugins/architecture#provider-runtime-hooks)

## List All Hooks

```bash
uagent hooks list
```

List all discovered hooks from workspace, managed, extra, and bundled directories.

**Options:**

- `--eligible`: Show only eligible hooks (requirements met)
- `--json`: Output as JSON
- `-v, --verbose`: Show detailed information including missing requirements

**Example output:**

```
Hooks (4/4 ready)

Ready:
  🚀 boot-md ✓ - Run BOOT.md on gateway startup
  📎 bootstrap-extra-files ✓ - Inject extra workspace bootstrap files during agent bootstrap
  📝 command-logger ✓ - Log all command events to a centralized audit file
  💾 session-memory ✓ - Save session context to memory when /new or /reset command is issued
```

**Example (verbose):**

```bash
uagent hooks list --verbose
```

Shows missing requirements for ineligible hooks.

**Example (JSON):**

```bash
uagent hooks list --json
```

Returns structured JSON for programmatic use.

## Get Hook Information

```bash
uagent hooks info <name>
```

Show detailed information about a specific hook.

**Arguments:**

- `<name>`: Hook name or hook key (e.g., `session-memory`)

**Options:**

- `--json`: Output as JSON

**Example:**

```bash
uagent hooks info session-memory
```

**Output:**

```
💾 session-memory ✓ Ready

Save session context to memory when /new or /reset command is issued

Details:
  Source: uagent-bundled
  Path: /path/to/uagent/hooks/bundled/session-memory/HOOK.md
  Handler: /path/to/uagent/hooks/bundled/session-memory/handler.ts
  Homepage: https://docs.uagent.ai/automation/hooks#session-memory
  Events: command:new, command:reset

Requirements:
  Config: ✓ workspace.dir
```

## Check Hooks Eligibility

```bash
uagent hooks check
```

Show summary of hook eligibility status (how many are ready vs. not ready).

**Options:**

- `--json`: Output as JSON

**Example output:**

```
Hooks Status

Total hooks: 4
Ready: 4
Not ready: 0
```

## Enable a Hook

```bash
uagent hooks enable <name>
```

Enable a specific hook by adding it to your config (`~/.uagent/uagent.json` by default).

**Note:** Workspace hooks are disabled by default until enabled here or in config. Hooks managed by plugins show `plugin:<id>` in `uagent hooks list` and can’t be enabled/disabled here. Enable/disable the plugin instead.

**Arguments:**

- `<name>`: Hook name (e.g., `session-memory`)

**Example:**

```bash
uagent hooks enable session-memory
```

**Output:**

```
✓ Enabled hook: 💾 session-memory
```

**What it does:**

- Checks if hook exists and is eligible
- Updates `hooks.internal.entries.<name>.enabled = true` in your config
- Saves config to disk

If the hook came from `<workspace>/hooks/`, this opt-in step is required before
the Gateway will load it.

**After enabling:**

- Restart the gateway so hooks reload (menu bar app restart on macOS, or restart your gateway process in dev).

## Disable a Hook

```bash
uagent hooks disable <name>
```

Disable a specific hook by updating your config.

**Arguments:**

- `<name>`: Hook name (e.g., `command-logger`)

**Example:**

```bash
uagent hooks disable command-logger
```

**Output:**

```
⏸ Disabled hook: 📝 command-logger
```

**After disabling:**

- Restart the gateway so hooks reload

## Notes

- `uagent hooks list --json`, `info --json`, and `check --json` write structured JSON directly to stdout.
- Plugin-managed hooks cannot be enabled or disabled here; enable or disable the owning plugin instead.

## Install Hook Packs

```bash
uagent plugins install <package>        # ClawHub first, then npm
uagent plugins install <package> --pin  # pin version
uagent plugins install <path>           # local path
```

Install hook packs through the unified plugins installer.

`uagent hooks install` still works as a compatibility alias, but it prints a
deprecation warning and forwards to `uagent plugins install`.

Npm specs are **registry-only** (package name + optional **exact version** or
**dist-tag**). Git/URL/file specs and semver ranges are rejected. Dependency
installs run with `--ignore-scripts` for safety.

Bare specs and `@latest` stay on the stable track. If npm resolves either of
those to a prerelease, UAGENT stops and asks you to opt in explicitly with a
prerelease tag such as `@beta`/`@rc` or an exact prerelease version.

**What it does:**

- Copies the hook pack into `~/.uagent/hooks/<id>`
- Enables the installed hooks in `hooks.internal.entries.*`
- Records the install under `hooks.internal.installs`

**Options:**

- `-l, --link`: Link a local directory instead of copying (adds it to `hooks.internal.load.extraDirs`)
- `--pin`: Record npm installs as exact resolved `name@version` in `hooks.internal.installs`

**Supported archives:** `.zip`, `.tgz`, `.tar.gz`, `.tar`

**Examples:**

```bash
# Local directory
uagent plugins install ./my-hook-pack

# Local archive
uagent plugins install ./my-hook-pack.zip

# NPM package
uagent plugins install @uagent/my-hook-pack

# Link a local directory without copying
uagent plugins install -l ./my-hook-pack
```

Linked hook packs are treated as managed hooks from an operator-configured
directory, not as workspace hooks.

## Update Hook Packs

```bash
uagent plugins update <id>
uagent plugins update --all
```

Update tracked npm-based hook packs through the unified plugins updater.

`uagent hooks update` still works as a compatibility alias, but it prints a
deprecation warning and forwards to `uagent plugins update`.

**Options:**

- `--all`: Update all tracked hook packs
- `--dry-run`: Show what would change without writing

When a stored integrity hash exists and the fetched artifact hash changes,
UAGENT prints a warning and asks for confirmation before proceeding. Use
global `--yes` to bypass prompts in CI/non-interactive runs.

## Bundled Hooks

### session-memory

Saves session context to memory when you issue `/new` or `/reset`.

**Enable:**

```bash
uagent hooks enable session-memory
```

**Output:** `~/.uagent/workspace/memory/YYYY-MM-DD-slug.md`

**See:** [session-memory documentation](/automation/hooks#session-memory)

### bootstrap-extra-files

Injects additional bootstrap files (for example monorepo-local `AGENTS.md` / `TOOLS.md`) during `agent:bootstrap`.

**Enable:**

```bash
uagent hooks enable bootstrap-extra-files
```

**See:** [bootstrap-extra-files documentation](/automation/hooks#bootstrap-extra-files)

### command-logger

Logs all command events to a centralized audit file.

**Enable:**

```bash
uagent hooks enable command-logger
```

**Output:** `~/.uagent/logs/commands.log`

**View logs:**

```bash
# Recent commands
tail -n 20 ~/.uagent/logs/commands.log

# Pretty-print
cat ~/.uagent/logs/commands.log | jq .

# Filter by action
grep '"action":"new"' ~/.uagent/logs/commands.log | jq .
```

**See:** [command-logger documentation](/automation/hooks#command-logger)

### boot-md

Runs `BOOT.md` when the gateway starts (after channels start).

**Events**: `gateway:startup`

**Enable**:

```bash
uagent hooks enable boot-md
```

**See:** [boot-md documentation](/automation/hooks#boot-md)

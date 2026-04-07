---
summary: "CLI reference for `uagent browser` (lifecycle, profiles, tabs, actions, state, and debugging)"
read_when:
  - You use `uagent browser` and want examples for common tasks
  - You want to control a browser running on another machine via a node host
  - You want to attach to your local signed-in Chrome via Chrome MCP
title: "browser"
---

# `uagent browser`

Manage UAGENT's browser control surface and run browser actions (lifecycle, profiles, tabs, snapshots, screenshots, navigation, input, state emulation, and debugging).

Related:

- Browser tool + API: [Browser tool](/tools/browser)

## Common flags

- `--url <gatewayWsUrl>`: Gateway WebSocket URL (defaults to config).
- `--token <token>`: Gateway token (if required).
- `--timeout <ms>`: request timeout (ms).
- `--expect-final`: wait for a final Gateway response.
- `--browser-profile <name>`: choose a browser profile (default from config).
- `--json`: machine-readable output (where supported).

## Quick start (local)

```bash
uagent browser profiles
uagent browser --browser-profile uagent start
uagent browser --browser-profile uagent open https://example.com
uagent browser --browser-profile uagent snapshot
```

## Lifecycle

```bash
uagent browser status
uagent browser start
uagent browser stop
uagent browser --browser-profile uagent reset-profile
```

Notes:

- For `attachOnly` and remote CDP profiles, `uagent browser stop` closes the
  active control session and clears temporary emulation overrides even when
  UAGENT did not launch the browser process itself.
- For local managed profiles, `uagent browser stop` stops the spawned browser
  process.

## If the command is missing

If `uagent browser` is an unknown command, check `plugins.allow` in
`~/.uagent/uagent.json`.

When `plugins.allow` is present, the bundled browser plugin must be listed
explicitly:

```json5
{
  plugins: {
    allow: ["telegram", "browser"],
  },
}
```

`browser.enabled=true` does not restore the CLI subcommand when the plugin
allowlist excludes `browser`.

Related: [Browser tool](/tools/browser#missing-browser-command-or-tool)

## Profiles

Profiles are named browser routing configs. In practice:

- `uagent`: launches or attaches to a dedicated UAGENT-managed Chrome instance (isolated user data dir).
- `user`: controls your existing signed-in Chrome session via Chrome DevTools MCP.
- custom CDP profiles: point at a local or remote CDP endpoint.

```bash
uagent browser profiles
uagent browser create-profile --name work --color "#FF5A36"
uagent browser create-profile --name chrome-live --driver existing-session
uagent browser create-profile --name remote --cdp-url https://browser-host.example.com
uagent browser delete-profile --name work
```

Use a specific profile:

```bash
uagent browser --browser-profile work tabs
```

## Tabs

```bash
uagent browser tabs
uagent browser tab new
uagent browser tab select 2
uagent browser tab close 2
uagent browser open https://docs.uagent.ai
uagent browser focus <targetId>
uagent browser close <targetId>
```

## Snapshot / screenshot / actions

Snapshot:

```bash
uagent browser snapshot
```

Screenshot:

```bash
uagent browser screenshot
uagent browser screenshot --full-page
uagent browser screenshot --ref e12
```

Notes:

- `--full-page` is for page captures only; it cannot be combined with `--ref`
  or `--element`.
- `existing-session` / `user` profiles support page screenshots and `--ref`
  screenshots from snapshot output, but not CSS `--element` screenshots.

Navigate/click/type (ref-based UI automation):

```bash
uagent browser navigate https://example.com
uagent browser click <ref>
uagent browser type <ref> "hello"
uagent browser press Enter
uagent browser hover <ref>
uagent browser scrollintoview <ref>
uagent browser drag <startRef> <endRef>
uagent browser select <ref> OptionA OptionB
uagent browser fill --fields '[{"ref":"1","value":"Ada"}]'
uagent browser wait --text "Done"
uagent browser evaluate --fn '(el) => el.textContent' --ref <ref>
```

File + dialog helpers:

```bash
uagent browser upload /tmp/uagent/uploads/file.pdf --ref <ref>
uagent browser waitfordownload
uagent browser download <ref> report.pdf
uagent browser dialog --accept
```

## State and storage

Viewport + emulation:

```bash
uagent browser resize 1280 720
uagent browser set viewport 1280 720
uagent browser set offline on
uagent browser set media dark
uagent browser set timezone Europe/London
uagent browser set locale en-GB
uagent browser set geo 51.5074 -0.1278 --accuracy 25
uagent browser set device "iPhone 14"
uagent browser set headers '{"x-test":"1"}'
uagent browser set credentials myuser mypass
```

Cookies + storage:

```bash
uagent browser cookies
uagent browser cookies set session abc123 --url https://example.com
uagent browser cookies clear
uagent browser storage local get
uagent browser storage local set token abc123
uagent browser storage session clear
```

## Debugging

```bash
uagent browser console --level error
uagent browser pdf
uagent browser responsebody "**/api"
uagent browser highlight <ref>
uagent browser errors --clear
uagent browser requests --filter api
uagent browser trace start
uagent browser trace stop --out trace.zip
```

## Existing Chrome via MCP

Use the built-in `user` profile, or create your own `existing-session` profile:

```bash
uagent browser --browser-profile user tabs
uagent browser create-profile --name chrome-live --driver existing-session
uagent browser create-profile --name brave-live --driver existing-session --user-data-dir "~/Library/Application Support/BraveSoftware/Brave-Browser"
uagent browser --browser-profile chrome-live tabs
```

This path is host-only. For Docker, headless servers, Browserless, or other remote setups, use a CDP profile instead.

Current existing-session limits:

- snapshot-driven actions use refs, not CSS selectors
- `click` is left-click only
- `type` does not support `slowly=true`
- `press` does not support `delayMs`
- `hover`, `scrollintoview`, `drag`, `select`, `fill`, and `evaluate` reject
  per-call timeout overrides
- `select` supports one value only
- `wait --load networkidle` is not supported
- file uploads require `--ref` / `--input-ref`, do not support CSS
  `--element`, and currently support one file at a time
- dialog hooks do not support `--timeout`
- screenshots support page captures and `--ref`, but not CSS `--element`
- `responsebody`, download interception, PDF export, and batch actions still
  require a managed browser or raw CDP profile

## Remote browser control (node host proxy)

If the Gateway runs on a different machine than the browser, run a **node host** on the machine that has Chrome/Brave/Edge/Chromium. The Gateway will proxy browser actions to that node (no separate browser control server required).

Use `gateway.nodes.browser.mode` to control auto-routing and `gateway.nodes.browser.node` to pin a specific node if multiple are connected.

Security + remote setup: [Browser tool](/tools/browser), [Remote access](/gateway/remote), [Tailscale](/gateway/tailscale), [Security](/gateway/security)

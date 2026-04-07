---
summary: "Redirect: flow commands live under `uagent tasks flow`"
read_when:
  - You encounter uagent flows in older docs or release notes
title: "flows (redirect)"
---

# `uagent tasks flow`

Flow commands are subcommands of `uagent tasks`, not a standalone `flows` command.

```bash
uagent tasks flow list [--json]
uagent tasks flow show <lookup>
uagent tasks flow cancel <lookup>
```

For full documentation see [Task Flow](/automation/taskflow) and the [tasks CLI reference](/cli/index#tasks).

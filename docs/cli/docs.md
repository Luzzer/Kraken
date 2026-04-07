---
summary: "CLI reference for `uagent docs` (search the live docs index)"
read_when:
  - You want to search the live UAGENT docs from the terminal
title: "docs"
---

# `uagent docs`

Search the live docs index.

Arguments:

- `[query...]`: search terms to send to the live docs index

Examples:

```bash
uagent docs
uagent docs browser existing-session
uagent docs sandbox allowHostControl
uagent docs gateway token secretref
```

Notes:

- With no query, `uagent docs` opens the live docs search entrypoint.
- Multi-word queries are passed through as one search request.

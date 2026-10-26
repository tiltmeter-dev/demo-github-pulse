# Repo Pulse

A weekly digest of a GitHub repository for the team channel: what merged, who owns the
open issues, and how much API quota is left. Written in late 2024 against the GitHub REST
API, version `2022-11-28`.

```bash
npm test   # Node 24 runs the TypeScript directly
```

## A Tiltmeter demo

This code still pins GitHub's REST API version `2022-11-28`.
[Tiltmeter](https://github.com/tiltmeter-dev/tiltmeter) follows GitHub's real OpenAPI
description of `2026-03-10`, the first version with breaking changes, and the
`API changes` workflow opens a pull request that adapts the code. The agent's edits are
tested before the pull request opens.

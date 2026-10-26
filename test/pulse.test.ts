import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { header, issueOwners, merged, quotaLeft } from "../src/pulse.ts";

const RESPONSES: Record<string, unknown> = {
  "/rate_limit": {
    resources: { core: { limit: 5000, remaining: 4870, reset: 1793620800 } },
  },
  "/repos/acme/rocket/pulls?state=closed&per_page=50": [
    {
      number: 12,
      title: "Faster launches",
      merged_at: "2026-10-20T10:00:00Z",
      merge_commit_sha: "4f9c2e1aa7d0",
      assignees: [{ login: "ana" }],
    },
    { number: 11, title: "Abandoned", merged_at: null, merge_commit_sha: null, assignees: [] },
  ],
  "/repos/acme/rocket/issues?state=open&per_page=100": [
    { number: 30, title: "Crash", assignees: [{ login: "ana" }] },
    { number: 31, title: "Docs", assignees: [] },
    { number: 32, title: "A pull request", assignees: [], pull_request: {} },
  ],
  "/repos/acme/rocket": {
    full_name: "acme/rocket",
    stargazers_count: 812,
    open_issues_count: 3,
    has_downloads: true,
  },
};

beforeEach(() => {
  globalThis.fetch = async (input: string | URL | Request) => {
    const path = String(input).replace("https://api.github.com", "");
    if (!(path in RESPONSES)) return new Response("not found", { status: 404 });
    return Response.json(RESPONSES[path]);
  };
});

test("quota left", async () => {
  assert.equal(await quotaLeft(), 4870);
});

test("merged pull requests", async () => {
  assert.deepEqual(await merged("acme", "rocket"), ["#12 Faster launches (4f9c2e1, ana)"]);
});

test("who owns the open issues", async () => {
  assert.deepEqual(
    [...(await issueOwners("acme", "rocket"))],
    [
      ["ana", 1],
      ["unassigned", 1],
    ],
  );
});

test("digest header", async () => {
  assert.equal(await header("acme", "rocket"), "acme/rocket: 812 stars, 3 open, downloads on");
});

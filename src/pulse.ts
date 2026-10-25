// The weekly digest.

import { get } from "./github.ts";
import type { Issue, Pull, RateLimit, Repository } from "./github.ts";

export async function quotaLeft(): Promise<number> {
  const limits = await get<RateLimit>("/rate_limit");
  return limits.rate.remaining;
}

export async function merged(owner: string, repo: string): Promise<string[]> {
  const pulls = await get<Pull[]>(`/repos/${owner}/${repo}/pulls?state=closed&per_page=50`);
  return pulls
    .filter((pull) => pull.merged_at !== null)
    .map((pull) => {
      const sha = pull.merge_commit_sha?.slice(0, 7) ?? "unknown";
      const owner = pull.assignee?.login ?? "nobody";
      return `#${pull.number} ${pull.title} (${sha}, ${owner})`;
    });
}

export async function issueOwners(owner: string, repo: string): Promise<Map<string, number>> {
  const issues = await get<Issue[]>(`/repos/${owner}/${repo}/issues?state=open&per_page=100`);
  const counts = new Map<string, number>();
  for (const issue of issues) {
    if (issue.pull_request) continue;
    const login = issue.assignee?.login ?? "unassigned";
    counts.set(login, (counts.get(login) ?? 0) + 1);
  }
  return counts;
}

export async function header(owner: string, repo: string): Promise<string> {
  const repository = await get<Repository>(`/repos/${owner}/${repo}`);
  const downloads = repository.has_downloads ? ", downloads on" : "";
  return `${repository.full_name}: ${repository.stargazers_count} stars, ${repository.open_issues_count} open${downloads}`;
}

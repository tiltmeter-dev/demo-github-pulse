// The GitHub REST API, as Repo Pulse reads it.

export const API = "https://api.github.com";

const HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export interface User {
  login: string;
}

export interface RateLimit {
  rate: { limit: number; remaining: number; reset: number };
}

export interface Pull {
  number: number;
  title: string;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: User | null;
}

export interface Issue {
  number: number;
  title: string;
  assignee: User | null;
  pull_request?: unknown;
}

export interface Repository {
  full_name: string;
  stargazers_count: number;
  open_issues_count: number;
  has_downloads: boolean;
}

export async function get<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const headers = token ? { ...HEADERS, Authorization: `Bearer ${token}` } : HEADERS;
  const response = await fetch(`${API}${path}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub answered ${response.status} for ${path}`);
  }
  return (await response.json()) as T;
}

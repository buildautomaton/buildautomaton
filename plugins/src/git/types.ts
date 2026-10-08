export type GitContext = {
  cwd: string;
  inRepo: boolean;
  repo: string | null;
  branch: string | null;
};

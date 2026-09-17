import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is a hand-maintained project brief with an append-only rules
  // section — don't let `next dev`/`next build` generate into it or into the
  // CLAUDE.md that imports it.
  agentRules: false,
};

export default nextConfig;

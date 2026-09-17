import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This repo's CLAUDE.md is a hand-maintained project brief (see the file
  // itself) — don't let `next dev`/`next build` append agent-rules content
  // to it or to a generated AGENTS.md.
  agentRules: false,
};

export default nextConfig;

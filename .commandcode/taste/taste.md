# Taste

## Workflow

- Wants test scenarios implemented/verified using the Playwright CLI (`npx playwright ...`) — including the project's already-installed `playwright-cli` skill workflow (`.claude/skills/playwright-cli/`) — rather than ad-hoc Node scripts, MCP, or other tooling, and explicitly restates "using playwright CLI" or asks whether the CLI skills were used when that wasn't followed. Confidence: 0.8
- Prefers additive, non-destructive changes: preserve existing project files and never delete or overwrite existing implementation files unnecessarily; extend configs (e.g. append to `.gitignore`) rather than rewriting them. Confidence: 0.65

import type { Metadata } from "next";

import {
  McpAgentsSection,
  McpCapabilitiesSection,
  McpCtaSection,
  McpHeroSection,
  McpVideoSection,
} from "./_components";

export const metadata: Metadata = {
  title: "Prisma MCP Server",
  description:
    "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT, and other AI agents.",
};

const DOCS_MCP = "https://www.prisma.io/docs/postgres/integrations/mcp-server";

const heroFeatures = [
  {
    icon: "fa-regular fa-message-smile",
    line1: "Natural language",
    line2: "database operations",
    mobileText: "Natural language db operations",
  },
  { icon: "fa-regular fa-rocket-launch", line1: "Works with any", line2: "AI agent" },
  { icon: "fa-regular fa-bolt", line1: "Super quick", line2: "2-minute setup" },
  { icon: "fa-regular fa-lock", line1: "Enterprise-grade", line2: "security & OAuth" },
] as const;

const agents = [
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/d6c20f460745128976b42777082c0f509a0a3703-48x48.svg",
    alt: "Add to Cursor",
    icon: "fa-regular fa-copy",
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/89100dbc0ed0cf476b3db2167608a57598f30df7-48x48.svg",
    alt: "Install in VS Code",
    icon: "fa-regular fa-copy",
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/7f67dbbe8167e517aa0522b318c2fc670d09b15b-48x48.svg",
    alt: "Copy JSON configuration",
    icon: "fa-regular fa-copy",
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/967f1eacafd72c6cb613ca8be94154677def8e8d-50x48.svg",
    alt: "See how to add the remote Prisma MCP server to ChatGPT",
    icon: "fa-regular fa-arrow-up-right",
    href: "https://pris.ly/gpt-prisma-mcp",
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/ecae3930bd4cdc2e90d28ad88a09c91ae8e8ad29-48x48.svg",
    alt: "Copy command to add to Claude Code",
    icon: "fa-regular fa-arrow-up-right",
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/d463811d56c616eafda88a79b866306858e067df-48x48.svg",
    alt: "Add via Plugin Store",
    icon: "fa-regular fa-copy",
    href: "https://pris.ly/windsurf-mcp",
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/17c842e8d84ff2f747801b30a2e292789db6146c-512x512.svg",
    alt: "Copy command to add to Gemini CLI",
    icon: "fa-regular fa-arrow-up-right",
    href: DOCS_MCP,
  },
  {
    logo: null,
    alt: "Any AI agent",
    icon: "fa-regular fa-arrow-up-right",
    href: DOCS_MCP,
  },
] as const;

const capabilities = [
  {
    icon: "fa-regular fa-database",
    title: "Database Management",
    description: "Create projects, databases, or clean them up via natural language",
    prompt: "Set up this project with a new database in us-east-1",
    mobileTall: false,
  },
  {
    icon: "fa-regular fa-magnifying-glass-arrow-right",
    title: "Data Analysis",
    description: "Execute queries and analyze data through conversation",
    prompt: "Show me all users who signed up this week and their activity levels",
    mobileTall: true,
  },
  {
    icon: "fa-regular fa-code-compare",
    title: "Schema Operations",
    description: "Manage migrations and database structure changes",
    prompt: "Check my migration status and create a new user preferences table",
    mobileTall: false,
  },
  {
    icon: "fa-regular fa-folder-gear",
    title: "Database Administration",
    description: "Handle backups, connection strings, and multi-database workflows",
    prompt: "Create a new database from the most recent backup to my product db",
    mobileTall: false,
  },
  {
    icon: "fa-regular fa-arrow-progress",
    title: "Development Workflow",
    description: "Integrate database operations seamlessly into coding workflow",
    prompt: "Open Prisma Studio and show me the data in my users table",
    mobileTall: false,
  },
] as const;

export default function McpPage() {
  return (
    <main className="relative flex flex-col overflow-x-hidden  text-foreground-neutral">
      <link
        rel="stylesheet"
        href="https://ka-p.fontawesome.com/releases/v7.2.0/css/pro.min.css?token=6916e9db27"
        crossOrigin="anonymous"
      />
      <div className="relative z-1 flex flex-col">
        <McpHeroSection docsHref={DOCS_MCP} features={heroFeatures} />
        <McpVideoSection />
        <McpAgentsSection docsHref={DOCS_MCP} agents={agents} />
        <McpCapabilitiesSection capabilities={capabilities} />
        <McpCtaSection docsHref={DOCS_MCP} />
      </div>
    </main>
  );
}

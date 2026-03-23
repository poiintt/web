import type { Metadata } from "next";
import {
  ArrowUpRight,
  Copy,
  Database,
  FolderCog,
  GitCompareArrows,
  Lock,
  MessagesSquare,
  Rocket,
  SearchCode,
  Workflow,
  Zap,
} from "lucide-react";

import {
  type McpAgent,
  McpAgentsSection,
} from "./_components/mcp-agents-section";
import {
  type McpCapability,
  McpCapabilitiesSection,
} from "./_components/mcp-capabilities-section";
import { McpCtaSection } from "./_components/mcp-cta-section";
import {
  type McpHeroFeature,
  McpHeroSection,
} from "./_components/mcp-hero-section";
import { McpVideoSection } from "./_components/mcp-video-section";

export const metadata: Metadata = {
  title: "Prisma MCP Server",
  description:
    "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT, and other AI agents.",
};

const DOCS_MCP = "https://www.prisma.io/docs/postgres/integrations/mcp-server";

const heroFeatures: McpHeroFeature[] = [
  {
    icon: MessagesSquare,
    line1: "Natural language",
    line2: "database operations",
    mobileText: "Natural language db operations",
  },
  { icon: Rocket, line1: "Works with any", line2: "AI agent" },
  { icon: Zap, line1: "Super quick", line2: "2-minute setup" },
  { icon: Lock, line1: "Enterprise-grade", line2: "security & OAuth" },
];

const agents: McpAgent[] = [
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/d6c20f460745128976b42777082c0f509a0a3703-48x48.svg",
    alt: "Add to Cursor",
    icon: Copy,
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/89100dbc0ed0cf476b3db2167608a57598f30df7-48x48.svg",
    alt: "Install in VS Code",
    icon: Copy,
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/7f67dbbe8167e517aa0522b318c2fc670d09b15b-48x48.svg",
    alt: "Copy JSON configuration",
    icon: Copy,
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/967f1eacafd72c6cb613ca8be94154677def8e8d-50x48.svg",
    alt: "See how to add the remote Prisma MCP server to ChatGPT",
    icon: ArrowUpRight,
    href: "https://pris.ly/gpt-prisma-mcp",
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/ecae3930bd4cdc2e90d28ad88a09c91ae8e8ad29-48x48.svg",
    alt: "Copy command to add to Claude Code",
    icon: ArrowUpRight,
    href: DOCS_MCP,
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/d463811d56c616eafda88a79b866306858e067df-48x48.svg",
    alt: "Add via Plugin Store",
    icon: Copy,
    href: "https://pris.ly/windsurf-mcp",
  },
  {
    logo: "https://cdn.sanity.io/images/p2zxqf70/production/17c842e8d84ff2f747801b30a2e292789db6146c-512x512.svg",
    alt: "Copy command to add to Gemini CLI",
    icon: ArrowUpRight,
    href: DOCS_MCP,
  },
  {
    logo: null,
    alt: "Any AI agent",
    icon: ArrowUpRight,
    href: DOCS_MCP,
  },
];

const capabilities: McpCapability[] = [
  {
    icon: Database,
    title: "Database Management",
    description: "Create projects, databases, or clean them up via natural language",
    prompt: "Set up this project with a new database in us-east-1",
    mobileTall: false,
  },
  {
    icon: SearchCode,
    title: "Data Analysis",
    description: "Execute queries and analyze data through conversation",
    prompt: "Show me all users who signed up this week and their activity levels",
    mobileTall: true,
  },
  {
    icon: GitCompareArrows,
    title: "Schema Operations",
    description: "Manage migrations and database structure changes",
    prompt: "Check my migration status and create a new user preferences table",
    mobileTall: false,
  },
  {
    icon: FolderCog,
    title: "Database Administration",
    description: "Handle backups, connection strings, and multi-database workflows",
    prompt: "Create a new database from the most recent backup to my product db",
    mobileTall: false,
  },
  {
    icon: Workflow,
    title: "Development Workflow",
    description: "Integrate database operations seamlessly into coding workflow",
    prompt: "Open Prisma Studio and show me the data in my users table",
    mobileTall: false,
  },
];

export default function McpPage() {
  return (
    <main className="relative flex flex-col overflow-x-hidden  text-foreground-neutral">
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

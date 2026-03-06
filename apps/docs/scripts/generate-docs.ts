import { generateFiles } from "fumadocs-openapi";
import { openapi } from "@/lib/openapi";

void generateFiles({
  input: openapi,
  output: "./content/docs/management-api/endpoints",
  includeDescription: true,
  per: "operation",
  groupBy: "tag",
  name: (output, document) => {
    if (output.type === "operation") {
      // @ts-ignore
      const operation = document.paths![output.item.path]![output.item.method]!;

      const operationId = operation.operationId || "";

      const cleanName = operationId
        .replace(/V\d+/g, "")
        .replace(/By[A-Z][a-z]{2,}/g, "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase();

      return cleanName;
    }

    return output.item.name;
  },
  beforeWrite(files) {
    for (const file of files) {
      const frontmatterMatch = file.content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) continue;

      let frontmatter = frontmatterMatch[1];

      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
      const title = titleMatch
        ? titleMatch[1].replace(/^['"]|['"]$/g, "")
        : "";

      const methodMatch = frontmatter.match(/method:\s*(\w+)/);
      const method = methodMatch ? methodMatch[1].toUpperCase() : "";

      const apiPageMatch = file.content.match(
        /<APIPage[^>]*operations=\{(\[.*?\])\}/s,
      );
      let apiPath = "";
      if (apiPageMatch) {
        try {
          const operations = JSON.parse(apiPageMatch[1].replace(/'/g, '"'));
          if (operations[0]?.path) {
            apiPath = operations[0].path;
          }
        } catch (e) {
          console.warn(`Failed to parse operations for ${file.path}:`, e);
        }
      }

      const openapiPathMatch = frontmatter.match(
        /^\s*path:\s*['"]?([^'"\n]+)['"]?\s*$/m,
      );
      if (!apiPath && openapiPathMatch) {
        apiPath = openapiPathMatch[1];
      }

      if (
        frontmatter.includes("_openapi:") &&
        !frontmatter.includes("path:") &&
        apiPath
      ) {
        frontmatter = frontmatter.replace(
          /(_openapi:\s*\n\s*method:)/,
          `_openapi:\n  path: "${apiPath}"\n  method:`,
        );
      }

      if (!method || !title || !apiPath) {
        console.warn(
          `Skipping SEO metadata for ${file.path}: missing method/title/path`,
        );
        file.content =
          `---\n${frontmatter}\n---` +
          file.content.slice(frontmatterMatch[0].length);
        continue;
      }

      const contentAfterFrontmatter = file.content.slice(
        frontmatterMatch[0].length,
      );
      const descMatch = contentAfterFrontmatter.match(/\n\n([^<\n{][^\n]+)\n/);
      const description = descMatch ? descMatch[1].trim() : title;

      const slug = file.path
        .replace(/^.*endpoints\//, "")
        .replace(/\.mdx$/, "");
      const urlPath = `/management-api/endpoints/${slug}`;
      const metaTitle = `${method} ${apiPath} | ${title} - Prisma Postgres`;
      const descriptionClean = description.replace(/\.$/, "");
      const metaDescription = `Management API: ${descriptionClean}. ${method} ${apiPath}.`;

      frontmatter += `\nurl: ${urlPath}`;
      frontmatter += `\nmetaTitle: '${metaTitle.replace(/'/g, "''")}'`;
      frontmatter += `\nmetaDescription: '${metaDescription.replace(/'/g, "''")}'`;

      file.content =
        `---\n${frontmatter}\n---` +
        file.content.slice(frontmatterMatch[0].length);
    }
  },
});

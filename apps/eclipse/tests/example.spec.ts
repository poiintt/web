import { argosScreenshot } from "@argos-ci/playwright";
import { Page, test } from "@playwright/test";

const pages = [
  // Atoms
  { name: "Action", path: "/atoms/action" },
  { name: "Avatar", path: "/atoms/avatar" },
  { name: "Badge", path: "/atoms/badge" },
  { name: "Button", path: "/atoms/button" },
  { name: "Checkbox", path: "/atoms/checkbox" },
  { name: "Field", path: "/atoms/field" },
  { name: "Input", path: "/atoms/input" },
  { name: "Label", path: "/atoms/label" },
  { name: "Radio Group", path: "/atoms/radio-group" },
  { name: "Separator", path: "/atoms/separator" },
  { name: "Slider", path: "/atoms/slider" },
  { name: "Spinner", path: "/atoms/spinner" },
  { name: "Tooltip", path: "/atoms/tooltip" },
  // Molecules
  { name: "Accordion", path: "/molecules/accordion" },
  { name: "Banner", path: "/molecules/banner" },
  { name: "Breadcrumb", path: "/molecules/breadcrumb" },
  { name: "Card", path: "/molecules/card" },
  { name: "Codeblock", path: "/molecules/codeblock" },
  { name: "Dialog", path: "/molecules/dialog" },
  { name: "Dropdown Menu", path: "/molecules/dropdownmenu" },
  { name: "Files", path: "/molecules/files" },
  { name: "Inline TOC", path: "/molecules/inlinetoc" },
  { name: "Pagination", path: "/molecules/pagination" },
  { name: "Steps", path: "/molecules/steps" },
  { name: "Table", path: "/molecules/table" },
  { name: "Tabs", path: "/molecules/tabs" },
  { name: "Type Table", path: "/molecules/typetable" },
];

const ignoreElements: String[] = [];

const MAX_PAGE_HEIGHT = 30000; // Set below the 32767px limit

const disableComp = async (page: Page) => {
  if (ignoreElements.length) {
    for (const iEl of ignoreElements) {
      try {
        await page.waitForSelector(`[data-testid="${iEl}"]`, { timeout: 3000 });

        await page.$$eval(`[data-testid="${iEl}"]`, (els) => {
          els.forEach((el) => {
            el.style.setProperty("visibility", "hidden", "important");
          });
        });
      } catch {
        console.warn(`[skip] ${iEl} not found`);
      }
    }
  }
  await page.evaluate(() => {
    return new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });

  await page.waitForTimeout(500); // Optional: allow animations to settle
};

const getPageHeight = async (page: Page): Promise<number> => {
  return await page.evaluate(() => document.body.scrollHeight);
};

for (const { name, path } of pages) {
  test(`run Argos on ${name} (${path})`, async ({ page }) => {
    await page.goto(path, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await disableComp(page);

    const pageHeight = await getPageHeight(page);

    if (pageHeight > MAX_PAGE_HEIGHT) {
      console.warn(
        `Page ${name} is too tall (${pageHeight}px), taking viewport screenshot only`,
      );
      await argosScreenshot(page, name, { fullPage: false });
    } else {
      try {
        // Try full page screenshot
        await argosScreenshot(page, name, { fullPage: true });
      } catch (err) {
        console.warn(
          `Full page screenshot failed for ${name}, falling back to viewport only. Error:`,
          err,
        );
        await argosScreenshot(page, name, { fullPage: false });
      }
    }
  });
}

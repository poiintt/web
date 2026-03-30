import Antigravity from "../../components/homepage/antigravity";
import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Button, Card, Action } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
import { PostgresTabs } from "../../components/postgres";
import postgresData from "../../data/postgres.json";

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Postgres that <br /> fits your stack.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Works with your existing stack, wherever you deploy.Your choice of
          ORM, frameworks, and tools, they all just connect.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "logoGrid" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Real Postgres. <br /> Better experience.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          The PostgreSQL millions know and trust in production, ready in seconds
          with zero configuration. Automatic backups, observability and
          compliance.
        </p>
      </>
    ),
    imageUrl: "/illustrations/homepage/real_ppg",
    imageAlt: "Real Postgres",
    mobileImageUrl: "/illustrations/homepage/real_ppg_mobile",
    mobileImageAlt: "Real PPG mobile",
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
];
export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
  alternates: {
    canonical: "https://www.prisma.io/",
  },
  openGraph: {
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    url: "https://www.prisma.io/",
    images: [
      {
        url: "/og/og-index.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    images: ["/og/og-index.png"],
  },
};

export default async function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 pt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 my-12 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-ppg-weak uppercase tracking-widest text-sm font-sans-display font-black">
              <i className="fa-solid fa-chart-pyramid" />
              <span>Prisma Postgres</span>
            </div>
            <h1 className="text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 mt-0 font-sans-display text-foreground-neutral">
              The fastest way <br />
              to real Postgres
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto text-xl">
            Build, test and ship faster with zero infrastructure to manage.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="ppg"
              href="https://console.prisma.io/sign-up?utm_source=website&utm_medium=postgres&utm_campaign=cta"
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
            <Button
              variant="default-stronger"
              href="/docs/postgres"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Read the docs</span>
              <i className="fa-regular fa-book-open ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="my-12">
          <PostgresTabs data={postgresData} />
        </div>
      </div>

      <section className="my-12 px-4">
        <div className="py-12 relative gap-8 flex flex-col max-w-300 mx-auto w-full">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0">
            Postgres that fits your stack
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-300 mx-auto w-full">
          {postgresData.stack.map((card, index) => {
            const last = index === postgresData.stack.length - 1;
            return (
              <Card
                key={card.title}
                className={cn(
                  "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] relative",
                  last && "md:col-span-2",
                  !last && "pb-25",
                )}
              >
                <div className={cn(last && "grid md:grid-cols-2 gap-6")}>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <Action color="ppg" size="4xl">
                        <i className={card.icon} />
                      </Action>
                      <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display mt-0 mb-1 font-bold">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-foreground-neutral-weak text-sm font-normal m-0">
                      {card.subtitle}
                    </p>
                    {!last && (
                      <div className="bottom-0 left-0 right-0 px-4 after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(0deg,var(--color-background-default)_0%,transparent_62.5%)] after:top-0 absolute after:rounded-square">
                        <img
                          src={`${card.image}.svg`}
                          alt="Enterprise"
                          className="hidden dark:block mx-auto"
                        />
                        <img
                          src={`${card.image}_light.svg`}
                          className="block dark:hidden mx-auto"
                          alt="Enterprise"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      <div className="my-12 bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-ppg)_100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-12">
        <div className="web-cta flex gap-3 md:gap-12 items-center mx-auto w-fit lg:p-4 flex-col md:flex-row">
          <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left">
            Build anything.
            <br />
            Deploy instantly.
          </h3>
          <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
            <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
              Give your users instant production-ready Postgres, spin up
              databases, add a built-in data browser, and make it feel part of
              your product.
            </p>
            <Button variant="ppg" size="2xl" href="/pricing">
              <span>Explore Pricing</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-teal-400 before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Try Prisma Postgres
              </h2>
              <p className="text-foreground-neutral-weak">
                Deploy a Postgres database instantly.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button variant="ppg" size="2xl">
                <span>Create your first Database</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
              <Button variant="default-stronger" size="2xl" href="/docs">
                <span>Read the docs</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
            <h6 className="mb-0! -mt-4 text-foreground-neutral-weaker text-xs">
              Free to get started, no credit card needed.
            </h6>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit a startup — Superhero® Startup Directory",
  description:
    "Add the startup or project you're building to the Superhero® startup directory.",
};

export default function SubmitPage() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        <section className="bg-dots border-b border-line">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
            <Link
              href="/"
              className="text-[13px] text-accent hover:underline"
            >
              ← Back to directory
            </Link>
            <h1 className="mt-5 font-display text-4xl font-medium italic leading-tight tracking-tight text-ink sm:text-5xl">
              Submit your startup
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              Building something at Frontier Tower or anywhere in the Superhero®
              community? Add it to the directory so founders, operators, and VCs
              can find you.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <SubmitForm />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

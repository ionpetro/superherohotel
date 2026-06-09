"use client";

import { useActionState, useState } from "react";
import { createStartup, type SubmitState } from "./actions";
import { LogoUploader } from "../components/LogoUploader";

const initialState: SubmitState = { error: null };

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(
    createStartup,
    initialState,
  );
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-xl border border-accent/40 bg-accent-soft/40 px-4 py-3 text-[14px] text-ink">
          {state.error}
        </div>
      )}

      <Section title="The basics" subtitle="What everyone sees first.">
        <LogoUploader
          value={logoUrl}
          onChange={setLogoUrl}
          onUploadingChange={setLogoUploading}
        />
        <Field
          label="Startup name"
          name="name"
          required
          placeholder="e.g. Voltway"
          error={state.fieldErrors?.name}
        />
        <Field
          label="One-line description"
          name="tagline"
          required
          placeholder="Battery swap network for electric fleets."
          error={state.fieldErrors?.tagline}
          hint="Max 140 characters."
        />
        <Field
          label="Description"
          name="description"
          textarea
          placeholder="Tell us what you're building, who it's for, and what's working so far."
        />
      </Section>

      <Section title="Details" subtitle="Help people filter and find you.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Website" name="website" placeholder="voltway.com" />
          <Field
            label="Location"
            name="location"
            placeholder="San Francisco, CA, USA"
          />
          <Field
            label="Industry"
            name="industry"
            placeholder="Hardware"
            hint="Primary category."
          />
          <Field
            label="Batch / cohort"
            name="batch"
            placeholder="Spring 2026"
          />
          <SelectField
            label="Status"
            name="status"
            options={[
              { value: "active", label: "Active" },
              { value: "raising", label: "Raising" },
              { value: "public", label: "Public" },
              { value: "acquired", label: "Acquired" },
            ]}
          />
          <Field
            label="Team size"
            name="team_size"
            type="number"
            placeholder="6"
          />
          <Field
            label="Founded year"
            name="founded_year"
            type="number"
            placeholder="2025"
          />
          <Field
            label="Tags"
            name="tags"
            placeholder="Hardware, Climate, Logistics"
            hint="Comma-separated, up to 6."
          />
        </div>
        <label className="mt-2 flex cursor-pointer items-center gap-3 text-[14px] text-ink-soft select-none">
          <input
            type="checkbox"
            name="is_hiring"
            className="h-4 w-4 accent-[var(--color-ink)]"
          />
          We&apos;re actively hiring
        </label>
      </Section>

      <Section
        title="Founders"
        subtitle="Add one or more — it makes the page sing."
      >
        <FoundersField />
      </Section>

      <Section
        title="Contact"
        subtitle="Only visible to the Superhero team — never shown publicly."
      >
        <Field
          label="Your email"
          name="submitter_email"
          type="email"
          placeholder="you@startup.com"
        />
      </Section>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pending || logoUploading}
          className="rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-cream transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
        >
          {pending
            ? "Submitting…"
            : logoUploading
              ? "Waiting for logo…"
              : "Submit to the directory"}
        </button>
        <span className="text-[13px] text-muted">
          Your startup appears in the directory immediately.
        </span>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="mb-5">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <p className="text-[13px] text-muted">{subtitle}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  textarea,
  hint,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  hint?: string;
  error?: string;
}) {
  const base =
    "w-full rounded-xl border bg-cream/60 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-ink/15 transition-shadow";
  const borderClass = error ? "border-accent" : "border-line-strong focus:border-ink";

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-ink-soft">
        {label}
        {required && <span className="text-accent">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          placeholder={placeholder}
          className={`${base} ${borderClass} resize-y`}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={`${base} ${borderClass}`}
        />
      )}
      {error ? (
        <span className="mt-1 block text-[12px] text-accent">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[12px] text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

type FounderInput = {
  name: string;
  role: string;
  bio: string;
  linkedin_url: string;
  twitter_url: string;
};

const EMPTY_FOUNDER: FounderInput = {
  name: "",
  role: "",
  bio: "",
  linkedin_url: "",
  twitter_url: "",
};

function FoundersField() {
  const [founders, setFounders] = useState<FounderInput[]>([
    { ...EMPTY_FOUNDER },
  ]);

  function update(i: number, patch: Partial<FounderInput>) {
    setFounders((list) =>
      list.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    );
  }

  const serialized = JSON.stringify(
    founders
      .map((f) => ({
        name: f.name.trim(),
        role: f.role.trim(),
        bio: f.bio.trim(),
        linkedin_url: f.linkedin_url.trim(),
        twitter_url: f.twitter_url.trim(),
      }))
      .filter((f) => f.name.length > 0),
  );

  return (
    <div className="space-y-4">
      {founders.map((f, i) => (
        <div
          key={i}
          className="rounded-xl border border-line bg-cream/40 p-4 sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink-soft">
              Founder {i + 1}
            </span>
            {founders.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setFounders((list) => list.filter((_, idx) => idx !== i))
                }
                className="text-[13px] text-muted hover:text-accent"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RawField
              label="Name"
              value={f.name}
              onChange={(v) => update(i, { name: v })}
              placeholder="Marcus Lee"
            />
            <RawField
              label="Role"
              value={f.role}
              onChange={(v) => update(i, { role: v })}
              placeholder="Co-founder / CEO"
            />
          </div>
          <div className="mt-4">
            <RawField
              label="Bio"
              value={f.bio}
              onChange={(v) => update(i, { bio: v })}
              placeholder="A sentence or two about this founder."
              textarea
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RawField
              label="LinkedIn URL"
              value={f.linkedin_url}
              onChange={(v) => update(i, { linkedin_url: v })}
              placeholder="https://linkedin.com/in/…"
            />
            <RawField
              label="X / Twitter URL"
              value={f.twitter_url}
              onChange={(v) => update(i, { twitter_url: v })}
              placeholder="https://x.com/…"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setFounders((list) => [...list, { ...EMPTY_FOUNDER }])}
        className="w-full rounded-lg border border-dashed border-line-strong px-4 py-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-surface-2"
      >
        + Add another founder
      </button>

      <input type="hidden" name="founders_json" value={serialized} />
    </div>
  );
}

function RawField({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const base =
    "w-full rounded-xl border border-line-strong bg-cream/60 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15 transition-shadow";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-y`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      <div className="relative">
        <select
          name={name}
          defaultValue="active"
          className="w-full cursor-pointer rounded-xl border border-line-strong bg-cream/60 px-3.5 py-2.5 pr-9 text-[15px] text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
}

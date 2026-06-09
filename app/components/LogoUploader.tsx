"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const BUCKET = "startup-logos";

export function LogoUploader({
  value,
  onChange,
  onUploadingChange,
}: {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setBusy(busy: boolean) {
    setUploading(busy);
    onUploadingChange(busy);
  }

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be under 2 MB.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError("Upload failed. Please try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(publicUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        Logo
      </span>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line-strong bg-cream/60">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Logo preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-line-strong bg-surface px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-cream-deep disabled:opacity-60"
            >
              {uploading ? "Uploading…" : value ? "Replace logo" : "Upload logo"}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-[13px] text-muted hover:text-ink"
              >
                Remove
              </button>
            )}
          </div>
          <span className="text-[12px] text-muted">
            PNG, JPG, WebP or SVG · up to 2 MB
          </span>
          {error && (
            <span className="text-[12px] text-accent">{error}</span>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <input type="hidden" name="logo_url" value={value} />
    </div>
  );
}

"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value?: File | null;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  hint?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  label = "Image",
  value,
  existingUrl,
  onChange,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  hint = "JPG, PNG, WebP · max 20 MB",
  maxSizeMB = 20,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const displayUrl = preview || (existingUrl ? getMediaUrl(existingUrl) : null);

  const handleFile = useCallback(
    (file: File | null) => {
      setFileError(null);
      if (preview) URL.revokeObjectURL(preview);

      if (file) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setFileError(`File size exceeds the ${maxSizeMB} MB limit.`);
          return;
        }
        setPreview(URL.createObjectURL(file));
        onChange(file);
      } else {
        setPreview(null);
        onChange(null);
      }
    },
    [maxSizeMB, onChange, preview]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.07em] text-satelit-muted"
      >
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-xl border border-dashed transition ${
          dragOver
            ? "border-satelit-accent bg-satelit-surface"
            : "border-satelit-border bg-satelit-bg"
        }`}
      >
        {displayUrl ? (
          <div className="relative aspect-video w-full bg-satelit-surface">
            <Image
              src={displayUrl}
              alt={`${label} preview`}
              fill
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => {
                handleFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-satelit-ink/80 text-satelit-on-accent transition hover:bg-satelit-danger"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
            {value && (
              <span className="absolute bottom-3 left-3 rounded-lg bg-satelit-ink/80 px-2.5 py-1 text-[13px] font-medium text-satelit-on-accent">
                {value.name}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-9 text-satelit-muted transition hover:text-satelit-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-satelit-surface text-satelit-accent">
              <Upload size={18} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <span className="text-[14px] font-semibold text-satelit-ink">
              Drop image or click to upload
            </span>
            <span className="text-[13px] text-satelit-muted">{hint}</span>
          </button>
        )}
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {displayUrl && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-t border-satelit-border py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-satelit-muted transition hover:bg-satelit-surface hover:text-satelit-ink"
          >
            Replace image
          </button>
        )}
      </div>
      {fileError && (
        <p role="alert" className="mt-1.5 text-[13px] font-semibold text-satelit-danger">
          {fileError}
        </p>
      )}
    </div>
  );
}

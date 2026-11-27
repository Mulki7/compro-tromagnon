"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { getMediaUrl } from "@/lib/utils";
import { labelClass } from "@/components/admin/formStyles";

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
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-[20px] border-2 border-dashed transition-colors ${
          dragOver
            ? "border-admin-forest bg-admin-lime-soft/40"
            : "border-admin-border bg-admin-muted/60"
        }`}
      >
        {displayUrl ? (
          <div className="relative aspect-video w-full bg-admin-muted">
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
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-admin-forest/85 text-white backdrop-blur-sm transition hover:bg-admin-danger"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
            {value && (
              <span className="absolute bottom-3 left-3 rounded-full bg-admin-forest/85 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
                {value.name}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2.5 px-4 py-10 text-admin-sub transition hover:text-admin-forest"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-lime text-admin-forest shadow-sm">
              <Upload size={19} strokeWidth={2} aria-hidden="true" />
            </div>
            <span className="text-[14px] font-semibold text-admin-ink">
              Drop artwork here or click to browse
            </span>
            <span className="text-[12.5px] text-admin-sub">{hint}</span>
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
            className="w-full border-t border-admin-border/80 bg-white py-2.5 text-[12.5px] font-semibold text-admin-forest transition hover:bg-admin-muted"
          >
            Replace {label.toLowerCase()}
          </button>
        )}
      </div>
      {fileError && (
        <p role="alert" className="mt-1.5 text-[12.5px] font-semibold text-admin-danger">
          {fileError}
        </p>
      )}
    </div>
  );
}

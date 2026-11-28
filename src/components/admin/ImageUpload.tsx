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
  hint = "JPG, PNG, WebP · up to 20 MB",
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
          setFileError(`File exceeds ${maxSizeMB} MB.`);
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
        className={`relative overflow-hidden rounded-xl border border-dashed transition-colors duration-[120ms] ${
          dragOver
            ? "border-admin-forest bg-admin-elevated"
            : "border-admin-border-strong bg-admin-canvas"
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
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-admin-ink/85 text-[#F1F2EE] transition-colors duration-[120ms] hover:bg-admin-danger"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
            {value && (
              <span className="absolute bottom-3 left-3 rounded-md bg-admin-ink/85 px-2.5 py-1 font-admin text-[12.5px] font-medium text-[#F1F2EE]">
                {value.name}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-8 text-admin-sub transition-colors duration-[120ms] hover:bg-admin-elevated/60 hover:text-admin-forest"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-forest-soft text-[#F1F2EE]">
              <Upload size={17} strokeWidth={2} aria-hidden="true" />
            </div>
            <span className="font-admin text-[14px] font-semibold text-admin-ink">
              Drop image or click to browse
            </span>
            <span className="font-admin text-[12.5px] text-admin-sub">{hint}</span>
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
            className="h-10 w-full border-t border-admin-border bg-admin-surface font-admin text-[13px] font-semibold text-admin-forest-soft transition-colors duration-[120ms] hover:bg-admin-elevated hover:text-admin-forest"
          >
            Replace image
          </button>
        )}
      </div>
      {fileError && (
        <p role="alert" className="mt-1.5 font-admin text-[12.5px] font-medium text-admin-danger">
          {fileError}
        </p>
      )}
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
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
  hint = "JPG, PNG, WebP — max 20 MB",
  maxSizeMB = 20,
}: ImageUploadProps) {
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
      <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative border border-dashed transition ${dragOver
            ? "border-black bg-neutral-50"
            : "border-neutral-300 bg-neutral-50/50"
          }`}
      >
        {displayUrl ? (
          <div className="relative aspect-video w-full">
            <Image
              src={displayUrl}
              alt="Preview"
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
              className="absolute right-2 top-2 bg-black p-1.5 text-white hover:bg-neutral-800"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
            {value && (
              <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 font-mono text-[10px] text-white">
                {value.name}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-neutral-500 transition hover:text-black"
          >
            <Upload size={22} strokeWidth={1.5} />
            <span className="font-mono text-xs uppercase tracking-wide">
              Drop image or click to upload
            </span>
            <span className="text-[11px] text-neutral-400">{hint}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {displayUrl && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-t border-neutral-200 py-2 font-mono text-[10px] uppercase tracking-wide text-neutral-600 hover:bg-neutral-100 hover:text-black"
          >
            Replace image
          </button>
        )}
      </div>
      {fileError && (
        <p className="mt-1.5 font-mono text-[11px] font-semibold text-red-600">
          {fileError}
        </p>
      )}
    </div>
  );
}

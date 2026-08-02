"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileText, UploadCloud, X } from "lucide-react";
import { useToast } from "@/lib/ui/Toast";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  preview?: boolean;
};

async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Upload failed");
  }
  const data = await res.json();
  return data.url as string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/*,application/pdf",
  label,
  preview = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const isImage = value ? /\.(png|jpe?g|webp|gif)$/i.test(value) : false;
  const isPdf = value ? /\.pdf$/i.test(value) : false;

  const handle = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast("success", "File uploaded");
    } catch (e) {
      toast("error", (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {value && preview && isImage && (
        <Image
          src={value}
          alt="Uploaded"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-line"
        />
      )}
      {value && preview && isPdf && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100">
          <FileText className="h-5 w-5" />
        </span>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand px-3 py-2 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-50 transition-colors"
        >
          <UploadCloud className="h-4 w-4" />
          {uploading ? "Uploading..." : label || "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-brand-deep/60 hover:text-red-600 hover:border-red-200 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

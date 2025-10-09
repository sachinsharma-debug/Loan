import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { FileUploadResponse } from "@/api/fileUploadService";

interface FileUploadFieldProps {
  label: string;
  fieldName: string;
  documentType: "pan" | "passport" | "aadhar" | "photo" | "signature" | "thumb";
  uploadedFile?: FileUploadResponse | null;
  isUploading?: boolean;
  // Optional local preview URL (e.g., URL.createObjectURL) for instant preview before server URL is ready
  previewUrl?: string;
  // Optional default value for the text input (useful in edit view)
  defaultValue?: string;
  // Original stored value (id or full URL/path) for edit/view fallback
  originalValue?: string;
  // When true, render as read-only: no upload/remove controls, inputs are read-only
  readOnly?: boolean;
  onFileUpload: (
    file: File,
    documentType:
      | "pan"
      | "passport"
      | "aadhar"
      | "photo"
      | "signature"
      | "thumb"
  ) => void;
  onRemoveFile: (documentType: string) => void;
  // Include documentType in callback so the caller can know which image was clicked
  onImageClick?: (src: string, title: string, documentType: string) => void;
  getFileUrl: (filePath: string) => string;
  required?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  fieldName,
  documentType,
  uploadedFile,
  isUploading,
  previewUrl,
  defaultValue,
  originalValue,
  readOnly = false,
  onFileUpload,
  onRemoveFile,
  onImageClick,
  getFileUrl,
  required = false,
}) => {
  const inputId = `${fieldName}-upload`;
  const [resolvedSrc, setResolvedSrc] = React.useState<string | undefined>(
    undefined
  );
  const [objectUrl, setObjectUrl] = React.useState<string | undefined>(
    undefined
  );

  const looksLikeUrl = (v?: string) => !!v && /^(https?:)?\/\//i.test(v);
  const looksLikePath = (v?: string) =>
    !!v &&
    (/[\\\\/]/.test(v) ||
      /\.[a-zA-Z0-9]+$/.test(v) ||
      /mastergetfile\//.test(v));
  const isUuid = (v?: string) =>
    !!v &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
  const isHex24 = (v?: string) => !!v && /^[0-9a-fA-F]{24}$/.test(v);
  const isLikelyFileRef = (v?: string) => {
    if (!v) return false;
    if (looksLikeUrl(v) || looksLikePath(v) || isUuid(v) || isHex24(v))
      return true;
    // Heuristic: very long tokens are likely IDs
    if (v.length >= 18 && /[A-Za-z]/.test(v)) return true;
    return false;
  };
  const computeSrc = () => {
    if (previewUrl) return previewUrl;
    if (uploadedFile?.id) {
      const ref = String(uploadedFile.id);
      if (isLikelyFileRef(ref)) return getFileUrl(ref);
      return "";
    }
    if (originalValue) {
      const ref = String(originalValue).trim();
      if (!isLikelyFileRef(ref)) return "";
      return getFileUrl(ref);
    }
    return "";
  };

  // Convert base64 string (with or without data: prefix) to Blob
  const base64ToBlob = (
    base64: string,
    mimeType: string = "application/octet-stream"
  ) => {
    const parts = base64.split(",");
    const base64Data = parts.length > 1 ? parts[1] : parts[0];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Proactively resolve preview source for IDs/paths that may return JSON/base64
  React.useEffect(() => {
    let cancelled = false;
    // Cleanup any previous object URL
    const cleanup = () => {
      if (objectUrl && objectUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
      }
    };

    const run = async () => {
      try {
        const direct = computeSrc();
        if (!direct) {
          cleanup();
          if (!cancelled) setResolvedSrc(undefined);
          return;
        }
        // Fast-path: if we have a local blob or obvious image URL, use it
        if (
          direct.startsWith("blob:") ||
          /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(direct)
        ) {
          if (!cancelled) setResolvedSrc(direct);
          return;
        }

        // Try fetching to handle JSON/base64 from mastergetfile
        const token = localStorage.getItem("auth_token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const resp = await fetch(direct, { credentials: "include", headers });
        if (!resp.ok) {
          // Fall back to direct URL (onError path will handle link)
          if (!cancelled) setResolvedSrc(direct);
          return;
        }
        const ct = resp.headers.get("content-type") || "";
        if (ct.includes("application/json") || ct.includes("text/json")) {
          const json = await resp.json();
          const data = (json && (json.data || json)) || {};
          const base64: string | undefined =
            data.base64 ||
            data.fileBase64 ||
            data.imageBase64 ||
            data.file ||
            data.content;
          const mimetype: string =
            data.mimetype || data.mimeType || data.contentType || "image/*";
          const filepath: string | undefined = data.filepath || data.path;
          const directUrl: string | undefined = data.url || data.link;

          if (base64) {
            const blob = base64ToBlob(base64, mimetype);
            const url = URL.createObjectURL(blob);
            cleanup();
            if (!cancelled) {
              setObjectUrl(url);
              setResolvedSrc(url);
            }
            return;
          }
          if (directUrl) {
            cleanup();
            if (!cancelled) setResolvedSrc(directUrl);
            return;
          }
          if (filepath) {
            const abs = getFileUrl(filepath);
            cleanup();
            if (!cancelled) setResolvedSrc(abs);
            return;
          }
          // As last resort, use original direct URL
          if (!cancelled) setResolvedSrc(direct);
        } else if (ct.startsWith("image/")) {
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          cleanup();
          if (!cancelled) {
            setObjectUrl(url);
            setResolvedSrc(url);
          }
        } else {
          // Not an image; use direct and let onError create a link
          if (!cancelled) setResolvedSrc(direct);
        }
      } catch {
        // Ignore and let onError path handle fallback
        // Keep resolvedSrc as whatever direct was
        const direct = computeSrc();
        if (!cancelled) setResolvedSrc(direct || undefined);
      }
    };

    run();
    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl, uploadedFile?.id, originalValue]);

  return (
    <div className="col-span-2">
      <div className="flex items-center gap-2 mb-2">
        <Label htmlFor={fieldName} className="text-xs w-32 text-right">
          {label}:
        </Label>
        <Input
          id={fieldName}
          name={fieldName}
          className="h-6 text-xs flex-1"
          defaultValue={defaultValue}
          required={required}
          readOnly={readOnly}
          style={readOnly ? { backgroundColor: "#f3f4f6" } : undefined}
        />
        <div className="flex items-center gap-2 flex-1">
          <Input
            id={`${fieldName}-path`}
            name={`${fieldName}-path`}
            className="h-6 text-xs flex-1"
            placeholder={`${label} document path`}
            value={uploadedFile?.fileName || ""}
            readOnly
          />
          {!readOnly && (
            <>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onFileUpload(file, documentType);
                  }
                  e.target.value = "";
                }}
                style={{ display: "none" }}
                id={inputId}
              />
              {isUploading ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  disabled
                >
                  Uploading...
                </Button>
              ) : !uploadedFile ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => document.getElementById(inputId)?.click()}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Uploaded
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => onRemoveFile(fieldName)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {(() => {
        const src = computeSrc();
        return !!(previewUrl || src);
      })() && (
        <div className="flex justify-end">
          {/* Try to show image preview; if it fails (e.g., non-image/PDF), render a link */}
          <img
            src={resolvedSrc || computeSrc()}
            alt={`${label} Preview`}
            className="max-w-24 max-h-16 object-cover border rounded cursor-pointer hover:opacity-80 transition-opacity"
            onError={async (e) => {
              const target = e.currentTarget as HTMLImageElement;
              // Prevent infinite retry
              if (target.getAttribute("data-blob-retried") === "true") {
                target.style.display = "none";
                const container = target.parentElement;
                const existing = container?.querySelector(
                  "a[data-fallback-link='true']"
                );
                const url = computeSrc();
                if (container && url && !existing) {
                  const link = document.createElement("a");
                  link.setAttribute("data-fallback-link", "true");
                  link.href = url;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  link.textContent = `Open ${label}`;
                  link.className = "text-xs text-blue-600 underline";
                  container.appendChild(link);
                }
                return;
              }
              // Try fetching as blob (helps when direct image load path needs auth headers disabled by server or content-disposition issues)
              try {
                const url = computeSrc();
                if (!url) throw new Error("no-url");
                // Try with cookies first; if a token exists in localStorage, also send Authorization
                const token = localStorage.getItem("auth_token");
                const headers: Record<string, string> = {};
                if (token) {
                  headers["Authorization"] = `Bearer ${token}`;
                }
                const resp = await fetch(url, {
                  credentials: "include",
                  headers,
                });
                if (!resp.ok) throw new Error("resp-not-ok");
                const ct = resp.headers.get("content-type") || "";
                if (
                  ct.includes("application/json") ||
                  ct.includes("text/json")
                ) {
                  // Parse JSON and try to extract a usable source
                  const json = await resp.json();
                  const data = (json && (json.data || json)) || {};
                  const base64: string | undefined =
                    data.base64 ||
                    data.fileBase64 ||
                    data.imageBase64 ||
                    data.file ||
                    data.content;
                  const mimetype: string =
                    data.mimetype ||
                    data.mimeType ||
                    data.contentType ||
                    "image/*";
                  const filepath: string | undefined =
                    data.filepath || data.path;
                  const directUrl: string | undefined = data.url || data.link;

                  if (base64) {
                    const blobFromBase64 = base64ToBlob(base64, mimetype);
                    if (
                      !blobFromBase64 ||
                      (blobFromBase64.type &&
                        !blobFromBase64.type.startsWith("image/"))
                    ) {
                      throw new Error("json-not-image");
                    }
                    const objUrl = URL.createObjectURL(blobFromBase64);
                    target.setAttribute("data-blob-retried", "true");
                    target.src = objUrl;
                    target.style.display = "block";
                    return;
                  }
                  if (directUrl) {
                    target.setAttribute("data-blob-retried", "true");
                    target.src = directUrl;
                    target.style.display = "block";
                    return;
                  }
                  if (filepath) {
                    const abs = getFileUrl(filepath);
                    target.setAttribute("data-blob-retried", "true");
                    target.src = abs;
                    target.style.display = "block";
                    return;
                  }
                  throw new Error("json-no-usable");
                } else {
                  const blob = await resp.blob();
                  if (!blob || (blob.type && !blob.type.startsWith("image/"))) {
                    throw new Error("not-image");
                  }
                  const objUrl = URL.createObjectURL(blob);
                  target.setAttribute("data-blob-retried", "true");
                  target.src = objUrl;
                  target.style.display = "block";
                }
              } catch (err) {
                // Fallback to link
                target.style.display = "none";
                const container = target.parentElement;
                const existing = container?.querySelector(
                  "a[data-fallback-link='true']"
                );
                const url = computeSrc();
                if (container && url && !existing) {
                  const link = document.createElement("a");
                  link.setAttribute("data-fallback-link", "true");
                  link.href = url;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  link.textContent = `Open ${label}`;
                  link.className = "text-xs text-blue-600 underline";
                  container.appendChild(link);
                }
              }
            }}
            onClick={() => {
              if (onImageClick) {
                const src = computeSrc();
                if (src) onImageClick(src, label, documentType);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

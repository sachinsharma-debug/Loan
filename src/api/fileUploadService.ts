// services/file-upload-api.ts
const API_BASE_URL = "https://api-finance.prudent360.in/api/v1";

export interface FileUploadResponse {
  success: boolean;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  id: string;
}

export const fileUploadApi = {
  // Upload a single file using masterupload endpoint
  uploadFile: async (
    file: File,
    category: string = "general",
    signal?: AbortSignal
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();

    console.log(file);
    formData.append("file", file);
    formData.append("category", category);

    const response = await fetch(`${API_BASE_URL}/masterupload`, {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const raw = await response.json();
    // Normalize to FileUploadResponse shape
    const normalized: FileUploadResponse = {
      success: !!raw.success || true,
      filePath: raw.filePath || raw.filepath || "",
      fileName: raw.fileName || raw.originalFilename || raw.newFilename || "",
      fileSize: raw.fileSize || raw.size || 0,
      mimeType: raw.mimeType || raw.mimetype || "",
      uploadedAt: raw.uploadedAt || "",
      id: raw.id || raw._id || raw.filepath || raw.newFilename || "",
    };
    return normalized;
  },

  // Upload multiple files
  uploadMultipleFiles: async (
    files: File[],
    category: string = "general"
  ): Promise<FileUploadResponse[]> => {
    const uploadPromises = files.map((file) =>
      fileUploadApi.uploadFile(file, category)
    );
    return Promise.all(uploadPromises);
  },

  // Upload guarantor document
  uploadGuarantorDocument: async (
    file: File,
    guarantorId: string,
    documentType:
      | "pan"
      | "passport"
      | "aadhar"
      | "photo"
      | "signature"
      | "thumb",
    signal?: AbortSignal
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("guarantorId", guarantorId);
    formData.append("documentType", documentType);
    formData.append("category", `guarantor-${documentType}`);

    const response = await fetch(`${API_BASE_URL}/masterupload`, {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw new Error("Failed to upload guarantor document");
    }

    const raw = await response.json();
    const normalized: FileUploadResponse = {
      success: !!raw.success || true,
      filePath: raw.filePath || raw.filepath || "",
      fileName: raw.fileName || raw.originalFilename || raw.newFilename || "",
      fileSize: raw.fileSize || raw.size || 0,
      mimeType: raw.mimeType || raw.mimetype || "",
      uploadedAt: raw.uploadedAt || "",
      id: raw.id || raw._id || raw.filepath || raw.newFilename || "",
    };
    return normalized;
  },

  // Delete a file (you may need to implement this endpoint on your backend)
  deleteFile: async (fileId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/mastergetfile/${fileId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
  },

  // Get file URL using mastergetfile endpoint
  getFileUrl: (fileId: string): string => {
    if (!fileId) return "";
    const looksLikeUrl = /^(https?:)?\/\//i.test(fileId);
    if (looksLikeUrl) return fileId;
    const looksLikePath =
      /[\\\/]/.test(fileId) ||
      /\.[a-zA-Z0-9]+$/.test(fileId) ||
      /mastergetfile\//.test(fileId);
    if (looksLikePath) {
      // Normalize slashes and trim leading '/'
      let normalized = fileId.replace(/\\/g, "/").replace(/^\/+/, "");
      // Avoid duplicating api/v1 if present in both API_BASE_URL and the incoming path
      const apiPrefix = "api/v1/";
      if (normalized.toLowerCase().startsWith(apiPrefix)) {
        normalized = normalized.slice(apiPrefix.length);
      }
      return `${API_BASE_URL}/${normalized}`;
    }
    // Treat as a raw id for mastergetfile
    return `${API_BASE_URL}/mastergetfile/${encodeURIComponent(fileId)}`;
  },

  // Get file metadata
  getFileMetadata: async (fileId: string): Promise<FileUploadResponse> => {
    const response = await fetch(`${API_BASE_URL}/mastergetfile/${fileId}`);

    if (!response.ok) {
      throw new Error("Failed to get file metadata");
    }

    return response.json();
  },
};

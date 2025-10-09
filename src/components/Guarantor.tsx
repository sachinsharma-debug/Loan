import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit, Plus, Search, Upload, Trash2, X } from "lucide-react";
import { Guarantor, EmploymentInfo } from "@/types";
import { createFormKeyDownHandler } from "@/lib/formNavigation";
import { guarantorApi } from "@/api/guarantorapi";
import { fileUploadApi, FileUploadResponse } from "@/api/fileUploadService";
import { FileUploadField } from "@/components/FileUploadField";
import { toast } from "react-toastify";

const GuarantorComponent = () => {
  // API state
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Unified form dialog state (add/edit/view)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit" | "view">("add");
  const [currentItem, setCurrentItem] = useState<Guarantor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sameAsCommunication, setSameAsCommunication] = useState(false);
  const [isOccupationDialogOpen, setIsOccupationDialogOpen] = useState(false);
  const [employmentType, setEmploymentType] = useState("");
  const [occupationValue, setOccupationValue] = useState("");
  const [isOccupationFilled, setIsOccupationFilled] = useState(false);
  const [editingOccupationData, setEditingOccupationData] = useState<any>(null);
  // Detailed employment information to persist to backend
  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfo | null>(
    null
  );
  // Marital status handling similar to Member component
  const [maritalStatusState, setMaritalStatusState] = useState<
    string | undefined
  >(undefined);
  const [spouseNameState, setSpouseNameState] = useState<string>("");

  useEffect(() => {
    // Clear spouse name whenever marital status is not 'married'
    if (maritalStatusState !== "married" && spouseNameState !== "") {
      setSpouseNameState("");
    }
  }, [maritalStatusState, spouseNameState]);

  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: FileUploadResponse | null;
  }>({});

  console.log(uploadedFiles, "askdlks ");
  // Track in-flight uploads so we can abort on cancel
  const [uploadControllers, setUploadControllers] = useState<
    Partial<
      Record<
        "pan" | "passport" | "aadhar" | "photo" | "signature" | "thumb",
        AbortController
      >
    >
  >({});

  // Image preview states
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [previewImageTitle, setPreviewImageTitle] = useState("");
  const [previewDocType, setPreviewDocType] = useState<
    "pan" | "passport" | "aadhar" | "photo" | "signature" | "thumb" | ""
  >("");

  // Local preview URLs for instant feedback after selecting files
  const [localPreviews, setLocalPreviews] = useState<
    Partial<
      Record<
        "pan" | "passport" | "aadhar" | "photo" | "signature" | "thumb",
        string
      >
    >
  >({});

  // Address state (Member-style UI but keeping Guarantor field names)
  const [commAddress, setCommAddress] = useState({
    address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    postoffice: "",
    policestation: "",
    landmark: "",
  });
  const [permAddress, setPermAddress] = useState({
    address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    postoffice: "",
    policestation: "",
    landmark: "",
  });

  // Load guarantors on component mount
  useEffect(() => {
    fetchGuarantors();
  }, []);

  // Search functionality
  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        setLoading(true);
        const results = await guarantorApi.search(query);
        setGuarantors(results || []);
      } catch (err) {
        toast.error("Failed to search guarantors");
      } finally {
        setLoading(false);
      }
    } else {
      fetchGuarantors();
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        handleSearch(searchTerm);
      } else if (searchTerm === "") {
        fetchGuarantors();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API Functions
  const fetchGuarantors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching guarantors from API...");
      const data = await guarantorApi.getAll();
      console.log("API Response:", data);
      // Ensure data is always an array and normalize id/name fields if backend differs
      const list = (Array.isArray(data) ? data : []) as any[];
      const normalized = list.map((g) => ({
        ...g,
        id:
          g?.id ??
          g?._id ??
          g?.guarantorId ??
          g?.GuarantorId ??
          g?.GuarantorID ??
          "",
        guarantorName:
          g?.guarantorName ?? g?.name ?? g?.GuarantorName ?? g?.Guarantor ?? "",
      }));
      setGuarantors(normalized as unknown as Guarantor[]);
      console.log("Guarantors set:", Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching guarantors:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch guarantors"
      );
      setGuarantors([]); // Set empty array on error
      toast.error("Failed to fetch guarantors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuarantor = async (formData: FormData) => {
    try {
      setLoading(true);
      const guarantorData = Object.fromEntries(formData.entries());

      // Convert form field names to match Guarantor interface
      const mappedData: Partial<Guarantor> = {
        branch: guarantorData.branch as string,
        date: guarantorData.date as string,
        id: guarantorData.guarantorid as string,
        guarantorName: guarantorData.guarantorname as string,
        parent: guarantorData.parent as string,
        fathersName: guarantorData.fathersname as string,
        mothersName: guarantorData.mothersname as string,
        dateOfBirth: guarantorData.dateofbirth as string,
        age: guarantorData.age
          ? parseInt(guarantorData.age as string)
          : undefined,
        gender: guarantorData.gender as string,
        maritalStatus: guarantorData.maritalstatus as string,
        religion: guarantorData["religion-field"] as string,
        spouseName: guarantorData["spousename"] as string,
        sourceOfIncome: guarantorData.sourceofincome as string,
        occupation: guarantorData.occupation as string,
        mobileNo: guarantorData["mobile-no"] as string,
        telephoneNo: guarantorData["telephone-no"] as string,
        email: guarantorData.email as string,
        salesman: guarantorData.salesman as string,
        reference: guarantorData.reference as string,
        address: guarantorData.address as string,
        district: guarantorData.district as string,
        city: guarantorData.city as string,
        state: guarantorData.state as string,
        postOffice: guarantorData.postoffice as string,
        pincode: guarantorData.pincode as string,
        policeStation: guarantorData.policestation as string,
        landmark: guarantorData.landmark as string,
        permanentAddress: guarantorData["permanent-address"] as string,
        permanentDistrict: guarantorData["permanent-district"] as string,
        permanentCity: guarantorData["permanent-city"] as string,
        permanentState: guarantorData["permanent-state"] as string,
        permanentPostOffice: guarantorData["permanent-postoffice"] as string,
        permanentPincode: guarantorData["permanent-pincode"] as string,
        permanentPoliceStation: guarantorData[
          "permanent-policestation"
        ] as string,
        permanentLandmark: guarantorData["permanent-landmark"] as string,
        cibilScore: guarantorData.cibilscore
          ? parseInt(guarantorData.cibilscore as string)
          : undefined,
        panNo: guarantorData["pan-no"] as string,
        passportNo: guarantorData["passport-no"] as string,
        aadharCardNo: guarantorData["aadharcard-no"] as string,
        // carry file ids separately if present from hidden/extra fields (for edit)
        panFileId: (guarantorData["panfileid"] as string) || undefined,
        passportFileId:
          (guarantorData["passportfileid"] as string) || undefined,
        aadharFileId: (guarantorData["aadharfileid"] as string) || undefined,
        // Image/document path fields as provided by the form (may be ids, paths, or URLs)
        photoPath: (guarantorData["photopath"] as string) || undefined,
        signaturePath: (guarantorData["signaturepath"] as string) || undefined,
        thumbImpressionPath:
          (guarantorData["thumbimpressionpath"] as string) || undefined,
        kycDocuments: ["yes", "true", "on", "1"].includes(
          String(guarantorData.kycdocuments || "").toLowerCase()
        ),
        bankDetails: ["yes", "true", "on", "1"].includes(
          String(guarantorData.bankdetails || "").toLowerCase()
        ),
        monthlyIncome: guarantorData.monthlyincome
          ? parseFloat(guarantorData.monthlyincome as string)
          : undefined,
      };

      // Add uploaded file IDs to guarantor data
      if (uploadedFiles.pan) mappedData.panFileId = uploadedFiles.pan.id;
      if (uploadedFiles.passport)
        mappedData.passportFileId = uploadedFiles.passport.id;
      if (uploadedFiles.aadhar)
        mappedData.aadharFileId = uploadedFiles.aadhar.id;
      if (uploadedFiles.photo) mappedData.photoPath = uploadedFiles.photo.id;
      if (uploadedFiles.signature)
        mappedData.signaturePath = uploadedFiles.signature.id;
      if (uploadedFiles.thumb)
        mappedData.thumbImpressionPath = uploadedFiles.thumb.id;

      // Merge employment info captured from Occupation dialog
      if (employmentInfo) {
        Object.assign(mappedData, employmentInfo);
      }

      const newGuarantor = await guarantorApi.create(mappedData);
      // Some backends return only a message or partial object; refresh to be safe
      if (newGuarantor && newGuarantor.id) {
        setGuarantors((prev) => [...prev, newGuarantor]);
      }
      // Always fetch fresh list to reflect server truth (ids, defaults, etc.)
      await fetchGuarantors();

      toast.success("Guarantor added successfully");

      // Close unified dialog after successful add
      setIsFormDialogOpen(false);
      setCurrentItem(null);
      setFormMode("add");
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add guarantor"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGuarantor = async (id: string, formData: FormData) => {
    try {
      setLoading(true);
      const guarantorData = Object.fromEntries(formData.entries());

      // Convert form field names to match Guarantor interface
      const mappedData: Partial<Guarantor> = {
        branch: guarantorData.branch as string,
        date: guarantorData.date as string,
        guarantorName: guarantorData.guarantorname as string,
        parent: guarantorData.parent as string,
        fathersName: guarantorData.fathersname as string,
        mothersName: guarantorData.mothersname as string,
        dateOfBirth: guarantorData.dateofbirth as string,
        age: guarantorData.age
          ? parseInt(guarantorData.age as string)
          : undefined,
        gender: guarantorData.gender as string,
        maritalStatus: guarantorData.maritalstatus as string,
        religion: guarantorData["religion-field"] as string,
        spouseName: guarantorData["spousename"] as string,
        sourceOfIncome: guarantorData.sourceofincome as string,
        occupation: guarantorData.occupation as string,
        mobileNo: guarantorData["mobile-no"] as string,
        telephoneNo: guarantorData["telephone-no"] as string,
        email: guarantorData.email as string,
        salesman: guarantorData.salesman as string,
        reference: guarantorData.reference as string,
        address: guarantorData.address as string,
        district: guarantorData.district as string,
        city: guarantorData.city as string,
        state: guarantorData.state as string,
        postOffice: guarantorData.postoffice as string,
        pincode: guarantorData.pincode as string,
        policeStation: guarantorData.policestation as string,
        landmark: guarantorData.landmark as string,
        permanentAddress: guarantorData["permanent-address"] as string,
        permanentDistrict: guarantorData["permanent-district"] as string,
        permanentCity: guarantorData["permanent-city"] as string,
        permanentState: guarantorData["permanent-state"] as string,
        permanentPostOffice: guarantorData["permanent-postoffice"] as string,
        permanentPincode: guarantorData["permanent-pincode"] as string,
        permanentPoliceStation: guarantorData[
          "permanent-policestation"
        ] as string,
        permanentLandmark: guarantorData["permanent-landmark"] as string,
        cibilScore: guarantorData.cibilscore
          ? parseInt(guarantorData.cibilscore as string)
          : undefined,
        panNo: guarantorData["pan-no"] as string,
        passportNo: guarantorData["passport-no"] as string,
        aadharCardNo: guarantorData["aadharcard-no"] as string,
        panFileId: (guarantorData["panfileid"] as string) || undefined,
        passportFileId:
          (guarantorData["passportfileid"] as string) || undefined,
        aadharFileId: (guarantorData["aadharfileid"] as string) || undefined,
        // Bring forward existing stored paths/ids if user didn't re-upload
        photoPath: (guarantorData["photopath"] as string) || undefined,
        signaturePath: (guarantorData["signaturepath"] as string) || undefined,
        thumbImpressionPath:
          (guarantorData["thumbimpressionpath"] as string) || undefined,
        kycDocuments: ["yes", "true", "on", "1"].includes(
          String(guarantorData.kycdocuments || "").toLowerCase()
        ),
        bankDetails: ["yes", "true", "on", "1"].includes(
          String(guarantorData.bankdetails || "").toLowerCase()
        ),
        monthlyIncome: guarantorData.monthlyincome
          ? parseFloat(guarantorData.monthlyincome as string)
          : undefined,
      };

      // If user uploaded/changed files in edit, prefer those new IDs (single block)
      if (uploadedFiles.pan) mappedData.panFileId = uploadedFiles.pan.id;
      if (uploadedFiles.passport)
        mappedData.passportFileId = uploadedFiles.passport.id;
      if (uploadedFiles.aadhar)
        mappedData.aadharFileId = uploadedFiles.aadhar.id;
      if (uploadedFiles.photo) mappedData.photoPath = uploadedFiles.photo.id;
      if (uploadedFiles.signature)
        mappedData.signaturePath = uploadedFiles.signature.id;
      if (uploadedFiles.thumb)
        mappedData.thumbImpressionPath = uploadedFiles.thumb.id;

      // Merge employment info captured from Occupation dialog
      if (employmentInfo) {
        Object.assign(mappedData, employmentInfo);
      }

      const updatedGuarantor = await guarantorApi.update(id, mappedData);
      setGuarantors((prev) =>
        prev.map((g) => (g.id === id ? updatedGuarantor : g))
      );
      toast.success("Guarantor updated successfully");

      // Close unified dialog after successful update
      setIsFormDialogOpen(false);
      setCurrentItem(null);
      setFormMode("add");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update guarantor"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuarantor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guarantor?")) return;

    const originalGuarantors = [...guarantors]; // Backup for rollback if needed

    try {
      setLoading(true);
      console.log("Deleting guarantor with ID:", id);

      // Optimistically update UI first (remove from list immediately)
      setGuarantors((prev) => {
        const filteredGuarantors = prev.filter((g) => g.id !== id);
        console.log(
          "Optimistically updated guarantors list:",
          filteredGuarantors
        );
        return filteredGuarantors;
      });

      // Call the delete API
      await guarantorApi.delete(id);
      console.log("Delete API call successful");

      console.log("Guarantor deleted successfully");
      toast.success("Guarantor deleted successfully");

      // Force refresh
      setRefreshTrigger((prev) => prev + 1);

      // Refresh the list from server after a short delay to ensure consistency
      setTimeout(() => {
        fetchGuarantors();
      }, 1000);
    } catch (err) {
      console.error("Error deleting guarantor:", err);

      // Rollback the optimistic update on error
      setGuarantors(originalGuarantors);
      console.log("Rolled back guarantors list due to error");

      toast.error(
        err instanceof Error ? err.message : "Failed to delete guarantor"
      );
    } finally {
      setLoading(false);
    }
  };

  // File upload functions
  const handleFileUpload = async (
    file: File,
    documentType:
      | "pan"
      | "passport"
      | "aadhar"
      | "photo"
      | "signature"
      | "thumb"
  ) => {
    try {
      setUploadingFiles((prev) => ({ ...prev, [documentType]: true }));

      // Create a local object URL for instant preview
      const objectUrl = URL.createObjectURL(file);
      setLocalPreviews((prev) => ({ ...prev, [documentType]: objectUrl }));

      const controller = new AbortController();
      setUploadControllers((prev) => ({ ...prev, [documentType]: controller }));

      const uploadResult = await fileUploadApi.uploadFile(
        file,
        `guarantor-${documentType}`,
        controller.signal
      );
      setUploadedFiles((prev) => ({ ...prev, [documentType]: uploadResult }));

      // Keep showing local preview until the server URL is confirmed loaded
      const serverUrl = fileUploadApi.getFileUrl(uploadResult.id);
      const tryLoad = (url: string) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });

      // Try up to 3 times with small delay
      let loaded = await tryLoad(serverUrl);
      if (!loaded) {
        await new Promise((r) => setTimeout(r, 800));
        loaded = await tryLoad(serverUrl);
      }
      if (!loaded) {
        await new Promise((r) => setTimeout(r, 1200));
        loaded = await tryLoad(serverUrl);
      }

      if (loaded) {
        // Now safe to remove local preview and rely on server URL
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        setLocalPreviews((prev) => {
          const next = { ...prev } as Record<string, string>;
          delete next[documentType];
          return next as typeof prev;
        });
      } else {
        // Keep local preview; user will still see image. We can optionally try again later.
      }

      toast.success(`${documentType} uploaded successfully`);
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        // Silent on abort
      } else {
        toast.error(`Failed to upload ${documentType}`);
      }
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
      setUploadControllers((prev) => {
        const next = { ...prev };
        delete next[documentType];
        return next;
      });
    }
  };

  const handleRemoveFile = async (documentType: string) => {
    // Abort any in-flight upload for this document type
    const controller = (
      uploadControllers as Record<string, AbortController | undefined>
    )[documentType];
    if (controller) {
      try {
        controller.abort();
      } catch {}
    }
    setUploadControllers((prev) => {
      const next = { ...prev } as Record<string, AbortController>;
      delete next[documentType];
      return next as typeof prev;
    });

    const fileData = uploadedFiles[documentType];

    // Optimistically clear local UI state so user can upload another file immediately
    setUploadedFiles((prev) => ({ ...prev, [documentType]: null }));
    setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
    setLocalPreviews((prev) => {
      const current = (prev as Record<string, string | undefined>)[
        documentType
      ];
      if (current && current.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(current);
        } catch {}
      }
      const next = { ...prev } as Record<string, string>;
      delete next[documentType];
      return next as typeof prev;
    });

    // Attempt server-side delete in background, but don't block local removal
    if (fileData?.id) {
      try {
        await fileUploadApi.deleteFile(fileData.id);
        // Optionally: toast.info(`${documentType} deleted on server`);
      } catch (err) {
        // Keep UI clean even if server delete fails; avoid error toast per user request
        // Optionally log or show a subtle notice
      }
    }

    toast.success(`${documentType} removed locally`);
  };

  const resetForm = () => {
    setSameAsCommunication(false);
    setOccupationValue("");
    setIsOccupationFilled(false);
    setUploadedFiles({});
    // Revoke any blob urls before clearing
    Object.values(localPreviews).forEach((url) => {
      if (url && url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }
    });
    setLocalPreviews({});
    setEmploymentType("");
    setEditingOccupationData(null);
    setEmploymentInfo(null);
    setMaritalStatusState(undefined);
    setSpouseNameState("");
    setCommAddress({
      address: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      postoffice: "",
      policestation: "",
      landmark: "",
    });
    setPermAddress({
      address: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      postoffice: "",
      policestation: "",
      landmark: "",
    });
  };

  const seedUploadsFromItem = (item: Guarantor) => {
    // Only seed for image/file-backed fields. Skip pan/passport/aadhar since those are document numbers, not file ids.
    const seed = (
      ref?: string,
      fileNameHint?: string
    ): FileUploadResponse | null => {
      if (!ref) return null;
      return {
        success: true,
        filePath: "",
        fileName: ref || fileNameHint || "Existing",
        fileSize: 0,
        mimeType: "",
        uploadedAt: "",
        id: ref,
      };
    };
    setUploadedFiles({
      pan: seed((item as any).panFileId, "PAN File"),
      passport: seed((item as any).passportFileId, "Passport File"),
      aadhar: seed((item as any).aadharFileId, "Aadhar File"),
      photo: seed(item.photoPath, "Photo"),
      signature: seed(item.signaturePath, "Signature"),
      thumb: seed(item.thumbImpressionPath, "Thumb"),
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setCurrentItem(null);
    setFormMode("add");
    setMaritalStatusState(undefined);
    setSpouseNameState("");
    setIsFormDialogOpen(true);
  };

  // Seed address state when dialog opens for edit/view
  useEffect(() => {
    if (isFormDialogOpen) {
      if (formMode !== "add" && currentItem) {
        setCommAddress({
          address: currentItem.address || "",
          state: currentItem.state || "",
          district: currentItem.district || "",
          city: currentItem.city || "",
          pincode: currentItem.pincode || "",
          postoffice: currentItem.postOffice || "",
          policestation: currentItem.policeStation || "",
          landmark: currentItem.landmark || "",
        });
        setPermAddress({
          address: currentItem.permanentAddress || "",
          state: currentItem.permanentState || "",
          district: currentItem.permanentDistrict || "",
          city: currentItem.permanentCity || "",
          pincode: currentItem.permanentPincode || "",
          postoffice: currentItem.permanentPostOffice || "",
          policestation: currentItem.permanentPoliceStation || "",
          landmark: currentItem.permanentLandmark || "",
        });
      } else {
        setCommAddress({
          address: "",
          state: "",
          district: "",
          city: "",
          pincode: "",
          postoffice: "",
          policestation: "",
          landmark: "",
        });
        setPermAddress({
          address: "",
          state: "",
          district: "",
          city: "",
          pincode: "",
          postoffice: "",
          policestation: "",
          landmark: "",
        });
      }
    }
  }, [isFormDialogOpen, formMode, currentItem]);

  const handleEdit = (item: Guarantor) => {
    resetForm();
    setCurrentItem(item);
    setFormMode("edit");
    setOccupationValue(item.occupation || "");
    setIsOccupationFilled(!!item.occupation);
    seedUploadsFromItem(item);
    setMaritalStatusState(item.maritalStatus || "");
    setSpouseNameState(item.spouseName || "");
    setIsFormDialogOpen(true);
  };

  const handleView = (item: Guarantor) => {
    resetForm();
    setCurrentItem(item);
    setFormMode("view");
    setOccupationValue(item.occupation || "");
    setIsOccupationFilled(true);
    seedUploadsFromItem(item);
    setMaritalStatusState(item.maritalStatus || "");
    setSpouseNameState(item.spouseName || "");
    setIsFormDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formMode === "add") {
      handleAddGuarantor(formData);
    } else if (formMode === "edit" && currentItem) {
      handleUpdateGuarantor(currentItem.id, formData);
    }
  };

  const handleFormDialogClose = (open: boolean) => {
    setIsFormDialogOpen(open);
    if (!open) {
      // Abort any in-flight uploads
      Object.values(uploadControllers).forEach((c) => c?.abort());
      setUploadControllers({});
      setUploadingFiles({});
      resetForm();
    }
  };

  const handleOccupationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const employmentType = formData.get("employmentType") as string;
    // For self-employed, prefer designation; otherwise use position
    const positionOrDesignation =
      (employmentType === "self-employed"
        ? (formData.get("designation") as string)
        : (formData.get("position") as string)) || "";

    // Generate occupation value based on employment type
    let occupation = "";
    if (employmentType === "self-employed") {
      occupation = `Self Employed - ${positionOrDesignation || "Business"}`;
    } else if (employmentType === "salaried") {
      occupation = `Salaried - ${positionOrDesignation || "Employee"}`;
    } else if (employmentType === "self-employed-professional") {
      occupation = `Self Employed Professional - ${
        positionOrDesignation || "Professional"
      }`;
    } else if (employmentType === "others") {
      occupation = `Others - ${positionOrDesignation || "Worker"}`;
    }

    setOccupationValue(occupation);
    setIsOccupationFilled(true);
    setIsOccupationDialogOpen(false);
    setEmploymentType("");
    // Capture detailed employment info for backend persistence
    const nextInfo: EmploymentInfo = { employmentType };
    if (employmentType === "self-employed") {
      // Map business details to common employer fields for consistent backend storage
      const seName = (formData.get("name") as string) || "";
      const seAddr = (formData.get("address") as string) || "";
      const seDesig = (formData.get("designation") as string) || "";
      nextInfo.employerName = seName;
      nextInfo.employerAddress = seAddr;
      nextInfo.position = seDesig;
      nextInfo.tradeLicenseNo =
        (formData.get("trade-license-no") as string) || "";
      const yearsRaw = (formData.get("years") as string) || "0";
      nextInfo.years = Number.isNaN(parseInt(yearsRaw))
        ? undefined
        : parseInt(yearsRaw);
      const ai = (formData.get("annual-income") as string) || "";
      nextInfo.annualIncome = ai ? Number(ai) : undefined;
      const mi = (formData.get("monthly-income") as string) || "";
      nextInfo.monthlyIncome = mi ? Number(mi) : undefined;
      nextInfo.description = (formData.get("description") as string) || "";
    } else if (employmentType) {
      nextInfo.employerName = (formData.get("employer-name") as string) || "";
      nextInfo.employerAddress =
        (formData.get("employer-address") as string) || "";
      nextInfo.position = (formData.get("position") as string) || "";
      nextInfo.employmentNumber =
        (formData.get("employment-number") as string) || "";
      const ype = (formData.get("years-with-employer") as string) || "0";
      nextInfo.yearsWithEmployer = Number.isNaN(parseInt(ype))
        ? undefined
        : parseInt(ype);
      const as = (formData.get("annual-salary") as string) || "";
      nextInfo.annualSalary = as ? Number(as) : undefined;
      const ms = (formData.get("monthly-salary") as string) || "";
      nextInfo.monthlySalary = ms ? Number(ms) : undefined;
      nextInfo.description = (formData.get("description") as string) || "";
    }
    setEmploymentInfo(nextInfo);
  };

  const handleOccupationDialogClose = (open: boolean) => {
    setIsOccupationDialogOpen(open);
    if (!open) {
      setEmploymentType("");
      setEditingOccupationData(null);
    }
  };

  const handleResetOccupation = () => {
    setOccupationValue("");
    setIsOccupationFilled(false);
  };

  // Extract employment type from occupation value for editing
  const getEmploymentTypeFromOccupation = (occupation: string) => {
    if (occupation.startsWith("Self Employed Professional")) {
      return "self-employed-professional";
    } else if (occupation.startsWith("Self Employed")) {
      return "self-employed";
    } else if (occupation.startsWith("Salaried")) {
      return "salaried";
    } else if (occupation.startsWith("Others")) {
      return "others";
    }
    return "";
  };

  // Parse occupation data for editing (this is a simplified version - in real app, you'd store the original form data)
  const parseOccupationForEditing = (occupation: string) => {
    const employmentType = getEmploymentTypeFromOccupation(occupation);
    const parts = occupation.split(" - ");
    const detail = parts[1] || "";

    // Create comprehensive editing data structure with defaults
    const editingData: any = {
      employmentType,
      // Common defaults for all employment types
      employerName: "",
      employerAddress: "",
      employmentNumber: "",
      yearsWithEmployer: "0",
      annualSalary: "",
      monthlySalary: "",
      description: "",
      // Self-employed specific defaults
      name: "",
      address: "",
      tradeLicenseNo: "",
      years: "0",
      annualIncome: "",
      monthlyIncome: "",
    };

    if (employmentType === "self-employed") {
      editingData.designation = detail === "Business" ? "" : detail;
    } else if (
      employmentType === "salaried" ||
      employmentType === "self-employed-professional" ||
      employmentType === "others"
    ) {
      editingData.position =
        detail === "Employee" ||
        detail === "Professional" ||
        detail === "Worker"
          ? ""
          : detail;
    }

    return editingData;
  };

  // Helper functions for image handling
  const handleImageClick = (
    src: string,
    title: string,
    documentType:
      | "pan"
      | "passport"
      | "aadhar"
      | "photo"
      | "signature"
      | "thumb"
  ) => {
    setPreviewImageSrc(src);
    setPreviewImageTitle(title);
    setIsImagePreviewOpen(true);
    setPreviewDocType(documentType);
  };

  const getFileUrl = (fileId: string) => {
    console.log(fileUploadApi.getFileUrl(fileId));
    return fileUploadApi.getFileUrl(fileId);
  };

  const handleRemoveImage = async (imageType: string) => {
    let uploadedFileKey = "";

    switch (imageType) {
      case "pan-no":
        uploadedFileKey = "pan";
        break;
      case "passport-no":
        uploadedFileKey = "passport";
        break;
      case "aadharcard-no":
        uploadedFileKey = "aadhar";
        break;
      case "photopath":
        uploadedFileKey = "photo";
        break;
      case "signaturepath":
        uploadedFileKey = "signature";
        break;
      case "thumbimpressionpath":
        uploadedFileKey = "thumb";
        break;
    }

    await handleRemoveFile(uploadedFileKey);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guarantor</h1>
          <p className="text-gray-600 mt-2">Manage Guarantors</p>
        </div>
        {/* Removed Add Test Data button */}
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Guarantor</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center w-72 h-9 rounded-md border border-input bg-background px-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search guarantors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2"
                />
              </div>
              <Button onClick={handleOpenAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Guarantor
              </Button>
              <Dialog
                open={isFormDialogOpen}
                onOpenChange={handleFormDialogClose}
              >
                <DialogContent className="max-w-4xl max-h-[99vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {formMode === "add"
                        ? "Add New Guarantor"
                        : formMode === "edit"
                        ? "Edit Guarantor"
                        : "View Guarantor Details"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleFormSubmit}
                    onKeyDown={createFormKeyDownHandler()}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="branch"
                          className="text-xs w-32 text-right"
                        >
                          Branch:
                        </Label>
                        <Input
                          id="branch"
                          name="branch"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.branch || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="date"
                          className="text-xs w-32 text-right"
                        >
                          Date:
                        </Label>
                        <Input
                          type="date"
                          id="date"
                          name="date"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.date || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="guarantorid"
                          className="text-xs w-32 text-right"
                        >
                          Guarantor Id:
                        </Label>
                        <Input
                          id="guarantorid"
                          name="guarantorid"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.id || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="guarantorname"
                          className="text-xs w-32 text-right"
                        >
                          Guarantor Name:
                        </Label>
                        <Input
                          id="guarantorname"
                          name="guarantorname"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.guarantorName || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="parent"
                          className="text-xs w-32 text-right"
                        >
                          Parent:
                        </Label>
                        <Input
                          id="parent"
                          name="parent"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.parent || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>

                      <div className="col-span-2 my-4">
                        <div className="flex items-center">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <h3 className="px-4 text-sm font-medium text-gray-700">
                            Basic Info
                          </h3>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="fathersname"
                          className="text-xs w-32 text-right"
                        >
                          Father's Name:
                        </Label>
                        <Input
                          id="fathersname"
                          name="fathersname"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.fathersName || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="mothersname"
                          className="text-xs w-32 text-right"
                        >
                          Mother's Maiden Name:
                        </Label>
                        <Input
                          id="mothersname"
                          name="mothersname"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.mothersName || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="dateofbirth"
                          className="text-xs w-32 text-right"
                        >
                          Date of Birth:
                        </Label>
                        <Input
                          type="date"
                          id="dateofbirth"
                          name="dateofbirth"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.dateOfBirth || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="age"
                          className="text-xs w-32 text-right"
                        >
                          Age:
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? (currentItem?.age as any) || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="gender"
                          className="text-xs w-32 text-right"
                        >
                          Gender:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="gender"
                            defaultValue={
                              formMode !== "add"
                                ? currentItem?.gender || undefined
                                : undefined
                            }
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue placeholder="Select from below" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                            >
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="maritalstatus"
                          className="text-xs w-32 text-right"
                        >
                          Marital Status:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="maritalstatus"
                            value={
                              maritalStatusState ??
                              (formMode !== "add"
                                ? currentItem?.maritalStatus || ""
                                : "")
                            }
                            onValueChange={setMaritalStatusState}
                            disabled={formMode === "view"}
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue placeholder="Select from below" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                            >
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                              <SelectItem value="separated">
                                Separated
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {(maritalStatusState ?? currentItem?.maritalStatus) ===
                        "married" && (
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="spousename"
                            className="text-xs w-32 text-right"
                          >
                            Spouse Name:
                          </Label>
                          <Input
                            id="spousename"
                            name="spousename"
                            className="h-6 text-xs flex-1"
                            value={
                              spouseNameState ||
                              (formMode !== "add"
                                ? currentItem?.spouseName || ""
                                : "")
                            }
                            onChange={(e) => setSpouseNameState(e.target.value)}
                            readOnly={formMode === "view"}
                            style={
                              formMode === "view"
                                ? { backgroundColor: "#f3f4f6" }
                                : undefined
                            }
                            required={
                              (maritalStatusState ??
                                currentItem?.maritalStatus) === "married"
                            }
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="religion-field"
                          className="text-xs w-32 text-right"
                        >
                          Religion:
                        </Label>
                        <Input
                          id="religion-field"
                          name="religion-field"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.religion || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="sourceofincome"
                          className="text-xs w-32 text-right"
                        >
                          Source of Income:
                        </Label>
                        <Input
                          id="sourceofincome"
                          name="sourceofincome"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.sourceOfIncome || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="occupation"
                          className="text-xs w-32 text-right"
                        >
                          Occupation:
                        </Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          className="h-6 text-xs flex-1"
                          value={
                            formMode !== "add"
                              ? currentItem?.occupation || occupationValue
                              : occupationValue
                          }
                          onChange={(e) => {
                            if (!isOccupationFilled && formMode === "add") {
                              setOccupationValue(e.target.value);
                            }
                          }}
                          readOnly={isOccupationFilled || formMode !== "add"}
                          style={{
                            backgroundColor:
                              isOccupationFilled || formMode !== "add"
                                ? "#f3f4f6"
                                : "",
                            cursor:
                              isOccupationFilled || formMode !== "add"
                                ? "not-allowed"
                                : "text",
                          }}
                          required
                        />
                        {!isOccupationFilled && formMode === "add" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => setIsOccupationDialogOpen(true)}
                          >
                            Add Occupation
                          </Button>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="mobile-no"
                          className="text-xs w-32 text-right"
                        >
                          Mobile No.:
                        </Label>
                        <Input
                          id="mobile-no"
                          name="mobile-no"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.mobileNo || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="telephone-no"
                          className="text-xs w-32 text-right"
                        >
                          Telephone No.:
                        </Label>
                        <Input
                          id="telephone-no"
                          name="telephone-no"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.telephoneNo || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="email"
                          className="text-xs w-32 text-right"
                        >
                          Email:
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.email || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="salesman"
                          className="text-xs w-32 text-right"
                        >
                          Sales Man:
                        </Label>
                        <Input
                          id="salesman"
                          name="salesman"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? currentItem?.salesman || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="reference"
                          className="text-xs w-32 text-right"
                        >
                          Reference:
                        </Label>
                        <Input
                          id="reference"
                          name="reference"
                          className="h-6 text-xs flex-1"
                          defaultValue={
                            formMode !== "add"
                              ? (currentItem as any)?.reference || ""
                              : undefined
                          }
                          readOnly={formMode === "view"}
                          style={
                            formMode === "view"
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                          }
                          required
                        />
                      </div>

                      <div className="col-span-2 my-4">
                        <div className="flex items-center">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <h3 className="px-4 text-sm font-medium text-gray-700">
                            Address
                          </h3>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                      </div>

                      {/* Address Details - Member-style layout */}
                      <div className="col-span-2">
                        <div className="space-y-2">
                          <div className="flex items-start gap-6">
                            {/* Communication Address */}
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">
                                  Communication Address
                                </h3>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Label
                                    htmlFor="address"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Address:
                                  </Label>
                                  <Textarea
                                    id="address"
                                    name="address"
                                    className="text-xs flex-1 min-h-[80px]"
                                    value={commAddress.address}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        address: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="state"
                                    className="text-xs text-right"
                                  >
                                    State:
                                  </Label>
                                  <Input
                                    id="state"
                                    name="state"
                                    className="h-7 text-xs"
                                    value={commAddress.state}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        state: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="district"
                                    className="text-xs text-right"
                                  >
                                    District:
                                  </Label>
                                  <Input
                                    id="district"
                                    name="district"
                                    className="h-7 text-xs"
                                    value={commAddress.district}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        district: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="city"
                                    className="text-xs text-right"
                                  >
                                    City:
                                  </Label>
                                  <Input
                                    id="city"
                                    name="city"
                                    className="h-7 text-xs"
                                    value={commAddress.city}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        city: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="pincode"
                                    className="text-xs text-right"
                                  >
                                    Pincode:
                                  </Label>
                                  <Input
                                    id="pincode"
                                    name="pincode"
                                    className="h-7 text-xs"
                                    value={commAddress.pincode}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        pincode: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="postoffice"
                                    className="text-xs text-right"
                                  >
                                    Post Office:
                                  </Label>
                                  <Input
                                    id="postoffice"
                                    name="postoffice"
                                    className="h-7 text-xs"
                                    value={commAddress.postoffice}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        postoffice: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="policestation"
                                    className="text-xs text-right"
                                  >
                                    Police Station:
                                  </Label>
                                  <Input
                                    id="policestation"
                                    name="policestation"
                                    className="h-7 text-xs"
                                    value={commAddress.policestation}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        policestation: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="landmark"
                                    className="text-xs text-right"
                                  >
                                    Landmark:
                                  </Label>
                                  <Input
                                    id="landmark"
                                    name="landmark"
                                    className="h-7 text-xs"
                                    value={commAddress.landmark}
                                    onChange={(e) =>
                                      setCommAddress({
                                        ...commAddress,
                                        landmark: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={formMode === "view"}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Vertical divider */}
                            <div
                              className="w-px bg-gray-200 self-stretch"
                              aria-hidden="true"
                            />

                            {/* Permanent Address */}
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">
                                  Permanent Address
                                </h3>
                                <label className="flex items-center gap-2 text-xs select-none ml-4">
                                  <Checkbox
                                    id="sameAsComm"
                                    checked={sameAsCommunication}
                                    onCheckedChange={(v: boolean) => {
                                      setSameAsCommunication(!!v);
                                      if (v) {
                                        setPermAddress({ ...commAddress });
                                      }
                                    }}
                                  />
                                  <span>Same as Communication Address</span>
                                </label>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Label
                                    htmlFor="permanent-address"
                                    className="text-xs text-right w-[120px] pt-1 flex-shrink-0"
                                  >
                                    Address:
                                  </Label>
                                  <Textarea
                                    id="permanent-address"
                                    name="permanent-address"
                                    className="text-xs flex-1 min-h-[80px]"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.address
                                        : permAddress.address
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        address: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-state"
                                    className="text-xs text-right"
                                  >
                                    State:
                                  </Label>
                                  <Input
                                    id="permanent-state"
                                    name="permanent-state"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.state
                                        : permAddress.state
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        state: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-district"
                                    className="text-xs text-right"
                                  >
                                    District:
                                  </Label>
                                  <Input
                                    id="permanent-district"
                                    name="permanent-district"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.district
                                        : permAddress.district
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        district: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-city"
                                    className="text-xs text-right"
                                  >
                                    City:
                                  </Label>
                                  <Input
                                    id="permanent-city"
                                    name="permanent-city"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.city
                                        : permAddress.city
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        city: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-pincode"
                                    className="text-xs text-right"
                                  >
                                    Pincode:
                                  </Label>
                                  <Input
                                    id="permanent-pincode"
                                    name="permanent-pincode"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.pincode
                                        : permAddress.pincode
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        pincode: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-postoffice"
                                    className="text-xs text-right"
                                  >
                                    Post Office:
                                  </Label>
                                  <Input
                                    id="permanent-postoffice"
                                    name="permanent-postoffice"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.postoffice
                                        : permAddress.postoffice
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        postoffice: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-policestation"
                                    className="text-xs text-right"
                                  >
                                    Police Station:
                                  </Label>
                                  <Input
                                    id="permanent-policestation"
                                    name="permanent-policestation"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.policestation
                                        : permAddress.policestation
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        policestation: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                                  <Label
                                    htmlFor="permanent-landmark"
                                    className="text-xs text-right"
                                  >
                                    Landmark:
                                  </Label>
                                  <Input
                                    id="permanent-landmark"
                                    name="permanent-landmark"
                                    className="h-7 text-xs"
                                    value={
                                      sameAsCommunication
                                        ? commAddress.landmark
                                        : permAddress.landmark
                                    }
                                    onChange={(e) =>
                                      setPermAddress({
                                        ...permAddress,
                                        landmark: e.target.value,
                                      })
                                    }
                                    required
                                    disabled={
                                      formMode === "view" || sameAsCommunication
                                    }
                                  />
                                </div>

                                {/* Hidden fields for same-as to ensure values submit */}
                                {sameAsCommunication && (
                                  <div className="hidden">
                                    <input
                                      type="hidden"
                                      name="permanent-address"
                                      value={commAddress.address}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-state"
                                      value={commAddress.state}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-district"
                                      value={commAddress.district}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-city"
                                      value={commAddress.city}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-pincode"
                                      value={commAddress.pincode}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-postoffice"
                                      value={commAddress.postoffice}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-policestation"
                                      value={commAddress.policestation}
                                    />
                                    <input
                                      type="hidden"
                                      name="permanent-landmark"
                                      value={commAddress.landmark}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 my-4">
                        <div className="flex items-center">
                          <div className="flex-1 border-t border-gray-300"></div>
                          <h3 className="px-4 text-sm font-medium text-gray-700">
                            Identity Details
                          </h3>
                          <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                      </div>

                      {/* Cibil Score */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Label
                            htmlFor="cibilscore"
                            className="text-xs w-32 text-right"
                          >
                            Cibil Score:
                          </Label>
                          <Input
                            id="cibilscore"
                            name="cibilscore"
                            className="h-6 text-xs flex-1"
                            defaultValue={
                              formMode !== "add"
                                ? (currentItem?.cibilScore as any) || ""
                                : undefined
                            }
                            readOnly={formMode === "view"}
                            style={
                              formMode === "view"
                                ? { backgroundColor: "#f3f4f6" }
                                : undefined
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* Pan No */}
                      <FileUploadField
                        label="Pan No"
                        fieldName="pan-no"
                        documentType="pan"
                        uploadedFile={uploadedFiles.pan}
                        isUploading={uploadingFiles.pan}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={() => handleRemoveFile("pan")}
                        onImageClick={handleImageClick}
                        getFileUrl={getFileUrl}
                        required
                        previewUrl={localPreviews.pan}
                        defaultValue={
                          formMode !== "add"
                            ? (currentItem?.panNo as any) || ""
                            : undefined
                        }
                        originalValue={
                          formMode !== "add"
                            ? (currentItem?.panFileId as any) || ""
                            : undefined
                        }
                        readOnly={formMode === "view"}
                      />
                      {/* carry pan file id through submit */}
                      <input
                        type="hidden"
                        name="panfileid"
                        value={
                          formMode !== "add" ? currentItem?.panFileId || "" : ""
                        }
                      />

                      {/* Passport No */}
                      <FileUploadField
                        label="Passport No"
                        fieldName="passport-no"
                        documentType="passport"
                        uploadedFile={uploadedFiles.passport}
                        isUploading={uploadingFiles.passport}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={() => handleRemoveFile("passport")}
                        onImageClick={handleImageClick}
                        getFileUrl={getFileUrl}
                        required
                        previewUrl={localPreviews.passport}
                        defaultValue={
                          formMode !== "add"
                            ? (currentItem?.passportNo as any) || ""
                            : undefined
                        }
                        originalValue={
                          formMode !== "add"
                            ? (currentItem?.passportFileId as any) || ""
                            : undefined
                        }
                        readOnly={formMode === "view"}
                      />
                      {/* carry passport file id through submit */}
                      <input
                        type="hidden"
                        name="passportfileid"
                        value={
                          formMode !== "add"
                            ? currentItem?.passportFileId || ""
                            : ""
                        }
                      />

                      {/* Aadhar Card No */}
                      <FileUploadField
                        label="Aadhar Card No"
                        fieldName="aadharcard-no"
                        documentType="aadhar"
                        uploadedFile={uploadedFiles.aadhar}
                        isUploading={uploadingFiles.aadhar}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={() => handleRemoveFile("aadhar")}
                        onImageClick={handleImageClick}
                        getFileUrl={getFileUrl}
                        required
                        previewUrl={localPreviews.aadhar}
                        defaultValue={
                          formMode !== "add"
                            ? (currentItem?.aadharCardNo as any) || ""
                            : undefined
                        }
                        originalValue={
                          formMode !== "add"
                            ? (currentItem?.aadharFileId as any) || ""
                            : undefined
                        }
                        readOnly={formMode === "view"}
                      />
                      {/* carry aadhar file id through submit */}
                      <input
                        type="hidden"
                        name="aadharfileid"
                        value={
                          formMode !== "add"
                            ? currentItem?.aadharFileId || ""
                            : ""
                        }
                      />

                      {/* Photo */}
                      <FileUploadField
                        label="Photo Path"
                        fieldName="photopath"
                        documentType="photo"
                        uploadedFile={uploadedFiles.photo}
                        isUploading={uploadingFiles.photo}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={() => handleRemoveFile("photo")}
                        onImageClick={handleImageClick}
                        getFileUrl={getFileUrl}
                        previewUrl={localPreviews.photo}
                        defaultValue={
                          formMode !== "add"
                            ? (currentItem?.photoPath as any) || ""
                            : undefined
                        }
                        originalValue={
                          formMode !== "add"
                            ? (currentItem?.photoPath as any) || ""
                            : undefined
                        }
                        readOnly={formMode === "view"}
                      />

                      {/* Signature */}
                      <FileUploadField
                        label="Signature Path"
                        fieldName="signaturepath"
                        documentType="signature"
                        uploadedFile={uploadedFiles.signature}
                        isUploading={uploadingFiles.signature}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={() => handleRemoveFile("signature")}
                        onImageClick={handleImageClick}
                        getFileUrl={getFileUrl}
                        previewUrl={localPreviews.signature}
                        defaultValue={
                          formMode !== "add"
                            ? (currentItem?.signaturePath as any) || ""
                            : undefined
                        }
                        originalValue={
                          formMode !== "add"
                            ? (currentItem?.signaturePath as any) || ""
                            : undefined
                        }
                        readOnly={formMode === "view"}
                      />

                      {/* Thumb Impression */}
                      <FileUploadField
                        label="Thumb Impression Path"
                        fieldName="thumbimpressionpath"
                        documentType="thumb"
                        uploadedFile={uploadedFiles.thumb}
                        isUploading={uploadingFiles.thumb}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={() => handleRemoveFile("thumb")}
                        onImageClick={handleImageClick}
                        getFileUrl={getFileUrl}
                        previewUrl={localPreviews.thumb}
                        defaultValue={
                          formMode !== "add"
                            ? (currentItem?.thumbImpressionPath as any) || ""
                            : undefined
                        }
                        originalValue={
                          formMode !== "add"
                            ? (currentItem?.thumbImpressionPath as any) || ""
                            : undefined
                        }
                        readOnly={formMode === "view"}
                      />

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="kycdocuments"
                          className="text-xs w-32 text-right"
                        >
                          KYC Documents:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="kycdocuments"
                            defaultValue={
                              formMode !== "add"
                                ? currentItem?.kycDocuments === true
                                  ? "yes"
                                  : currentItem?.kycDocuments === false
                                  ? "no"
                                  : (currentItem as any)?.kycDocuments
                                : undefined
                            }
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue placeholder="No" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                            >
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="bankdetails"
                          className="text-xs w-32 text-right"
                        >
                          Bank Details:
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="bankdetails"
                            defaultValue={
                              formMode !== "add"
                                ? currentItem?.bankDetails === true
                                  ? "yes"
                                  : currentItem?.bankDetails === false
                                  ? "no"
                                  : (currentItem as any)?.bankDetails
                                : undefined
                            }
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue placeholder="No" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]"
                            >
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    {formMode === "view" ? (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => handleFormDialogClose(false)}
                        >
                          Close
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleFormDialogClose(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading
                            ? formMode === "add"
                              ? "Adding..."
                              : "Updating..."
                            : formMode === "add"
                            ? "Add Guarantor"
                            : "Update Guarantor"}
                        </Button>
                      </div>
                    )}
                  </form>
                </DialogContent>
              </Dialog>

              {/* Occupation Dialog */}
              <Dialog
                open={isOccupationDialogOpen}
                onOpenChange={handleOccupationDialogClose}
              >
                <DialogContent className="max-w-4xl max-h-[99vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Employment Information</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleOccupationSubmit}
                    onKeyDown={createFormKeyDownHandler()}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-2">
                      <div className="flex items-center gap-2 md:col-span-2">
                        <Label
                          htmlFor="employmentType"
                          className="text-xs w-32 text-right"
                        >
                          Employed ?
                        </Label>
                        <div className="flex-1">
                          <Select
                            name="employmentType"
                            value={employmentType}
                            onValueChange={setEmploymentType}
                            required
                          >
                            <SelectTrigger className="h-6 text-xs w-full">
                              <SelectValue placeholder="Select One" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 overflow-y-auto w-[var(--radix-select-trigger-width)]">
                              <SelectItem value="others">Others</SelectItem>
                              <SelectItem value="salaried">Salaried</SelectItem>
                              <SelectItem value="self-employed">
                                Self Employed
                              </SelectItem>
                              <SelectItem value="self-employed-professional">
                                Self Employed Professional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Common fields for all except Self Employed */}
                      {employmentType && employmentType !== "self-employed" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="employer-name"
                              className="text-xs w-32 text-right"
                            >
                              Name of Employer
                            </Label>
                            <Input
                              id="employer-name"
                              name="employer-name"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.employerName || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="employer-address"
                              className="text-xs w-32 text-right"
                            >
                              Address of Employer
                            </Label>
                            <Input
                              id="employer-address"
                              name="employer-address"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.employerAddress || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="position"
                              className="text-xs w-32 text-right"
                            >
                              Position / Designation
                            </Label>
                            <Input
                              id="position"
                              name="position"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.position || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="employment-number"
                              className="text-xs w-32 text-right"
                            >
                              Employment Number
                            </Label>
                            <Input
                              id="employment-number"
                              name="employment-number"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.employmentNumber || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="years-with-employer"
                              className="text-xs w-32 text-right"
                            >
                              Years With Present Employer
                            </Label>
                            <Input
                              id="years-with-employer"
                              name="years-with-employer"
                              type="number"
                              defaultValue={
                                editingOccupationData?.yearsWithEmployer || "0"
                              }
                              className="h-6 text-xs flex-1"
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="annual-salary"
                              className="text-xs w-32 text-right"
                            >
                              Annual Salary
                            </Label>
                            <Input
                              id="annual-salary"
                              name="annual-salary"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.annualSalary || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="monthly-salary"
                              className="text-xs w-32 text-right"
                            >
                              Monthly Salary
                            </Label>
                            <Input
                              id="monthly-salary"
                              name="monthly-salary"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.monthlySalary || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2">
                            <Label
                              htmlFor="description"
                              className="text-xs w-32 text-right pt-1"
                            >
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              className="text-xs flex-1 h-20"
                              defaultValue={
                                editingOccupationData?.description || ""
                              }
                            />
                          </div>
                        </>
                      )}

                      {/* Self Employed specific fields */}
                      {employmentType === "self-employed" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="name"
                              className="text-xs w-32 text-right"
                            >
                              Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              className="h-6 text-xs flex-1"
                              defaultValue={editingOccupationData?.name || ""}
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="address"
                              className="text-xs w-32 text-right"
                            >
                              Address
                            </Label>
                            <Input
                              id="address"
                              name="address"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.address || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="designation"
                              className="text-xs w-32 text-right"
                            >
                              Designation
                            </Label>
                            <Input
                              id="designation"
                              name="designation"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.designation || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="trade-license-no"
                              className="text-xs w-32 text-right"
                            >
                              Trade License No.
                            </Label>
                            <Input
                              id="trade-license-no"
                              name="trade-license-no"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.tradeLicenseNo || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="years"
                              className="text-xs w-32 text-right"
                            >
                              No of Years
                            </Label>
                            <Input
                              id="years"
                              name="years"
                              type="number"
                              defaultValue={editingOccupationData?.years || "0"}
                              className="h-6 text-xs flex-1"
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="annual-income"
                              className="text-xs w-32 text-right"
                            >
                              Annual Income
                            </Label>
                            <Input
                              id="annual-income"
                              name="annual-income"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.annualIncome || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="monthly-income"
                              className="text-xs w-32 text-right"
                            >
                              Monthly Income
                            </Label>
                            <Input
                              id="monthly-income"
                              name="monthly-income"
                              className="h-6 text-xs flex-1"
                              defaultValue={
                                editingOccupationData?.monthlyIncome || ""
                              }
                              required
                            />
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2">
                            <Label
                              htmlFor="description"
                              className="text-xs w-32 text-right pt-1"
                            >
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              className="text-xs flex-1 h-20"
                              defaultValue={
                                editingOccupationData?.description || ""
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOccupationDialogClose(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Employment Information</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table key={`${guarantors.length}-${refreshTrigger}`}>
            <TableHeader>
              <TableRow>
                <TableHead>Guarantor ID</TableHead>
                <TableHead>Guarantor Name</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading guarantors...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-red-600"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : guarantors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No guarantors found
                  </TableCell>
                </TableRow>
              ) : Array.isArray(guarantors) ? (
                guarantors.map((item, idx) => {
                  const rowId =
                    (item as any)?.id ||
                    (item as any)?._id ||
                    (item as any)?.guarantorId ||
                    idx;
                  const displayId =
                    (item as any)?.id ||
                    (item as any)?.guarantorId ||
                    (item as any)?._id ||
                    "";
                  return (
                    <TableRow key={rowId}>
                      <TableCell className="font-medium">{displayId}</TableCell>
                      <TableCell className="font-medium">
                        {item.guarantorName}
                      </TableCell>
                      <TableCell>{item.mobileNo || "-"}</TableCell>
                      <TableCell>{item.email || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteGuarantor(
                                (item as any)?._id ||
                                  (item as any)?.id ||
                                  (item as any)?.guarantorId
                              )
                            }
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-red-600"
                  >
                    Invalid data format received
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{previewImageTitle} Preview</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative max-w-full max-h-[70vh] overflow-hidden rounded-lg border">
              <img
                src={previewImageSrc}
                alt={previewImageTitle}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsImagePreviewOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // Use the stored document type for reliable removal
                  const typeMap: Record<string, string> = {
                    pan: "pan",
                    passport: "passport",
                    aadhar: "aadhar",
                    photo: "photo",
                    signature: "signature",
                    thumb: "thumb",
                  };
                  const key = typeMap[previewDocType];
                  if (key) {
                    handleRemoveFile(key);
                  }
                  setIsImagePreviewOpen(false);
                }}
              >
                Remove Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuarantorComponent;

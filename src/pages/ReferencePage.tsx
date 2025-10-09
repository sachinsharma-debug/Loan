import React, { useEffect, useState, useCallback } from "react";
import Reference from "@/components/Reference";
import { Reference as ReferenceType, Branch } from "@/types";
import { referenceService } from "@/api/referenceService";
import { branchApi } from "@/api/organisationstructure";

const ReferencePage = () => {
  const [references, setReferences] = useState<ReferenceType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [refList, branchList] = await Promise.all([
          referenceService.getAll(),
          branchApi.getBranches(),
        ]);
        if (mounted) {
          const list = Array.isArray(refList)
            ? refList
            : (refList as any)?.data || [];
          const normalizedRefs = list.map((r: any) => ({
            ...r,
            id: r?.id ?? r?._id ?? String(r?.Id ?? r?.ID ?? ""),
          }));
          setReferences(normalizedRefs);
          setBranches(branchList || []);
        }
      } catch (e: any) {
        const msg = e?.message || "Failed to load data";
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const reloadReferences = useCallback(async () => {
    try {
      const refList = await referenceService.getAll();
      const list = Array.isArray(refList)
        ? refList
        : (refList as any)?.data || [];
      const normalizedRefs = list.map((r: any) => ({
        ...r,
        id: r?.id ?? r?._id ?? String(r?.Id ?? r?.ID ?? ""),
      }));
      setReferences(normalizedRefs);
    } catch {}
  }, []);

  const handleAddReference = useCallback(
    async (data: Omit<ReferenceType, "id">) => {
      try {
        const created = await referenceService.create(data);
        const reference = (created as any)?.data || created;
        const normalized: ReferenceType = {
          ...reference,
          id: reference?.id ?? reference?._id ?? String(Date.now()),
        };
        setReferences((prev) => [...prev, normalized]);
        await reloadReferences();
      } catch (e: any) {
        const msg = e?.message || "Failed to add reference";
        setError(msg);
        throw e;
      }
    },
    [reloadReferences]
  );

  const handleUpdateReference = useCallback(
    async (id: string, data: Partial<ReferenceType>) => {
      try {
        await referenceService.update(id, data);
        setReferences((prev) =>
          prev.map((ref) => (ref.id === id ? { ...ref, ...data } : ref))
        );
        await reloadReferences();
      } catch (e: any) {
        const msg = e?.message || "Failed to update reference";
        setError(msg);
        throw e;
      }
    },
    [reloadReferences]
  );

  const handleDeleteReference = useCallback(
    async (id: string) => {
      try {
        await referenceService.delete(id);
        setReferences((prev) => prev.filter((r) => r.id !== id));
        await reloadReferences();
      } catch (e: any) {
        const msg = e?.message || "Failed to delete reference";
        setError(msg);
        throw e;
      }
    },
    [reloadReferences]
  );

  return (
    <div>
      {loading && (
        <div className="p-4 text-sm text-gray-500">Loading references…</div>
      )}
      {error && <div className="p-4 text-sm text-red-600">{error}</div>}
      <Reference
        references={references}
        branches={branches}
        onAddReference={handleAddReference}
        onUpdateReference={handleUpdateReference}
        onDeleteReference={handleDeleteReference}
      />
    </div>
  );
};

export default ReferencePage;

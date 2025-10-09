import React, { useEffect, useState } from "react";
import PenaltyComponent from "@/components/Penalty";
import { Penalty } from "@/types";
import { penaltyService } from "@/api/penaltyService";

const PenaltyPage: React.FC = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch penalties on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    penaltyService
      .getAll()
      .then((data) => {
        if (mounted) {
          // Normalize: backend may wrap in { data: [...] }
          const list = Array.isArray(data)
            ? data
            : (data as any)?.data || (data as any)?.result || [];
          // Ensure id is string
          setPenalties(
            list.map((p: any) => ({
              ...p,
              id: p?.id ?? p?._id ?? String(p?.Id ?? p?.ID ?? ""),
            }))
          );
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch penalties");
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const fetchPenalties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await penaltyService.getAll();
      const list = Array.isArray(data)
        ? data
        : (data as any)?.data || (data as any)?.result || [];
      setPenalties(
        list.map((p: any) => ({
          ...p,
          id: p?.id ?? p?._id ?? String(p?.Id ?? p?.ID ?? ""),
        }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to fetch penalties");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPenalty = async (data: {
    penaltyType: "percentage" | "fixed";
    value: number;
    penaltyMode: "daywise" | "monthly" | "yearly";
    penaltyApplyOn: "principal" | "interest" | "total";
  }) => {
    setLoading(true);
    setError(null);
    try {
      await penaltyService.create(data);
      await fetchPenalties();
    } catch (err: any) {
      setError(err.message || "Failed to add penalty");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePenalty = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      await penaltyService.update(id, data);
      await fetchPenalties();
    } catch (err: any) {
      setError(err.message || "Failed to update penalty");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePenalty = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await penaltyService.delete(id);
      setPenalties((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete penalty");
    } finally {
      setLoading(false);
    }
  };

  if (loading && penalties.length === 0) {
    return <div className="p-6">Loading penalties...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <PenaltyComponent
      penalties={penalties}
      onAddPenalty={handleAddPenalty}
      onUpdatePenalty={handleUpdatePenalty}
      onDeletePenalty={handleDeletePenalty}
    />
  );
};

export default PenaltyPage;

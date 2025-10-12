import { useState, useCallback, useEffect } from "react";
import KycComponent from "@/components/kyc";
import { KYC } from "@/types";
import { kycService } from "@/api/kycService";
import { useSelector, useDispatch } from 'react-redux'
import { setcompanyid } from '../redux/storeSlice'

const KycPage = () => {
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const companyid = useSelector((state) => state?.Store.companyid)
  const dispatch = useDispatch()
  const [cmpchangerendor,setcmpchangerendor]=useState(true)
  const fetchKycs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kycService.getAll();
      setKycs(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch KYC documents"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKycs();
  }, [companyid]);

  const handleAddKYC = useCallback(async (data: Omit<KYC, "id">) => {
    try {
      setError(null);
     
      const newItem = await kycService.create(data);
      fetchKycs()
      // setKycs((prev) => [...prev, newItem]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add KYC document"
      );
      throw error;
    }
  }, []);

  const handleUpdateKYC = useCallback(
    async (id: string, data: Partial<KYC>) => {
      try {
        setError(null);
        const updatedItem = await kycService.update(id, data);
       fetchKycs()
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update KYC document"
        );
        throw error;
      }
    },
    []
  );

  const handleDeleteKYC = useCallback(async (id: string) => {
    try {
      setError(null);
      await kycService.delete(id);
      setKycs((prev) => prev.filter((kyc) => kyc.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete KYC document"
      );
      throw error;
    }
  }, []);

  return (
    <div>
      {error && <div className="p-4 text-sm text-red-600">{error}</div>}
      <KycComponent
        kycs={kycs}
        onAddKYC={handleAddKYC}
        onUpdateKYC={handleUpdateKYC}
        onDeleteKYC={handleDeleteKYC}
        loading={loading}
      />
    </div>
  );
};

export default KycPage;

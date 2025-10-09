import React, { useState } from "react";
import LoanCancellationReasonComponent from "@/components/LoanCancellationReason";
import { LoanCancellationReason } from "@/types";

const LoanCancellationReasonsPage: React.FC = () => {
  const [reasons, setReasons] = useState<LoanCancellationReason[]>([]);

  const handleAddReason = (data: { description: string }) => {
    const newReason: LoanCancellationReason = {
      id: (reasons.length + 1).toString(),
      ...data,
    };
    setReasons([...reasons, newReason]);
  };

  const handleUpdateReason = (id: string, data: any) => {
    setReasons(
      reasons.map((reason) =>
        reason.id === id ? { ...reason, ...data } : reason
      )
    );
  };

  const handleDeleteReason = (id: string) => {
    setReasons(reasons.filter((reason) => reason.id !== id));
  };

  return (
    <LoanCancellationReasonComponent
      reasons={reasons}
      onAddReason={handleAddReason}
      onUpdateReason={handleUpdateReason}
      onDeleteReason={handleDeleteReason}
    />
  );
};

export default LoanCancellationReasonsPage;

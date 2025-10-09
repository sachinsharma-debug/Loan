import React, { useState } from "react";
import TransactionTypeManager from "@/components/TransactionTypeManager";
import { TransactionType } from "@/types";

const TransactionTypePage = () => {
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );

  const handleAddTransactionType = (data: Omit<TransactionType, "id">) => {
    const newTransactionType = {
      ...data,
      id: (transactionTypes.length + 1).toString(),
    };
    setTransactionTypes([...transactionTypes, newTransactionType]);
  };

  const handleUpdateTransactionType = (
    id: string,
    data: Partial<TransactionType>
  ) => {
    setTransactionTypes(
      transactionTypes.map((type) =>
        type.id === id ? { ...type, ...data } : type
      )
    );
  };

  return (
    <TransactionTypeManager
      transactionTypes={transactionTypes}
      onAddTransactionType={handleAddTransactionType}
      onUpdateTransactionType={handleUpdateTransactionType}
    />
  );
};

export default TransactionTypePage;

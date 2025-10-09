import React, { useState } from "react";
import CasteComponent from "@/components/Caste";
import { Caste } from "@/types";

const CastePage = () => {
  const [castes, setCastes] = useState<Caste[]>([]);

  const handleAddCaste = (data: { casteName: string }) => {
    const newCaste: Caste = {
      id: (castes.length + 1).toString(),
      casteName: data.casteName,
    };
    setCastes([...castes, newCaste]);
  };

  const handleUpdateCaste = (id: string, data: any) => {
    setCastes(
      castes.map((caste) => (caste.id === id ? { ...caste, ...data } : caste))
    );
  };

  return (
    <CasteComponent
      castes={castes}
      onAddCaste={handleAddCaste}
      onUpdateCaste={handleUpdateCaste}
    />
  );
};

export default CastePage;

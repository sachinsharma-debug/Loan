import React, { useState } from "react";
import OccupationComponent from "@/components/Occupation";
import { Occupation } from "@/types";

const OccupationPage = () => {
  const [occupations, setOccupations] = useState<Occupation[]>([]);

  const handleAddOccupation = (data: { occupationName: string }) => {
    const newOccupation: Occupation = {
      id: (occupations.length + 1).toString(),
      occupationName: data.occupationName,
    };
    setOccupations([...occupations, newOccupation]);
  };

  const handleUpdateOccupation = (id: string, data: any) => {
    setOccupations(
      occupations.map((occupation) =>
        occupation.id === id ? { ...occupation, ...data } : occupation
      )
    );
  };

  return (
    <OccupationComponent
      occupations={occupations}
      onAddOccupation={handleAddOccupation}
      onUpdateOccupation={handleUpdateOccupation}
    />
  );
};

export default OccupationPage;

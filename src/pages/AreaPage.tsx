import React, { useState } from "react";
import AreaComponent from "@/components/Area";
import { Area } from "@/types";

const AreaPage = () => {
  const [areas, setAreas] = useState<Area[]>([]);

  const handleAddArea = (data: { areaName: string }) => {
    const newArea: Area = {
      id: (areas.length + 1).toString(),
      areaName: data.areaName,
    };
    setAreas([...areas, newArea]);
  };

  const handleUpdateArea = (id: string, data: any) => {
    setAreas(
      areas.map((area) => (area.id === id ? { ...area, ...data } : area))
    );
  };

  return (
    <AreaComponent
      areas={areas}
      onAddArea={handleAddArea}
      onUpdateArea={handleUpdateArea}
    />
  );
};

export default AreaPage;

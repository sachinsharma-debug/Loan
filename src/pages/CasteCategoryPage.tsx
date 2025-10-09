import React, { useState } from "react";
import CasteCategoryComponent from "@/components/CasteCategory";
import { CasteCategory } from "@/types";

const CasteCategoryPage = () => {
  const [casteCategories, setCasteCategories] = useState<CasteCategory[]>([]);

  const handleAddCasteCategory = (data: { casteCategoryName: string }) => {
    const newCasteCategory: CasteCategory = {
      id: (casteCategories.length + 1).toString(),
      casteCategoryName: data.casteCategoryName,
    };
    setCasteCategories([...casteCategories, newCasteCategory]);
  };

  const handleUpdateCasteCategory = (id: string, data: any) => {
    setCasteCategories(
      casteCategories.map((category) =>
        category.id === id ? { ...category, ...data } : category
      )
    );
  };

  return (
    <CasteCategoryComponent
      casteCategories={casteCategories}
      onAddCasteCategory={handleAddCasteCategory}
      onUpdateCasteCategory={handleUpdateCasteCategory}
    />
  );
};

export default CasteCategoryPage;

import React, { useState } from "react";
import EducationComponent from "@/components/Education";
import { Education } from "@/types";

const EducationPage = () => {
  const [educations, setEducations] = useState<Education[]>([]);

  const handleAddEducation = (data: { educationName: string }) => {
    const newEducation: Education = {
      id: (educations.length + 1).toString(),
      educationName: data.educationName,
    };
    setEducations([...educations, newEducation]);
  };

  const handleUpdateEducation = (id: string, data: any) => {
    setEducations(
      educations.map((education) =>
        education.id === id ? { ...education, ...data } : education
      )
    );
  };

  return (
    <EducationComponent
      educations={educations}
      onAddEducation={handleAddEducation}
      onUpdateEducation={handleUpdateEducation}
    />
  );
};

export default EducationPage;

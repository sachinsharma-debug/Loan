import React, { useState } from "react";
import RelationshipComponent from "@/components/Relationship";
import { Relationship } from "@/types";

const RelationshipPage = () => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  const handleAddRelationship = (data: { relationshipName: string }) => {
    const newRelationship: Relationship = {
      id: (relationships.length + 1).toString(),
      relationshipName: data.relationshipName,
    };
    setRelationships([...relationships, newRelationship]);
  };

  const handleUpdateRelationship = (id: string, data: any) => {
    setRelationships(
      relationships.map((relationship) =>
        relationship.id === id ? { ...relationship, ...data } : relationship
      )
    );
  };

  return (
    <RelationshipComponent
      relationships={relationships}
      onAddRelationship={handleAddRelationship}
      onUpdateRelationship={handleUpdateRelationship}
    />
  );
};

export default RelationshipPage;

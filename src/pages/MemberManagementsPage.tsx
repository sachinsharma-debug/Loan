import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MemberManagements from "@/components/MemberManagements";
import {
  KYC,
  Area,
  Occupation,
  Education,
  CasteCategory,
  Caste,
  Relationship,
  Guarantor,
  Member,
  SalesMan,
  Branch,
  Reference as ReferenceType,
} from "@/types";
import { referenceService } from "@/api/referenceService";
import { branchApi } from "@/api/organisationstructure";

const MemberManagementsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [kycs, setKycs] = useState<KYC[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [casteCategories, setCasteCategories] = useState<CasteCategory[]>([]);
  const [castes, setCastes] = useState<Caste[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [salesMen, setSalesMen] = useState<SalesMan[]>([]);
  // References/Branches for Reference section
  const [references, setReferences] = useState<ReferenceType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Helper: reload references from backend to reflect latest server state
  const reloadReferences = useCallback(async () => {
    try {
      const refList = await referenceService.getAll();
      const refs = Array.isArray(refList)
        ? refList
        : (refList as any)?.data || [];
      const normalizedRefs: ReferenceType[] = refs.map((r: any) => ({
        ...r,
        id: r?.id ?? r?._id ?? String(r?.Id ?? r?.ID ?? Date.now()),
      }));
      setReferences(normalizedRefs);
    } catch (e) {
      console.warn("Failed to reload references", e);
    }
  }, []);

  // Load references and branches once when the page mounts
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [refList, branchList] = await Promise.all([
          referenceService.getAll(),
          branchApi.getBranches(),
        ]);
        if (!mounted) return;
        const refs = Array.isArray(refList)
          ? refList
          : (refList as any)?.data || [];
        const normalizedRefs: ReferenceType[] = refs.map((r: any) => ({
          ...r,
          id: r?.id ?? r?._id ?? String(r?.Id ?? r?.ID ?? Date.now()),
        }));
        const branchesArr = Array.isArray(branchList)
          ? branchList
          : (branchList as any)?.data || [];
        setReferences(normalizedRefs);
        setBranches(branchesArr as Branch[]);
      } catch (e) {
        // Non-fatal; the Reference component will show its own errors/toasts
        console.warn("Failed to prefetch references/branches", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddKYC = (data: Omit<KYC, "id">) => {
    const newKYC = {
      ...data,
      id: (kycs.length + 1).toString(),
    };
    setKycs([...kycs, newKYC]);
  };

  const handleUpdateKYC = (id: string, data: Partial<KYC>) => {
    setKycs(kycs.map((kyc) => (kyc.id === id ? { ...kyc, ...data } : kyc)));
  };

  const handleAddArea = (data: Omit<Area, "id">) => {
    const newArea = {
      ...data,
      id: (areas.length + 1).toString(),
    };
    setAreas([...areas, newArea]);
  };

  const handleUpdateArea = (id: string, data: Partial<Area>) => {
    setAreas(
      areas.map((area) => (area.id === id ? { ...area, ...data } : area))
    );
  };

  const handleAddOccupation = (data: Omit<Occupation, "id">) => {
    const newOccupation = {
      ...data,
      id: (occupations.length + 1).toString(),
    };
    setOccupations([...occupations, newOccupation]);
  };

  const handleUpdateOccupation = (id: string, data: Partial<Occupation>) => {
    setOccupations(
      occupations.map((occupation) =>
        occupation.id === id ? { ...occupation, ...data } : occupation
      )
    );
  };

  const handleAddEducation = (data: Omit<Education, "id">) => {
    const newEducation = {
      ...data,
      id: (educations.length + 1).toString(),
    };
    setEducations([...educations, newEducation]);
  };

  const handleUpdateEducation = (id: string, data: Partial<Education>) => {
    setEducations(
      educations.map((education) =>
        education.id === id ? { ...education, ...data } : education
      )
    );
  };

  const handleAddCasteCategory = (data: Omit<CasteCategory, "id">) => {
    const newCasteCategory = {
      ...data,
      id: (casteCategories.length + 1).toString(),
    };
    setCasteCategories([...casteCategories, newCasteCategory]);
  };

  const handleUpdateCasteCategory = (
    id: string,
    data: Partial<CasteCategory>
  ) => {
    setCasteCategories(
      casteCategories.map((category) =>
        category.id === id ? { ...category, ...data } : category
      )
    );
  };

  const handleAddCaste = (data: Omit<Caste, "id">) => {
    const newCaste = {
      ...data,
      id: (castes.length + 1).toString(),
    };
    setCastes([...castes, newCaste]);
  };

  const handleUpdateCaste = (id: string, data: Partial<Caste>) => {
    setCastes(
      castes.map((caste) => (caste.id === id ? { ...caste, ...data } : caste))
    );
  };

  const handleAddRelationship = (data: Omit<Relationship, "id">) => {
    const newRelationship = {
      ...data,
      id: (relationships.length + 1).toString(),
    };
    setRelationships([...relationships, newRelationship]);
  };

  const handleUpdateRelationship = (
    id: string,
    data: Partial<Relationship>
  ) => {
    setRelationships(
      relationships.map((relationship) =>
        relationship.id === id ? { ...relationship, ...data } : relationship
      )
    );
  };

  const handleAddGuarantor = (data: Omit<Guarantor, "id">) => {
    const newGuarantor = {
      ...data,
      id: (guarantors.length + 1).toString(),
    };
    setGuarantors([...guarantors, newGuarantor]);
  };

  const handleUpdateGuarantor = (id: string, data: Partial<Guarantor>) => {
    setGuarantors(
      guarantors.map((guarantor) =>
        guarantor.id === id ? { ...guarantor, ...data } : guarantor
      )
    );
  };

  const handleAddMember = (data: Omit<Member, "id">) => {
    const newMember = {
      ...data,
      id: (members.length + 1).toString(),
    };
    setMembers([...members, newMember]);
  };

  const handleUpdateMember = (id: string, data: Partial<Member>) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, ...data } : member
      )
    );
  };

  const handleAddSalesMan = (data: Omit<SalesMan, "id">) => {
    const newSalesMan = {
      ...data,
      id: (salesMen.length + 1).toString(),
    };
    setSalesMen([...salesMen, newSalesMan]);
  };

  const handleUpdateSalesMan = (id: string, data: Partial<SalesMan>) => {
    setSalesMen(
      salesMen.map((salesman) =>
        salesman.id === id ? { ...salesman, ...data } : salesman
      )
    );
  };

  // Reference handlers to be passed into Reference component
  const handleAddReference = useCallback(
    async (data: Omit<ReferenceType, "id">) => {
      const created = await referenceService.create(data);
      const ref = (created as any)?.data || created;
      const normalized: ReferenceType = {
        ...ref,
        id: ref?.id ?? ref?._id ?? String(Date.now()),
      };
      // Optimistic add, then refresh from backend
      setReferences((prev) => [...prev, normalized]);
      await reloadReferences();
    },
    [reloadReferences]
  );

  const handleUpdateReference = useCallback(
    async (id: string, data: Partial<ReferenceType>) => {
      await referenceService.update(id, data);
      // Optimistic merge, then reload to ensure fresh server data
      setReferences((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
      await reloadReferences();
    },
    [reloadReferences]
  );

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <MemberManagements
            kycs={kycs}
            onAddKYC={handleAddKYC}
            onUpdateKYC={handleUpdateKYC}
            areas={areas}
            onAddArea={handleAddArea}
            onUpdateArea={handleUpdateArea}
            occupations={occupations}
            onAddOccupation={handleAddOccupation}
            onUpdateOccupation={handleUpdateOccupation}
            educations={educations}
            onAddEducation={handleAddEducation}
            onUpdateEducation={handleUpdateEducation}
            casteCategories={casteCategories}
            onAddCasteCategory={handleAddCasteCategory}
            onUpdateCasteCategory={handleUpdateCasteCategory}
            castes={castes}
            onAddCaste={handleAddCaste}
            onUpdateCaste={handleUpdateCaste}
            relationships={relationships}
            onAddRelationship={handleAddRelationship}
            onUpdateRelationship={handleUpdateRelationship}
            guarantors={guarantors}
            onAddGuarantor={handleAddGuarantor}
            onUpdateGuarantor={handleUpdateGuarantor}
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            salesMen={salesMen}
            onAddSalesMan={handleAddSalesMan}
            onUpdateSalesMan={handleUpdateSalesMan}
            references={references}
            onAddReference={handleAddReference}
            onUpdateReference={handleUpdateReference}
          />
        }
      />
    </Routes>
  );
};

export default MemberManagementsPage;

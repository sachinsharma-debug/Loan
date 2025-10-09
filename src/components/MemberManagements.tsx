import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type KYC,
  type Area,
  type Occupation,
  type Education,
  type CasteCategory,
  type Caste,
  type Relationship,
  type Guarantor,
  type Member,
  type SalesMan,
  type Reference as ReferenceType,
} from "@/types";

// Import the individual components
import KycComponent from "./kyc";
import AreaComponent from "./Area";
import OccupationComponent from "./Occupation";
import EducationComponent from "./Education";
import CasteCategoryComponent from "./CasteCategory";
import CasteComponent from "./Caste";
import RelationshipComponent from "./Relationship";
import GuarantorComponent from "./Guarantor";
import MemberComponent from "./Member";
import SalesManManager from "./SalesManManager";
import ReferenceComponent from "./Reference";

// Coerce imported SalesManManager to a component type to avoid TSX IntrinsicAttributes errors
const SalesManManagerAny =
  SalesManManager as unknown as React.ComponentType<any>;

// Compact hub styled like the provided design (two cards with blue headers and item lists)
export type MemberManagementsProps = {
  kycs: KYC[];
  areas: Area[];
  occupations: Occupation[];
  educations: Education[];
  casteCategories: CasteCategory[];
  castes: Caste[];
  relationships: Relationship[];
  guarantors: Guarantor[];
  members: Member[];
  salesMen: SalesMan[];
  references: ReferenceType[];

  onAddKYC: (data: Omit<KYC, "id">) => void | Promise<void>;

  onUpdateKYC: (id: string, data: Partial<KYC>) => void | Promise<void>;
  onAddArea: (data: { areaName: string }) => void;
  onUpdateArea: (id: string, data: any) => void;
  onAddOccupation: (data: { occupationName: string }) => void;
  onUpdateOccupation: (id: string, data: any) => void;
  onAddEducation: (data: { educationName: string }) => void;
  onUpdateEducation: (id: string, data: any) => void;
  onAddCasteCategory: (data: { casteCategoryName: string }) => void;
  onUpdateCasteCategory: (id: string, data: any) => void;
  onAddCaste: (data: { casteName: string }) => void;
  onUpdateCaste: (id: string, data: any) => void;
  onAddRelationship: (data: { relationshipName: string }) => void;
  onUpdateRelationship: (id: string, data: any) => void;
  onAddGuarantor: (data: any) => void;
  onUpdateGuarantor: (id: string, data: any) => void;
  onAddSalesMan: (data: Omit<SalesMan, "id">) => void;
  onUpdateSalesMan: (id: string, data: Partial<SalesMan>) => void;
  onAddMember: (data: any) => void;
  onUpdateMember: (id: string, data: any) => void;
  onAddReference: (data: any) => void;
  onUpdateReference: (id: string, data: any) => void;
};

const MemberManagements: React.FC<MemberManagementsProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current active component from URL
  const activeComponent = location.pathname.split("/")[2] || null;

  const itemClass =
    "w-full text-left px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm transition-colors";
  const cardClass = "rounded-md shadow-sm border border-gray-200 bg-white";
  const headerClass =
    "rounded-t-md bg-blue-600 text-white font-semibold px-3 py-1.5 text-sm";

  const handleItemClick = (componentName: string) => {
    navigate(`/member-managements/${componentName}`);
  };

  const handleBackToList = () => {
    navigate("/member-managements");
  };

  // If a component is selected, render it
  if (activeComponent) {
    switch (activeComponent) {
      case "occupation":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <OccupationComponent
              occupations={props.occupations}
              onAddOccupation={props.onAddOccupation}
              onUpdateOccupation={props.onUpdateOccupation}
            />
          </div>
        );
      case "education":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <EducationComponent
              educations={props.educations}
              onAddEducation={props.onAddEducation}
              onUpdateEducation={props.onUpdateEducation}
            />
          </div>
        );
      case "casteCategory":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <CasteCategoryComponent
              casteCategories={props.casteCategories}
              onAddCasteCategory={props.onAddCasteCategory}
              onUpdateCasteCategory={props.onUpdateCasteCategory}
            />
          </div>
        );
      case "caste":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <CasteComponent
              castes={props.castes}
              onAddCaste={props.onAddCaste}
              onUpdateCaste={props.onUpdateCaste}
            />
          </div>
        );
      case "relationship":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <RelationshipComponent
              relationships={props.relationships}
              onAddRelationship={props.onAddRelationship}
              onUpdateRelationship={props.onUpdateRelationship}
            />
          </div>
        );
      case "salesman":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <SalesManManagerAny
              salesMen={props.salesMen}
              branches={[]}
              onAddSalesMan={props.onAddSalesMan}
              onUpdateSalesMan={props.onUpdateSalesMan}
            />
          </div>
        );
      case "reference":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <ReferenceComponent
              references={props.references}
              branches={[]}
              onAddReference={props.onAddReference}
              onUpdateReference={props.onUpdateReference}
            />
          </div>
        );
      case "guarantor":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <GuarantorComponent />
          </div>
        );
      case "member":
        return (
          <div className="p-6">
            <Button
              onClick={handleBackToList}
              className="mb-4"
              variant="outline"
            >
              ← Back to Member Management
            </Button>
            <MemberComponent
              members={props.members}
              onAddMember={props.onAddMember}
              onUpdateMember={props.onUpdateMember}
            />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
          Member Management
        </h1>
        <p className="text-sm text-gray-600">Choose a section below</p>
      </div>

      <div className="flex gap-6">
        <div className="max-w-sm">
          <Card className={cardClass}>
            <div className={headerClass}>Member Management</div>
            <ul className="divide-y divide-gray-200">
              {/* <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "kyc" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => handleItemClick("kyc")}
                >
                  KYC
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "area" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => handleItemClick("area")}
                >
                  Area
                </button>
              </li> */}
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "occupation"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("occupation")}
                >
                  Occupation
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "education"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("education")}
                >
                  Education
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "casteCategory"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("casteCategory")}
                >
                  Caste Category
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "caste"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("caste")}
                >
                  Caste
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "relationship"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("relationship")}
                >
                  Relationship
                </button>
              </li>
            </ul>
          </Card>
        </div>

        <div className="max-w-sm">
          <Card className={cardClass}>
            <div className={headerClass}>Additional Management</div>
            <ul className="divide-y divide-gray-200">
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "salesman"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("salesman")}
                >
                  SalesMan
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "reference"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("reference")}
                >
                  Reference
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "guarantor"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("guarantor")}
                >
                  Guarantor
                </button>
              </li>
              <li>
                <button
                  className={`${itemClass} ${
                    activeComponent === "member"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                  onClick={() => handleItemClick("member")}
                >
                  Member
                </button>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberManagements;

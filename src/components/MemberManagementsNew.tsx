// import React from "react";
// import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import type {
//   KYC,
//   Area,
//   Occupation,
//   Education,
//   CasteCategory,
//   Caste,
//   Relationship,
//   Guarantor,
//   SalesMan,
//   Member,
//   Branch,
//   Reference as ReferenceType,
// } from "@/types";

// // Import the individual components
// import KycComponent from "./kyc";
// import AreaComponent from "./Area";
// import OccupationComponent from "./Occupation";
// import EducationComponent from "./Education";
// import CasteCategoryComponent from "./CasteCategory";
// import CasteComponent from "./Caste";
// import RelationshipComponent from "./Relationship";
// import GuarantorComponent from "./Guarantor";
// import SalesManManager from "./SalesManManager";
// import ReferenceComponent from "./Reference";

// import MemberComponent from "./Member";

// export type MemberManagementsProps = {
//   kycs: KYC[];
//   areas: Area[];
//   occupations: Occupation[];
//   educations: Education[];
//   casteCategories: CasteCategory[];
//   castes: Caste[];
//   relationships: Relationship[];
//   guarantors: Guarantor[];
//   members: Member[];
//   salesMen: SalesMan[];
//   references: ReferenceType[];
//   branches: Branch[];

//   onAddKYC: (data: { kycName: string }) => void;
//   onUpdateKYC: (id: string, data: any) => void;
//   onAddArea: (data: { areaName: string }) => void;
//   onUpdateArea: (id: string, data: any) => void;
//   onAddOccupation: (data: { occupationName: string }) => void;
//   onUpdateOccupation: (id: string, data: any) => void;
//   onAddEducation: (data: { educationName: string }) => void;
//   onUpdateEducation: (id: string, data: any) => void;
//   onAddCasteCategory: (data: { casteCategoryName: string }) => void;
//   onUpdateCasteCategory: (id: string, data: any) => void;
//   onAddCaste: (data: { casteName: string }) => void;
//   onUpdateCaste: (id: string, data: any) => void;
//   onAddRelationship: (data: { relationshipName: string }) => void;
//   onUpdateRelationship: (id: string, data: any) => void;
//   onAddGuarantor: (data: any) => void;
//   onAddSalesMan: (data: any) => void;
//   onUpdateSalesMan: (id: string, data: any) => void;
//   onAddReference: (data: any) => void;
//   onUpdateReference: (id: string, data: any) => void;
//   onAddMember: (data: any) => void;
//   onUpdateMember: (id: string, data: any) => void;
// };

// // Main hub component
// const MemberManagementHub: React.FC<MemberManagementsProps> = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get current active component from URL
//   const currentPath = location.pathname
//     .replace("/member-managements/", "")
//     .replace("/member-managements", "");
//   const activeComponent = currentPath === "" ? null : currentPath;

//   const itemClass =
//     "w-full text-left px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm transition-colors";
//   const cardClass = "rounded-md shadow-sm border border-gray-200 bg-white";
//   const headerClass =
//     "rounded-t-md bg-blue-600 text-white font-semibold px-3 py-1.5 text-sm";

//   const handleItemClick = (componentName: string) => {
//     navigate(`/member-managements/${componentName}`);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
//           Member Management
//         </h1>
//         <p className="text-sm text-gray-600">Choose a section below</p>
//       </div>

//       <div className="flex gap-6">
//         <div className="max-w-sm">
//           <Card className={cardClass}>
//             <div className={headerClass}>Member Management</div>
//             <ul className="divide-y divide-gray-200">
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "kyc" ? "bg-blue-50 text-blue-600" : ""
//                   }`}
//                   onClick={() => handleItemClick("kyc")}
//                 >
//                   KYC
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "area" ? "bg-blue-50 text-blue-600" : ""
//                   }`}
//                   onClick={() => handleItemClick("area")}
//                 >
//                   Area
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "occupation"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("occupation")}
//                 >
//                   Occupation
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "education"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("education")}
//                 >
//                   Education
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "casteCategory"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("casteCategory")}
//                 >
//                   Caste Category
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "caste"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("caste")}
//                 >
//                   Caste
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "relationship"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("relationship")}
//                 >
//                   Relationship
//                 </button>
//               </li>
//             </ul>
//           </Card>
//         </div>

//         <div className="max-w-sm">
//           <Card className={cardClass}>
//             <div className={headerClass}>Additional Management</div>
//             <ul className="divide-y divide-gray-200">
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "salesman"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("salesman")}
//                 >
//                   Salesman
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "reference"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("reference")}
//                 >
//                   Reference
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "guarantor"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("guarantor")}
//                 >
//                   Guarantor
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className={`${itemClass} ${
//                     activeComponent === "member"
//                       ? "bg-blue-50 text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => handleItemClick("member")}
//                 >
//                   Member
//                 </button>
//               </li>
//             </ul>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MemberManagements: React.FC<MemberManagementsProps> = (props) => {
//   const navigate = useNavigate();

//   const handleBackToList = () => {
//     navigate("/member-managements");
//   };

//   return (
//     <Routes>
//       <Route index element={<MemberManagementHub {...props} />} />

//       <Route
//         path="kyc"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <KycComponent
//               kycs={props.kycs}
//               onAddKYC={props.onAddKYC}
//               onUpdateKYC={props.onUpdateKYC}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="area"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <AreaComponent
//               areas={props.areas}
//               onAddArea={props.onAddArea}
//               onUpdateArea={props.onUpdateArea}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="occupation"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <OccupationComponent
//               occupations={props.occupations}
//               onAddOccupation={props.onAddOccupation}
//               onUpdateOccupation={props.onUpdateOccupation}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="education"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <EducationComponent
//               educations={props.educations}
//               onAddEducation={props.onAddEducation}
//               onUpdateEducation={props.onUpdateEducation}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="casteCategory"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <CasteCategoryComponent
//               casteCategories={props.casteCategories}
//               onAddCasteCategory={props.onAddCasteCategory}
//               onUpdateCasteCategory={props.onUpdateCasteCategory}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="caste"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <CasteComponent
//               castes={props.castes}
//               onAddCaste={props.onAddCaste}
//               onUpdateCaste={props.onUpdateCaste}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="relationship"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <RelationshipComponent
//               relationships={props.relationships}
//               onAddRelationship={props.onAddRelationship}
//               onUpdateRelationship={props.onUpdateRelationship}
//             />
//           </div>
//         }
//       />
//       <Route
//         path="salesman"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <SalesManManager
//               salesMen={props.salesMen}
//               branches={props.branches}
//               onAddSalesMan={props.onAddSalesMan}
//               onUpdateSalesMan={props.onUpdateSalesMan}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="reference"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <ReferenceComponent
//               references={props.references}
//               branches={props.branches}
//               onAddReference={props.onAddReference}
//               onUpdateReference={props.onUpdateReference}
//             />
//           </div>
//         }
//       />

//       <Route
//         path="guarantor"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <GuarantorComponent />
//           </div>
//         }
//       />

//       <Route
//         path="member"
//         element={
//           <div className="p-6">
//             <Button
//               onClick={handleBackToList}
//               className="mb-4"
//               variant="outline"
//             >
//               ← Back to Member Management
//             </Button>
//             <MemberComponent
//               members={props.members}
//               onAddMember={props.onAddMember}
//               onUpdateMember={props.onUpdateMember}
//             />
//           </div>
//         }
//       />

//       {/* Fallback to hub for any unknown sub-paths */}
//       <Route path="*" element={<MemberManagementHub {...props} />} />
//     </Routes>
//   );
// };

// export default MemberManagements;

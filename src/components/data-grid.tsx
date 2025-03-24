"use client";

// import { useSearchParams } from "next/navigation";
// import { FaPiggyBank } from "react-icons/fa";
// import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useRouter } from "next/navigation"
import { 
  BadgeCheck,
  Briefcase,
  ClipboardList, 
  FileSpreadsheet,
  FileText,
  Megaphone, 
  Scale,
  DoorOpen,
  CreditCard
} from "lucide-react";

import { DataCard } from "@/components/data-card";
import { FormType } from "@/constants/form-data-object"

// Card data with distinct variants for each phase
const components = [
  {
    title: "Phase 1: Identification",
    formType: "identification" as FormType,
    description:
      "Divisions define, analyze, and document the specific needs that must be satisfied through the acquisition of goods and services.",
    icon: Briefcase,
    variant: "default" as const,
    iconColor: "blue-600"
  },
  {
    title: "Phase 2: Planning",
    formType: "planning" as FormType,
    description:
      "Creating a detailed plan for the procurement process, including identifying needs, determining the best approach, and establishing timelines.",
    icon: ClipboardList,
    variant: "success" as const,
    iconColor: "yellow-600"
  },
  {
    title: "Phase 3: Publication of Plan",
    formType: "publication" as FormType,
    description:
      "Making the procurement plan available to the public by creating notices and posting them on the official procurement platforms.",
    icon: FileText,
    variant: "default" as const,
    iconColor: "blue-600"
  },
  {
    title: "Phase 4: Publication of Tender",
    formType: "publicationTender" as FormType,
    description:
      "Publishing tender documents for public access, including specifications, terms, and conditions for potential bidders.",
    icon: Megaphone,
    variant: "success" as const,
    iconColor: "emerald-600"
  },
  {
    title: "Phase 5: Opening of Tenders",
    formType: "openBid" as FormType,
    description: 
      "Formal opening of submitted bids in the presence of bidders' representatives to ensure transparency and fairness.",
    icon: DoorOpen,
    variant: "default" as const,
    iconColor: "blue-600"
  },
  {
    title: "Phase 6: Bid Evaluation",
    formType: "bidEvaluation" as FormType,
    description:
      "Evaluating submitted bids against predetermined criteria to select the most qualified bidder offering best value.",
    icon: Scale,
    variant: "success" as const,
    iconColor: "emerald-600"
  },
  {
    title: "Phase 7: Contract Signing",
    formType: "contractSigning" as FormType,
    description:
      "Formalizing the agreement between the procuring entity and the successful bidder through legally binding documentation.",
    icon: FileSpreadsheet,
    variant: "default" as const,
    iconColor: "blue-600"
  },
  {
    title: "Phase 8: Contract Management",
    formType: "contractManagement" as FormType,
    description:
      "Overseeing contract execution to ensure compliance with terms, quality standards, and timely delivery of goods/services.",
    icon: BadgeCheck,
    variant: "success" as const,
    iconColor: "emerald-600"
  },
  {
    title: "Phase 9: Invoice",
    formType: "invoice" as FormType,
    description:
      "Processing payment documents and financial transactions related to the executed contract following delivery verification.",
    icon: CreditCard,
    variant: "warning" as const,
    iconColor: "amber-600"
  }
];

export const DataGrid = () => {
  const router = useRouter();

  const handleNavigateToFormType = (formType: FormType) => {
    // Navigate to the list page and set the form type state
    // We use router.push to navigate programmatically
    router.push(`/list?formType=${formType}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {components.map((component) => (
        <DataCard
          key={component.title}
          title={component.title}
          description={component.description}
          icon={component.icon}
          variant={component.variant}
          iconColor={component.iconColor}
          onClick={() => handleNavigateToFormType(component.formType)}
        />
      ))}
    </div>
  );
};

"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormType } from "@/constants/form-data-object"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; formType: FormType; description: string }[] = [
  {
    title: "Phase 1: Identification",
    formType: "identification",
    description:
      "divisions define, analyze, and document the specific needs that must be satisfied through the acquisition of goods and services",
  },
  {
    title: "Phase 2: Planning",
    formType: "planning",
    description:
      "creating a detailed plan for the procurement process. This includes identifying the needs, determining the best way to meet those needs, and creating a timeline for the procurement process.",
  },
  {
    title: "Phase 3: Publication of Procurement Plan",
    formType: "publication",
    description:
      "making the procurement plan available to the public. This includes creating a public notice of the procurement plan and posting it on the procurement website.",
  },
  {
    title: "Phase 4: Publication of Tender",
    formType: "publicationTender",
    description:
      "making the tender available to the public. This includes creating a public notice of the tender and posting it on the procurement website.",
  },
  {
    title: "Phase 5: Opening of Tenders",
    formType: "openBid",
    description: "opening the tender to the public. This includes creating a public notice of the tender and posting it on the procurement website.",
  },
  {
    title: "Phase 6: Bid Evaluation",
    formType: "bidEvaluation",
    description:
      "evaluating the bids received for the tender. This includes evaluating the bids, selecting the best bid, and awarding the contract.",
  },
  {
    title: "Phase 7: Contract Signing",
    formType: "contractSigning",
    description:
      "signing the contract. This includes signing the contract, and sending the contract to the public.",
  },
  {
    title: "Phase 8: Contract Management",
    formType: "contractManagement",
    description:
      "managing the contract. This includes managing the contract, and sending the contract to the public.",
  },
  {
    title: "Phase 9: Invoice",
    formType: "invoice",
    description:
      "sending the invoice to the public. This includes sending the invoice, and sending the invoice to the public.",
  }
]

export function NavMenu() {
  const router = useRouter();

  const handleNavigateToFormType = (formType: FormType) => {
    // Navigate to the list page and set the form type state
    // We use router.push to navigate programmatically
    router.push(`/list?formType=${formType}`);
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Phases</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-3 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  onClick={() => handleNavigateToFormType(component.formType)}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
  )
};


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { onClick?: () => void }
>(({ className, title, children, onClick, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
            className
          )}
          onClick={onClick}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

"use client"
import { useState } from "react";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { FormType, formTitles } from "@/constants/form-data-object";

export function FormMenu() {
  const [open, setOpen] = useState(false);
  
  const formTypes = Object.keys(formTitles) as FormType[];
  
  return (
  <div className="flex flex-col gap-4 items-start justify-center">
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Select Form <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {formTypes.map((type) => (
          <DropdownMenuItem key={type} asChild>
            <Link 
              href={`/new/${type}`} 
              className="w-full cursor-pointer"
              onClick={() => setOpen(false)}
            >
              {formTitles[type]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    <Link href="/" className="text-sm underline">Homepage</Link>
    <Link href="/list" className="text-sm underline">List</Link>
  </div>
  );
} 
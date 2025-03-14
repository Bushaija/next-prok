"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, List, PlusCircle, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Procurement Management
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/list" 
              className={`flex items-center space-x-1 ${isActive('/list') ? 'font-bold' : ''}`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </Link>
            <Link 
              href="/new/identification" 
              className={`flex items-center space-x-1 ${isActive('/new') ? 'font-bold' : ''}`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>New</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Procurement Management System
        </div>
      </footer>
    </div>
  );
} 
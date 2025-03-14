import { FormMenu } from "@/components/FormMenu";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-8">Procurement Management Dashboard</h1>
      
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Forms</h2>
        <p className="mb-4">Select a form to create or manage:</p>
        
        <div className="flex items-center gap-4">
          <FormMenu />
          
          <Link 
            href="/test-forms" 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Test All Forms
          </Link>
        </div>
      </div>
    </div>
  );
} 
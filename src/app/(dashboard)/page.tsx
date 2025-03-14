import React from "react";
import { Menu } from "@/components/menu";
import Hero from "@/components/Hero";

export default function App() {
  return (
    <div className="flex flex-col items-center mx-auto max-w-screen-lg h-[100vh]">
        <Hero />
        <Menu />
    </div>
  );
}

import React from "react";
import Hero from "@/components/Hero";
import { Menu } from "@/components/menu";
import { NavMenu } from "@/components/nav-menu";

export default function App() {
  return (
    <div className="flex flex-col items-center mx-auto max-w-screen-lg h-[100vh]">
        <div className="flex flex-row justify-center items-center w-full m-4">
            <NavMenu />
        </div>
        <Hero />
        <Menu />
    </div>
  );
}

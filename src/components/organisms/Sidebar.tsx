"use client";

import { NavLogo, NavLinks } from "../atoms";
import React from "react";

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-5 h-screen w-[300px] border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="flex flex-col items-center h-full">
        <div className="w-full flex items-center justify-center">
          <NavLogo />
        </div>
        <div className="w-full flex-1 overflow-y-hidden">
          <NavLinks />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

"use client";

import { usePathname } from "next/navigation";
import { navLinks } from "@/data";

import Link from "next/link";
import React from "react";

export const NavLinks = () => {
  const path = usePathname();

  const shouldShowMenu = (index: number) => {
    return [0, 3, 6].includes(index);
  };

  const getMenuLabel = (index: number) => {
    switch (index) {
      case 0:
        return "Menu";
      case 3:
        return "Management";
      case 6:
        return "Settings";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-2 w-[300px] rounded-xl bg-gray-50/5">
      {navLinks.map((links, index) => {
        const isActive = path === links.href;

        return (
          <React.Fragment key={index}>
            {shouldShowMenu(index) && (
              <span className="text-sm text-gray-500 pl-3 block mb-2">
                {getMenuLabel(index)}
              </span>
            )}
            <Link href={links.href} className="block">
              <div
                className={`
                group p-3 rounded-lg transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-blue-500/10 hover:bg-blue-500/20"
                    : "hover:bg-gray-100/10"
                }
              `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    transition-colors
                    ${
                      isActive
                        ? "text-blue-500"
                        : "text-gray-500 group-hover:text-blue-500"
                    }
                  `}
                  >
                    <links.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`
                    font-medium transition-colors
                    ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-700 group-hover:text-blue-600"
                    }
                  `}
                  >
                    {links.text}
                  </span>
                </div>
              </div>
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default NavLinks;

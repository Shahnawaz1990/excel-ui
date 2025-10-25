"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, UserCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Personal Accounts", icon: UserCircle, href: "/personalaccounts" },
  { name: "Urban Wheels", icon: Car, href: "/urbanwheels" },
];


  return (
    <div
      className={`${
        expanded ? "w-1/5" : "w-[5%]"
      } bg-gray-800 text-green-400 transition-all duration-300 flex flex-col`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="p-3 hover:bg-gray-700"
      >
        {expanded ? "⏴" : "⏵"}
      </button>

      <nav className="flex flex-col gap-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                active ? "bg-gray-700 text-white" : "hover:bg-gray-700"
              )}
            >
              <Icon size={20} />
              {expanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

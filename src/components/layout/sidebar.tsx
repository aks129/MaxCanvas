"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  Calendar,
  Megaphone,
  MessageSquare,
  BookOpen,
  Bell,
  Sparkles,
  Sun,
  Target,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChildSelector } from "./child-selector";

const navSections = [
  {
    label: "Quick Access",
    items: [
      { href: "/today", label: "Today", icon: Sun },
      { href: "/focus", label: "Focus Mode", icon: Target },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "School",
    items: [
      { href: "/grades", label: "Grades", icon: GraduationCap },
      { href: "/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/calendar", label: "Calendar", icon: Calendar },
      { href: "/announcements", label: "Announcements", icon: Megaphone },
      { href: "/discussions", label: "Discussions", icon: MessageSquare },
      { href: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { href: "/catch-up", label: "Parent Catch-Up", icon: Sparkles },
      { href: "/adhd-support", label: "ADHD Support", icon: Brain },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 text-slate-200 flex flex-col z-50">
      <div className="p-5 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          MaxCanvas
        </h1>
        <p className="text-xs text-slate-400 mt-1">School Dashboard</p>
      </div>

      <div className="p-3 border-b border-slate-700">
        <Suspense fallback={<div className="text-xs text-slate-400 px-2">Loading...</div>}>
          <ChildSelector />
        </Suspense>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700 text-xs text-slate-500">
        Powered by Canvas LMS + AI
      </div>
    </aside>
  );
}

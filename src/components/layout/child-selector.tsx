"use client";

import { useQueryState } from "nuqs";
import { Users } from "lucide-react";

interface ChildOption {
  id: string;
  name: string;
}

// Children are passed from server component via props
export function ChildSelector({
  children: childOptions,
}: {
  children?: ChildOption[];
}) {
  const [child, setChild] = useQueryState("child", { defaultValue: "" });

  // Use provided children or fallback
  const options = childOptions || [];

  if (options.length === 0) {
    return (
      <div className="text-xs text-slate-400 px-2">
        No children configured
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <select
        value={child || options[0]?.id || ""}
        onChange={(e) => setChild(e.target.value)}
        className="bg-slate-700 text-slate-200 text-sm rounded-md px-2 py-1.5 w-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

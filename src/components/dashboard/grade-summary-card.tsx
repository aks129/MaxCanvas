import Link from "next/link";
import { GraduationCap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, getGradeBadgeColor } from "@/lib/utils";
import type { CanvasGradeInfo } from "@/types/canvas";

interface GradeSummaryCardProps {
  grade: CanvasGradeInfo;
}

export function GradeSummaryCard({ grade }: GradeSummaryCardProps) {
  const score = grade.current_score;
  const letterGrade = grade.current_grade;

  return (
    <Link href={`/grades/${grade.course_id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
              {grade.course_name}
            </h3>
          </div>
          {score !== null && (
            <span
              className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                getGradeBadgeColor(score)
              )}
            >
              {letterGrade || `${score}%`}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            {score !== null ? (
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {score}
                <span className="text-lg text-slate-400">%</span>
              </p>
            ) : (
              <p className="text-sm text-slate-400">No grade yet</p>
            )}
          </div>
          <GradeTrend score={score} />
        </div>
      </div>
    </Link>
  );
}

function GradeTrend({ score }: { score: number | null }) {
  if (score === null)
    return <Minus className="w-4 h-4 text-slate-300" />;
  if (score >= 90) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (score >= 70) return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import {
  Target,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Focus Mode: Shows ONE task at a time with a Pomodoro-style timer
// Designed to reduce overwhelm for ADHD students

interface FocusTask {
  id: string;
  title: string;
  course: string;
  timeEstimate: number; // minutes
  steps: string[];
}

// Demo tasks when Canvas isn't connected
const demoTasks: FocusTask[] = [
  {
    id: "1",
    title: "Start with your most urgent assignment",
    course: "Connect Canvas to see your real assignments",
    timeEstimate: 25,
    steps: [
      "Read the assignment instructions carefully",
      "Identify the main question or task",
      "List what materials you need",
      "Start with the first section",
      "Take a 5-minute break after this timer",
    ],
  },
];

export default function FocusPage() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [isBreak, setIsBreak] = useState(false);

  const tasks = demoTasks;
  const currentTask = tasks[currentTaskIndex] || demoTasks[0];

  const resetTimer = useCallback((minutes?: number) => {
    setTimeLeft((minutes || 25) * 60);
    setIsRunning(false);
    setIsBreak(false);
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (!isBreak) {
            setIsBreak(true);
            return 5 * 60; // 5-minute break
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress =
    ((currentTask.timeEstimate * 60 - timeLeft) /
      (currentTask.timeEstimate * 60)) *
    100;

  function toggleStep(index: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div>
      <Header
        title="Focus Mode"
        description="One task at a time. You've got this."
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Current Task */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-500 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {isBreak ? "Break Time!" : "Focus On"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {isBreak
              ? "Take a break! Stretch, get water, move around."
              : currentTask.title}
          </h2>
          <p className="text-sm text-slate-500">{currentTask.course}</p>
        </div>

        {/* Timer */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center">
            {/* Progress ring */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-700"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-1000",
                    isBreak ? "text-green-500" : "text-blue-500"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
                <span className="text-sm text-slate-400 mt-1">
                  {isBreak ? "break" : "focus time"}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => resetTimer(25)}
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  "p-5 rounded-full text-white transition-all shadow-lg",
                  isRunning
                    ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/25"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                )}
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={() => {
                  if (isBreak) {
                    resetTimer(25);
                  } else {
                    setIsBreak(true);
                    setTimeLeft(5 * 60);
                    setIsRunning(false);
                  }
                }}
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title={isBreak ? "Back to focus" : "Take a break"}
              >
                <Timer className="w-5 h-5" />
              </button>
            </div>

            {/* Quick timer presets */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[10, 15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => resetTimer(mins)}
                  className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Steps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Steps to Complete
          </h3>
          <div className="space-y-2">
            {currentTask.steps.map((step, i) => (
              <button
                key={i}
                onClick={() => toggleStep(i)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  completedSteps.has(i)
                    ? "bg-green-50 dark:bg-green-900/20"
                    : i === currentStepIndex
                      ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800"
                      : "bg-slate-50 dark:bg-slate-700/50"
                )}
              >
                {completedSteps.has(i) ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : i === currentStepIndex ? (
                  <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    completedSteps.has(i)
                      ? "line-through text-slate-400"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  {step}
                </span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {completedSteps.size}/{currentTask.steps.length} steps done
            </span>
            <div className="w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{
                  width: `${(completedSteps.size / currentTask.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {completedSteps.size === currentTask.steps.length && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-400 font-bold text-lg">
                Amazing! You finished all the steps!
              </p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                Take a break, you earned it. Then come back for the next task.
              </p>
            </div>
          )}
        </div>

        {/* ADHD Tips */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Focus Tips
          </h3>
          <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
            <li className="flex items-start gap-2">
              <span className="mt-1">1.</span>
              <span>
                Put your phone in another room or use Do Not Disturb
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">2.</span>
              <span>
                Work for the timer duration, then take a real break — walk, stretch, snack
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">3.</span>
              <span>
                If you get stuck, skip to the next step and come back
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">4.</span>
              <span>
                It&apos;s okay to need more time. Adjust the timer to what works for you
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

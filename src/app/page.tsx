"use client"

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreChart from "@/components/dashboard/ScoreChart";
import { Target, CalendarClock, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { goal, results, bugs } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple logic to calculate stats
  const latestResult = results[results.length - 1] || { totalScore: 0 };
  const scoreGap = goal - latestResult.totalScore;
  const criticalBugs = bugs.filter(b => b.reviewed === false).length;

  // Mock countdown (static for now, could be dynamic based on examDate)
  const daysLeft = 90;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goal}</div>
            <p className="text-xs text-muted-foreground">Target Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestResult.totalScore}</div>
            <p className="text-xs text-muted-foreground">
              {scoreGap > 0 ? `${scoreGap} points to go` : "Goal Reached!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLeft}</div>
            <p className="text-xs text-muted-foreground">Keep pushing!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bugs</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{criticalBugs}</div>
            <p className="text-xs text-muted-foreground">Mistakes to review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <ScoreChart />
      </div>
    </div>
  );
}

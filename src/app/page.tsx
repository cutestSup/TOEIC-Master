"use client"

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ScoreChart from "@/components/dashboard/ScoreChart";
import { Target, CalendarClock, TrendingUp, AlertCircle, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { goal, results, bugs } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple logic to calculate stats
  const latestResult = results[results.length - 1] || { totalScore: 0 };
  const previousResult = results[results.length - 2] || { totalScore: 0 };
  const scoreGap = goal - latestResult.totalScore;
  const criticalBugs = bugs.filter(b => b.reviewed === false).length;
  const scoreChange = latestResult.totalScore - previousResult.totalScore;
  const scoreTrend = scoreChange > 0 ? 'up' : scoreChange < 0 ? 'down' : 'neutral';

  // Mock countdown (static for now, could be dynamic based on examDate)
  const daysLeft = 90;

  const stats = [
    {
      title: "Current Goal",
      value: goal,
      description: "Target Score",
      icon: Target,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Latest Score",
      value: latestResult.totalScore,
      description: scoreGap > 0 ? `${scoreGap} points to go` : "Goal Reached! 🎉",
      icon: TrendingUp,
      gradient: scoreTrend === 'up' ? "from-green-500 to-emerald-500" : scoreTrend === 'down' ? "from-red-500 to-rose-500" : "from-purple-500 to-pink-500",
      trend: scoreChange !== 0 ? (
        <span className={`text-xs flex items-center gap-1 ${scoreChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {scoreChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(scoreChange)} pts
        </span>
      ) : null,
    },
    {
      title: "Days Remaining",
      value: daysLeft,
      description: "Keep pushing!",
      icon: CalendarClock,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Pending Bugs",
      value: criticalBugs,
      description: "Mistakes to review",
      icon: AlertCircle,
      gradient: "from-red-500 to-pink-500",
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your TOEIC learning progress</p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10`}>
                    <Icon className={`h-4 w-4 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    {stat.trend}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-4 md:grid-cols-1"
      >
        <ScoreChart />
      </motion.div>
    </div>
  );
}

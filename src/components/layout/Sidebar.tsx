"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    CheckSquare,
    Bug,
    Globe,
    BookOpen,
    LayoutDashboard,
    GraduationCap,
    FileText
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/daily", label: "Daily Sprint", icon: CheckSquare },
        { href: "/lessons", label: "Lessons", icon: GraduationCap },
        { href: "/vocab", label: "Vocabulary", icon: BookOpen },
        { href: "/bugs", label: "Bug Tracker", icon: Bug },
        { href: "/mock", label: "Mock Test", icon: FileText },
    ];

    return (
        <div className="flex flex-col h-full w-64 border-r bg-gradient-to-b from-muted/40 to-muted/20 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex items-center justify-between px-2"
            >
                <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/70">
                        <Globe className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight block">TOEIC Sprint</span>
                        <span className="text-xs text-muted-foreground">Master TOEIC</span>
                    </div>
                </div>
                <ModeToggle />
            </motion.div>

            <nav className="space-y-1 flex-1">
                {links.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon className={cn(
                                    "h-5 w-5 transition-transform",
                                    isActive && "scale-110",
                                    !isActive && "group-hover:scale-110"
                                )} />
                                <span>{link.label}</span>
                                {isActive && (
                                    <motion.div
                                        className="absolute right-2 w-2 h-2 rounded-full bg-primary-foreground/30"
                                        layoutId="activeIndicator"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-border/50"
            >
                <div className="px-2 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">Target Score</span>
                        <span className="text-xs font-bold text-primary">800+</span>
                    </div>
                    <p className="text-xs text-muted-foreground">3 Month Plan</p>
                </div>
            </motion.div>
        </div>
    );
}

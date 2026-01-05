"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    CheckSquare,
    Bug,
    Globe,
    BookOpen,
    LayoutDashboard
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/daily", label: "Daily Sprint", icon: CheckSquare },
        { href: "/vocab", label: "Vocabulary", icon: BookOpen },
        { href: "/bugs", label: "Bug Tracker", icon: Bug },
        { href: "/mock", label: "Mock Test", icon: BookOpen },
    ];

    return (
        <div className="flex flex-col h-full w-64 border-r bg-muted/40 p-4">
            <div className="mb-8 flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">TOEIC Sprint</span>
                </div>
                <ModeToggle />
            </div>

            <nav className="space-y-2 flex-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-4 border-t text-xs text-muted-foreground px-2">
                <p>Target: 800+</p>
                <p>3 Month Plan</p>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Glasses, Gamepad2, Mic } from "lucide-react";
import { clsx } from "clsx";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/reader", label: "Lens", icon: Glasses },
        { href: "/detective", label: "Play", icon: Gamepad2 },
        { href: "/screening", label: "Test", icon: Mic },
    ];

    return (
        <nav className="fixed bottom-4 left-4 right-4 z-50 glass rounded-2xl shadow-xl border border-white/20 md:hidden">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
                                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={clsx("w-6 h-6", isActive && "fill-current")}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

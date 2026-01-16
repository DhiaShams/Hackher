"use client";

import Link from "next/link";
import { UserCircle2, Menu } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 px-4 py-3 glass rounded-b-xl border-b border-white/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        E
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        EmpowRead
                    </span>
                </Link>

                {/* Desktop Menu (hidden on mobile) */}
                <div className="hidden md:flex items-center gap-6 font-medium text-sm text-muted-foreground">
                    <Link href="/reader" className="hover:text-primary transition-colors">
                        Magic Lens
                    </Link>
                    <Link href="/detective" className="hover:text-primary transition-colors">
                        Detective
                    </Link>
                </div>

                {/* Profile / Parent Mode */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/parent"
                        className="p-2 rounded-full hover:bg-black/5 transition-colors"
                        aria-label="Parent Settings"
                    >
                        <UserCircle2 className="w-6 h-6 text-foreground/80" />
                    </Link>
                    <button className="md:hidden" aria-label="Menu">
                        <Menu className="w-6 h-6 text-foreground/80" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

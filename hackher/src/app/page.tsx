"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Glasses, Gamepad2 } from "lucide-react";
import { Avatar } from "@/components/avatar/Avatar";
import { useAvatarStore } from "@/store/useAvatarStore";

export default function Home() {
  const { emotion } = useAvatarStore();

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Hero / Avatar Section */}
      <section className="relative h-[45vh] w-full rounded-3xl overflow-hidden glass flex items-center justify-center p-6 shadow-2xl border border-white/30 transition-all duration-500">
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${emotion === "concerned" ? "bg-orange-50/50" : "bg-gradient-to-br from-primary/10 to-secondary/10"
          }`} />

        <div className="z-10 flex flex-col items-center gap-6">
          <Avatar />

          <div className="text-center space-y-2 max-w-md">
            <h1 className="text-3xl font-bold text-foreground">
              Hi Maya!
            </h1>
            <p className="text-muted-foreground">
              {emotion === "happy" && "I'm feeling super confident today! Let's find some words."}
              {emotion === "concerned" && "It sounds like things are getting tricky. Let's slow down."}
              {emotion === "thinking" && "Hmm, let me think about that..."}
              {emotion === "celebrating" && "You are doing amazing!"}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/reader" className="group">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-border hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <Glasses size={24} />
              </div>
              <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-1">Magic Lens</h3>
            <p className="text-sm text-muted-foreground">
              Point your camera at any book to make reading easier.
            </p>
          </div>
        </Link>

        <Link href="/detective" className="group">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-border hover:shadow-xl hover:border-accent/50 transition-all cursor-pointer h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <Gamepad2 size={24} />
              </div>
              <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-1">Word Detective</h3>
            <p className="text-sm text-muted-foreground">
              Find hidden patterns and earn badges!
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

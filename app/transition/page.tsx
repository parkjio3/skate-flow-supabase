"use client"
import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationTabs = [
  { name: "RAMP", href: "/ramp" },
  { name: "STREET", href: "/street" },
  { name: "TRANSITION", href: "/transition" },
];

export default function TransitionPage() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center py-4 gap-4">
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center gap-4">
                <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
                <h1 className="font-mono text-2xl font-bold text-primary tracking-tighter">SkateFlow</h1>
              </div>
              <div className="flex md:hidden">
                <Button variant="ghost" size="icon"><User className="size-5" /></Button>
              </div>
            </div>
            <div className="relative flex-1 md:max-w-md" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="기술 검색..." 
                className="pl-9" 
                value={searchQuery} 
                onFocus={() => setIsSearchFocused(true)} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon"><User className="size-5" /></Button>
            </div>
          </div>
          <nav className="flex gap-1 pb-px overflow-x-auto no-scrollbar">
            {navigationTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.name} href={tab.href} className="flex-1 min-w-[100px] max-w-[200px]">
                  <button className={`w-full py-3 text-xs font-black italic transition-all border-b-2 ${isActive ? "border-primary text-primary bg-primary/5 shadow-[inset_0_-2px_0_0_rgba(var(--primary),1)]" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                    {tab.name}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-muted p-6">
            <Search className="size-12 text-muted-foreground opacity-20" />
          </div>
          <h2 className="mb-2 text-4xl font-black italic tracking-tighter text-primary">TRANSITION</h2>
          <p className="text-muted-foreground font-mono uppercase text-xs tracking-widest">준비 중입니다...</p>
        </div>
      </main>
    </div>
  )
}

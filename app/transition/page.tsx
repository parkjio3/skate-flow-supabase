"use client"

import { ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TransitionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>

            <div className="flex gap-2">
              <Link href="/ramp">
                <Button variant="outline" size="sm">
                  램프
                </Button>
              </Link>
              <Link href="/street">
                <Button variant="outline" size="sm">
                  스트릿
                </Button>
              </Link>
              <Link href="/transition">
                <Button variant="default" size="sm">
                  트랜지션
                </Button>
              </Link>
            </div>

            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="mb-4 text-4xl font-bold">트랜지션</h2>
          <p className="text-xl text-muted-foreground">준비 중입니다...</p>
        </div>
      </main>
    </div>
  )
}

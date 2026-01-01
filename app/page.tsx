"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 font-mono text-6xl font-bold text-primary md:text-8xl">SkateFlow</h1>
        <p className="mb-12 text-xl text-muted-foreground md:text-2xl">스케이트보드 튜토리얼</p>

        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <Link href="/ramp" className="w-full">
            <Button size="lg" className="h-24 w-full text-2xl font-bold shadow-lg transition-all hover:scale-105">
              램프
            </Button>
          </Link>

          <Link href="/street" className="w-full">
            <Button size="lg" className="h-24 w-full text-2xl font-bold shadow-lg transition-all hover:scale-105">
              스트릿
            </Button>
          </Link>

          <Link href="/transition" className="w-full">
            <Button size="lg" className="h-24 w-full text-2xl font-bold shadow-lg transition-all hover:scale-105">
              트랜지션
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

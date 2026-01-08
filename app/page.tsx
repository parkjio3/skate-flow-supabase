"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [targetPath, setTargetPath] = useState("")
  const [error, setError] = useState(false)

  const CORRECT_PASSWORD = "1234"

  // 버튼 클릭 시 호출
  const handleProtectedNavigation = (path: string) => {
    setTargetPath(path)
    setIsOpen(true)
  }

  // 비밀번호 확인 로직
  const handleConfirm = () => {
    if (password === CORRECT_PASSWORD) {
      setError(false)
      setIsOpen(false)
      router.push(targetPath) // 비밀번호 맞으면 이동
    } else {
      setError(true)
      setPassword("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 font-mono text-6xl font-bold text-primary md:text-8xl">SkateFlow</h1>
        <p className="mb-12 text-xl text-muted-foreground md:text-2xl">스케이트보드 튜토리얼</p>

        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <Button 
            onClick={() => handleProtectedNavigation("/ramp")}
            size="lg" className="h-24 w-full text-2xl font-bold shadow-lg transition-all hover:scale-105"
          >
            램프
          </Button>

          <Button 
            onClick={() => handleProtectedNavigation("/street")}
            size="lg" className="h-24 w-full text-2xl font-bold shadow-lg transition-all hover:scale-105"
          >
            스트릿
          </Button>

          <Button 
            onClick={() => handleProtectedNavigation("/transition")}
            size="lg" className="h-24 w-full text-2xl font-bold shadow-lg transition-all hover:scale-105"
          >
            트랜지션
          </Button>
        </div>
      </div>

      {/* 비밀번호 입력 팝업 (Shadcn UI Dialog 기준) */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) { setPassword(""); setError(false); }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">비밀번호 입력</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className={error ? "border-destructive" : ""}
              autoFocus
            />
            {error && <p className="text-sm text-destructive text-center">비밀번호가 올바르지 않습니다.</p>}
          </div>
          <DialogFooter className="flex flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>취소</Button>
            <Button className="flex-1" onClick={handleConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

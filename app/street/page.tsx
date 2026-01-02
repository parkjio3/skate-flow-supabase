"use client"

import { useState, useEffect } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useSkateData } from "@/hooks/useSkateData" // 커스텀 훅 임포트

// ... (Trick 타입 및 streetTricks 데이터는 기존과 동일)
type Trick = {
  id: string
  name: string
  videoUrl: string
  category?: string
}

const streetTricks: Trick[] = [
  // 기초 기술
  { id: "1", name: "푸쉬오프(5M한발버티기)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "2", name: "틱택(10M타임어택)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "3", name: "앤드워크(10M타임어택)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "4", name: "앤드오버(10M타임어택)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "5", name: "매뉴얼(3M통과)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "6", name: "히피점프30CM(넘기)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "11", name: "파워슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },
  { id: "12", name: "엑시드드롭", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "기초" },

  // 킥턴
  { id: "7", name: "페이키BS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "킥턴" },
  { id: "8", name: "BS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "킥턴" },
  { id: "9", name: "페이키FS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "킥턴" },
  { id: "10", name: "FS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "킥턴" },

  { id: "13", name: "알리높이(20CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },
  { id: "14", name: "알리높이(30CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },
  { id: "15", name: "알리높이(40CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },
  { id: "16", name: "알리멀리(20CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },
  { id: "17", name: "알리멀리(60CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },
  { id: "18", name: "알리멀리(100CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },
  { id: "31", name: "페이키알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "알리" },

  { id: "19", name: "BS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "20", name: "페이키BS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "21", name: "페이키BS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "22", name: "FS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "23", name: "페이키FS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "24", name: "페이키FS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "27", name: "BS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },
  { id: "29", name: "FS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "샤빗" },

  { id: "25", name: "FS180알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "26", name: "BS180알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "28", name: "BS360알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "30", name: "FS360알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "32", name: "BS하프캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "33", name: "BS풀캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "34", name: "FS하프캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },
  { id: "35", name: "FS풀캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "회전" },

  // 플립 트릭
  { id: "36", name: "킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "37", name: "베리얼킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "38", name: "트레플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "39", name: "힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "40", name: "베리얼힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "41", name: "레이져플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "42", name: "BS킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "43", name: "BS빅플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "44", name: "BS360킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "45", name: "FS킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },
  { id: "46", name: "하드플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "플립" },

  // 널리 트릭
  { id: "47", name: "널리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },
  { id: "48", name: "널리BS180", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },
  { id: "49", name: "널리BS360", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },
  { id: "50", name: "널리FS180", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },
  { id: "51", name: "널리FS360", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },
  { id: "52", name: "널리킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },
  { id: "53", name: "널리힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "널리" },

  { id: "54", name: "BS보드슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  { id: "55", name: "FS보드슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  { id: "56", name: "BS립슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  { id: "57", name: "FS립슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  { id: "63", name: "BS노즈슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  { id: "65", name: "BS블런트슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  {
    id: "66",
    name: "BS노즈블런트슬라이드",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "슬라이드",
  },
  { id: "72", name: "FS노즈슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  { id: "74", name: "FS블런트슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "슬라이드" },
  {
    id: "75",
    name: "FS노즈블런트슬라이드",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "슬라이드",
  },

  // 그라인드 (슬라이드 제외)
  { id: "58", name: "BS피프티", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "59", name: "BS5-0", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "60", name: "BS스미스", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "61", name: "BS피블", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "62", name: "BS테일", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "64", name: "BS크룩그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "67", name: "FS피프티", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "68", name: "FS5-0", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "69", name: "FS스미스", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "70", name: "FS피블", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "71", name: "FS테일", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
  { id: "73", name: "FS노즈그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", category: "그라인드" },
]

const streetCategories = [
  { name: "기초", tricks: streetTricks.filter((t) => t.category === "기초") },
  { name: "킥턴", tricks: streetTricks.filter((t) => t.category === "킥턴") },
  { name: "알리", tricks: streetTricks.filter((t) => t.category === "알리") },
  { name: "샤빗", tricks: streetTricks.filter((t) => t.category === "샤빗") },
  { name: "회전", tricks: streetTricks.filter((t) => t.category === "회전") },
  { name: "플립", tricks: streetTricks.filter((t) => t.category === "플립") },
  { name: "널리", tricks: streetTricks.filter((t) => t.category === "널리") },
  { name: "슬라이드", tricks: streetTricks.filter((t) => t.category === "슬라이드") },
  { name: "그라인드", tricks: streetTricks.filter((t) => t.category === "그라인드") },
]

export default function RampPage() {
  const [selectedTrick, setSelectedTrick] = useState<{ name: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  // 기본 영상 URL
  const DEFAULT_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ"

  // 커스텀 훅 사용
  const { descriptions, saveDescription, addVideo, deleteVideo, getTrickVideos } = useSkateData()

  // 모달이 열릴 때 선택된 기술의 데이터 로드
  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(descriptions[selectedTrick.name] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }, [selectedTrick, descriptions])

  const handleSaveDesc = () => {
    if (selectedTrick) {
      saveDescription(selectedTrick.name, currentDescription)
      setIsEditingDescription(false)
    }
  }

  const handleAddVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      // URL 변환 로직은 훅 내부에 넣거나 여기서 처리
      let embedUrl = newVideoUrl.trim()
      if (embedUrl.includes("watch?v=")) embedUrl = embedUrl.replace("watch?v=", "embed/")
      else if (embedUrl.includes("youtu.be/")) embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/")

      addVideo(selectedTrick.name, embedUrl, DEFAULT_VIDEO)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const handleDeleteVideo = (index: number) => {
    if (selectedTrick) {
      deleteVideo(selectedTrick.name, index, DEFAULT_VIDEO)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>
            <div className="flex flex-1 items-center gap-4 md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="검색어 입력..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="ghost" size="icon"><User className="size-5" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl font-bold">KBRT</h2>
          <p className="text-xl text-muted-foreground">K&B MINIRAMP RANK TEST</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rampRanks.map((rank) => (
            <div key={rank.name} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-4">
                <div className={`size-12 rounded-lg bg-gradient-to-br ${rank.color} shadow-md`} />
                <h3 className="text-xl font-bold">{rank.name}</h3>
              </div>
              <div className="space-y-6">
                {rank.levels.map((level) => (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-primary">{rank.name} {level.level}</span>
                      <span className="text-xs text-muted-foreground">{level.description}</span>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {level.tricks.map((trick, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => setSelectedTrick({ name: trick })}
                            className="text-sm hover:text-primary underline decoration-primary/20 hover:decoration-primary transition-all"
                          >
                            {trick}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {selectedTrick && getTrickVideos(selectedTrick.name, DEFAULT_VIDEO).map((videoUrl, index) => (
                <div key={index} className="group relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">영상 #{index + 1}</span>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-8 gap-1"
                      onClick={() => handleDeleteVideo(index)}
                    >
                      <Trash2 className="size-3" /> 삭제
                    </Button>
                  </div>
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
                    <iframe src={videoUrl} className="size-full" allowFullScreen />
                  </div>
                </div>
              ))}
            </div>

            {isAddingVideo ? (
              <div className="space-y-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4">
                <Input
                  placeholder="YouTube URL을 입력하세요..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddVideo}>등록하기</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingVideo(false)}>취소</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full border-dashed py-8" onClick={() => setIsAddingVideo(true)}>
                <Plus className="mr-2 size-4" /> 참고 영상 추가하기
              </Button>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">나의 메모 / 기술 팁</label>
                <Button 
                  size="sm" 
                  variant={isEditingDescription ? "default" : "secondary"} 
                  onClick={isEditingDescription ? handleSaveDesc : () => setIsEditingDescription(true)}
                >
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              <Textarea
                className="min-h-[120px] resize-none"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                disabled={!isEditingDescription}
                placeholder="연습 팁을 기록해보세요."
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

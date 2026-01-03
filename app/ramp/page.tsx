"use client"

import { useState, useEffect } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useSkateData } from "@/hooks/useSkateData" // 커스텀 훅 임포트

// ... (RankLevel, RankCategory, rampRanks 정의는 이전과 동일)
type RankLevel = {
  level: number
  description: string
  tricks: string[]
}

type RankCategory = {
  name: string
  color: string
  levels: RankLevel[]
}

const rampRanks: RankCategory[] = [
  {
    name: "아이언",
    color: "from-stone-600 to-stone-800",
    levels: [
      { level: 3, description: "진자운동 하프파이프", tricks: ["락인", "락투페이키", "스위치 락투페이키"] },
      { level: 2, description: "테일탭 활용한", tricks: ["드롭인", "테일스톨"] },
      { level: 1, description: "킥턴 활용한 락", tricks: ["B/S하프팩 락투페이키", "B/S락앤롤", "B/S하프팩 락앤롤"] },
    ],
  },
  {
    name: "브론즈",
    color: "from-amber-600 to-amber-800",
    levels: [
      { level: 3, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["페이키 F/S엑슬스톨", "페이키 F/S스미스스톨"] },
      { level: 2, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["B/S피블스톨", "B/S엑슬스톨"] },
      { level: 1, description: "틱택을 활용한 스톨 (앞꿈치중심)", tricks: ["페이키 B/S엑슬스톨", "페이키 B/S스미스스톨"] },
    ],
  },
  // ... (다른 랭크 데이터 생략 가능하나 구조 유지를 위해 포함)
  {
    name: "브론즈",
    color: "from-amber-600 to-amber-800",
    levels: [
      { level: 3, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["페이키 F/S엑슬스톨", "페이키 F/S스미스스톨"] },
      { level: 2, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["B/S피블스톨", "B/S엑슬스톨"] },
      { level: 1, description: "틱택을 활용한 스톨 (앞꿈치중심)", tricks: ["페이키 B/S엑슬스톨", "페이키 B/S스미스스톨"] },
    ],
  },
  {
    name: "실버",
    color: "from-gray-400 to-gray-600",
    levels: [
      {
        level: 3,
        description: "킥턴을 활용한 락",
        tricks: ["F/S하프캡 락투페이키", "F/S락앤롤"],
      },
      {
        level: 2,
        description: "앤드워크를 활용한 스위치 락",
        tricks: ["스위치 F/S락", "스위치 B/S락앤롤"],
      },
      {
        level: 1,
        description: "앤드워크를 활용한 페이키아웃",
        tricks: ["B/S엑슬스톨 페이키", "페이키 B/S엑슬스톨 페이키"],
      },
    ],
  },
  {
    name: "실버",
    color: "from-gray-400 to-gray-600",
    levels: [
      {
        level: 3,
        description: "킥턴을 활용한 락",
        tricks: ["F/S하프캡 락투페이키", "F/S락앤롤"],
      },
      {
        level: 2,
        description: "앤드워크를 활용한 스위치 락",
        tricks: ["스위치 F/S락", "스위치 B/S락앤롤"],
      },
      {
        level: 1,
        description: "앤드워크를 활용한 페이키아웃",
        tricks: ["B/S엑슬스톨 페이키", "페이키 B/S엑슬스톨 페이키"],
      },
    ],
  },
  {
    name: "골드",
    color: "from-yellow-500 to-yellow-700",
    levels: [
      {
        level: 3,
        description: "틱택과 테일탭을 활용한 스톨",
        tricks: ["페이키 F/S파이브오", "페이키 B/S파이브오"],
      },
      {
        level: 2,
        description: "틱택을 활용한 스톨 (뒷꿈치중심)",
        tricks: ["F/S엑슬스톨", "F/S스미스스톨"],
      },
      {
        level: 1,
        description: "앤드워크를 활용한 페이키아웃",
        tricks: ["페이키 F/S엑슬스톨 페이키", "F/S엑슬스톨 페이키", "페이키 F/S스미스스톨 페이키"],
      },
    ],
  },
    name: "플래티넘",
    color: "from-slate-400 to-slate-600",
    levels: [
      {
        level: 3,
        description: "노즈탭과 앤드워크를 활용한",
        tricks: ["노즈스톨", "스위치B/S락", "스위치F/S락앤롤"],
      },
      {
        level: 2,
        description: "앤드워크를 활용한 리버트",
        tricks: ["테일스톨 B/S리버트", "테일스톨 F/S리버트"],
      },
      {
        level: 1,
        description: "틱택과 테일탭을 활용한 스톨",
        tricks: ["B/S파이브오", "F/S파이브오"],
      },
    ],
  },
  {
    name: "에메랄드",
    color: "from-emerald-500 to-emerald-700",
    levels: [
      { level: 3, description: "틱택을 활용한 스톨 (앞꿈치중심)", tricks: ["F/S피블스톨", "B/S스미스스톨"] },
      { level: 2, description: "킥턴과 180알리를 활용한 락", tricks: ["행업", "B/S디제스터", "F/S디제스터"] },
      { level: 1, description: "테일탭과 알리를 활용한", tricks: ["블런트 락투페이키", "블런트 노즈그랩 페이키"] },
    ],
  },
  // ... (다른 랭크 데이터 생략 가능하나 구조 유지를 위해 포함)
  {
    name: "다이아몬드",
    color: "from-sky-400 to-sky-600",
    levels: [
      {
        level: 3,
        description: "틱택을 활용한 페이키아웃",
        tricks: ["B/S피블스톨 페이키", "B/S파이브오 페이키"],
      },
      {
        level: 2,
        description: "앤드워크를 활용한 페이키아웃",
        tricks: ["F/S스미스스톨 페이키", "F/S파이브오 페이키"],
      },
      {
        level: 1,
        description: "테일탭과 알리를 활용한",
        tricks: ["블런트 페이키", "널리 디제스터"],
      },
    ],
  },
  {
    name: "마스터",
    color: "from-purple-500 to-purple-700",
    levels: [
      {
        level: 3,
        description: "락앤롤을 활용한 스톨",
        tricks: ["B/S허리케인", "F/S허리케인"],
      },
      {
        level: 2,
        description: "노즈탭과 널리를 활용한",
        tricks: ["스위치블런트 락투페이키", "스위치블런트"],
      },
      {
        level: 1,
        description: "킥턴과 180알리를 활용한 스톨",
        tricks: ["F/S테일스톨 (or린테일)", "B/S테일스톨 (or바디자)"],
      },
    ],
  },
  {
    name: "그랜드마스터",
    color: "from-red-600 to-red-800",
    levels: [
      {
        level: 3,
        description: "노즈탭을 활용한 스톨",
        tricks: ["B/S크룩스톨", "F/S노즈스톨", "F/S파이브오투페이키"],
      },
      {
        level: 2,
        description: "180회전을 활용한 블런트",
        tricks: ["B/S하프캡 블런트", "블런트B/S아웃", "블런트F/S아웃"],
      },
      {
        level: 1,
        description: "디제스터를 활용한 스톨",
        tricks: ["B/S슈가케인", "F/S슈가케인"],
      },
    ],
  },
  {
    name: "챌린저",
    color: "from-cyan-400 to-cyan-600",
    levels: [
      {
        level: 3,
        description: "스위치 블런트 활용",
        tricks: ["스위치 블런트EB/S아웃", "스위치 블런트EF/S아웃"],
      },
      {
        level: 2,
        description: "180회전을 활용한 노즈블런트",
        tricks: ["B/S노즈블런트", "F/S노즈블런트"],
      },
      {
        level: 1,
        description: "180알리를 활용한 노즈",
        tricks: ["B/S노즈픽", "F/S노즈픽"],
      },
    ],
  },
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

"use client"

import { useState, useEffect } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

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
      {
        level: 3,
        description: "진자운동 하프파이프",
        tricks: ["락인", "락투페이키", "스위치 락투페이키"],
      },
      {
        level: 2,
        description: "테일탭 활용한",
        tricks: ["드롭인", "테일스톨"],
      },
      {
        level: 1,
        description: "킥턴 활용한 락",
        tricks: ["B/S하프팩 락투페이키", "B/S락앤롤", "B/S하프팩 락앤롤"],
      },
    ],
  },
  {
    name: "에메랄드",
    color: "from-emerald-500 to-emerald-700",
    levels: [
      {
        level: 3,
        description: "틱택을 활용한 스톨 (앞꿈치중심)",
        tricks: ["F/S피블스톨", "B/S스미스스톨"],
      },
      {
        level: 2,
        description: "킥턴과 180알리를 활용한 락",
        tricks: ["행업", "B/S디제스터", "F/S디제스터"],
      },
      {
        level: 1,
        description: "테일탭과 알리를 활용한",
        tricks: ["블런트 락투페이키", "블런트 노즈그랩 페이키"],
      },
    ],
  },
  {
    name: "브론즈",
    color: "from-amber-600 to-amber-800",
    levels: [
      {
        level: 3,
        description: "틱택을 활용한 스톨 (뒷꿈치중심)",
        tricks: ["페이키 F/S엑슬스톨", "페이키 F/S스미스스톨"],
      },
      {
        level: 2,
        description: "틱택을 활용한 스톨 (뒷꿈치중심)",
        tricks: ["B/S피블스톨", "B/S엑슬스톨"],
      },
      {
        level: 1,
        description: "틱택을 활용한 스톨 (앞꿈치중심)",
        tricks: ["페이키 B/S엑슬스톨", "페이키 B/S스미스스톨"],
      },
    ],
  },
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
        tricks: ["B/S노즈팩", "F/S노즈팩"],
      },
    ],
  },
]

export default function RampPage() {
  const [selectedTrick, setSelectedTrick] = useState<{ name: string; videoUrl: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({})
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({})
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("skateflow-descriptions")
    if (saved) {
      setTrickDescriptions(JSON.parse(saved))
    }
    const savedVideos = localStorage.getItem("skateflow-videos")
    if (savedVideos) {
      setTrickVideos(JSON.parse(savedVideos))
    }
  }, [])

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }, [selectedTrick, trickDescriptions])

  const saveDescription = () => {
    if (selectedTrick) {
      const updated = { ...trickDescriptions, [selectedTrick.name]: currentDescription }
      setTrickDescriptions(updated)
      localStorage.setItem("skateflow-descriptions", JSON.stringify(updated))
      setIsEditingDescription(false)
    }
  }

  const addVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const currentVideos = trickVideos[selectedTrick.name] || []
      const updated = {
        ...trickVideos,
        [selectedTrick.name]: [...currentVideos, newVideoUrl.trim()],
      }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-videos", JSON.stringify(updated))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (index: number) => {
    if (selectedTrick) {
      const currentVideos = trickVideos[selectedTrick.name] || []
      const updated = {
        ...trickVideos,
        [selectedTrick.name]: currentVideos.filter((_, i) => i !== index),
      }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-videos", JSON.stringify(updated))
    }
  }

  const handleTrickClick = (trickName: string) => {
    setSelectedTrick({
      name: trickName,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    })
  }

  const getCurrentVideos = () => {
    if (!selectedTrick) return []
    return trickVideos[selectedTrick.name] || [selectedTrick.videoUrl]
  }

  return (
    <div className="min-h-screen bg-background">
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
                <Button variant="default" size="sm">
                  램프
                </Button>
              </Link>
              <Link href="/street">
                <Button variant="outline" size="sm">
                  스트릿
                </Button>
              </Link>
              <Link href="/transition">
                <Button variant="outline" size="sm">
                  트랜지션
                </Button>
              </Link>
            </div>

            <div className="flex flex-1 items-center gap-4 md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="검색어 입력..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl font-bold">KBRT</h2>
          <p className="text-xl text-muted-foreground">K&B MINIRAMP RANK TEST</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {rampRanks.map((rank) => (
            <div key={rank.name} className="rounded-xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-4">
                <div className={`size-16 rounded-lg bg-gradient-to-br ${rank.color} shadow-lg`} />
                <div>
                  <h3 className="text-2xl font-bold">{rank.name}</h3>
                </div>
              </div>

              <div className="space-y-6">
                {rank.levels.map((level) => (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <h4 className="whitespace-nowrap text-lg font-semibold">
                        {rank.name}
                        {level.level}
                      </h4>
                      <span className="text-sm text-muted-foreground">{level.description}</span>
                    </div>
                    <ul className="space-y-1 pl-4">
                      {level.tricks.map((trick, idx) => (
                        <li key={idx} className="text-sm">
                          <button
                            onClick={() => handleTrickClick(trick)}
                            className="text-foreground underline decoration-primary/30 transition-colors hover:decoration-primary"
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
            <DialogTitle>{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getCurrentVideos().map((videoUrl, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">영상 {index + 1}</span>
                  {index > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => deleteVideo(index - 1)}>
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <iframe
                    src={videoUrl}
                    title={`${selectedTrick?.name} - ${index + 1}`}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}

            {isAddingVideo ? (
              <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
                <label className="text-sm font-medium">새 영상 URL</label>
                <Input
                  placeholder="YouTube embed URL을 입력하세요..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addVideo}>
                    추가
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingVideo(false)}>
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsAddingVideo(true)}>
                <Plus className="mr-2 size-4" />
                영상 추가
              </Button>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">기술 설명</label>
                {isEditingDescription ? (
                  <Button size="sm" onClick={saveDescription}>
                    저장
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(true)}>
                    수정
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="기술에 대한 설명이나 팁을 입력하세요..."
                className="min-h-[100px]"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                disabled={!isEditingDescription}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

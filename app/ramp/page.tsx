"use client"
import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// --- 유튜브 주소 변환 유틸리티 함수 ---
const convertToEmbedUrl = (url: string) => {
  if (!url) return "";
  let videoId = "";
  try {
    const parsedUrl = new URL(url);
    if (url.includes("shorts/")) {
      videoId = parsedUrl.pathname.split("/")[2];
    } else if (url.includes("youtu.be/")) {
      videoId = parsedUrl.pathname.split("/")[1];
    } else if (url.includes("v=")) {
      videoId = parsedUrl.searchParams.get("v") || "";
    } else if (url.includes("embed/")) {
      return url;
    }
    if (videoId && videoId.includes("?")) {
      videoId = videoId.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (e) {
    return url;
  }
};

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
      { level: 1, description: "킥턴 활용한 락", tricks: ["B/S하프캡 락투페이키", "B/S락앤롤", "B/S하프캡 락앤롤"] },
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
  {
    name: "실버",
    color: "from-gray-400 to-gray-600",
    levels: [
      { level: 3, description: "킥턴을 활용한 락", tricks: ["F/S하프캡 락투페이키", "F/S락앤롤"] },
      { level: 2, description: "앤드워크를 활용한 스위치 락", tricks: ["스위치 F/S락", "스위치 B/S락앤롤"] },
      { level: 1, description: "앤드워크를 활용한 페이키아웃", tricks: ["B/S엑슬스톨 페이키", "페이키 B/S엑슬스톨 페이키"] },
    ],
  },
  {
    name: "골드",
    color: "from-yellow-500 to-yellow-700",
    levels: [
      { level: 3, description: "틱택과 테일탭을 활용한 스톨", tricks: ["페이키 F/S파이브오", "페이키 B/S파이브오"] },
      { level: 2, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["F/S엑슬스톨", "F/S스미스스톨"] },
      { level: 1, description: "앤드워크를 활용한 페이키아웃", tricks: ["페이키 F/S엑슬스톨 페이키", "F/S엑슬스톨 페이키", "페이키 F/S스미스스톨 페이키"] },
    ],
  },
  {
    name: "플래티넘",
    color: "from-slate-400 to-slate-600",
    levels: [
      { level: 3, description: "노즈탭과 앤드워크를 활용한", tricks: ["노즈스톨", "스위치B/S락", "스위치F/S락앤롤"] },
      { level: 2, description: "앤드워크를 활용한 리버트", tricks: ["테일스톨 B/S리버트", "테일스톨 F/S리버트"] },
      { level: 1, description: "틱택과 테일탭을 활용한 스톨", tricks: ["B/S파이브오", "F/S파이브오"] },
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
  {
    name: "다이아몬드",
    color: "from-sky-400 to-sky-600",
    levels: [
      { level: 3, description: "틱택을 활용한 페이키아웃", tricks: ["B/S피블스톨 페이키", "B/S파이브오 페이키"] },
      { level: 2, description: "앤드워크를 활용한 페이키아웃", tricks: ["F/S스미스스톨 페이키", "F/S파이브오 페이키"] },
      { level: 1, description: "테일탭과 알리를 활용한", tricks: ["블런트 페이키", "널리 디제스터"] },
    ],
  },
  {
    name: "마스터",
    color: "from-purple-500 to-purple-700",
    levels: [
      { level: 3, description: "락앤롤을 활용한 스톨", tricks: ["B/S허리케인", "F/S허리케인"] },
      { level: 2, description: "노즈탭과 널리를 활용한", tricks: ["스위치블런트 락투페이키", "스위치블런트"] },
      { level: 1, description: "킥턴과 180알리를 활용한 스톨", tricks: ["F/S테일스톨 (or린테일)", "B/S테일스톨 (or바디자)"] },
    ],
  },
  {
    name: "그랜드마스터",
    color: "from-red-600 to-red-800",
    levels: [
      { level: 3, description: "노즈탭을 활용한 스톨", tricks: ["B/S크룩스톨", "F/S노즈스톨", "F/S파이브오투페이키"] },
      { level: 2, description: "180회전을 활용한 블런트", tricks: ["B/S하프캡 블런트", "블런트B/S아웃", "블런트F/S아웃"] },
      { level: 1, description: "디제스터를 활용한 스톨", tricks: ["B/S슈가케인", "F/S슈가케인"] },
    ],
  },
  {
    name: "챌린저",
    color: "from-cyan-400 to-cyan-600",
    levels: [
      { level: 3, description: "스위치 블런트 활용", tricks: ["스위치 블런트EB/S아웃", "스위치 블런트EF/S아웃"] },
      { level: 2, description: "180회전을 활용한 노즈블런트", tricks: ["B/S노즈블런트", "F/S노즈블런트"] },
      { level: 1, description: "180알리를 활용한 노즈", tricks: ["B/S노즈픽", "F/S노즈픽"] },
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
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("skateflow-ramp-descriptions")
    if (saved) setTrickDescriptions(JSON.parse(saved))
    const savedVideos = localStorage.getItem("skateflow-ramp-videos")
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos))
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }, [selectedTrick, trickDescriptions])

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : rampRanks.flatMap(rank => 
        rank.levels.flatMap(level => 
          level.tricks
            .filter(trick => trick.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(trick => ({ name: trick, rankName: rank.name, level: level.level }))
        )
      )

  const saveDescription = () => {
    if (selectedTrick) {
      const updated = { ...trickDescriptions, [selectedTrick.name]: currentDescription }
      setTrickDescriptions(updated)
      localStorage.setItem("skateflow-ramp-descriptions", JSON.stringify(updated))
      setIsEditingDescription(false)
    }
  }

  const addVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const embeddedUrl = convertToEmbedUrl(newVideoUrl.trim())
      const currentVideos = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: [...currentVideos, embeddedUrl] }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (index: number) => {
    if (selectedTrick) {
      const currentVideos = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: currentVideos.filter((_, i) => i !== index) }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated))
    }
  }

  const handleTrickClick = (trickName: string) => {
    setSelectedTrick({ name: trickName, videoUrl: "" })
    setSearchQuery("")
    setIsSearchFocused(false)
  }

  const getCurrentVideos = () => {
    if (!selectedTrick) return []
    return trickVideos[selectedTrick.name] || []
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/ramp"><Button variant="default" size="sm">램프</Button></Link>
              <Link href="/street"><Button variant="outline" size="sm">스트릿</Button></Link>
              <Link href="/transition"><Button variant="outline" size="sm">트랜지션</Button></Link>
            </div>
            <div className="flex flex-1 items-center gap-4 md:max-w-md" ref={searchRef}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="기술 이름 검색..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setIsSearchFocused(true); }}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-md border border-border bg-popover shadow-xl">
                    <div className="p-1">
                      {searchResults.map((result, idx) => (
                        <button key={idx} onClick={() => handleTrickClick(result.name)} className="flex w-full flex-col items-start rounded-sm px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors">
                          <span className="text-sm font-semibold">{result.name}</span>
                          <span className="text-xs text-muted-foreground">{result.rankName} 레벨 {result.level}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon"><User className="size-5" /></Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl font-bold italic underline decoration-primary/30">KBRT</h2>
          <p className="text-xl text-muted-foreground font-mono">K&B MINIRAMP RANK TEST</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rampRanks.map((rank) => (
            <div key={rank.name} className="rounded-xl border border-border bg-card p-6 shadow-lg transition-all hover:shadow-primary/5">
              <div className="mb-6 flex items-center gap-4">
                <div className={`size-14 rounded-lg bg-gradient-to-br ${rank.color} shadow-lg`} />
                <h3 className="text-2xl font-black italic">{rank.name}</h3>
              </div>
              <div className="space-y-6">
                {rank.levels.map((level) => (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <h4 className="whitespace-nowrap text-sm font-bold text-primary">{rank.name} {level.level}</h4>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">{level.description}</span>
                    </div>
                    <ul className="space-y-1.5 pl-3 border-l-2 border-primary/10">
                      {level.tricks.map((trick, idx) => (
                        <li key={idx} className="text-sm">
                          <button onClick={() => handleTrickClick(trick)} className="text-foreground/80 hover:text-primary hover:underline underline-offset-4 transition-all text-left">
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
            <DialogTitle className="text-2xl font-black italic">{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              {getCurrentVideos().length === 0 ? (
                <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-muted text-muted-foreground border-2 border-dashed">
                  <p>등록된 영상이 없습니다.</p>
                  <p className="text-xs">학습 영상을 추가해보세요!</p>
                </div>
              ) : (
                getCurrentVideos().map((videoUrl, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">GUIDE VIDEO #{index + 1}</span>
                      <Button size="sm" variant="ghost" className="text-destructive h-7 px-2 hover:bg-destructive/10" onClick={() => deleteVideo(index)}>
                        <Trash2 className="size-4 mr-1" /> 삭제
                      </Button>
                    </div>
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                      <iframe src={videoUrl} title={`${selectedTrick?.name} - ${index + 1}`} className="size-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t pt-6">
              {isAddingVideo ? (
                <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <label className="text-xs font-bold uppercase">YouTube 주소 입력</label>
                  <Input placeholder="주소를 복사해서 붙여넣으세요" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => setIsAddingVideo(false)}>취소</Button>
                    <Button size="sm" onClick={addVideo}>저장하기</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5" onClick={() => setIsAddingVideo(true)}>
                  <Plus className="mr-2 size-4" /> 새로운 영상 추가
                </Button>
              )}
            </div>
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase">나의 연습 노트</label>
                <Button size="sm" variant={isEditingDescription ? "default" : "ghost"} onClick={() => isEditingDescription ? saveDescription() : setIsEditingDescription(true)}>
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              <Textarea className="min-h-[120px] bg-muted/20 border-none focus-visible:ring-1" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} disabled={!isEditingDescription} placeholder="성공 비결이나 주의할 점을 기록하세요." />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

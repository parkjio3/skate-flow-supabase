"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft, Plus, Trash2, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// --- 유튜브 및 인스타그램 주소 변환 유틸리티 ---
const convertToEmbedUrl = (url: string) => {
  if (!url) return "";
  try {
    const parsedUrl = new URL(url);
    // 1. 유튜브 처리 (일반, Shorts, 단축 URL 모두 대응)
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("shorts/")) {
        videoId = parsedUrl.pathname.split("/")[2];
      } else if (url.includes("youtu.be/")) {
        videoId = parsedUrl.pathname.split("/")[1];
      } else if (url.includes("v=")) {
        videoId = parsedUrl.searchParams.get("v") || "";
      }
      if (videoId && videoId.includes("?")) {
        videoId = videoId.split("?")[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    // 2. 인스타그램 처리
    if (url.includes("instagram.com")) {
      let baseUrl = url.split("?")[0];
      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
      }
      return `${baseUrl}/embed`;
    }
    return url;
  } catch (e) {
    return url;
  }
};

type RankLevel = {
  level: number;
  description: string;
  tricks: string[];
}

type RankCategory = {
  name: string;
  color: string;
  levels: RankLevel[];
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
  }
];

export default function RampPage() {
  const [selectedTrick, setSelectedTrick] = useState<{ name: string } | null>(null)
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
    const savedDesc = localStorage.getItem("skateflow-ramp-descriptions")
    if (savedDesc) setTrickDescriptions(JSON.parse(savedDesc))
    const savedVideos = localStorage.getItem("skateflow-ramp-videos")
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos))
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
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

  const searchResults = searchQuery.trim() === "" ? [] : rampRanks.flatMap(rank => 
    rank.levels.flatMap(level => level.tricks
      .filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(t => ({ name: t, rankName: rank.name, level: level.level }))
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
      const embedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: [...current, embedUrl] }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (idx: number) => {
    if (selectedTrick) {
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: current.filter((_, i) => i !== idx) }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated))
    }
  }

  const handleTrickClick = (trickName: string) => {
    setSelectedTrick({ name: trickName })
    setSearchQuery("")
    setIsSearchFocused(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* --- HEADER --- */}
      <header className="border-b bg-card sticky top-0 z-40">
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
            <div className="relative flex-1 md:max-w-md" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="기술 검색..." 
                className="pl-9" 
                value={searchQuery} 
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-md border bg-popover shadow-xl p-1">
                  {searchResults.map((r, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleTrickClick(r.name)} 
                      className="flex w-full flex-col p-2 hover:bg-accent rounded-sm text-left"
                    >
                      <span className="text-sm font-bold">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.rankName} Lv.{r.level}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon"><User className="size-5" /></Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-black italic tracking-tighter text-primary">KBRT</h2>
          <p className="text-muted-foreground font-mono uppercase">K&B Miniramp Rank Test</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rampRanks.map((rank) => (
            <div key={rank.name} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className={`size-12 rounded-lg bg-gradient-to-br ${rank.color}`} />
                <h3 className="text-xl font-bold italic">{rank.name}</h3>
              </div>
              <div className="space-y-5">
                {rank.levels.map((lv) => (
                  <div key={lv.level} className="space-y-2">
                    <div className="flex items-center gap-2 border-b pb-1">
                      <span className="text-xs font-black text-primary">{rank.name} {lv.level}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{lv.description}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {lv.tricks.map((trick, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleTrickClick(trick)}
                          className="text-xs px-2 py-1 rounded bg-muted hover:bg-primary hover:text-white transition-colors"
                        >
                          {trick}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- TRICK DETAIL DIALOG --- */}
      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic">{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* 영상 목록 구역 */}
            <div className="space-y-6">
              {(trickVideos[selectedTrick?.name || ""] || []).length === 0 ? (
                <div className="aspect-video flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                  유튜브/인스타 영상을 추가하세요.
                </div>
              ) : (
                trickVideos[selectedTrick?.name || ""].map((url, i) => (
                  <div key={i} className="space-y-2 pb-4 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-bold opacity-50">
                        {url.includes("instagram") ? <Instagram className="size-3"/> : <Youtube className="size-3"/>}
                        VIDEO #{i+1}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-destructive" 
                        onClick={() => deleteVideo(i)}
                      >
                        <Trash2 className="size-3 mr-1"/>삭제
                      </Button>
                    </div>
                    {/* 영상 컨테이너: 인스타그램은 세로 비율(4:5), 유튜브는 가로 비율(16:9) 대응 */}
                    <div 
                      className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg"
                      style={{ paddingTop: url.includes("instagram") ? "125%" : "56.25%" }}
                    >
                      <iframe 
                        src={url} 
                        className="absolute top-0 left-0 w-full h-full" 
                        allowFullScreen 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 영상 추가 폼 */}
            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="flex flex-col gap-2">
                  <Input 
                    placeholder="유튜브 또는 인스타그램 주소" 
                    value={newVideoUrl} 
                    onChange={(e) => setNewVideoUrl(e.target.value)} 
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingVideo(false)}>취소</Button>
                    <Button size="sm" onClick={addVideo}>영상 등록</Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full border-dashed" 
                  onClick={() => setIsAddingVideo(true)}
                >
                  <Plus className="mr-2 size-4"/>새 영상 추가 (유튜브/인스타)
                </Button>
              )}
            </div>

            {/* 노하우/팁 메모 구역 */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">노하우 & 팁</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => isEditingDescription ? saveDescription() : setIsEditingDescription(true)}
                >
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              <Textarea 
                value={currentDescription} 
                onChange={(e) => setCurrentDescription(e.target.value)} 
                disabled={!isEditingDescription} 
                className="min-h-[100px] bg-muted/30 border-none resize-none focus-visible:ring-1" 
                placeholder="기술 성공을 위한 팁을 입력하세요..."
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

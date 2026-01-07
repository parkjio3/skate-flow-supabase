"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// --- 유튜브 주소 변환 유틸리티 함수 (이 부분이 반드시 있어야 합니다) ---
const convertToEmbedUrl = (url: string) => {
  if (!url) return "";
  
  let videoId = "";
  
  try {
    // URL 객체를 생성하여 파라미터 분리 시도
    const parsedUrl = new URL(url);
    
    if (url.includes("shorts/")) {
      // 1. Shorts 형식: youtube.com/shorts/VIDEO_ID
      videoId = parsedUrl.pathname.split("/")[2];
    } else if (url.includes("youtu.be/")) {
      // 2. 단축 주소 형식: youtu.be/VIDEO_ID
      videoId = parsedUrl.pathname.split("/")[1];
    } else if (url.includes("v=")) {
      // 3. 일반 영상 형식: youtube.com/watch?v=VIDEO_ID
      videoId = parsedUrl.searchParams.get("v") || "";
    } else if (url.includes("embed/")) {
      // 4. 이미 임베드 형식인 경우 그대로 반환
      return url;
    }
    
    // ID 뒤에 붙을 수 있는 다른 파라미터들(?si= 등) 제거
    if (videoId && videoId.includes("?")) {
      videoId = videoId.split("?")[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch (e) {
    return url;
  }
};

type Trick = {
  id: string
  category: string
  name: string
  videoUrl: string
}

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
        tricks: ["B/S하프캡 락투페이키", "B/S락앤롤", "B/S하프캡 락앤롤"],
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
// 램프 전용 기술 리스트
const rampTricks: Trick[] = [
  { id: "r1", category: "기초", name: "드롭인", videoUrl: "" },
  { id: "r2", category: "기초", name: "펌핑", videoUrl: "" },
  { id: "r3", category: "기초", name: "BS 킥턴", videoUrl: "" },
  { id: "r4", category: "기초", name: "FS 킥턴", videoUrl: "" },
  { id: "r5", category: "기초", name: "테일 스탈", videoUrl: "" },
  { id: "r6", category: "기초", name: "락 투 페이키", videoUrl: "" },
  { id: "r7", category: "기초", name: "락 앤 롤", videoUrl: "" },
  { id: "r8", category: "기초", name: "액슬 스탈", videoUrl: "" },
  { id: "r9", category: "그라인드", name: "BS 50-50 그라인드", videoUrl: "" },
  { id: "r10", category: "그라인드", name: "FS 50-50 그라인드", videoUrl: "" },
  { id: "r11", category: "그라인드", name: "BS 5-0 그라인드", videoUrl: "" },
  { id: "r12", category: "그라인드", name: "BS 스미스 그라인드", videoUrl: "" },
  { id: "r13", category: "에어", name: "알리 인", videoUrl: "" },
  { id: "r14", category: "에어", name: "BS 에어", videoUrl: "" },
  { id: "r15", category: "에어", name: "FS 에어", videoUrl: "" },
  { id: "r16", category: "에어", name: "인디 그랩", videoUrl: "" },
  { id: "r17", category: "에어", name: "뮤트 그랩", videoUrl: "" },
  { id: "r18", category: "플립", name: "킥플립 투 페이키", videoUrl: "" },
  { id: "r19", category: "플립", name: "페이키 킥플립", videoUrl: "" },
  { id: "r20", category: "고난도", name: "블런트 투 페이키", videoUrl: "" },
  { id: "r21", category: "고난도", name: "노즈블런트", videoUrl: "" },
];

const categories = ["기초", "그라인드", "에어", "플립", "고난도"];

export default function RampPage() {
  const [selectedTrick, setSelectedTrick] = useState<Trick | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({})
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({})
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 램프 전용 로컬스토리지 키 사용
    const savedDesc = localStorage.getItem("skateflow-ramp-desc")
    if (savedDesc) setTrickDescriptions(JSON.parse(savedDesc))
    const savedVideos = localStorage.getItem("skateflow-ramp-videos")
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos))

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchFocused(false)
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
    : rampTricks.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const handleTrickClick = (trick: Trick) => {
    setSelectedTrick(trick)
    setSearchQuery("")
    setIsSearchFocused(false)
  }

  const saveDescription = () => {
    if (selectedTrick) {
      const updated = { ...trickDescriptions, [selectedTrick.name]: currentDescription }
      setTrickDescriptions(updated)
      localStorage.setItem("skateflow-ramp-desc", JSON.stringify(updated))
      setIsEditingDescription(false)
    }
  }

  const addVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      // 여기서 convertToEmbedUrl을 사용하여 변환 후 저장합니다.
      const embeddedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: [...current, embeddedUrl] }
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5"/></Button></Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>

            <nav className="flex gap-2">
              <Link href="/ramp"><Button variant="default" size="sm">램프</Button></Link>
              <Link href="/street"><Button variant="outline" size="sm">스트릿</Button></Link>
              <Link href="/transition"><Button variant="outline" size="sm">트랜지션</Button></Link>
            </nav>

            <div className="relative flex-1 md:max-w-md" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="램프 기술 검색..."
                className="pl-9"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 z-50 w-full overflow-hidden rounded-lg border bg-popover shadow-xl">
                  {searchResults.map((t) => (
                    <button
                      key={t.id}
                      className="flex w-full flex-col px-4 py-2 text-left hover:bg-accent transition-colors border-b last:border-none"
                      onClick={() => handleTrickClick(t)}
                    >
                      <span className="text-sm font-bold">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon"><User className="size-5"/></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h2 className="font-mono text-4xl font-extrabold tracking-tighter italic">RAMP TRICKS</h2>
          <p className="text-muted-foreground">쿼터파이프 기술 라이브러리</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {categories.map((cat) => (
            <section key={cat} className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary italic">
                <span className="h-1 w-6 bg-primary rounded-full" /> {cat}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {rampTricks
                  .filter((t) => t.category === cat)
                  .map((t) => (
                    <Button
                      key={t.id}
                      variant="outline"
                      className="h-auto min-h-[50px] justify-start text-left text-xs leading-tight hover:border-primary/50 transition-all"
                      onClick={() => setSelectedTrick(t)}
                    >
                      {t.name}
                    </Button>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-xs font-bold text-primary uppercase tracking-widest">{selectedTrick?.category}</div>
            <DialogTitle className="text-2xl font-black italic">{selectedTrick?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              {[selectedTrick?.videoUrl, ...(trickVideos[selectedTrick?.name || ""] || [])].map((url, i) => (
                url && (
                  <div key={i} className="group relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold opacity-50">VIDEO #{i + 1}</span>
                      {i > 0 && (
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => deleteVideo(i - 1)}>
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted border shadow-inner">
                      <iframe 
                        src={url} 
                        className="size-full" 
                        allowFullScreen 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="space-y-2 rounded-xl bg-muted p-4">
                  <Input 
                    placeholder="유튜브 주소를 붙여넣으세요" 
                    value={newVideoUrl} 
                    onChange={(e) => setNewVideoUrl(e.target.value)} 
                  />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingVideo(false)}>취소</Button>
                    <Button size="sm" onClick={addVideo}>저장</Button>
                  </div>
                </div>
              ) : (
                <Button variant="ghost" className="w-full border-dashed border-2" onClick={() => setIsAddingVideo(true)}>
                  <Plus className="mr-2 size-4" /> 추가 학습 영상 등록
                </Button>
              )}
            </div>

            <div className="space-y-2 border-t pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold italic">TIPS & NOTES</span>
                <Button size="sm" variant={isEditingDescription ? "default" : "ghost"} onClick={() => isEditingDescription ? saveDescription() : setIsEditingDescription(true)}>
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              <Textarea
                className="min-h-[100px] bg-muted/50 border-none"
                placeholder="성공을 위한 팁이나 본인만의 노하우를 적어주세요."
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

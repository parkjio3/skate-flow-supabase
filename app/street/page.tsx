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
  
  // 1. shorts 주소 체크 (https://youtube.com/shorts/ID)
  if (url.includes("shorts/")) {
    videoId = url.split("shorts/")[1].split("?")[0];
  } 
  // 2. youtu.be 주소 체크 (https://youtu.be/ID)
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } 
  // 3. 일반 watch 주소 체크 (https://youtube.com/watch?v=ID)
  else if (url.includes("v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } 
  // 4. 이미 embed 주소인 경우
  else if (url.includes("embed/")) {
    return url;
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

type Trick = {
  id: string
  category: string
  name: string
  videoUrl: string
}

const streetTricks: Trick[] = [
  // 기초
  { id: "s1", category: "기초", name: "푸쉬오프\n(5M한발버티기)", videoUrl: "" },
  { id: "s2", category: "기초", name: "틱택\n(10M타임어택)", videoUrl: "" },
  { id: "s3", category: "기초", name: "FS앤드워크\n(10M타임어택)", videoUrl: "" },
  { id: "s4", category: "기초", name: "BS앤드워크\n(10M타임어택)", videoUrl: "" },
  { id: "s5", category: "기초", name: "매뉴얼\n(3M통과)", videoUrl: "" },
  { id: "s6", category: "기초", name: "노즈매뉴얼\n(3M통과)", videoUrl: "" },
  { id: "s7", category: "기초", name: "팬케이크플립", videoUrl: "" },
  { id: "s8", category: "기초", name: "페이키BS킥턴", videoUrl: "" },
  { id: "s9", category: "기초", name: "BS킥턴", videoUrl: "" },
  { id: "s10", category: "기초", name: "페이키FS킥턴", videoUrl: "" },
  { id: "s11", category: "기초", name: "FS킥턴", videoUrl: "" },
  { id: "s12", category: "기초", name: "FS파워슬라이드", videoUrl: "" },
  { id: "s13", category: "기초", name: "BS파워슬라이드", videoUrl: "" },
  { id: "s14", category: "기초", name: "엑시드드롭", videoUrl: "" },
  { id: "s15", category: "기초", name: "풋브레이크", videoUrl: "" },
  { id: "s16", category: "기초", name: "테일브레이크", videoUrl: "" },
  { id: "s17", category: "기초", name: "FS앤드오버", videoUrl: "" },
  { id: "s18", category: "기초", name: "BS앤드오버", videoUrl: "" },
  { id: "s19", category: "기초", name: "페이키 FS앤드오버", videoUrl: "" },
  { id: "s20", category: "기초", name: "페이키 BS앤드오버", videoUrl: "" },
  { id: "s21", category: "기초", name: "히피점프", videoUrl: "" },

  // 알리
  { id: "a1", category: "알리", name: "주행 알리", videoUrl: "" },
  { id: "a2", category: "알리", name: "알리 높이\n(10CM)", videoUrl: "" },
  { id: "a3", category: "알리", name: "알리 높이\n(20CM)", videoUrl: "" },
  { id: "a4", category: "알리", name: "알리 높이\n(30CM)", videoUrl: "" },
  { id: "a5", category: "알리", name: "알리 높이\n(40CM)", videoUrl: "" },
  { id: "a6", category: "알리", name: "알리 높이\n(50CM)", videoUrl: "" },
  { id: "a7", category: "알리", name: "알리 높이\n(60CM)", videoUrl: "" },
  { id: "a8", category: "알리", name: "페이키 알리", videoUrl: "" },
  { id: "a9", category: "알리", name: "알리 멀리\n(20CM)", videoUrl: "" },
  { id: "a10", category: "알리", name: "알리 멀리\n(40CM)", videoUrl: "" },
  { id: "a11", category: "알리", name: "알리 멀리\n(60CM)", videoUrl: "" },
  { id: "a12", category: "알리", name: "알리 멀리\n(100CM)", videoUrl: "" },
  { id: "a13", category: "알리", name: "알리 멀리\n(160CM)", videoUrl: "" },
  { id: "a14", category: "알리", name: "알리 멀리\n(200CM)", videoUrl: "" },

  // 샤빗
  { id: "sh1", category: "샤빗", name: "BS샤빗", videoUrl: "" },
  { id: "sh2", category: "샤빗", name: "BS360샤빗", videoUrl: "" },
  { id: "sh3", category: "샤빗", name: "페이키BS샤빗", videoUrl: "" },
  { id: "sh4", category: "샤빗", name: "페이키BS빅스핀", videoUrl: "" },
  { id: "sh5", category: "샤빗", name: "BS빅스핀", videoUrl: "" },
  { id: "sh6", category: "샤빗", name: "FS샤빗", videoUrl: "" },
  { id: "sh7", category: "샤빗", name: "FS360샤빗", videoUrl: "" },
  { id: "sh8", category: "샤빗", name: "페이키FS샤빗", videoUrl: "" },
  { id: "sh9", category: "샤빗", name: "페이키FS빅스핀", videoUrl: "" },
  { id: "sh10", category: "샤빗", name: "FS빅스핀", videoUrl: "" },

  // 회전
  { id: "r1", category: "회전", name: "BS180알리", videoUrl: "" },
  { id: "r2", category: "회전", name: "BS360알리", videoUrl: "" },
  { id: "r3", category: "회전", name: "BS하프캡", videoUrl: "" },
  { id: "r4", category: "회전", name: "BS풀캡", videoUrl: "" },
  { id: "r5", category: "회전", name: "FS180알리", videoUrl: "" },
  { id: "r6", category: "회전", name: "FS360알리", videoUrl: "" },
  { id: "r7", category: "회전", name: "FS하프캡", videoUrl: "" },
  { id: "r8", category: "회전", name: "FS풀캡", videoUrl: "" },

  // 슬라이드
  { id: "sl1", category: "슬라이드", name: "BS보드슬라이드", videoUrl: "" },
  { id: "sl2", category: "슬라이드", name: "FS보드슬라이드", videoUrl: "" },
  { id: "sl3", category: "슬라이드", name: "BS립슬라이드", videoUrl: "" },
  { id: "sl4", category: "슬라이드", name: "FS립슬라이드", videoUrl: "" },
  { id: "sl5", category: "슬라이드", name: "BS노즈슬라이드", videoUrl: "" },
  { id: "sl6", category: "슬라이드", name: "FS노즈슬라이드", videoUrl: "" },
  { id: "sl7", category: "슬라이드", name: "BS테일슬라이드", videoUrl: "" },
  { id: "sl8", category: "슬라이드", name: "FS테일슬라이드", videoUrl: "" },
  { id: "sl9", category: "슬라이드", name: "BS블런트슬라이드", videoUrl: "" },
  { id: "sl10", category: "슬라이드", name: "FS블런트슬라이드", videoUrl: "" },
  { id: "sl11", category: "슬라이드", name: "BS노즈블런트슬라이드", videoUrl: "" },
  { id: "sl12", category: "슬라이드", name: "FS노즈블런트슬라이드", videoUrl: "" },

  // 그라인드
  { id: "g1", category: "그라인드", name: "BS50-50 그라인드", videoUrl: "" },
  { id: "g2", category: "그라인드", name: "FS50-50 그라인드", videoUrl: "" },
  { id: "g3", category: "그라인드", name: "BS5-0 그라인드", videoUrl: "" },
  { id: "g4", category: "그라인드", name: "FS5-0 그라인드", videoUrl: "" },
  { id: "g5", category: "그라인드", name: "BS피블 그라인드", videoUrl: "" },
  { id: "g6", category: "그라인드", name: "FS피블 그라인드", videoUrl: "" },
  { id: "g7", category: "그라인드", name: "BS스미스 그라인드", videoUrl: "" },
  { id: "g8", category: "그라인드", name: "FS스미스 그라인드", videoUrl: "" },
  { id: "g9", category: "그라인드", name: "BS노즈 그라인드", videoUrl: "" },
  { id: "g10", category: "그라인드", name: "BS크룩 그라인드", videoUrl: "" },
  { id: "g11", category: "그라인드", name: "FS노즈 그라인드", videoUrl: "" },
  { id: "g12", category: "그라인드", name: "FS크룩 그라인드", videoUrl: "" },

  // 킥플립
  { id: "kf1", category: "킥플립", name: "킥플립", videoUrl: "" },
  { id: "kf2", category: "킥플립", name: "베리얼킥플립", videoUrl: "" },
  { id: "kf3", category: "킥플립", name: "트레플립", videoUrl: "" },
  { id: "kf4", category: "킥플립", name: "BS킥플립", videoUrl: "" },
  { id: "kf5", category: "킥플립", name: "FS킥플립", videoUrl: "" },
  { id: "kf6", category: "킥플립", name: "BS빅스핀 킥플립", videoUrl: "" },
  { id: "kf7", category: "킥플립", name: "BS360킥플립", videoUrl: "" },
  { id: "kf8", category: "킥플립", name: "페이키 킥플립", videoUrl: "" },
  { id: "kf9", category: "킥플립", name: "페이키 베리얼 킥플립", videoUrl: "" },
  { id: "kf10", category: "킥플립", name: "BS하프캡 킥플립", videoUrl: "" },
  { id: "kf11", category: "킥플립", name: "FS하프캡 킥플립", videoUrl: "" },
  { id: "kf12", category: "킥플립", name: "풀캡 킥플립", videoUrl: "" },
  { id: "kf13", category: "킥플립", name: "페이키 BS빅스핀 킥플립", videoUrl: "" },
  { id: "kf14", category: "킥플립", name: "하드플립", videoUrl: "" },

  // 힐플립
  { id: "hf1", category: "힐플립", name: "힐플립", videoUrl: "" },
  { id: "hf2", category: "힐플립", name: "베리얼힐플립", videoUrl: "" },
  { id: "hf3", category: "힐플립", name: "레이져플립", videoUrl: "" },
  { id: "hf4", category: "힐플립", name: "BS힐플립", videoUrl: "" },
  { id: "hf5", category: "힐플립", name: "FS힐플립", videoUrl: "" },
  { id: "hf6", category: "힐플립", name: "FS빅스핀 힐플립", videoUrl: "" },
  { id: "hf7", category: "힐플립", name: "FS360힐플립", videoUrl: "" },
  { id: "hf8", category: "힐플립", name: "페이키 힐플립", videoUrl: "" },
  { id: "hf9", category: "힐플립", name: "페이키 베리얼 힐플립", videoUrl: "" },
  { id: "hf10", category: "힐플립", name: "BS하프캡 힐플립", videoUrl: "" },
  { id: "hf11", category: "힐플립", name: "FS하프캡 힐플립", videoUrl: "" },
  { id: "hf12", category: "힐플립", name: "풀캡 힐플립", videoUrl: "" },
  { id: "hf13", category: "힐플립", name: "페이키 FS빅스핀 힐플립", videoUrl: "" },
  { id: "hf14", category: "힐플립", name: "인워드힐플립", videoUrl: "" },

  // 널리
  { id: "n1", category: "널리", name: "널리", videoUrl: "" },
  { id: "n2", category: "널리", name: "널리 BS180", videoUrl: "" },
  { id: "n3", category: "널리", name: "널리 BS360", videoUrl: "" },
  { id: "n4", category: "널리", name: "널리 FS180", videoUrl: "" },
  { id: "n5", category: "널리", name: "널리 FS360", videoUrl: "" },
  { id: "n6", category: "널리", name: "널리 BS샤빗", videoUrl: "" },
  { id: "n7", category: "널리", name: "널리 BS360샤빗", videoUrl: "" },
  { id: "n8", category: "널리", name: "널리 BS빅스핀", videoUrl: "" },
  { id: "n9", category: "널리", name: "널리 FS샤빗", videoUrl: "" },
  { id: "n10", category: "널리", name: "널리 FS360샤빗", videoUrl: "" },
  { id: "n11", category: "널리", name: "널리 FS빅스핀", videoUrl: "" },
  { id: "n12", category: "널리", name: "널리 킥플립", videoUrl: "" },
  { id: "n13", category: "널리", name: "널리 BS180킥플립", videoUrl: "" },
  { id: "n14", category: "널리", name: "널리 BS360킥플립", videoUrl: "" },
  { id: "n15", category: "널리", name: "널리 FS180킥플립", videoUrl: "" },
  { id: "n16", category: "널리", name: "널리 FS360킥플립", videoUrl: "" },
  { id: "n17", category: "널리", name: "널리 힐플립", videoUrl: "" },
  { id: "n18", category: "널리", name: "널리 BS180힐플립", videoUrl: "" },
  { id: "n19", category: "널리", name: "널리 BS360힐플립", videoUrl: "" },
  { id: "n20", category: "널리", name: "널리 FS180힐플립", videoUrl: "" },
  { id: "n21", category: "널리", name: "널리 FS360힐플립", videoUrl: "" },

  // 스위치
  { id: "sw1", category: "스위치", name: "스위치 알리", videoUrl: "" },
  { id: "sw2", category: "스위치", name: "스위치 BS180", videoUrl: "" },
  { id: "sw3", category: "스위치", name: "스위치 BS360", videoUrl: "" },
  { id: "sw4", category: "스위치", name: "스위치 FS180", videoUrl: "" },
  { id: "sw5", category: "스위치", name: "스위치 FS360", videoUrl: "" },
  { id: "sw6", category: "스위치", name: "스위치 BS샤빗", videoUrl: "" },
  { id: "sw7", category: "스위치", name: "스위치 BS360샤빗", videoUrl: "" },
  { id: "sw8", category: "스위치", name: "스위치 BS빅스핀", videoUrl: "" },
  { id: "sw9", category: "스위치", name: "스위치 FS샤빗", videoUrl: "" },
  { id: "sw10", category: "스위치", name: "스위치 FS360샤빗", videoUrl: "" },
  { id: "sw11", category: "스위치", name: "스위치 FS빅스핀", videoUrl: "" },
  { id: "sw12", category: "스위치", name: "스위치 킥플립", videoUrl: "" },
  { id: "sw13", category: "스위치", name: "스위치 BS180킥플립", videoUrl: "" },
  { id: "sw14", category: "스위치", name: "스위치 BS360킥플립", videoUrl: "" },
  { id: "sw15", category: "스위치", name: "스위치 FS180킥플립", videoUrl: "" },
  { id: "sw16", category: "스위치", name: "스위치 FS360킥플립", videoUrl: "" },
  { id: "sw17", category: "스위치", name: "스위치 힐플립", videoUrl: "" },
  { id: "sw18", category: "스위치", name: "스위치 BS180힐플립", videoUrl: "" },
  { id: "sw19", category: "스위치", name: "스위치 BS360힐플립", videoUrl: "" },
  { id: "sw20", category: "스위치", name: "스위치 FS180힐플립", videoUrl: "" },
  { id: "sw21", category: "스위치", name: "스위치 FS360힐플립", videoUrl: "" },
];

const categories = ["기초", "알리", "샤빗", "회전", "슬라이드", "그라인드", "킥플립", "힐플립", "널리", "스위치"];

export default function StreetPage() {
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
    const savedDesc = localStorage.getItem("skateflow-street-desc")
    if (savedDesc) setTrickDescriptions(JSON.parse(savedDesc))
    const savedVideos = localStorage.getItem("skateflow-street-videos")
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
    : streetTricks.filter(t => 
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
      localStorage.setItem("skateflow-street-desc", JSON.stringify(updated))
      setIsEditingDescription(false)
    }
  }

  const addVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const embeddedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: [...current, embeddedUrl] }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-street-videos", JSON.stringify(updated))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (idx: number) => {
    if (selectedTrick) {
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: current.filter((_, i) => i !== idx) }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-street-videos", JSON.stringify(updated))
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
              <Link href="/ramp"><Button variant="outline" size="sm">램프</Button></Link>
              <Link href="/street"><Button variant="default" size="sm">스트릿</Button></Link>
              <Link href="/transition"><Button variant="outline" size="sm">트랜지션</Button></Link>
            </nav>

            <div className="relative flex-1 md:max-w-md" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="기술 또는 카테고리 검색..."
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
                      <span className="text-sm font-bold">{t.name.replace('\n', ' ')}</span>
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
          <h2 className="font-mono text-4xl font-extrabold tracking-tighter italic">STREET TRICKS</h2>
          <p className="text-muted-foreground">스트릿 기술 라이브러리</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {categories.map((cat) => (
            <section key={cat} className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary italic">
                <span className="h-1 w-6 bg-primary rounded-full" /> {cat}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {streetTricks
                  .filter((t) => t.category === cat)
                  .map((t) => (
                    <Button
                      key={t.id}
                      variant="outline"
                      className="h-auto min-h-[50px] justify-start text-left text-xs leading-tight whitespace-pre-wrap hover:border-primary/50 transition-all"
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
            <DialogTitle className="text-2xl font-black italic">{selectedTrick?.name.replace('\n', ' ')}</DialogTitle>
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
                      <iframe src={url} className="size-full" allowFullScreen />
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="space-y-2 rounded-xl bg-muted p-4">
                  <Input placeholder="유튜브 URL을 붙여넣으세요 (Shorts 지원)" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
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

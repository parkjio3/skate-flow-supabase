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

export default function StreetPage() {
  const [selectedTrick, setSelectedTrick] = useState<Trick | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  // 커스텀 훅 사용
  const { descriptions, saveDescription, addVideo, deleteVideo, getTrickVideos } = useSkateData()

  // 모달 열릴 때 상태 초기화
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
      addVideo(selectedTrick.name, newVideoUrl, selectedTrick.videoUrl)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const handleDeleteVideo = (index: number) => {
    if (selectedTrick) {
      deleteVideo(selectedTrick.name, index, selectedTrick.videoUrl)
    }
  }

  const filteredCategories = streetCategories.map(cat => ({
    ...cat,
    tricks: cat.tricks.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.tricks.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header 영역 (기존과 동일) */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
            <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/ramp"><Button variant="outline" size="sm">램프</Button></Link>
            <Link href="/street"><Button variant="default" size="sm">스트릿</Button></Link>
            <Link href="/transition"><Button variant="outline" size="sm">트랜지션</Button></Link>
          </div>
          <div className="flex flex-1 items-center gap-4 md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="기술 검색..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="ghost" size="icon"><User className="size-5" /></Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto space-y-8 px-4 py-8">
        <h2 className="font-mono text-3xl font-bold">스트릿 기술</h2>
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.name} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-primary">{category.name}</h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {category.tricks.map((trick) => (
                  <Button key={trick.id} variant="outline" className="h-auto justify-start py-3 text-left hover:border-primary/50" onClick={() => setSelectedTrick(trick)}>
                    <span className="truncate text-sm">{trick.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal 영역 */}
      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-xl font-bold">{selectedTrick?.name}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              {selectedTrick && getTrickVideos(selectedTrick.name, selectedTrick.videoUrl).map((videoUrl, index) => (
                <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">영상 {index + 1}</span>
                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteVideo(index)}>
                      <Trash2 className="mr-1 size-4" /> 삭제
                    </Button>
                  </div>
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <iframe src={videoUrl} title="video" className="size-full" allowFullScreen />
                  </div>
                </div>
              ))}
            </div>

            {isAddingVideo ? (
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <Input placeholder="YouTube Embed URL..." value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                <div className="flex gap-2"><Button size="sm" onClick={handleAddVideo}>등록</Button><Button size="sm" variant="outline" onClick={() => setIsAddingVideo(false)}>취소</Button></div>
              </div>
            ) : (
              <Button variant="outline" className="w-full border-dashed" onClick={() => setIsAddingVideo(true)}><Plus className="mr-2 size-4" /> 영상 추가</Button>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold">기술 메모</label>
                <Button size="sm" variant="outline" onClick={isEditingDescription ? handleSaveDesc : () => setIsEditingDescription(true)}>
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              <Textarea className="min-h-[100px]" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} disabled={!isEditingDescription} placeholder="연습 팁 기록..." />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

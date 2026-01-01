"use client"

import { useState, useEffect } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// --- 데이터 타입 정의 ---
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

// --- 랭크 데이터 (기존과 동일) ---
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
    name: "에메랄드",
    color: "from-emerald-500 to-emerald-700",
    levels: [
      { level: 3, description: "틱택을 활용한 스톨 (앞꿈치중심)", tricks: ["F/S피블스톨", "B/S스미스스톨"] },
      { level: 2, description: "킥턴과 180알리를 활용한 락", tricks: ["행업", "B/S디제스터", "F/S디제스터"] },
      { level: 1, description: "테일탭과 알리를 활용한", tricks: ["블런트 락투페이키", "블런트 노즈그랩 페이키"] },
    ],
  },
  // ... (다른 랭크 데이터들 생략되어도 로직은 동일하게 작동합니다)
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
  const [trickVideoTitles, setTrickVideoTitles] = useState<Record<string, string[]>>({})
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null)
  const [editingTitleValue, setEditingTitleValue] = useState("")

  // --- 추가된 상태: 각 영상의 시작 시간(초) 관리 ---
  const [videoStartTimes, setVideoStartTimes] = useState<Record<number, number>>({})

  useEffect(() => {
    const saved = localStorage.getItem("skateflow-descriptions")
    if (saved) setTrickDescriptions(JSON.parse(saved))
    const savedVideos = localStorage.getItem("skateflow-videos")
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos))
    const savedTitles = localStorage.getItem("skateflow-video-titles")
    if (savedTitles) setTrickVideoTitles(JSON.parse(savedTitles))
  }, [])

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
      setEditingTitleIndex(null)
      setEditingTitleValue("")
      setVideoStartTimes({}) // 모달 열 때 시간 초기화
    }
  }, [selectedTrick, trickDescriptions])

  // --- 유틸리티 함수: 시간 변환 및 타임스탬프 처리 ---
  const timeToSeconds = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(":").map(Number)
    return minutes * 60 + seconds
  }

  const handleTimestampClick = (videoIndex: number, timeStr: string) => {
    const seconds = timeToSeconds(timeStr)
    setVideoStartTimes((prev) => ({ ...prev, [videoIndex]: seconds }))
  }

  const renderDescriptionWithLinks = (text: string) => {
    if (!text) return null
    const regex = /(영상(\d+)\((\d{1,2}:\d{2})\))/g
    const parts = text.split(regex)
    const result = []

    for (let i = 0; i < parts.length; i++) {
      // regex 그룹화로 인해 parts[i+1]은 숫자, parts[i+2]는 분:초가 됨
      if (parts[i] && parts[i].match(/^영상\d+\(\d{1,2}:\d{2}\)$/)) {
        const videoNum = Number.parseInt(parts[i + 1]) - 1
        const timeStr = parts[i + 2]
        result.push(
          <button
            key={i}
            onClick={() => handleTimestampClick(videoNum, timeStr)}
            className="mx-1 font-bold text-blue-500 hover:underline"
          >
            {parts[i]}
          </button>,
        )
        i += 2
      } else {
        result.push(parts[i])
      }
    }
    return result
  }

  // --- 기존 핸들러 함수들 ---
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
      const currentTitles = trickVideoTitles[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: [...currentVideos, newVideoUrl.trim()] }
      const updatedTitles = {
        ...trickVideoTitles,
        [selectedTrick.name]: [...currentTitles, `영상 ${currentVideos.length + 2}`],
      }
      setTrickVideos(updated)
      setTrickVideoTitles(updatedTitles)
      localStorage.setItem("skateflow-videos", JSON.stringify(updated))
      localStorage.setItem("skateflow-video-titles", JSON.stringify(updatedTitles))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (index: number) => {
    if (selectedTrick) {
      const currentVideos = trickVideos[selectedTrick.name] || []
      const currentTitles = trickVideoTitles[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: currentVideos.filter((_, i) => i !== index) }
      const updatedTitles = { ...trickVideoTitles, [selectedTrick.name]: currentTitles.filter((_, i) => i !== index) }
      setTrickVideos(updated)
      setTrickVideoTitles(updatedTitles)
      localStorage.setItem("skateflow-videos", JSON.stringify(updated))
      localStorage.setItem("skateflow-video-titles", JSON.stringify(updatedTitles))
    }
  }

  const startEditingTitle = (index: number) => {
    const currentTitles = trickVideoTitles[selectedTrick?.name || ""] || []
    setEditingTitleIndex(index)
    setEditingTitleValue(currentTitles[index] || `영상 ${index + 1}`)
  }

  const saveVideoTitle = () => {
    if (selectedTrick && editingTitleIndex !== null) {
      const currentTitles = trickVideoTitles[selectedTrick.name] || []
      const videos = getCurrentVideos()
      const newTitles = [...currentTitles]
      while (newTitles.length < videos.length) newTitles.push(`영상 ${newTitles.length + 1}`)
      newTitles[editingTitleIndex] = editingTitleValue.trim() || `영상 ${editingTitleIndex + 1}`
      const updated = { ...trickVideoTitles, [selectedTrick.name]: newTitles }
      setTrickVideoTitles(updated)
      localStorage.setItem("skateflow-video-titles", JSON.stringify(updated))
      setEditingTitleIndex(null)
    }
  }

  const getVideoTitle = (index: number) => {
    if (!selectedTrick) return `영상 ${index + 1}`
    const titles = trickVideoTitles[selectedTrick.name] || []
    return titles[index] || `영상 ${index + 1}`
  }

  const handleTrickClick = (trickName: string) => {
    setSelectedTrick({ name: trickName, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" })
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
                <Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button>
              </Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/ramp"><Button variant="default" size="sm">램프</Button></Link>
              <Link href="/street"><Button variant="outline" size="sm">스트릿</Button></Link>
              <Link href="/transition"><Button variant="outline" size="sm">트랜지션</Button></Link>
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
            <Button variant="ghost" size="icon"><User className="size-5" /></Button>
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
                <h3 className="text-2xl font-bold">{rank.name}</h3>
              </div>
              <div className="space-y-6">
                {rank.levels.map((level) => (
                  <div key={level.level} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <h4 className="whitespace-nowrap text-lg font-semibold">{rank.name} {level.level}</h4>
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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getCurrentVideos().map((videoUrl, index) => {
              const startTime = videoStartTimes[index] || 0
              const separator = videoUrl.includes("?") ? "&" : "?"
              const finalUrl = `${videoUrl}${separator}start=${startTime}&autoplay=1`

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {editingTitleIndex === index ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editingTitleValue}
                          onChange={(e) => setEditingTitleValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={saveVideoTitle}>저장</Button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => startEditingTitle(index)} className="text-sm font-medium hover:text-primary">
                          {getVideoTitle(index)}
                        </button>
                        {index > 0 && (
                          <Button size="sm" variant="ghost" onClick={() => deleteVideo(index - 1)}>
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <iframe
                      key={`${index}-${startTime}`} // 중요: 시작 시간이 바뀔 때 iframe을 새로고침함
                      src={finalUrl}
                      title={`${selectedTrick?.name} - ${getVideoTitle(index)}`}
                      className="size-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )
            })}

            {isAddingVideo ? (
              <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
                <Input
                  placeholder="YouTube embed URL 입력..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addVideo}>추가</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingVideo(false)}>취소</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setIsAddingVideo(true)}>
                <Plus className="mr-2 size-4" /> 영상 추가
              </Button>
            )}

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">기술 설명 (영상1(00:10) 형식으로 입력)</label>
                {isEditingDescription ? (
                  <Button size="sm" onClick={saveDescription}>저장</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(true)}>수정</Button>
                )}
              </div>
              {isEditingDescription ? (
                <Textarea
                  className="min-h-[100px]"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                />
              ) : (
                <div className="min-h-[100px] whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm leading-relaxed">
                  {renderDescriptionWithLinks(currentDescription)}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

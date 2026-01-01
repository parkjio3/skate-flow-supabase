"use client"

import { useState } from "react"
import { useSkateTricks, timeToSeconds } from "@/hooks/useSkateTricks"
// ... 나머지 UI 임포트 동일

export default function StreetPage() {
  const [selectedTrick, setSelectedTrick] = useState<any>(null)
  const { states, actions } = useSkateTricks(selectedTrick?.name)

  // 타임스탬프 렌더링 로직 (UI 관련이라 페이지에 유지하거나 별도 컴포넌트화 가능)
  const renderDescriptionWithLinks = (text: string) => {
    if (!text) return null
    const regex = /(영상(\d+)\((\d{1,2}:\d{2})\))/g
    return text.split(regex).map((part, i, arr) => {
      if (part && part.match(/^영상\d+\(\d{1,2}:\d{2}\)$/)) {
        const videoIdx = Number(arr[i + 1]) - 1
        const timeStr = arr[i + 2]
        return (
          <button key={i} onClick={() => states.setVideoStartTimes(p => ({ ...p, [videoIdx]: timeToSeconds(timeStr) }))} className="mx-1 font-bold text-blue-500 hover:underline">
            {part}
          </button>
        )
      }
      if (i % 4 === 0) return part // 텍스트 파트만 반환
      return null
    })
  }

  const currentVideos = selectedTrick ? (states.trickVideos[selectedTrick.name] || [selectedTrick.videoUrl]) : []

  return (
    <div className="min-h-screen bg-background">
      {/* ... 헤더 및 리스트 UI 동일 ... */}

      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* ... 영상 리스트 렌더링 부분 ... */}
          {currentVideos.map((url, idx) => {
            const startTime = states.videoStartTimes[idx] || 0
            return (
              <div key={`${idx}-${startTime}`} className="space-y-2">
                <p className="text-sm font-medium">{states.trickVideoTitles[selectedTrick.name]?.[idx] || `영상 ${idx + 1}`}</p>
                <iframe src={`${url}${url.includes('?') ? '&' : '?'}start=${startTime}&autoplay=1`} className="w-full aspect-video rounded-lg" allowFullScreen />
              </div>
            )
          })}
          
          {/* ... 설명 및 수정 UI (states, actions 연결) ... */}
          <Textarea 
            value={states.currentDescription} 
            onChange={(e) => states.setCurrentDescription(e.target.value)} 
            disabled={!states.isEditingDescription}
          />
          <Button onClick={actions.saveDescription}>저장</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

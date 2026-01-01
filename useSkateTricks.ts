"use client"

import { useState, useEffect } from "react"

export function useSkateTricks(selectedTrickName: string | undefined) {
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({})
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({})
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const [trickVideoTitles, setTrickVideoTitles] = useState<Record<string, string[]>>({})
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null)
  const [editingTitleValue, setEditingTitleValue] = useState("")
  const [videoStartTimes, setVideoStartTimes] = useState<Record<number, number>>({})

  // 데이터 로드
  useEffect(() => {
    const savedDesc = localStorage.getItem("skateflow-descriptions")
    const savedVideos = localStorage.getItem("skateflow-videos")
    const savedTitles = localStorage.getItem("skateflow-video-titles")
    if (savedDesc) setTrickDescriptions(JSON.parse(savedDesc))
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos))
    if (savedTitles) setTrickVideoTitles(JSON.parse(savedTitles))
  }, [])

  // 기술 선택 시 상태 초기화
  useEffect(() => {
    if (selectedTrickName) {
      setCurrentDescription(trickDescriptions[selectedTrickName] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
      setEditingTitleIndex(null)
      setVideoStartTimes({})
    }
  }, [selectedTrickName, trickDescriptions])

  const saveDescription = () => {
    if (selectedTrickName) {
      const updated = { ...trickDescriptions, [selectedTrickName]: currentDescription }
      setTrickDescriptions(updated)
      localStorage.setItem("skateflow-descriptions", JSON.stringify(updated))
      setIsEditingDescription(false)
    }
  }

  const addVideo = () => {
    if (selectedTrickName && newVideoUrl.trim()) {
      const currentVideos = trickVideos[selectedTrickName] || []
      const currentTitles = trickVideoTitles[selectedTrickName] || []
      const updatedVideos = { ...trickVideos, [selectedTrickName]: [...currentVideos, newVideoUrl.trim()] }
      const updatedTitles = { ...trickVideoTitles, [selectedTrickName]: [...currentTitles, `영상 ${currentVideos.length + 2}`] }
      setTrickVideos(updatedVideos)
      setTrickVideoTitles(updatedTitles)
      localStorage.setItem("skateflow-videos", JSON.stringify(updatedVideos))
      localStorage.setItem("skateflow-video-titles", JSON.stringify(updatedTitles))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (index: number) => {
    if (selectedTrickName) {
      const updatedVideos = { ...trickVideos, [selectedTrickName]: (trickVideos[selectedTrickName] || []).filter((_, i) => i !== index) }
      const updatedTitles = { ...trickVideoTitles, [selectedTrickName]: (trickVideoTitles[selectedTrickName] || []).filter((_, i) => i !== index) }
      setTrickVideos(updatedVideos)
      setTrickVideoTitles(updatedTitles)
      localStorage.setItem("skateflow-videos", JSON.stringify(updatedVideos))
      localStorage.setItem("skateflow-video-titles", JSON.stringify(updatedTitles))
    }
  }

  const saveVideoTitle = (index: number, title: string) => {
    if (selectedTrickName) {
      const currentTitles = trickVideoTitles[selectedTrickName] || []
      const newTitles = [...currentTitles]
      newTitles[index] = title.trim() || `영상 ${index + 1}`
      const updated = { ...trickVideoTitles, [selectedTrickName]: newTitles }
      setTrickVideoTitles(updated)
      localStorage.setItem("skateflow-video-titles", JSON.stringify(updated))
      setEditingTitleIndex(null)
    }
  }

  return {
    states: {
      currentDescription, setCurrentDescription, isEditingDescription, setIsEditingDescription,
      newVideoUrl, setNewVideoUrl, isAddingVideo, setIsAddingVideo,
      editingTitleIndex, setEditingTitleIndex, editingTitleValue, setEditingTitleValue,
      videoStartTimes, setVideoStartTimes, trickVideos, trickVideoTitles
    },
    actions: { saveDescription, addVideo, deleteVideo, saveVideoTitle }
  }
}

// 헬퍼 함수 (컴포넌트 외부에서 사용 가능)
export const timeToSeconds = (timeStr: string) => {
  const [mins, secs] = timeStr.split(":").map(Number)
  return mins * 60 + secs
}

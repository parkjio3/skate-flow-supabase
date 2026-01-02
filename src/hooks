"use client"

import { useState, useEffect } from "react"

export function useSkateData() {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [videos, setVideos] = useState<Record<string, string[]>>({})

  // 데이터 로드
  useEffect(() => {
    const savedDesc = localStorage.getItem("skateflow-descriptions")
    const savedVideos = localStorage.getItem("skateflow-videos")
    if (savedDesc) setDescriptions(JSON.parse(savedDesc))
    if (savedVideos) setVideos(JSON.parse(savedVideos))
  }, [])

  // 설명 저장
  const saveDescription = (trickName: string, text: string) => {
    const updated = { ...descriptions, [trickName]: text }
    setDescriptions(updated)
    localStorage.setItem("skateflow-descriptions", JSON.stringify(updated))
  }

  // 영상 추가
  const addVideo = (trickName: string, url: string, defaultUrl: string) => {
    const currentList = videos[trickName] || [defaultUrl]
    const updatedList = [...currentList, url.trim()]
    const updatedVideos = { ...videos, [trickName]: updatedList }
    setVideos(updatedVideos)
    localStorage.setItem("skateflow-videos", JSON.stringify(updatedVideos))
  }

  // 영상 삭제
  const deleteVideo = (trickName: string, indexToDelete: number, defaultUrl: string) => {
    const currentList = videos[trickName] || [defaultUrl]
    const updatedList = currentList.filter((_, i) => i !== indexToDelete)
    const updatedVideos = { ...videos, [trickName]: updatedList }
    setVideos(updatedVideos)
    localStorage.setItem("skateflow-videos", JSON.stringify(updatedVideos))
  }

  // 현재 영상 리스트 가져오기
  const getTrickVideos = (trickName: string, defaultUrl: string) => {
    return videos[trickName] || [defaultUrl]
  }

  return {
    descriptions,
    saveDescription,
    addVideo,
    deleteVideo,
    getTrickVideos
  }
}

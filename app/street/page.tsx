"use client"

import { useState, useEffect } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useSkateData } from "@/hooks/useSkateData"

type Trick = {
  id: string
  name: string
  videoUrl: string
  category: string
}

const streetTricks: Trick[] = [
  // 기초
  { id: "s1", category: "기초", name: "푸쉬오프\n(5M한발버티기)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s2", category: "기초", name: "틱택\n(10M타임어택)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s3", category: "기초", name: "앤드워크\n(10M타임어택)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s4", category: "기초", name: "앤드오버\n(10M타임어택)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s5", category: "기초", name: "매뉴얼\n(3M통과)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s6", category: "기초", name: "히피점프\n30CM(넘기)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s7", category: "기초", name: "페이키BS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s8", category: "기초", name: "BS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s9", category: "기초", name: "페이키FS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s10", category: "기초", name: "FS킥턴", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s11", category: "기초", name: "파워슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "s12", category: "기초", name: "엑시드드롭", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 알리
  { id: "a1", category: "알리", name: "알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a2", category: "알리", name: "알리 높이\n(10CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a3", category: "알리", name: "알리 높이\n(20CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a4", category: "알리", name: "알리 높이\n(30CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a5", category: "알리", name: "알리 높이\n(40CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a6", category: "알리", name: "알리 높이\n(50CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a7", category: "알리", name: "알리 높이\n(60CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a8", category: "알리", name: "페이키 알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a9", category: "알리", name: "알리 멀리\n(20CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a10", category: "알리", name: "알리 멀리\n(40CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a11", category: "알리", name: "알리 멀리\n(60CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a12", category: "알리", name: "알리 멀리\n(100CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a13", category: "알리", name: "알리 멀리\n(160CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "a14", category: "알리", name: "알리 멀리\n(200CM)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 샤빗
  { id: "sh1", category: "샤빗", name: "BS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh2", category: "샤빗", name: "BS360샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh3", category: "샤빗", name: "페이키BS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh4", category: "샤빗", name: "페이키BS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh5", category: "샤빗", name: "BS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh6", category: "샤빗", name: "FS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh7", category: "샤빗", name: "FS360샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh8", category: "샤빗", name: "페이키FS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh9", category: "샤빗", name: "페이키FS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sh10", category: "샤빗", name: "FS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 회전
  { id: "r1", category: "회전", name: "BS180알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r2", category: "회전", name: "BS360알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r3", category: "회전", name: "BS하프캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r4", category: "회전", name: "BS풀캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r5", category: "회전", name: "FS180알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r6", category: "회전", name: "FS360알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r7", category: "회전", name: "FS하프캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "r8", category: "회전", name: "FS풀캡", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 슬라이드
  { id: "sl1", category: "슬라이드", name: "BS보드\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl2", category: "슬라이드", name: "FS보드\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl3", category: "슬라이드", name: "BS립\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl4", category: "슬라이드", name: "FS립\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl5", category: "슬라이드", name: "BS노즈\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl6", category: "슬라이드", name: "FS노즈\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl7", category: "슬라이드", name: "BS테일\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl8", category: "슬라이드", name: "FS테일\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl9", category: "슬라이드", name: "BS블런트\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl10", category: "슬라이드", name: "FS블런트\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl11", category: "슬라이드", name: "BS노즈블런트\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sl12", category: "슬라이드", name: "FS노즈블런트\n슬라이드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 그라인드
  { id: "g1", category: "그라인드", name: "BS50-50\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g2", category: "그라인드", name: "FS50-50\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g3", category: "그라인드", name: "BS5-0\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g4", category: "그라인드", name: "FS5-0\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g5", category: "그라인드", name: "BS피블\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g6", category: "그라인드", name: "FS피블\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g7", category: "그라인드", name: "BS스미스\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g8", category: "그라인드", name: "FS스미스\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g9", category: "그라인드", name: "BS노즈\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g10", category: "그라인드", name: "BS크룩\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g11", category: "그라인드", name: "FS노즈\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "g12", category: "그라인드", name: "FS크룩\n그라인드", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 킥플립
  { id: "kf1", category: "킥플립", name: "킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf2", category: "킥플립", name: "베리얼킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf3", category: "킥플립", name: "트레플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf4", category: "킥플립", name: "BS킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf5", category: "킥플립", name: "FS킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf6", category: "킥플립", name: "BS빅스핀 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf7", category: "킥플립", name: "BS360킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf8", category: "킥플립", name: "페이키 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf9", category: "킥플립", name: "페이키 베리얼 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf10", category: "킥플립", name: "BS하프캡 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf11", category: "킥플립", name: "FS하프캡 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf12", category: "킥플립", name: "풀캡 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf13", category: "킥플립", name: "페이키\nBS빅스핀 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "kf14", category: "킥플립", name: "하드플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 힐플립
  { id: "hf1", category: "힐플립", name: "힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf2", category: "힐플립", name: "베리얼힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf3", category: "힐플립", name: "레이져플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf4", category: "힐플립", name: "BS힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf5", category: "힐플립", name: "FS힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf6", category: "힐플립", name: "FS빅스핀 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf7", category: "힐플립", name: "FS360힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf8", category: "힐플립", name: "페이키 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf9", category: "힐플립", name: "페이키 베리얼 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf10", category: "힐플립", name: "BS하프캡 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf11", category: "힐플립", name: "FS하프캡 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf12", category: "힐플립", name: "풀캡 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf13", category: "힐플립", name: "페이키\nFS빅스핀 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "hf14", category: "힐플립", name: "인워드힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 널리
  { id: "n1", category: "널리", name: "널리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n2", category: "널리", name: "널리 BS180", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n3", category: "널리", name: "널리 BS360", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n4", category: "널리", name: "널리 FS180", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n5", category: "널리", name: "널리 FS360", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n6", category: "널리", name: "널리 BS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n7", category: "널리", name: "널리 BS360샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n8", category: "널리", name: "널리 BS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n9", category: "널리", name: "널리 FS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n10", category: "널리", name: "널리 FS360샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n11", category: "널리", name: "널리 FS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n12", category: "널리", name: "널리 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n13", category: "널리", name: "널리 BS180킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n14", category: "널리", name: "널리 BS360킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n15", category: "널리", name: "널리 FS180킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n16", category: "널리", name: "널리 FS360킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n17", category: "널리", name: "널리 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n18", category: "널리", name: "널리 BS180힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n19", category: "널리", name: "널리 BS360힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n20", category: "널리", name: "널리 FS180힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "n21", category: "널리", name: "널리 FS360힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },

  // 스위치
  { id: "sw1", category: "스위치", name: "스위치 알리", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw2", category: "스위치", name: "스위치 BS180", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw3", category: "스위치", name: "스위치 BS360", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw4", category: "스위치", name: "스위치 FS180", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw5", category: "스위치", name: "스위치 FS360", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw6", category: "스위치", name: "스위치 BS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw7", category: "스위치", name: "스위치 BS360샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw8", category: "스위치", name: "스위치 BS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw9", category: "스위치", name: "스위치 FS샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw10", category: "스위치", name: "스위치 FS360샤빗", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw11", category: "스위치", name: "스위치 FS빅스핀", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw12", category: "스위치", name: "스위치 킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw13", category: "스위치", name: "스위치 BS180킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw14", category: "스위치", name: "스위치 BS360킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw15", category: "스위치", name: "스위치 FS180킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw16", category: "스위치", name: "스위치 FS360킥플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw17", category: "스위치", name: "스위치 힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw18", category: "스위치", name: "스위치 BS180힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw19", category: "스위치", name: "스위치 BS360힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw20", category: "스위치", name: "스위치 FS180힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "sw21", category: "스위치", name: "스위치 FS360힐플립", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

const categoryNames = ["기초", "알리", "샤빗", "회전", "슬라이드", "그라인드", "킥플립", "힐플립", "널리", "스위치"];

const streetCategories = categoryNames.map(cat => ({
  name: cat,
  tricks: streetTricks.filter(t => t.category === cat)
}));

export default function StreetPage() {
  const [selectedTrick, setSelectedTrick] = useState<{ name: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  const DEFAULT_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ"
  const { descriptions, saveDescription, addVideo, deleteVideo, getTrickVideos } = useSkateData()

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(descriptions[selectedTrick.name] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }, [selectedTrick, descriptions])

  // 검색 필터링 로직
  const filteredCategories = streetCategories.map(cat => ({
    ...cat,
    tricks: cat.tricks.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tricks.length > 0);

  const handleSaveDesc = () => {
    if (selectedTrick) {
      saveDescription(selectedTrick.name, currentDescription)
      setIsEditingDescription(false)
    }
  }

  const handleAddVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      let embedUrl = newVideoUrl.trim()
      if (embedUrl.includes("watch?v=")) embedUrl = embedUrl.replace("watch?v=", "embed/")
      else if (embedUrl.includes("youtu.be/")) embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/")
      addVideo(selectedTrick.name, embedUrl, DEFAULT_VIDEO)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>
            <div className="flex flex-1 items-center gap-4 md:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="기술 이름 검색..." 
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
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-4xl font-bold tracking-tight">STREET TRICKS</h2>
          <p className="text-xl text-muted-foreground">스트릿 스케이트보딩 기술 가이드</p>
        </div>

        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <section key={category.name} className="space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-primary pl-4">
                <h3 className="text-2xl font-bold">{category.name}</h3>
                <span className="text-sm text-muted-foreground">{category.tricks.length}개</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {category.tricks.map((trick) => (
                  <button
                    key={trick.id}
                    onClick={() => setSelectedTrick({ name: trick.name })}
                    className="flex min-h-[80px] flex-col items-center justify-center rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary hover:shadow-md active:scale-95"
                  >
                    <span className="whitespace-pre-wrap text-sm font-medium leading-tight">
                      {trick.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="whitespace-pre-wrap text-2xl leading-tight">
              {selectedTrick?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {selectedTrick && getTrickVideos(selectedTrick.name, DEFAULT_VIDEO).map((videoUrl, index) => (
                <div key={index} className="group relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">영상 #{index + 1}</span>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-8 gap-1"
                      onClick={() => deleteVideo(selectedTrick.name, index, DEFAULT_VIDEO)}
                    >
                      <Trash2 className="size-3" /> 삭제
                    </Button>
                  </div>
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
                    <iframe src={videoUrl} className="size-full" allowFullScreen />
                  </div>
                </div>
              ))}
            </div>

            {isAddingVideo ? (
              <div className="space-y-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4">
                <Input
                  placeholder="YouTube URL을 입력하세요..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddVideo}>등록하기</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingVideo(false)}>취소</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full border-dashed py-8" onClick={() => setIsAddingVideo(true)}>
                <Plus className="mr-2 size-4" /> 참고 영상 추가하기
              </Button>
            )}

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">나의 메모 / 기술 팁</label>
                <Button 
                  size="sm" 
                  variant={isEditingDescription ? "default" : "secondary"} 
                  onClick={isEditingDescription ? handleSaveDesc : () => setIsEditingDescription(true)}
                >
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              <Textarea
                className="min-h-[120px] resize-none"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                disabled={!isEditingDescription}
                placeholder="연습 팁을 기록해보세요."
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Search, User, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

type Trick = {
  id: string
  name: string
  videoUrl: string
  category?: string
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
  const [selectedTrick, setSelectedTrick] = useState<{ name: string; videoUrl: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({})
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({})
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("skateflow-descriptions")
    if (saved) {
      setTrickDescriptions(JSON.parse(saved))
    }
    const savedVideos = localStorage.getItem("skateflow-videos")
    if (savedVideos) {
      setTrickVideos(JSON.parse(savedVideos))
    }
  }, [])

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "")
      setIsEditingDescription(false)
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }, [selectedTrick, trickDescriptions])

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
      const updated = {
        ...trickVideos,
        [selectedTrick.name]: [...currentVideos, newVideoUrl.trim()],
      }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-videos", JSON.stringify(updated))
      setNewVideoUrl("")
      setIsAddingVideo(false)
    }
  }

  const deleteVideo = (index: number) => {
    if (selectedTrick) {
      const currentVideos = trickVideos[selectedTrick.name] || []
      const updated = {
        ...trickVideos,
        [selectedTrick.name]: currentVideos.filter((_, i) => i !== index),
      }
      setTrickVideos(updated)
      localStorage.setItem("skateflow-videos", JSON.stringify(updated))
    }
  }

  const getCurrentVideos = () => {
    if (!selectedTrick) return []
    return trickVideos[selectedTrick.name] || [selectedTrick.videoUrl]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
            </div>

            {/* Navigation buttons to switch between pages */}
            <div className="flex gap-2">
              <Link href="/ramp">
                <Button variant="outline" size="sm">
                  램프
                </Button>
              </Link>
              <Link href="/street">
                <Button variant="default" size="sm">
                  스트릿
                </Button>
              </Link>
              <Link href="/transition">
                <Button variant="outline" size="sm">
                  트랜지션
                </Button>
              </Link>
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

            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto space-y-8 px-4 py-8">
        <h2 className="font-mono text-3xl font-bold">스트릿 기술</h2>
        <p className="mt-2 text-muted-foreground">Street Tricks</p>
        <div className="space-y-8">
          {streetCategories.map((category) => (
            <div key={category.name} className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-xl font-bold text-primary">{category.name}</h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {category.tricks.map((trick) => (
                  <Button
                    key={trick.id}
                    variant="outline"
                    className="h-auto justify-start py-3 text-left bg-transparent"
                    onClick={() => setSelectedTrick(trick)}
                  >
                    <span className="text-sm">{trick.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getCurrentVideos().map((videoUrl, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">영상 {index + 1}</span>
                  {index > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => deleteVideo(index - 1)}>
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <iframe
                    src={videoUrl}
                    title={`${selectedTrick?.name} - ${index + 1}`}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}

            {isAddingVideo ? (
              <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
                <label className="text-sm font-medium">새 영상 URL</label>
                <Input
                  placeholder="YouTube embed URL을 입력하세요..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addVideo}>
                    추가
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingVideo(false)}>
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsAddingVideo(true)}>
                <Plus className="mr-2 size-4" />
                영상 추가
              </Button>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">기술 설명</label>
                {isEditingDescription ? (
                  <Button size="sm" onClick={saveDescription}>
                    저장
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(true)}>
                    수정
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="기술에 대한 설명이나 팁을 입력하세요..."
                className="min-h-[100px]"
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

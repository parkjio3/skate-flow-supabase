"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft, Plus, Trash2, Instagram, Youtube, Edit2, Check, X, PlayCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { usePathname } from "next/navigation"

// --- 주소 변환 및 시간 파라미터 처리 유틸리티 (검토 완료) ---
const convertToEmbedUrl = (url: string, startTime?: number) => {
  if (!url) return "";
  try {
    const start = startTime !== undefined ? startTime : 0;
    
    // 유튜브 처리
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/embed/")) {
        videoId = url.split("embed/")[1].split("?")[0];
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1].split("?")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v") || "";
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=1`;
      }
    }

    // 인스타그램 처리
    if (url.includes("instagram.com")) {
      let baseUrl = url.split("?")[0];
      if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
      return `${baseUrl}/embed`;
    }

    return url;
  } catch (e) {
    return url;
  }
};

type Trick = { id: string; category: string; name: string; videoUrl: string }

const streetTricks: Trick[] = [
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
  { id: "a1", category: "알리", name: "주행 알리", videoUrl: "" },
  { id: "a2", category: "알리", name: "알리 높이\n(10CM)", videoUrl: "" },
  { id: "a3", category: "알리", name: "알리 높이\n(20CM)", videoUrl: "" },
  { id: "a4", category: "알리", name: "알리 높이\n(30CM)", videoUrl: "" },
  { id: "a5", category: "알리", name: "알리 높이\n(40CM)", videoUrl: "" },
  { id: "a6", category: "알리", name: "알리 높이\n(50CM)", videoUrl: "" },
  { id: "a7", category: "알리", name: "알리 높이\n(60CM)", videoUrl: "" },
  { id: "a4", category: "알리", name: "알리 계단 1칸 업", videoUrl: "" },
  { id: "a5", category: "알리", name: "알리 계단 2칸 업", videoUrl: "" },
  { id: "a6", category: "알리", name: "알리 계단 1칸 다운", videoUrl: "" },
  { id: "a7", category: "알리", name: "알리 계단 2칸 다운", videoUrl: "" },
  { id: "a8", category: "알리", name: "페이키 알리", videoUrl: "" },
  { id: "a9", category: "알리", name: "알리 멀리\n(20CM)", videoUrl: "" },
  { id: "a10", category: "알리", name: "알리 멀리\n(40CM)", videoUrl: "" },
  { id: "a11", category: "알리", name: "알리 멀리\n(60CM)", videoUrl: "" },
  { id: "a12", category: "알리", name: "알리 멀리\n(100CM)", videoUrl: "" },
  { id: "a13", category: "알리", name: "알리 멀리\n(160CM)", videoUrl: "" },
  { id: "a14", category: "알리", name: "알리 멀리\n(200CM)", videoUrl: "" },
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
  { id: "r1", category: "회전", name: "BS180알리", videoUrl: "" },
  { id: "r2", category: "회전", name: "BS360알리", videoUrl: "" },
  { id: "r3", category: "회전", name: "BS하프캡", videoUrl: "" },
  { id: "r4", category: "회전", name: "BS풀캡", videoUrl: "" },
  { id: "r5", category: "회전", name: "FS180알리", videoUrl: "" },
  { id: "r6", category: "회전", name: "FS360알리", videoUrl: "" },
  { id: "r7", category: "회전", name: "FS하프캡", videoUrl: "" },
  { id: "r8", category: "회전", name: "FS풀캡", videoUrl: "" },
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

const navigationTabs = [
  { name: "RAMP", href: "/ramp" },
  { name: "STREET", href: "/street" },
  { name: "TRANSITION", href: "/transition" },
];

export default function StreetPage() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTrick, setSelectedTrick] = useState<Trick | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({});
  const [currentDescription, setCurrentDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({});
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideoIdx, setEditingVideoIdx] = useState<number | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedDesc = localStorage.getItem("skateflow-street-desc");
    if (savedDesc) setTrickDescriptions(JSON.parse(savedDesc));
    const savedVideos = localStorage.getItem("skateflow-street-videos");
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos));

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "");
      setIsEditingDescription(false);
      setNewVideoUrl("");
      setIsAddingVideo(false);
      setEditingVideoIdx(null);
    }
  }, [selectedTrick, trickDescriptions]);

  if (!isMounted) return null;

  const jumpToVideoTime = (videoNum: number, timeStr: string) => {
    const [min, sec] = timeStr.replace(/[()]/g, "").split(":").map(Number);
    const totalSeconds = min * 60 + sec;
    const videoIndex = videoNum - 1;
    
    if (selectedTrick) {
      const videos = trickVideos[selectedTrick.name] || [];
      const targetUrl = videos[videoIndex];
      
      if (targetUrl) {
        if (targetUrl.includes("instagram.com")) {
          let cleanUrl = targetUrl.replace("/embed", "").split("?")[0];
          if (cleanUrl.endsWith("/")) cleanUrl = cleanUrl.slice(0, -1);
          window.open(`${cleanUrl}/?t=${totalSeconds}s`, "_blank");
        } else {
          const updatedVideos = [...videos];
          updatedVideos[videoIndex] = convertToEmbedUrl(targetUrl, totalSeconds);
          setTrickVideos({ ...trickVideos, [selectedTrick.name]: updatedVideos });
        }
      }
    }
  };

  const renderDescriptionWithLinks = (text: string) => {
    const combinedPattern = /영상(\d+)\((\d{1,2}:\d{2})\)/g;
    const parts = text.split(combinedPattern);
    const elements = [];

    for (let i = 0; i < parts.length; i += 3) {
      elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
      if (parts[i + 1] && parts[i + 2]) {
        const videoNum = parseInt(parts[i + 1]);
        const timeStr = parts[i + 2];
        const videoUrl = trickVideos[selectedTrick?.name || ""]?.[videoNum - 1] || "";
        const isInstagram = videoUrl.includes("instagram");

        elements.push(
          <button
            key={`btn-${i}`}
            onClick={() => jumpToVideoTime(videoNum, timeStr)}
            className={`font-bold hover:underline inline-flex items-center gap-0.5 mx-0.5 px-1 rounded transition-colors ${
              isInstagram ? "text-pink-600 bg-pink-50" : "text-primary bg-primary/5"
            }`}
          >
            {isInstagram ? <ExternalLink className="size-3" /> : <PlayCircle className="size-3" />}
            영상{videoNum}({timeStr})
          </button>
        );
      }
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{elements}</div>;
  };

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : streetTricks.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleTrickClick = (trick: Trick) => {
    setSelectedTrick(trick);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const saveDescription = () => {
    if (selectedTrick) {
      const updated = { ...trickDescriptions, [selectedTrick.name]: currentDescription };
      setTrickDescriptions(updated);
      localStorage.setItem("skateflow-street-desc", JSON.stringify(updated));
      setIsEditingDescription(false);
    }
  };

  const addVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const embeddedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const current = trickVideos[selectedTrick.name] || [];
      const updated = { ...trickVideos, [selectedTrick.name]: [...current, embeddedUrl] };
      setTrickVideos(updated);
      localStorage.setItem("skateflow-street-videos", JSON.stringify(updated));
      setNewVideoUrl("");
      setIsAddingVideo(false);
    }
  };

  const startEditVideo = (idx: number, url: string) => {
    setEditingVideoIdx(idx);
    setEditingVideoUrl(url);
  };

  const saveEditVideo = (idx: number) => {
    if (selectedTrick && editingVideoUrl.trim()) {
      const embedUrl = convertToEmbedUrl(editingVideoUrl.trim());
      const current = [...(trickVideos[selectedTrick.name] || [])];
      current[idx] = embedUrl;
      const updated = { ...trickVideos, [selectedTrick.name]: current };
      setTrickVideos(updated);
      localStorage.setItem("skateflow-street-videos", JSON.stringify(updated));
      setEditingVideoIdx(null);
    }
  };

  const deleteVideo = (idx: number) => {
    if (selectedTrick) {
      const current = trickVideos[selectedTrick.name] || [];
      const updated = { ...trickVideos, [selectedTrick.name]: current.filter((_, i) => i !== idx) };
      setTrickVideos(updated);
      localStorage.setItem("skateflow-street-videos", JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center py-4 gap-4">
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="size-5" />
                  </Button>
                </Link>
                <h1 className="font-mono text-2xl font-bold text-primary tracking-tighter">SkateFlow</h1>
              </div>
              <div className="flex md:hidden">
                <Button variant="ghost" size="icon"><User className="size-5" /></Button>
              </div>
            </div>

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
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-md border bg-popover shadow-xl p-1">
                  {searchResults.map((t) => (
                    <button key={t.id} onClick={() => handleTrickClick(t)} className="flex w-full flex-col p-2 hover:bg-accent rounded-sm text-left border-b last:border-none">
                      <span className="text-sm font-bold">{t.name.replace('\n', ' ')}</span>
                      <span className="text-[10px] text-muted-foreground">{t.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <nav className="flex gap-1 pb-px overflow-x-auto no-scrollbar">
            {navigationTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.name} href={tab.href} className="flex-1 min-w-[100px] max-w-[200px]">
                  <button
                    className={`w-full py-3 text-xs font-black italic transition-all border-b-2 ${
                      isActive 
                        ? "border-primary text-primary bg-primary/5 shadow-[inset_0_-2px_0_0_rgba(var(--primary),1)]" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tab.name}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-black italic tracking-tighter text-primary">STREET</h2>
          <p className="text-muted-foreground font-mono uppercase text-xs">SKATEBOARD STREET SKILL LIBRARY</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {categories.map((cat) => (
            <section key={cat} className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary italic uppercase">
                <span className="h-1 w-6 bg-primary rounded-full" /> {cat}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {streetTricks
                  .filter((t) => t.category === cat)
                  .map((t) => (
                    <Button
                      key={t.id}
                      variant="outline"
                      className="h-auto min-h-[52px] justify-start text-left text-[11px] leading-tight whitespace-pre-wrap hover:border-primary/50 hover:bg-primary/5 transition-all"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-70">{selectedTrick?.category}</div>
            <DialogTitle className="text-2xl font-black italic">{selectedTrick?.name.replace('\n', ' ')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-8">
              {(trickVideos[selectedTrick?.name || ""] || []).length === 0 ? (
                <div className="aspect-video flex flex-col gap-2 items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground text-sm bg-muted/10">
                  <Youtube className="size-8 opacity-20" />
                  등록된 학습 영상이 없습니다.
                </div>
              ) : (
                trickVideos[selectedTrick?.name || ""].map((url, i) => (
                  <div key={i} className="space-y-3 pb-6 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest">
                        {url.includes("instagram") ? "Instagram" : "Youtube"} VIDEO #{i+1}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => startEditVideo(i, url)}><Edit2 className="size-3 mr-1"/>수정</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => deleteVideo(i)}><Trash2 className="size-3 mr-1"/>삭제</Button>
                      </div>
                    </div>
                    {editingVideoIdx === i ? (
                      <div className="flex gap-2 bg-muted p-3 rounded-lg">
                        <Input className="h-9 text-sm" value={editingVideoUrl} onChange={(e) => setEditingVideoUrl(e.target.value)}/>
                        <Button size="sm" className="h-9 px-2" onClick={() => saveEditVideo(i)}><Check className="size-4"/></Button>
                        <Button size="sm" variant="ghost" className="h-9 px-2" onClick={() => setEditingVideoIdx(null)}><X className="size-4"/></Button>
                      </div>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg" style={{ paddingTop: url.includes("instagram") ? "125%" : "56.25%" }}>
                        <iframe src={url} className="absolute top-0 left-0 w-full h-full" allowFullScreen />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="flex flex-col gap-2">
                  <Input placeholder="유튜브 또는 인스타그램 주소" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingVideo(false)}>취소</Button>
                    <Button size="sm" onClick={addVideo}>영상 등록</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed py-8 bg-muted/5 hover:bg-muted/10 transition-colors" onClick={() => setIsAddingVideo(true)}>
                  <Plus className="mr-2 size-4"/>학습 영상 추가
                </Button>
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold italic tracking-widest opacity-60 uppercase">Tips & Notes</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => isEditingDescription ? saveDescription() : setIsEditingDescription(true)}>
                  {isEditingDescription ? "저장" : "수정"}
                </Button>
              </div>
              {isEditingDescription ? (
                <Textarea 
                  value={currentDescription} 
                  onChange={(e) => setCurrentDescription(e.target.value)} 
                  className="min-h-[140px] bg-muted/30 border-none resize-none focus-visible:ring-1 text-sm p-4" 
                  placeholder="예: 영상1(00:20) 처럼 작성하면 타임라인 링크가 활성화됩니다." 
                />
              ) : (
                <div className="p-4 rounded-md bg-muted/30 text-sm min-h-[80px] border border-transparent leading-relaxed">
                  {currentDescription ? renderDescriptionWithLinks(currentDescription) : <span className="text-muted-foreground italic text-xs">아직 등록된 팁이 없습니다. 본인만의 노하우를 기록해보세요.</span>}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

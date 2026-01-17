"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft, Plus, Trash2, Youtube, Edit2, Check, X, PlayCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Supabase 클라이언트
import { supabase } from '@/lib/supabase'

// --- 유틸리티: 주소 변환 및 시간 이동 ---
const convertToEmbedUrl = (url: string, startTime?: number) => {
  if (!url) return "";
  try {
    const start = startTime !== undefined ? startTime : 0;
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
      if (videoId) return `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=1`;
    }
    if (url.includes("instagram.com")) {
      let baseUrl = url.split("?")[0];
      if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
      return `${baseUrl}/embed`;
    }
    return url;
  } catch (e) { return url; }
};

type Trick = { id: string; category: string; name: string }

// --- 기술 목록 (나중에 여기에 추가하세요) ---
const transitionTricks: Trick[] = [
  // 예시: { id: "t1", category: "기초", name: "드롭인" },
];

const categories = ["기초", "스탈", "그라인드", "에어", "기타"];

const navigationTabs = [
  { name: "RAMP", href: "/ramp" },
  { name: "STREET", href: "/street" },
  { name: "TRANSITION", href: "/transition" },
];

export default function TransitionPage() {
  const pathname = usePathname();
  const [selectedTrick, setSelectedTrick] = useState<Trick | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // 데이터 상태 관리
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({});
  const [currentDescription, setCurrentDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({});
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideoIdx, setEditingVideoIdx] = useState<number | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // 1. Supabase 데이터 로드
  const loadAllData = async () => {
    // 설명 데이터 로드
    const { data: descData } = await supabase.from('transition_descriptions').select('*');
    if (descData) {
      const descObj = descData.reduce((acc, cur) => ({ ...acc, [cur.trick_name]: cur.content }), {});
      setTrickDescriptions(descObj);
    }
    // 영상 데이터 로드
    const { data: videoData } = await supabase.from('transition_videos').select('*');
    if (videoData) {
      const videoObj = videoData.reduce((acc, cur) => ({ ...acc, [cur.trick_name]: cur.urls }), {});
      setTrickVideos(videoObj);
    }
  };

  useEffect(() => {
    loadAllData();
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

  // 2. 설명 저장 (Upsert)
  const saveDescription = async () => {
    if (selectedTrick) {
      const { error } = await supabase
        .from('transition_descriptions')
        .upsert({ trick_name: selectedTrick.name, content: currentDescription }, { onConflict: 'trick_name' });
      
      if (!error) {
        setTrickDescriptions(prev => ({ ...prev, [selectedTrick.name]: currentDescription }));
        setIsEditingDescription(false);
      }
    }
  };

  // 3. 영상 추가 (Upsert)
  const addVideo = async () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const embedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const currentUrls = trickVideos[selectedTrick.name] || [];
      const updatedUrls = [...currentUrls, embedUrl];

      const { error } = await supabase
        .from('transition_videos')
        .upsert({ trick_name: selectedTrick.name, urls: updatedUrls }, { onConflict: 'trick_name' });

      if (!error) {
        setTrickVideos(prev => ({ ...prev, [selectedTrick.name]: updatedUrls }));
        setNewVideoUrl("");
        setIsAddingVideo(false);
      }
    }
  };

  // 4. 영상 수정/삭제 공통 DB 반영
  const updateVideosInDb = async (trickName: string, urls: string[]) => {
    const { error } = await supabase
      .from('transition_videos')
      .upsert({ trick_name: trickName, urls: urls }, { onConflict: 'trick_name' });
    return !error;
  };

  const saveEditVideo = async (idx: number) => {
    if (selectedTrick && editingVideoUrl.trim()) {
      const embedUrl = convertToEmbedUrl(editingVideoUrl.trim());
      const current = [...(trickVideos[selectedTrick.name] || [])];
      current[idx] = embedUrl;
      if (await updateVideosInDb(selectedTrick.name, current)) {
        setTrickVideos(prev => ({ ...prev, [selectedTrick.name]: current }));
        setEditingVideoIdx(null);
      }
    }
  };

  const deleteVideo = async (idx: number) => {
    if (selectedTrick) {
      const current = (trickVideos[selectedTrick.name] || []).filter((_, i) => i !== idx);
      if (await updateVideosInDb(selectedTrick.name, current)) {
        setTrickVideos(prev => ({ ...prev, [selectedTrick.name]: current }));
      }
    }
  };

  const jumpToVideoTime = (videoNum: number, timeStr: string) => {
    const [min, sec] = timeStr.replace(/[()]/g, "").split(":").map(Number);
    const totalSeconds = min * 60 + sec;
    if (selectedTrick) {
      const videos = trickVideos[selectedTrick.name] || [];
      const targetUrl = videos[videoNum - 1];
      if (targetUrl) {
        if (targetUrl.includes("instagram.com")) {
          let cleanUrl = targetUrl.replace("/embed", "").split("?")[0];
          window.open(`${cleanUrl}/?t=${totalSeconds}s`, "_blank");
        } else {
          const updatedVideos = [...videos];
          updatedVideos[videoNum - 1] = convertToEmbedUrl(targetUrl, totalSeconds);
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
          <button key={`btn-${i}`} onClick={() => jumpToVideoTime(videoNum, timeStr)} className={`font-bold hover:underline inline-flex items-center gap-0.5 mx-0.5 px-1 rounded transition-colors ${isInstagram ? "text-pink-600 bg-pink-50" : "text-primary bg-primary/5"}`}>
            {isInstagram ? <ExternalLink className="size-3" /> : <PlayCircle className="size-3" />}
            영상{videoNum}({timeStr})
          </button>
        );
      }
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{elements}</div>;
  };

  const searchResults = searchQuery.trim() === "" ? [] : transitionTricks.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center py-4 gap-4">
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center gap-4">
                <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
                <h1 className="font-mono text-2xl font-bold text-primary tracking-tighter">SkateFlow</h1>
              </div>
              <div className="flex md:hidden"><Button variant="ghost" size="icon"><User className="size-5" /></Button></div>
            </div>
            <div className="relative flex-1 md:max-w-md" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="기술 검색..." className="pl-9" value={searchQuery} onFocus={() => setIsSearchFocused(true)} onChange={(e) => setSearchQuery(e.target.value)} />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-md border bg-popover shadow-xl p-1">
                  {searchResults.map((t) => (
                    <button key={t.id} onClick={() => { setSelectedTrick(t); setSearchQuery(""); setIsSearchFocused(false); }} className="flex w-full flex-col p-2 hover:bg-accent rounded-sm text-left border-b last:border-none">
                      <span className="text-sm font-bold">{t.name}</span>
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
                  <button className={`w-full py-3 text-xs font-black italic transition-all border-b-2 ${isActive ? "border-primary text-primary bg-primary/5 shadow-[inset_0_-2px_0_0_rgba(var(--primary),1)]" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
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
          <h2 className="text-5xl font-black italic tracking-tighter text-primary">TRANSITION</h2>
          <p className="text-muted-foreground font-mono uppercase text-xs">BOWL & PIPE SKILL LIBRARY</p>
        </div>

        {transitionTricks.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <div className="mb-6 rounded-full bg-muted p-6"><Search className="size-12 text-muted-foreground opacity-20" /></div>
            <p className="text-muted-foreground font-mono uppercase text-xs tracking-widest">준비 중입니다...</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {categories.map((cat) => (
              <section key={cat} className="rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-primary italic uppercase"><span className="h-1 w-6 bg-primary rounded-full" /> {cat}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {transitionTricks.filter((t) => t.category === cat).map((t) => (
                    <Button key={t.id} variant="outline" className="h-auto min-h-[52px] justify-start text-left text-[11px] leading-tight hover:border-primary/50" onClick={() => setSelectedTrick(t)}>{t.name}</Button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-70">{selectedTrick?.category}</div>
            <DialogTitle className="text-2xl font-black italic">{selectedTrick?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-8">
              {(trickVideos[selectedTrick?.name || ""] || []).length === 0 ? (
                <div className="aspect-video flex flex-col gap-2 items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground text-sm bg-muted/10"><Youtube className="size-8 opacity-20" />등록된 학습 영상이 없습니다.</div>
              ) : (
                trickVideos[selectedTrick?.name || ""].map((url, i) => (
                  <div key={i} className="space-y-3 pb-6 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold opacity-50 uppercase tracking-widest">VIDEO #{i+1}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => { setEditingVideoIdx(i); setEditingVideoUrl(url); }}><Edit2 className="size-3 mr-1"/>수정</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => deleteVideo(i)}><Trash2 className="size-3 mr-1"/>삭제</Button>
                      </div>
                    </div>
                    {editingVideoIdx === i ? (
                      <div className="flex gap-2 bg-muted p-3 rounded-lg">
                        <Input className="h-9 text-sm" value={editingVideoUrl} onChange={(e) => setEditingVideoUrl(e.target.value)}/><Button size="sm" onClick={() => saveEditVideo(i)}><Check className="size-4"/></Button><Button size="sm" variant="ghost" onClick={() => setEditingVideoIdx(null)}><X className="size-4"/></Button>
                      </div>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingTop: url.includes("instagram") ? "125%" : "56.25%" }}><iframe src={url} className="absolute top-0 left-0 w-full h-full" allowFullScreen /></div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="flex flex-col gap-2">
                  <Input placeholder="유튜브/인스타그램 주소" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} /><div className="flex gap-2 justify-end"><Button variant="ghost" size="sm" onClick={() => setIsAddingVideo(false)}>취소</Button><Button size="sm" onClick={addVideo}>영상 등록</Button></div>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed py-8" onClick={() => setIsAddingVideo(true)}><Plus className="mr-2 size-4"/>학습 영상 추가</Button>
              )}
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold italic tracking-widest opacity-60">Tips & Notes</span><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => isEditingDescription ? saveDescription() : setIsEditingDescription(true)}>{isEditingDescription ? "저장" : "수정"}</Button></div>
              {isEditingDescription ? (
                <Textarea value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} className="min-h-[140px] bg-muted/30 border-none text-sm p-4" placeholder="영상1(00:20) 작성 시 링크 활성화" />
              ) : (
                <div className="p-4 rounded-md bg-muted/30 text-sm min-h-[80px]">{currentDescription ? renderDescriptionWithLinks(currentDescription) : <span className="text-muted-foreground italic text-xs">등록된 팁이 없습니다.</span>}</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

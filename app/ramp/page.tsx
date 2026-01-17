"use client"
import { useState, useEffect, useRef, ChangeEvent } from "react"
import { Search, User, ArrowLeft, Plus, Trash2, Instagram, Youtube, Edit2, Check, X, PlayCircle, ExternalLink, FileVideo, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Supabase 클라이언트 임포트
import { supabase } from '@/lib/supabase'

const convertToEmbedUrl = (url: string, startTime?: number) => {
  if (!url) return "";
  // Supabase Storage URL인 경우 (직접 업로드된 영상)
  if (url.includes("supabase.co/storage/v1/object/public/")) {
    return url;
  }
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
        const parsed = new URL(url);
        videoId = parsed.searchParams.get("v") || "";
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

type RankLevel = { level: number; description: string; tricks: string[] }
type RankCategory = { name: string; color: string; levels: RankLevel[] }

const rampRanks: RankCategory[] = [
  { name: "아이언", color: "from-stone-600 to-stone-800", levels: [{ level: 3, description: "진자운동 하프파이프", tricks: ["락인", "락투페이키", "스위치 락투페이키"] }, { level: 2, description: "테일탭 활용한", tricks: ["드롭인", "테일스톨"] }, { level: 1, description: "킥턴 활용한 락", tricks: ["B/S하프캡 락투페이키", "B/S락앤롤", "B/S하프캡 락앤롤"] }] },
  { name: "브론즈", color: "from-amber-600 to-amber-800", levels: [{ level: 3, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["페이키 F/S엑슬스톨", "페이키 F/S스미스스톨"] }, { level: 2, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["B/S피블스톨", "B/S엑슬스톨"] }, { level: 1, description: "틱택을 활용한 스톨 (앞꿈치중심)", tricks: ["페이키 B/S엑슬스톨", "페이키 B/S스미스스톨"] }] },
  { name: "실버", color: "from-gray-400 to-gray-600", levels: [{ level: 3, description: "킥턴을 활용한 락", tricks: ["F/S하프캡 락투페이키", "F/S락앤롤"] }, { level: 2, description: "앤드워크를 활용한 스위치 락", tricks: ["스위치 F/S락", "스위치 B/S락앤롤"] }, { level: 1, description: "앤드워크를 활용한 페이키아웃", tricks: ["B/S엑슬스톨 페이키", "페이키 B/S엑슬스톨 페이키"] }] },
  { name: "골드", color: "from-yellow-500 to-yellow-700", levels: [{ level: 3, description: "틱택과 테일탭을 활용한 스톨", tricks: ["페이키 F/S파이브오", "페이키 B/S파이브오"] }, { level: 2, description: "틱택을 활용한 스톨 (뒷꿈치중심)", tricks: ["F/S엑슬스톨", "F/S스미스스톨"] }, { level: 1, description: "앤드워크를 활용한 페이키아웃", tricks: ["페이키 F/S엑슬스톨 페이키", "F/S엑슬스톨 페이키", "페이키 F/S스미스스톨 페이키"] }] },
  { name: "플래티넘", color: "from-slate-400 to-slate-600", levels: [{ level: 3, description: "노즈탭과 앤드워크를 활용한", tricks: ["노즈스톨", "스위치B/S락", "스위치F/S락앤롤"] }, { level: 2, description: "앤드워크를 활용한 리버트", tricks: ["테일스톨 B/S리버트", "테일스톨 F/S리버트"] }, { level: 1, description: "틱택과 테일탭을 활용한 스톨", tricks: ["B/S파이브오", "F/S파이브오"] }] },
  { name: "에메랄드", color: "from-emerald-500 to-emerald-700", levels: [{ level: 3, description: "틱택을 활용한 스톨 (앞꿈치중심)", tricks: ["F/S피블스톨", "B/S스미스스톨"] }, { level: 2, description: "킥턴과 180알리를 활용한 락", tricks: ["행업", "B/S디제스터", "F/S디제스터"] }, { level: 1, description: "테일탭과 알리를 활용한", tricks: ["블런트 락투페이키", "블런트 노즈그랩 페이키"] }] },
  { name: "다이아몬드", color: "from-sky-400 to-sky-600", levels: [{ level: 3, description: "틱택을 활용한 페이키아웃", tricks: ["B/S피블스톨 페이키", "B/S파이브오 페이키"] }, { level: 2, description: "앤드워크를 활용한 페이키아웃", tricks: ["F/S스미스스톨 페이키", "F/S파이브오 페이키"] }, { level: 1, description: "테일탭과 알리를 활용한", tricks: ["블런트 페이키", "널리 디제스터"] }] },
  { name: "마스터", color: "from-purple-500 to-purple-700", levels: [{ level: 3, description: "락앤롤을 활용한 스톨", tricks: ["B/S허리케인", "F/S허리케인"] }, { level: 2, description: "노즈탭과 널리를 활용한", tricks: ["스위치블런트 락투페이키", "스위치블런트"] }, { level: 1, description: "킥턴과 180알리를 활용한 스톨", tricks: ["F/S테일스톨 (or린테일)", "B/S테일스톨 (or바디자)"] }] },
  { name: "그랜드마스터", color: "from-red-600 to-red-800", levels: [{ level: 3, description: "노즈탭을 활용한 스톨", tricks: ["B/S크룩스톨", "F/S노즈스톨", "F/S파이브오투페이키"] }, { level: 2, description: "180회전을 활용한 블런트", tricks: ["B/S하프캡 블런트", "블런트B/S아웃", "블런트F/S아웃"] }, { level: 1, description: "디제스터를 활용한 스톨", tricks: ["B/S슈가케인", "F/S슈가케인"] }] },
  { name: "챌린저", color: "from-cyan-400 to-cyan-600", levels: [{ level: 3, description: "스위치 블런트 활용", tricks: ["스위치 블런트EB/S아웃", "스위치 블런트EF/S아웃"] }, { level: 2, description: "180회전을 활용한 노즈블런트", tricks: ["B/S노즈블런트", "F/S노즈블런트"] }, { level: 1, description: "180알리를 활용한 노즈", tricks: ["B/S노즈픽", "F/S노즈픽"] }] }
];

const navigationTabs = [
  { name: "RAMP", href: "/ramp" },
  { name: "STREET", href: "/street" },
  { name: "TRANSITION", href: "/transition" },
];

export default function RampPage() {
  const pathname = usePathname();
  const [selectedTrick, setSelectedTrick] = useState<{ name: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [trickDescriptions, setTrickDescriptions] = useState<Record<string, string>>({})
  const [currentDescription, setCurrentDescription] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [trickVideos, setTrickVideos] = useState<Record<string, string[]>>({})
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const [editingVideoIdx, setEditingVideoIdx] = useState<number | null>(null)
  const [editingVideoUrl, setEditingVideoUrl] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isUploading, setIsUploading] = useState(false) 
  const searchRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 비디오 태그 및 iframe 컨테이너를 통합 제어하기 위한 Ref 배열
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 실제 HTML5 video 요소에 접근하기 위한 Ref 배열
  const nativeVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 1. Supabase에서 데이터 불러오기 (초기 로드)
  const loadAllData = async () => {
    const { data: descData } = await supabase.from('ramp_descriptions').select('*');
    if (descData) {
      const descObj = descData.reduce((acc, cur) => ({ ...acc, [cur.trick_name]: cur.content }), {});
      setTrickDescriptions(descObj);
    }

    const { data: videoData } = await supabase.from('ramp_videos').select('*');
    if (videoData) {
      const videoObj = videoData.reduce((acc, cur) => ({ ...acc, [cur.trick_name]: cur.urls }), {});
      setTrickVideos(videoObj);
    }
  };

  useEffect(() => {
    loadAllData();
    const handleClickOutside = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchFocused(false) }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "")
      setIsEditingDescription(false); 
      setNewVideoUrl(""); 
      setIsAddingVideo(false); 
      setEditingVideoIdx(null);
      // 트릭이 바뀔 때 모든 참조 초기화
      videoRefs.current = [];
      nativeVideoRefs.current = [];
    }
  }, [selectedTrick, trickDescriptions])

  const jumpToVideoTime = (videoNum: number, timeStr: string) => {
    const [min, sec] = timeStr.replace(/[()]/g, "").split(":").map(Number);
    const totalSeconds = min * 60 + sec;
    const videoIndex = videoNum - 1;

    if (selectedTrick) {
      const videos = trickVideos[selectedTrick.name] || [];
      const targetUrl = videos[videoIndex];
      if (!targetUrl) return;

      // 공통: 해당 영상 컨테이너로 스크롤 이동
      const containerElement = videoRefs.current[videoIndex];
      if (containerElement) {
        containerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // 1. 인스타그램 처리
      if (targetUrl.includes("instagram.com")) {
        let cleanUrl = targetUrl.replace("/embed", "").split("?")[0];
        if (cleanUrl.endsWith("/")) cleanUrl = cleanUrl.slice(0, -1);
        window.open(`${cleanUrl}/?t=${totalSeconds}s`, "_blank");
      } 
      // 2. 유튜브 처리
      else if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
        const updatedVideos = [...videos];
        updatedVideos[videoIndex] = convertToEmbedUrl(targetUrl, totalSeconds);
        setTrickVideos({ ...trickVideos, [selectedTrick.name]: updatedVideos });
      } 
      // 3. 로컬 업로드 영상 처리 (다운로드 문제 해결 핵심 코드)
      else if (targetUrl.includes("supabase.co")) {
        const videoElement = nativeVideoRefs.current[videoIndex];
        if (videoElement) {
          // window.open을 호출하는 대신 비디오 엘리먼트의 시간을 직접 조정합니다.
          videoElement.currentTime = totalSeconds;
          videoElement.play().catch(e => console.error("Auto-play failed:", e));
        }
      }
      // 기타 외부 링크
      else {
        window.open(targetUrl, "_blank");
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
        const isYoutube = videoUrl.includes("youtube") || videoUrl.includes("youtu.be");
        
        elements.push(
          <button 
            key={`btn-${i}`} 
            onClick={() => jumpToVideoTime(videoNum, timeStr)} 
            className={`font-bold hover:underline inline-flex items-center gap-0.5 mx-0.5 px-1 rounded transition-colors ${isInstagram ? "text-pink-600 bg-pink-50" : isYoutube ? "text-primary bg-primary/5" : "text-blue-600 bg-blue-50"}`}
          >
            {isInstagram ? <ExternalLink className="size-3" /> : isYoutube ? <PlayCircle className="size-3" /> : <FileVideo className="size-3" />}
            영상{videoNum}({timeStr})
          </button>
        );
      }
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{elements}</div>;
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTrick) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `ramp/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      const currentUrls = trickVideos[selectedTrick.name] || [];
      const updatedUrls = [...currentUrls, publicUrl];

      const { error: dbError } = await supabase
        .from('ramp_videos')
        .upsert({ trick_name: selectedTrick.name, urls: updatedUrls }, { onConflict: 'trick_name' });

      if (dbError) throw dbError;

      setTrickVideos(prev => ({ ...prev, [selectedTrick.name]: updatedUrls }));
      setIsAddingVideo(false);
      alert("영상이 성공적으로 업로드되었습니다.");
    } catch (error: any) {
      console.error(error);
      alert("업로드 실패: " + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const saveDescription = async () => {
    if (selectedTrick) {
      const { error } = await supabase
        .from('ramp_descriptions')
        .upsert({ trick_name: selectedTrick.name, content: currentDescription }, { onConflict: 'trick_name' });
      
      if (!error) {
        setTrickDescriptions(prev => ({ ...prev, [selectedTrick.name]: currentDescription }));
        setIsEditingDescription(false);
      }
    }
  }

  const addVideo = async () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const embedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const currentUrls = trickVideos[selectedTrick.name] || [];
      const updatedUrls = [...currentUrls, embedUrl];

      const { error } = await supabase
        .from('ramp_videos')
        .upsert({ trick_name: selectedTrick.name, urls: updatedUrls }, { onConflict: 'trick_name' });

      if (!error) {
        setTrickVideos(prev => ({ ...prev, [selectedTrick.name]: updatedUrls }));
        setNewVideoUrl("");
        setIsAddingVideo(false);
      }
    }
  }

  const updateVideosInDb = async (trickName: string, urls: string[]) => {
    const { error } = await supabase
      .from('ramp_videos')
      .upsert({ trick_name: trickName, urls: urls }, { onConflict: 'trick_name' });
    return !error;
  };

  const startEditVideo = (idx: number, url: string) => { setEditingVideoIdx(idx); setEditingVideoUrl(url) }
  
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
  }

  const deleteVideo = async (idx: number) => {
    if (selectedTrick) {
      const current = (trickVideos[selectedTrick.name] || []).filter((_, i) => i !== idx);
      if (await updateVideosInDb(selectedTrick.name, current)) {
        setTrickVideos(prev => ({ ...prev, [selectedTrick.name]: current }));
      }
    }
  }

  const handleTrickClick = (trickName: string) => { setSelectedTrick({ name: trickName }); setSearchQuery(""); setIsSearchFocused(false) }
  const searchResults = searchQuery ? rampRanks.flatMap(r => r.levels.flatMap(l => l.tricks.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).map(t => ({ name: t, rankName: r.name, level: l.level })))) : []

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
              <div className="flex md:hidden">
                <Button variant="ghost" size="icon"><User className="size-5" /></Button>
              </div>
            </div>
            <div className="relative flex-1 md:max-w-md" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="기술 검색..." className="pl-9" value={searchQuery} onFocus={() => setIsSearchFocused(true)} onChange={(e) => setSearchQuery(e.target.value)} />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[300px] overflow-y-auto rounded-md border bg-popover shadow-xl p-1">
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={() => handleTrickClick(r.name)} className="flex w-full flex-col p-2 hover:bg-accent rounded-sm text-left"><span className="text-sm font-bold">{r.name}</span><span className="text-xs text-muted-foreground">{r.rankName} Lv.{r.level}</span></button>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon"><User className="size-5" /></Button>
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
        <div className="mb-10 text-center"><h2 className="text-5xl font-black italic tracking-tighter text-primary">KBRT</h2><p className="text-muted-foreground font-mono uppercase text-xs">K&B Miniramp Rank Test</p></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rampRanks.map((rank) => (
            <div key={rank.name} className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-5 flex items-center gap-3"><div className={`size-12 rounded-lg bg-gradient-to-br ${rank.color}`} /><h3 className="text-xl font-bold italic">{rank.name}</h3></div>
              <div className="space-y-5">
                {rank.levels.map((lv) => (
                  <div key={lv.level} className="space-y-2">
                    <div className="flex items-center gap-2 border-b pb-1"><span className="text-xs font-black text-primary">{rank.name} {lv.level}</span><span className="text-[10px] text-muted-foreground font-medium">{lv.description}</span></div>
                    <div className="flex flex-wrap gap-1.5">{lv.tricks.map((trick, i) => (<button key={i} onClick={() => handleTrickClick(trick)} className="text-[11px] px-2 py-1 rounded bg-muted hover:bg-primary hover:text-white transition-colors">{trick}</button>))}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedTrick} onOpenChange={(open) => {
        if (!open) {
          setSelectedTrick(null);
          videoRefs.current = [];
          nativeVideoRefs.current = [];
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader><DialogTitle className="text-2xl font-black italic">{selectedTrick?.name}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="space-y-8">
              {(trickVideos[selectedTrick?.name || ""] || []).length === 0 ? (
                <div className="aspect-video flex flex-col gap-2 items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground text-sm bg-muted/10"><Youtube className="size-8 opacity-20" />영상을 추가해주세요 (URL 혹은 직접 업로드).</div>
              ) : (
                trickVideos[selectedTrick?.name || ""].map((url, i) => (
                  <div key={i} ref={(el) => (videoRefs.current[i] = el)} className="space-y-3 pb-6 border-b last:border-0 scroll-mt-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest">
                        {url.includes("instagram") ? <Instagram className="size-3"/> : url.includes("youtube") || url.includes("youtu.be") ? <Youtube className="size-3"/> : <FileVideo className="size-3"/>} 
                        {url.includes("supabase.co") ? "UPLOADED" : "VIDEO"} #{i+1}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => startEditVideo(i, url)}><Edit2 className="size-3 mr-1"/>수정</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => deleteVideo(i)}><Trash2 className="size-3 mr-1"/>삭제</Button>
                      </div>
                    </div>
                    {editingVideoIdx === i ? (
                      <div className="flex gap-2 bg-muted p-3 rounded-lg"><Input className="h-9 text-sm" value={editingVideoUrl} onChange={(e) => setEditingVideoUrl(e.target.value)}/><Button size="sm" className="h-9 px-2" onClick={() => saveEditVideo(i)}><Check className="size-4"/></Button><Button size="sm" variant="ghost" className="h-9 px-2" onClick={() => setEditingVideoIdx(null)}><X className="size-4"/></Button></div>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg" style={{ paddingTop: url.includes("instagram") ? "125%" : "56.25%" }}>
                        {url.includes("youtube") || url.includes("instagram") || url.includes("youtu.be") ? (
                          <iframe src={url} className="absolute top-0 left-0 w-full h-full" allowFullScreen />
                        ) : (
                          <video 
                            ref={(el) => (nativeVideoRefs.current[i] = el)}
                            src={url} 
                            className="absolute top-0 left-0 w-full h-full" 
                            controls 
                            playsInline 
                            preload="metadata"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Input placeholder="유튜브/인스타 주소" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                    <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
                    <Button variant="secondary" className="shrink-0" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
                      {isUploading ? <Loader2 className="size-4 animate-spin"/> : <Upload className="size-4 mr-1"/>}
                      {isUploading ? "업로드 중" : "업로드"}
                    </Button>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setIsAddingVideo(false)}>취소</Button>
                    <Button size="sm" onClick={addVideo} disabled={!newVideoUrl.trim()}>URL 추가</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed py-8 bg-muted/5" onClick={() => setIsAddingVideo(true)}><Plus className="mr-2 size-4"/>새 영상 추가 (URL 또는 갤러리 파일)</Button>
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold italic tracking-widest opacity-60 uppercase">Tips & Notes</span><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => isEditingDescription ? saveDescription() : setIsEditingDescription(true)}>{isEditingDescription ? "저장" : "수정"}</Button></div>
              {isEditingDescription ? (
                <Textarea value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} className="min-h-[140px] bg-muted/30 border-none resize-none text-sm p-4" placeholder="영상1(00:20) 처럼 작성하세요." />
              ) : (
                <div className="p-4 rounded-md bg-muted/30 text-sm min-h-[80px] border border-transparent leading-relaxed">{currentDescription ? renderDescriptionWithLinks(currentDescription) : <span className="text-muted-foreground italic text-xs">내용을 기록해보세요.</span>}</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

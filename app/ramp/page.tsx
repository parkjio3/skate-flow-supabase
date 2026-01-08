"use client"
import { useState, useEffect, useRef } from "react"
import { Search, User, ArrowLeft, Plus, Trash2, Instagram, Youtube, Edit2, Check, X, PlayCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
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
export default function RampPage() {
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
  const searchRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const savedDesc = localStorage.getItem("skateflow-ramp-descriptions")
    if (savedDesc) setTrickDescriptions(JSON.parse(savedDesc))
    const savedVideos = localStorage.getItem("skateflow-ramp-videos")
    if (savedVideos) setTrickVideos(JSON.parse(savedVideos))
    const handleClickOutside = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchFocused(false) }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  useEffect(() => {
    if (selectedTrick) {
      setCurrentDescription(trickDescriptions[selectedTrick.name] || "")
      setIsEditingDescription(false); setNewVideoUrl(""); setIsAddingVideo(false); setEditingVideoIdx(null);
    }
  }, [selectedTrick, trickDescriptions])
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
          <button key={`btn-${i}`} onClick={() => jumpToVideoTime(videoNum, timeStr)} className={`font-bold hover:underline inline-flex items-center gap-0.5 mx-0.5 px-1 rounded transition-colors ${isInstagram ? "text-pink-600 bg-pink-50" : "text-primary bg-primary/5"}`}>
            {isInstagram ? <ExternalLink className="size-3" /> : <PlayCircle className="size-3" />}
            영상{videoNum}({timeStr})
          </button>
        );
      }
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{elements}</div>;
  };
  const saveDescription = () => {
    if (selectedTrick) {
      const updated = { ...trickDescriptions, [selectedTrick.name]: currentDescription }
      setTrickDescriptions(updated); localStorage.setItem("skateflow-ramp-descriptions", JSON.stringify(updated)); setIsEditingDescription(false)
    }
  }
  const addVideo = () => {
    if (selectedTrick && newVideoUrl.trim()) {
      const embedUrl = convertToEmbedUrl(newVideoUrl.trim());
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: [...current, embedUrl] }
      setTrickVideos(updated); localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated)); setNewVideoUrl(""); setIsAddingVideo(false)
    }
  }
  const startEditVideo = (idx: number, url: string) => { setEditingVideoIdx(idx); setEditingVideoUrl(url) }
  const saveEditVideo = (idx: number) => {
    if (selectedTrick && editingVideoUrl.trim()) {
      const embedUrl = convertToEmbedUrl(editingVideoUrl.trim());
      const current = [...(trickVideos[selectedTrick.name] || [])]
      current[idx] = embedUrl; const updated = { ...trickVideos, [selectedTrick.name]: current }
      setTrickVideos(updated); localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated)); setEditingVideoIdx(null)
    }
  }
  const deleteVideo = (idx: number) => {
    if (selectedTrick) {
      const current = trickVideos[selectedTrick.name] || []
      const updated = { ...trickVideos, [selectedTrick.name]: current.filter((_, i) => i !== idx) }
      setTrickVideos(updated); localStorage.setItem("skateflow-ramp-videos", JSON.stringify(updated))
    }
  }
  const handleTrickClick = (trickName: string) => { setSelectedTrick({ name: trickName }); setSearchQuery(""); setIsSearchFocused(false) }
  const searchResults = searchQuery ? rampRanks.flatMap(r => r.levels.flatMap(l => l.tricks.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).map(t => ({ name: t, rankName: r.name, level: l.level })))) : []
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="size-5" /></Button></Link>
              <h1 className="font-mono text-2xl font-bold text-primary">SkateFlow</h1>
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
            <Button variant="ghost" size="icon"><User className="size-5" /></Button>
          </div>
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
      <Dialog open={!!selectedTrick} onOpenChange={() => setSelectedTrick(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader><DialogTitle className="text-2xl font-black italic">{selectedTrick?.name}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="space-y-8">
              {(trickVideos[selectedTrick?.name || ""] || []).length === 0 ? (
                <div className="aspect-video flex flex-col gap-2 items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground text-sm bg-muted/10"><Youtube className="size-8 opacity-20" />영상 주소를 추가해주세요.</div>
              ) : (
                trickVideos[selectedTrick?.name || ""].map((url, i) => (
                  <div key={i} className="space-y-3 pb-6 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-widest">{url.includes("instagram") ? <Instagram className="size-3"/> : <Youtube className="size-3"/>} VIDEO #{i+1}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => startEditVideo(i, url)}><Edit2 className="size-3 mr-1"/>수정</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => deleteVideo(i)}><Trash2 className="size-3 mr-1"/>삭제</Button>
                      </div>
                    </div>
                    {editingVideoIdx === i ? (
                      <div className="flex gap-2 bg-muted p-3 rounded-lg"><Input className="h-9 text-sm" value={editingVideoUrl} onChange={(e) => setEditingVideoUrl(e.target.value)}/><Button size="sm" className="h-9 px-2" onClick={() => saveEditVideo(i)}><Check className="size-4"/></Button><Button size="sm" variant="ghost" className="h-9 px-2" onClick={() => setEditingVideoIdx(null)}><X className="size-4"/></Button></div>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg" style={{ paddingTop: url.includes("instagram") ? "125%" : "56.25%" }}><iframe src={url} className="absolute top-0 left-0 w-full h-full" allowFullScreen /></div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 border-t">
              {isAddingVideo ? (
                <div className="flex flex-col gap-2"><Input placeholder="유튜브 또는 인스타그램 주소" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} /><div className="flex gap-2 justify-end"><Button variant="ghost" size="sm" onClick={() => setIsAddingVideo(false)}>취소</Button><Button size="sm" onClick={addVideo}>등록</Button></div></div>
              ) : (
                <Button variant="outline" className="w-full border-dashed py-8 bg-muted/5" onClick={() => setIsAddingVideo(true)}><Plus className="mr-2 size-4"/>새 영상 추가</Button>
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

"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  MapPin,
  Clock,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Sparkles,
  Info,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Photo } from "@/data/photos";
import { cn } from "@/lib/utils";

interface LightboxModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: Photo[];
  currentId: string | null;
  storyTitle?: string;
  onNavigate: (delta: number) => void;
  onSelectPhoto: (id: string) => void;
}

const ZOOM_LEVELS = [1, 2, 3];

export function LightboxModal({
  open,
  onOpenChange,
  photos,
  currentId,
  storyTitle,
  onNavigate,
  onSelectPhoto,
}: LightboxModalProps) {
  const current = photos.find((p) => p.id === currentId) || photos[0];
  const currentIndex = photos.findIndex((p) => p.id === currentId);

  // Estados de Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Painel lateral de EXIF
  const [showExifDrawer, setShowExifDrawer] = useState(false);

  // Modo Zen / Tela Cheia
  const [isZenMode, setIsZenMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Stage ref
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Touch swipe para mobile
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Resetar zoom e pan ao mudar de foto
  useEffect(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [currentId]);

  // Sincronizar Fullscreen API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignora erro se tela cheia não for permitida pelo browser
    }
  }, []);

  const toggleZenMode = useCallback(() => {
    setIsZenMode((prev) => !prev);
  }, []);

  // Funções de Zoom
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => {
      const nextIdx = ZOOM_LEVELS.findIndex((z) => z > prev);
      const next = nextIdx !== -1 ? ZOOM_LEVELS[nextIdx] : 3;
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const prevIdx = [...ZOOM_LEVELS].reverse().findIndex((z) => z < prev);
      const next = prevIdx !== -1 ? [...ZOOM_LEVELS].reverse()[prevIdx] : 1;
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleCycleZoom = useCallback(() => {
    setZoomLevel((prev) => {
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      setPan({ x: 0, y: 0 });
      return 1;
    });
  }, []);

  // Atalhos de Teclado
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Se estiver digitando em input, não captura
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "Escape") {
        if (isZenMode) {
          setIsZenMode(false);
          e.preventDefault();
        } else if (showExifDrawer) {
          setShowExifDrawer(false);
          e.preventDefault();
        } else {
          onOpenChange(false);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate(-1);
      } else if (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleZenMode();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        setShowExifDrawer((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    isZenMode,
    showExifDrawer,
    onNavigate,
    onOpenChange,
    toggleZenMode,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  ]);

  // Handlers de Pan / Arrastar
  const handleMouseDown = (e: ReactMouseEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Limites de pan relativos ao container
    const stageWidth = stageRef.current?.clientWidth || window.innerWidth;
    const stageHeight = stageRef.current?.clientHeight || window.innerHeight;
    const maxPanX = (stageWidth * (zoomLevel - 1)) / 1.4;
    const maxPanY = (stageHeight * (zoomLevel - 1)) / 1.4;

    const newX = Math.max(-maxPanX, Math.min(maxPanX, panStart.current.x + dx));
    const newY = Math.max(-maxPanY, Math.min(maxPanY, panStart.current.y + dy));

    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag para dispositivos móveis
  const handleTouchStart = (e: ReactTouchEvent) => {
    if (e.touches.length === 1) {
      if (zoomLevel > 1) {
        setIsDragging(true);
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStart.current = { ...pan };
      } else {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchMove = (e: ReactTouchEvent) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      const stageWidth = stageRef.current?.clientWidth || window.innerWidth;
      const stageHeight = stageRef.current?.clientHeight || window.innerHeight;
      const maxPanX = (stageWidth * (zoomLevel - 1)) / 1.4;
      const maxPanY = (stageHeight * (zoomLevel - 1)) / 1.4;

      const newX = Math.max(-maxPanX, Math.min(maxPanX, panStart.current.x + dx));
      const newY = Math.max(-maxPanY, Math.min(maxPanY, panStart.current.y + dy));

      setPan({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (isDragging) {
      setIsDragging(false);
    }
    if (touchStart.current && zoomLevel === 1) {
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
        onNavigate(dx < 0 ? 1 : -1);
      }
      touchStart.current = null;
    }
  };

  if (!current) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "lightbox-pro fixed inset-0 z-50 flex h-[100dvh] w-full max-w-none flex-col overflow-hidden rounded-none border-0 p-0 transition-colors duration-500",
          isZenMode ? "bg-[#050505]" : "bg-[#070708]/98 backdrop-blur-2xl"
        )}
      >
        <DialogTitle className="sr-only">{current.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {current.place} — {current.description}
        </DialogDescription>

        {/* BARRA SUPERIOR (Oculta no Modo Zen) */}
        <header
          className={cn(
            "relative z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/10 px-6 backdrop-blur-md transition-all duration-300",
            isZenMode && "pointer-events-none -translate-y-full opacity-0"
          )}
        >
          {/* Marca Hanzi */}
          <div className="flex items-center gap-4">
            <span className="font-serif text-2xl tracking-tighter text-white">
              hanzi<span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-[#c8102e]" />
            </span>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <span className="hidden text-xs uppercase tracking-widest text-neutral-400 sm:inline-block">
              {storyTitle || "Arquivo Visual de Luxo"}
            </span>
          </div>

          {/* Contador Central */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
            <span className="font-mono text-sm font-semibold text-white">
              {pad(currentIndex + 1)}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="font-mono text-neutral-500">{pad(photos.length)}</span>
          </div>

          {/* Ações do Topo */}
          <div className="flex items-center gap-2">
            {/* Toggle Painel EXIF */}
            <button
              onClick={() => setShowExifDrawer((prev) => !prev)}
              aria-label="Alternar painel de metadados EXIF e história"
              aria-pressed={showExifDrawer}
              className={cn(
                "group flex h-9 items-center gap-2 rounded-full border px-3 text-xs tracking-wider uppercase transition-all duration-200",
                showExifDrawer
                  ? "border-[#c8102e] bg-[#c8102e]/15 text-white"
                  : "border-white/15 bg-white/5 text-neutral-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#c8102e]" />
              <span className="hidden sm:inline">EXIF & História</span>
            </button>

            {/* Toggle Modo Zen */}
            <button
              onClick={toggleZenMode}
              aria-label="Ativar Modo Zen (contemplação sem distrações)"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-300 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
              title="Modo Zen (Atalho: Z)"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>

            {/* Toggle Fullscreen */}
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-300 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white md:flex"
              title="Tela Cheia (Atalho: F)"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Botão Fechar */}
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Fechar fotografia"
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:border-[#c8102e] hover:bg-[#c8102e]"
              title="Fechar (Atalho: Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* CONTAINER PRINCIPAL (STAGE + EXIF DRAWER) */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* BOTÃO FLUTUANTE PARA SAIR DO MODO ZEN */}
          {isZenMode && (
            <button
              onClick={() => setIsZenMode(false)}
              className="absolute top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs tracking-widest uppercase text-white/80 backdrop-blur-md transition-all hover:bg-white hover:text-black"
              aria-label="Sair do Modo Zen"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Sair do Modo Zen (Z)</span>
            </button>
          )}

          {/* PALCO CENTRAL DA FOTOGRAFIA */}
          <main
            ref={stageRef}
            className="relative flex flex-1 items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor:
                zoomLevel > 1
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "zoom-in",
            }}
          >
            {/* Navegação Anterior */}
            {!isZenMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(-1);
                }}
                className="absolute left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-neutral-900/60 text-white/90 backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:bg-neutral-800"
                aria-label="Fotografia anterior (Seta esquerda)"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            {/* Imagem Central com Zoom e Pan */}
            <div
              className="relative flex h-full w-full items-center justify-center p-4 sm:p-8"
              onDoubleClick={handleCycleZoom}
            >
              <div
                className="relative flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  willChange: "transform",
                }}
              >
                <img
                  ref={imageRef}
                  key={current.id}
                  src={"/photos/" + current.id + ".png"}
                  alt={current.title}
                  decoding="async"
                  draggable={false}
                  className="max-h-[82dvh] max-w-[88vw] object-contain shadow-2xl transition-all duration-300 select-none"
                  style={{
                    filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.85))",
                  }}
                />
              </div>
            </div>

            {/* Navegação Próxima */}
            {!isZenMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(1);
                }}
                className="absolute right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-neutral-900/60 text-white/90 backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:bg-neutral-800"
                aria-label="Próxima fotografia (Seta direita)"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            )}

            {/* PÍLULA FLUTUANTE DE CONTROLES DE ZOOM */}
            {!isZenMode && (
              <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950/80 px-3 py-1.5 backdrop-blur-xl shadow-2xl">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  aria-label="Reduzir zoom (-)"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-40"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {ZOOM_LEVELS.map((z) => (
                    <button
                      key={z}
                      onClick={() => {
                        setZoomLevel(z);
                        if (z === 1) setPan({ x: 0, y: 0 });
                      }}
                      className={cn(
                        "rounded px-2 py-0.5 font-mono text-[11px] font-semibold transition-all",
                        zoomLevel === z
                          ? "bg-[#c8102e] text-white shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      {z}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  aria-label="Ampliar zoom (+)"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-40"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>

                {zoomLevel > 1 && (
                  <>
                    <div className="h-3.5 w-px bg-white/20" />
                    <button
                      onClick={handleResetZoom}
                      aria-label="Resetar zoom (0)"
                      title="Resetar Zoom"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/15 hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>
            )}
          </main>

          {/* PAINEL LATERAL COLAPSÁVEL DE METADADOS / EXIF */}
          <aside
            className={cn(
              "absolute top-0 right-0 bottom-0 z-40 flex w-full flex-col border-l border-white/10 bg-neutral-950/95 backdrop-blur-2xl transition-transform duration-500 ease-out sm:w-[420px]",
              showExifDrawer ? "translate-x-0" : "translate-x-full pointer-events-none"
            )}
          >
            {/* Header da Gaveta */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#c8102e]" />
                <h3 className="font-serif text-lg tracking-wide text-white">Metadados & História</h3>
              </div>
              <button
                onClick={() => setShowExifDrawer(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-white/10 hover:text-white"
                aria-label="Fechar painel de metadados"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conteúdo Rolável */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Título & Kanji */}
              <div className="border-b border-white/10 pb-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs uppercase tracking-widest text-[#c8102e]">
                    {current.place}
                  </span>
                  <span className="font-serif text-2xl text-neutral-500 opacity-60 font-light">
                    {current.jp}
                  </span>
                </div>
                <h2 className="mt-1 font-serif text-2xl font-light tracking-tight text-white sm:text-3xl">
                  {current.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {current.description}
                </p>
              </div>

              {/* Grid Técnico de EXIF Cinematográfico */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    <Camera className="h-3.5 w-3.5 text-[#c8102e]" />
                    Ficha Técnica do Clique
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                    EXIF 35mm
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-neutral-900/60 p-2.5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Câmera
                    </span>
                    <span className="font-medium text-neutral-200 block truncate" title={current.exif.camera}>
                      {current.exif.camera}
                    </span>
                  </div>

                  <div className="rounded-lg bg-neutral-900/60 p-2.5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Lente
                    </span>
                    <span className="font-medium text-neutral-200 block truncate" title={current.exif.lens}>
                      {current.exif.lens}
                    </span>
                  </div>

                  <div className="rounded-lg bg-neutral-900/60 p-2.5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Abertura
                    </span>
                    <span className="font-mono font-medium text-white block">
                      {current.exif.aperture}
                    </span>
                  </div>

                  <div className="rounded-lg bg-neutral-900/60 p-2.5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Obturador
                    </span>
                    <span className="font-mono font-medium text-white block">
                      {current.exif.shutter}
                    </span>
                  </div>

                  <div className="rounded-lg bg-neutral-900/60 p-2.5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Sensibilidade ISO
                    </span>
                    <span className="font-mono font-medium text-white block">
                      ISO {current.exif.iso}
                    </span>
                  </div>

                  <div className="rounded-lg bg-neutral-900/60 p-2.5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Distância Focal
                    </span>
                    <span className="font-mono font-medium text-white block">
                      {current.exif.focalLength}
                    </span>
                  </div>
                </div>

                {/* Localização & Coordenadas */}
                <div className="mt-3 rounded-lg bg-neutral-900/60 p-3 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <MapPin className="h-3 w-3 text-[#c8102e]" />
                    <span className="truncate">{current.exif.locationExact}</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 pl-4.5">
                    {current.exif.coordinates}
                  </div>
                </div>
              </div>

              {/* História / Contexto por trás da foto */}
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                  <Info className="h-3.5 w-3.5 text-[#c8102e]" />
                  História & Bastidores
                </span>
                <p className="text-xs leading-relaxed text-neutral-300/90 font-light border-l-2 border-[#c8102e]/60 pl-3 py-1 italic bg-white/[0.01]">
                  "{current.story}"
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                  Categorias
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Miniaturas de Acesso Rápido */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                  Outras Fotos da Série
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {photos.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPhoto(p.id)}
                      className={cn(
                        "relative aspect-[3/2] overflow-hidden rounded border transition-all",
                        p.id === current.id
                          ? "border-[#c8102e] ring-2 ring-[#c8102e]/50 scale-105"
                          : "border-white/15 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={"/photos/" + p.id + ".png"}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* BARRA INFERIOR COM ATALHOS E DETALHES (Oculta no Modo Zen) */}
        <footer
          className={cn(
            "relative z-30 flex h-14 w-full shrink-0 items-center justify-between border-t border-white/10 px-6 backdrop-blur-md transition-all duration-300 text-xs text-neutral-400",
            isZenMode && "pointer-events-none translate-y-full opacity-0"
          )}
        >
          {/* Informações rápidas da foto */}
          <div className="flex items-center gap-3 truncate">
            <span className="font-serif text-sm font-medium text-white truncate">
              {current.title}
            </span>
            <span className="hidden text-neutral-600 sm:inline">·</span>
            <span className="hidden text-neutral-400 sm:inline truncate">
              {current.exif.camera} · {current.exif.aperture} · {current.exif.shutter}
            </span>
          </div>

          {/* Atalhos de Teclado Informativos */}
          <div className="hidden items-center gap-4 text-[11px] tracking-wider text-neutral-400 lg:flex">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                ←
              </kbd>
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                →
              </kbd>
              <span>Navegar</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                Z
              </kbd>
              <span>Modo Zen</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                I
              </kbd>
              <span>EXIF</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                Esc
              </kbd>
              <span>Fechar</span>
            </span>
          </div>

          {/* Kanji decorativo à direita */}
          <div className="font-serif text-lg font-light text-neutral-500">
            {current.jp}
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

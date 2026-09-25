"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Plus,
  X,
  Menu,
  Sparkles,
  Camera,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  photos,
  categories,
  navItems,
  storySets,
  type Photo,
} from "@/data/photos";
import { OptimizedImage } from "@/components/OptimizedImage";
import { LightboxModal } from "@/components/LightboxModal";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

function PhotoButton({
  id,
  onOpen,
  className = "",
  label = true,
  aspectRatio,
  priority = false,
}: {
  id: string;
  onOpen: (id: string) => void;
  className?: string;
  label?: boolean;
  aspectRatio?: string | number;
  priority?: boolean;
}) {
  const p = photos.find((photo) => photo.id === id)!;
  return (
    <button
      className={cn("photo-button tilt group", className)}
      data-cursor="Ver"
      onClick={() => onOpen(id)}
      aria-label={"Ver " + p.title}
    >
      <OptimizedImage
        src={"/photos/" + id + ".png"}
        alt={p.title}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        objectPosition={p.position}
        aspectRatio={aspectRatio || p.aspectRatio || "1.5"}
        imgClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
        showVignette={true}
      />
      {label && (
        <span className="photo-overlay">
          <span>
            <span className="photo-location">{p.place}</span>
            <strong>{p.title}</strong>
          </span>
          <span className="photo-plus">
            <Plus size={20} />
          </span>
        </span>
      )}
    </button>
  );
}

export default function Home() {
  const [filter, setFilter] = useState("Todas as fotografias");
  const [selection, setSelection] = useState<{
    ids: string[];
    index: number;
    story?: string;
  } | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const [activeChapter, setActiveChapter] = useState("home");

  const cursor = useRef<HTMLDivElement>(null);
  const cursorText = useRef<HTMLSpanElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const nightTrack = useRef<HTMLDivElement>(null);

  // Filtragem de fotos
  const visible = photos.filter(
    (p) => filter === "Todas as fotografias" || p.tags.includes(filter)
  );

  // Helper para contagem de fotos por categoria
  const getCategoryCount = (cat: string) => {
    if (cat === "Todas as fotografias") return photos.length;
    return photos.filter((p) => p.tags.includes(cat)).length;
  };

  const openPhoto = useCallback(
    (id: string, ids = photos.map((p) => p.id), story?: string) => {
      lastFocus.current = document.activeElement as HTMLElement;
      setSelection({
        ids,
        index: Math.max(0, ids.indexOf(id)),
        story,
      });
    },
    []
  );

  const nextPhoto = useCallback((delta: number) => {
    setSelection((s) =>
      s
        ? {
            ...s,
            index: (s.index + delta + s.ids.length) % s.ids.length,
          }
        : null
    );
  }, []);

  const selectPhotoById = useCallback((id: string) => {
    setSelection((s) => {
      if (!s) return null;
      const idx = s.ids.indexOf(id);
      return idx !== -1 ? { ...s, index: idx } : s;
    });
  }, []);

  // Preferência de movimento reduzido
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setReduced(q.matches);
    u();
    q.addEventListener("change", u);
    return () => q.removeEventListener("change", u);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion =
      reduced || manualReduced ? "reduced" : "full";
  }, [reduced, manualReduced]);

  // Observer de reveal e chapters
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".reveal").forEach((e) => o.observe(e));

    const c = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) setActiveChapter(e.target.id);
        }),
      { rootMargin: "-20% 0px -60% 0px" }
    );
    document.querySelectorAll("[data-chapter]").forEach((e) => c.observe(e));

    return () => {
      o.disconnect();
      c.disconnect();
    };
  }, []);

  // Cursor customizado e paralaxe suave
  useEffect(() => {
    if (reduced || manualReduced) return;
    const fine = matchMedia("(pointer:fine)").matches;
    let frame = 0,
      sf = 0,
      tx = -100,
      ty = -100,
      x = -100,
      y = -100;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      const a = t.closest<HTMLElement>("[data-cursor],a,button");
      if (cursor.current) {
        cursor.current.dataset.hover = a ? "true" : "false";
        cursor.current.dataset.visible = "true";
        if (cursorText.current)
          cursorText.current.textContent = a?.dataset.cursor || (a ? "↗" : "");
      }
      const card = t.closest<HTMLElement>(".tilt");
      if (card && fine) {
        const r = card.getBoundingClientRect();
        card.style.setProperty(
          "--rx",
          -((e.clientY - r.top) / r.height - 0.5) * 5 + "deg"
        );
        card.style.setProperty(
          "--ry",
          ((e.clientX - r.left) / r.width - 0.5) * 6 + "deg"
        );
      }
    };

    const out = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest<HTMLElement>(".tilt");
      if (c && !c.contains(e.relatedTarget as Node)) {
        c.style.setProperty("--rx", "0deg");
        c.style.setProperty("--ry", "0deg");
      }
    };

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (cursor.current)
        cursor.current.style.transform =
          "translate3d(" + x + "px," + y + "px,0)";
      frame = requestAnimationFrame(loop);
    };

    const paint = () => {
      const y = scrollY;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        (y / Math.max(1, document.documentElement.scrollHeight - innerHeight)) *
          100 +
          "%"
      );
      document
        .querySelector(".site-header")
        ?.classList.toggle("scrolled", y > 50);
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const b = el.parentElement!.getBoundingClientRect();
        if (b.bottom > 0 && b.top < innerHeight)
          el.style.setProperty(
            "--parallax",
            (innerHeight / 2 - b.top - b.height / 2) *
              Number(el.dataset.parallax) +
              "px"
          );
      });
      sf = 0;
    };

    const scroll = () => {
      if (!sf) sf = requestAnimationFrame(paint);
    };

    if (fine) {
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerout", out);
      frame = requestAnimationFrame(loop);
    }
    window.addEventListener("scroll", scroll, { passive: true });
    paint();

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(sf);
    };
  }, [reduced, manualReduced]);

  return (
    <>
      {/* Camada sutil de grão analógico cinematográfico 35mm */}
      <div className="film-grain" aria-hidden="true" />

      {/* Link de acessibilidade */}
      <a href="#gallery" className="skip-link">
        Pular para a coleção
      </a>

      {/* Cursor personalizado de alta precisão */}
      <div ref={cursor} className="custom-cursor" aria-hidden="true">
        <span ref={cursorText} />
      </div>

      {/* Barra de progresso de leitura vermelha carmim */}
      <div className="reading-progress" aria-hidden="true" />

      {/* CABEÇALHO PRINCIPAL EM VIDRO FOSCO */}
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Hanzi início">
          hanzi<span className="brand-dot" />
        </a>
        <nav aria-label="Navegação principal" className="desktop-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#gallery">
          Explorar o Japão <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir navegação"
        >
          <Menu size={24} />
        </button>
      </header>

      <main className="relative">
        {/* HERO SECTION - Imagem com Prioridade de Rede Máxima (fetchpriority="high", loading="eager") */}
        <section className="hero" id="home" data-chapter>
          <button
            className="hero-background"
            data-cursor="Ver"
            onClick={() => openPhoto("kyoto")}
            aria-label={"Ver " + photos.find((p) => p.id === "kyoto")!.title}
          >
            <img
              src="/photos/kyoto.png"
              alt="Um guarda-sol colorido em uma rua tradicional de Quioto"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width="612"
              height="408"
            />
          </button>
          <div className="hero-shade" />

          {/* Marcas d'água Kanji decorativas sutis */}
          <div
            className="kanji-watermark select-none right-8 top-32 text-[14vw] opacity-[0.04]"
            aria-hidden="true"
          >
            写真
          </div>

          <div className="hero-topline">
            <span>Uma jornada fotográfica pelo Japão</span>
            <span>Coleção independente / Vol. 01</span>
          </div>

          <div className="hero-title">
            <h1 aria-label="Hanzi">
              {"HANZI".split("").map((letter, i) => (
                <span key={i} style={{ "--i": i } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </h1>
            <div className="hero-subtitle">
              <span className="red-stroke" />
              Histórias Através da Luz
              <span className="hero-jp font-serif">写真で旅する日本</span>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-copy">
              <p>
                Ruas antigas. Montanhas silenciosas.
                <br />
                Mil maneiras de contemplar o Japão através da luz.
              </p>
              <a className="text-link" href="#gallery">
                Explorar a Coleção <ArrowUpRight size={21} />
              </a>
            </div>

            <a className="journey-link" href="#collection">
              <span className="round-arrow">
                <ArrowDown size={20} />
              </span>
              <span>
                Iniciar a jornada
                <br />
                <small>Role para descobrir</small>
              </span>
            </a>

            <div className="hero-contact-sheet">
              <div className="film-index">
                <span>01 / 12</span>
                <span>日本 — 2026</span>
              </div>
              <div className="film-photos">
                {["kyoto", "fuji", "osaka"].map((id, i) => (
                  <button
                    data-cursor="Ver"
                    onClick={() => openPhoto(id)}
                    key={id}
                    aria-label={
                      "Ver " + photos.find((p) => p.id === id)!.title
                    }
                  >
                    <img
                      src={"/photos/" + id + ".png"}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{pad(i + 1)}</span>
                  </button>
                ))}
              </div>
              <span className="film-caption">
                Um momento em Quioto <span className="font-serif">京都</span>
              </span>
            </div>
          </div>

          <div className="hero-edge">
            DESCUBRA O JAPÃO ATRAVÉS DE MOMENTOS, LUGARES E LUZ.
          </div>
        </section>

        {/* COLEÇÃO EDITORIAL */}
        <section className="collection section-pad relative" id="collection" data-chapter>
          {/* Marca d'água Kanji */}
          <div
            className="kanji-watermark select-none left-4 top-20 text-[18vw] opacity-[0.035]"
            aria-hidden="true"
          >
            光
          </div>

          <div className="section-heading reveal">
            <span className="eyebrow">
              <i />
              01 — A coleção
            </span>
            <span className="micro">Um diário visual em alta resolução</span>
          </div>

          <div className="intro-grid">
            <h2 className="display reveal">
              Japão<br />
              em <em>Quadros.</em>
            </h2>
            <div className="intro-copy reveal">
              <span className="jp-heading font-serif" lang="ja">
                一瞬を、永遠に。
              </span>
              <p>
                Entre o silêncio e o movimento, a tradição e a modernidade, cada
                imagem revela um Japão diferente.
              </p>
              <p className="muted">
                Uma coleção de lugares, luz fugaz e momentos que merecem ser
                contemplados com mais calma.
              </p>
              <a href="#gallery" className="text-link">
                Descubra a coleção <ArrowUpRight size={19} />
              </a>
            </div>
          </div>

          <div className="editorial-grid">
            <figure className="editorial-main reveal">
              <PhotoButton id="bridge" onOpen={openPhoto} aspectRatio={1.22} />
              <figcaption>
                <span>01 / A LUZ ENTRE AS FOLHAS</span>
                <span className="font-serif">日本</span>
              </figcaption>
            </figure>

            <div className="editorial-side reveal">
              <span className="vertical-word" aria-hidden="true">
                MOMENTOS, NÃO DISTÂNCIAS.
              </span>
              <PhotoButton id="kyoto" onOpen={openPhoto} aspectRatio={0.82} />
              <p>
                Certos lugares ficam com você.
                <br />
                <em>Alguns momentos nunca se vão.</em>
              </p>
            </div>
          </div>
        </section>

        {/* GALERIA PRINCIPAL COM FILTROS DINÂMICOS E ANIMAÇÃO FLUÍDA */}
        <section
          className="gallery-section section-pad relative"
          id="gallery"
          data-chapter
        >
          {/* Marca d'água Kanji */}
          <div
            className="kanji-watermark select-none right-6 top-16 text-[16vw] opacity-[0.03]"
            aria-hidden="true"
          >
            美
          </div>

          <div className="gallery-heading reveal">
            <div>
              <span className="eyebrow">
                <i />
                O arquivo visual
              </span>
              <h2 className="display">
                Um olhar mais <em>atento.</em>
              </h2>
            </div>
            <span className="archive-count">
              {pad(photos.length)}{" "}
              <span>
                fotografias
                <br />
                selecionadas
              </span>
            </span>
          </div>

          {/* Filtros de Categoria Dinâmicos */}
          <div className="filters" role="group" aria-label="Filtrar fotografias">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative transition-all duration-300",
                    isActive ? "active text-white font-medium" : "text-neutral-400 hover:text-white"
                  )}
                >
                  <span>{cat}</span>
                  <sup className="ml-1 text-[11px] text-[#e81b3c] font-mono">
                    {count}
                  </sup>
                </button>
              );
            })}
          </div>

          <p className="sr-only" role="status">
            {visible.length} fotografias em {filter}
          </p>

          {/* Grid de Imagens com Skeleton & Stagger suave */}
          <div
            className={cn(
              "gallery-grid transition-all duration-500",
              visible.length < 3 && "short-grid"
            )}
            key={filter}
          >
            {visible.map((p, i) => (
              <figure
                className="gallery-item gallery-stagger-item group"
                key={p.id}
                style={{ "--i": i } as CSSProperties}
              >
                <PhotoButton
                  id={p.id}
                  onOpen={(id) => openPhoto(id, visible.map((p) => p.id))}
                />
                <figcaption className="flex justify-between items-baseline pt-2">
                  <span className="flex items-center gap-2">
                    <span className="photo-number font-mono text-xs text-neutral-500">
                      {pad(photos.indexOf(p) + 1)}
                    </span>
                    <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                      {p.title}
                    </span>
                  </span>
                  <span lang="ja" className="font-serif text-sm text-neutral-500">
                    {p.jp}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="archive-end">
            <span>Cada quadro, uma história e uma luz singular.</span>
            <span className="font-mono">
              {pad(visible.length)} de {pad(photos.length)} fotografias / {filter}
            </span>
          </div>
        </section>

        {/* TÓQUIO AO ANOITECER (PANORAMA NOTURNO JAPONÊS) */}
        <section className="night-section relative" id="places" data-chapter>
          {/* Marca d'água Kanji */}
          <div
            className="kanji-watermark select-none left-12 top-24 text-[22vw] opacity-[0.04]"
            aria-hidden="true"
          >
            夜
          </div>

          <div className="night-heading section-pad reveal">
            <span className="eyebrow">
              <i />
              02 — Uma cidade que nunca dorme
            </span>
            <h2 className="display">
              Tóquio<br />
              <em>Ao Anoitecer.</em>
            </h2>
            <span className="night-jp font-serif" lang="ja">
              東京の夜
            </span>
            <p>
              Luzes de néon, reflexos, movimento e silêncio.
              <br />
              Um mundo cinematográfico começa ao cair do dia.
            </p>
          </div>

          <div className="night-panorama reveal group">
            <img
              data-parallax=".10"
              src="/photos/tokyo.png"
              alt="Torre de Tóquio brilhando sobre a cidade ao pôr do sol"
              loading="lazy"
              decoding="async"
              className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="photo-vignette absolute inset-0 pointer-events-none" />
            <button
              className="image-open"
              onClick={() => openPhoto("tokyo")}
              data-cursor="Ver"
              aria-label="Ver Tóquio no limiar do dia em alta resolução"
            >
              <Plus size={22} />
            </button>
            <span className="panorama-caption">
              TÓQUIO — 東京 <span className="font-mono text-neutral-400">A HORA AZUL · 35.6605° N</span>
            </span>
          </div>

          <div className="night-footer section-pad">
            <div className="night-strip-title">
              <span className="eyebrow">Além de Tóquio</span>
              <h3>
                Siga a <em>luz.</em>
              </h3>
              <div className="track-arrows">
                <button
                  aria-label="Fotografias anteriores"
                  onClick={() =>
                    nightTrack.current?.scrollBy({
                      left: -420,
                      behavior:
                        reduced || manualReduced ? "instant" : "smooth",
                    })
                  }
                >
                  <ArrowLeft />
                </button>
                <button
                  aria-label="Próximas fotografias"
                  onClick={() =>
                    nightTrack.current?.scrollBy({
                      left: 420,
                      behavior:
                        reduced || manualReduced ? "instant" : "smooth",
                    })
                  }
                >
                  <ArrowRight />
                </button>
              </div>
            </div>

            <div className="night-track" ref={nightTrack}>
              {["osaka", "kobe", "dotonbori"].map((id) => (
                <figure key={id}>
                  <PhotoButton id={id} onOpen={openPhoto} aspectRatio={1.7} />
                  <figcaption>
                    {photos.find((p) => p.id === id)!.place}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* JAPÃO SILENCIOSO */}
        <section className="quiet-section section-pad relative" id="quiet" data-chapter>
          {/* Marca d'água Kanji */}
          <div
            className="kanji-watermark select-none right-12 top-28 text-[20vw] opacity-[0.05] text-black"
            aria-hidden="true"
          >
            静
          </div>

          <div className="section-heading reveal">
            <span className="eyebrow">
              <i />
              03 — Um ritmo mais sereno
            </span>
            <span lang="ja" className="font-serif">
              静かな日本
            </span>
          </div>

          <div className="quiet-intro">
            <h2 className="display reveal">
              O Japão<br />
              <em>Silencioso.</em>
            </h2>
            <p className="reveal">
              Além do néon, outro Japão se revela — sereno, atemporal e
              profundamente enraizado na contemplação da natureza.
            </p>
          </div>

          <div className="quiet-grid">
            <figure className="quiet-large reveal">
              <PhotoButton id="onsen" onOpen={openPhoto} aspectRatio={0.95} />
              <figcaption>
                INVERNO, SUAVE. <span className="font-serif">日本の冬</span>
              </figcaption>
            </figure>

            <figure className="quiet-small reveal">
              <PhotoButton id="autumn" onOpen={openPhoto} aspectRatio={1.15} />
              <figcaption>A COR DA PASSAGEM DO TEMPO.</figcaption>
              <p>
                Ouça os espaços
                <br />
                <em>entre os momentos.</em>
              </p>
            </figure>
          </div>
        </section>

        {/* MONTE FUJI */}
        <section className="fuji-section relative" id="fuji" data-chapter>
          <img
            className="fuji-image"
            data-parallax=".15"
            src="/photos/fuji.png"
            alt="Monte Fuji além de um lago e cerejeiras cor-de-rosa em flor"
            loading="lazy"
            decoding="async"
          />
          <div className="fuji-shade" />

          <div className="fuji-top">
            <span className="font-mono">35.3606° N — 138.7274° E</span>
            <span>04 — A montanha sagrada</span>
          </div>

          <div className="fuji-title reveal">
            <span lang="ja" className="font-serif">
              富士山
            </span>
            <h2>FUJI</h2>
          </div>

          <div className="fuji-bottom">
            <p>
              Uma silhueta sagrada que moldou
              <br />a imaginação artística e espiritual do Japão por séculos.
            </p>
            <button
              onClick={() => openPhoto("fuji")}
              className="text-link"
              data-cursor="Ver"
            >
              Ver fotografia em alta resolução <Plus size={19} />
            </button>
          </div>
        </section>

        {/* HISTÓRIAS VISUAIS / SÉRIES */}
        <section className="stories-section section-pad relative" id="stories" data-chapter>
          {/* Marca d'água Kanji */}
          <div
            className="kanji-watermark select-none left-8 top-16 text-[18vw] opacity-[0.035]"
            aria-hidden="true"
          >
            語
          </div>

          <div className="gallery-heading reveal">
            <div>
              <span className="eyebrow">
                <i />
                05 — Ensaios fotográficos
              </span>
              <h2 className="display">
                Histórias <em>Visuais.</em>
              </h2>
            </div>
            <p>
              Um lugar. Alguns quadros selecionados.
              <br />
              Uma narrativa cinematográfica própria.
            </p>
          </div>

          <div className="stories-grid">
            {storySets.map((s, i) => (
              <button
                key={s.title}
                className="story-card tilt reveal group"
                data-cursor="Explorar"
                onClick={() => openPhoto(s.ids[0], s.ids, s.title)}
              >
                <span className="story-image">
                  <OptimizedImage
                    src={"/photos/" + s.ids[0] + ".png"}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    aspectRatio={1.1}
                    imgClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
                    showVignette={true}
                  />
                  <span className="story-image-count font-mono">
                    {pad(s.ids.length)} QUADROS
                  </span>
                </span>
                <span className="story-topline">
                  <span>HISTÓRIA {pad(i + 1)}</span>
                  <ArrowUpRight size={20} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.eyebrow}</p>
              </button>
            ))}
          </div>
        </section>

        {/* SOBRE O HANZI */}
        <section className="about-section section-pad relative" id="about" data-chapter>
          <div className="about-mark font-serif" aria-hidden="true">
            光
          </div>
          <div className="about-copy reveal">
            <span className="eyebrow">
              <i />
              Sobre o Hanzi
            </span>
            <h2>
              Uma maneira de
              <br />
              <em>olhar.</em>
            </h2>
            <p>
              Hanzi é uma jornada visual por ruas antigas, montanhas silenciosas,
              cidades em néon e momentos efêmeros do dia a dia. Um convite para
              desacelerar, inspecionar a luz de perto e contemplar o Japão através
              de cada detalhe técnico e poético capturado pelas lentes.
            </p>
            <span className="micro">
              Coleção fotográfica independente e de alta resolução · 2026
            </span>
          </div>
        </section>

        {/* SEÇÃO DE FECHAMENTO */}
        <section className="closing relative">
          <img
            data-parallax=".08"
            src="/photos/bridge.png"
            alt="Luz suave do sol sobre uma ponte vermelha no Japão"
            loading="lazy"
            decoding="async"
          />
          <div className="closing-shade" />
          <div className="closing-copy reveal">
            <span className="eyebrow">Leve um momento com você</span>
            <h2>
              O Japão não é apenas um lugar
              <br />
              que se visita.
            </h2>
            <p>É uma coleção de momentos que você carrega consigo.</p>
            <a className="text-link" href="#gallery">
              Explorar Todas as Fotografias <ArrowUpRight size={22} />
            </a>
          </div>
        </section>

        {/* RODAPÉ DA GALERIA */}
        <footer className="site-footer section-pad" id="contact">
          <div className="footer-top">
            <div>
              <a className="wordmark" href="#home">
                hanzi<span className="brand-dot" />
              </a>
              <p>Galeria Independente de Fotografia do Japão</p>
            </div>
            <div className="footer-links">
              <a href="#gallery">Galeria</a>
              <a href="#stories">Histórias</a>
              <a href="#about">Sobre</a>
            </div>
            <div className="footer-contact">
              <span className="eyebrow">Autoria & Curadoria</span>
              <p>
                Imagens em resolução master 35mm.
                <br />
                Desenvolvido com padrão internacional de luxo e arte visual.
              </p>
            </div>
            <span className="footer-jp font-serif" lang="ja">
              日本
            </span>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Hanzi — Histórias Através da Luz</span>
            <button
              onClick={() => setManualReduced((v) => !v)}
              aria-pressed={reduced || manualReduced}
            >
              Movimento: {reduced || manualReduced ? "reduzido" : "completo"}
            </button>
            <a href="#home">
              Voltar ao topo <ArrowUpRight size={15} />
            </a>
          </div>
        </footer>
      </main>

      {/* RUA DE CAPÍTULOS LATERAL */}
      <aside className="chapter-rail" aria-label="Capítulos da jornada">
        {[
          { id: "home", label: "Início" },
          { id: "collection", label: "Coleção" },
          { id: "gallery", label: "Galeria" },
          { id: "places", label: "Cidades" },
          { id: "quiet", label: "Japão Sereno" },
          { id: "fuji", label: "Fuji" },
          { id: "stories", label: "Histórias" },
        ].map((c) => (
          <a
            href={"#" + c.id}
            key={c.id}
            aria-label={c.label}
            aria-current={activeChapter === c.id ? "location" : undefined}
            className={activeChapter === c.id ? "active" : ""}
          >
            <span>{c.label}</span>
          </a>
        ))}
      </aside>

      {/* LIGHTBOX PROFISSIONAL COM ZOOM, PAN, EXIF DRAWER, MODO ZEN E ATALHOS */}
      <LightboxModal
        open={!!selection}
        onOpenChange={(v) => {
          if (!v) setSelection(null);
        }}
        photos={photos}
        currentId={selection ? selection.ids[selection.index] : null}
        storyTitle={selection?.story}
        onNavigate={nextPhoto}
        onSelectPhoto={selectPhotoById}
      />

      {/* MENU MOBILE */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent
          className="mobile-menu"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Navegação</DialogTitle>
          <DialogDescription className="sr-only">
            Explore a coleção Hanzi
          </DialogDescription>
          <button
            className="menu-close icon-button"
            aria-label="Fechar navegação"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
          <span className="eyebrow">Hanzi — Histórias Através da Luz</span>
          {navItems.map((x, i) => (
            <a
              key={x.href}
              href={x.href}
              onClick={() => setMenuOpen(false)}
            >
              <span>{pad(i + 1)}</span>
              {x.name}
              <ArrowUpRight />
            </a>
          ))}
          <span lang="ja" className="font-serif">
            日本
          </span>
        </DialogContent>
      </Dialog>
    </>
  );
}

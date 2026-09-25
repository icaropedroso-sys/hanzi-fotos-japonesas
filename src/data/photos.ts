export interface PhotoExif {
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  focalLength: string;
  locationExact: string;
  coordinates: string;
  year: string;
}

export interface Photo {
  id: string;
  title: string;
  place: string;
  jp: string;
  tags: string[];
  description: string;
  story: string;
  exif: PhotoExif;
  position?: string;
  aspectRatio?: string;
}

export const photos: Photo[] = [
  {
    id: "kyoto",
    title: "Um momento em Quioto",
    place: "Quioto, Japão",
    jp: "京都",
    tags: ["Quioto", "Pessoas", "Arquitetura", "Templos"],
    description: "Um guarda-sol de papel, um lampejo de cor e uma rua silenciosa. Os menores gestos dão à cidade antiga o seu ritmo.",
    story: "Nas primeiras horas após uma chuva suave de primavera em Gion, uma figura com guarda-sol tradicional de papel washi cruzou a calçada de pedra polida. O contraste entre os tons quentes de cedro das machiya centenárias e o carmim do guarda-sol revelou a essência do 'ma' (o intervalo que dá sentido ao espaço) e a beleza sutil da impermanência japonesa.",
    position: "60% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Leica M11",
      lens: "Summilux-M 35mm f/1.4 ASPH",
      aperture: "f/1.8",
      shutter: "1/500s",
      iso: "200",
      focalLength: "35mm",
      locationExact: "Distrito de Gion, Higashiyama-ku, Quioto",
      coordinates: "35.0037° N, 135.7772° E",
      year: "2026"
    }
  },
  {
    id: "fuji",
    title: "A forma do silêncio",
    place: "Monte Fuji, Japão",
    jp: "富士山",
    tags: ["Natureza"],
    description: "Flores de cerejeira alcançam a água. Além delas, a montanha mantém seu lugar contra o céu do entardecer.",
    story: "O Monte Fuji permaneceu recolhido atrás de densas nuvens por quase três dias consecutivos. Minutos antes do crepúsculo final, uma rajada suave dispersou a névoa, revelando a silhueta sagrada sob um degradê lilás e dourado, com ramos de sakura em flor beijando a superfície espelhada do Lago Kawaguchi.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Hasselblad X2D 100C",
      lens: "XCD 90mm f/2.5 V",
      aperture: "f/8.0",
      shutter: "1/80s",
      iso: "64",
      focalLength: "90mm",
      locationExact: "Margem norte do Lago Kawaguchi, Yamanashi",
      coordinates: "35.5171° N, 138.7518° E",
      year: "2026"
    }
  },
  {
    id: "osaka",
    title: "Sob as lanternas",
    place: "Shinsekai, Osaka",
    jp: "大阪",
    tags: ["Osaka", "Noite", "Pessoas", "Arquitetura"],
    description: "Letreiros disputam atenção enquanto a última luz azul se assenta entre os edifícios. A cidade muda lentamente de cor.",
    story: "O brilho retrô e a atmosfera nostálgica de Shinsekai ('Novo Mundo'). Lanternas de papel de izakayas tradicionais contrastam com os néons verticais de kushikatsu. A torre Tsutenkaku ao fundo atua como bússola para os transeuntes em meio à garoa noturna.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Sony α7R V",
      lens: "FE 24-70mm f/2.8 GM II",
      aperture: "f/2.8",
      shutter: "1/125s",
      iso: "1600",
      focalLength: "50mm",
      locationExact: "Shinsekai, Naniwa-ku, Osaka",
      coordinates: "34.6525° N, 135.5063° E",
      year: "2026"
    }
  },
  {
    id: "autumn",
    title: "Uma estação em vermelhão",
    place: "Japão · paisagem de outono",
    jp: "秋",
    tags: ["Natureza", "Arquitetura"],
    description: "Uma ponte vermelha desaparece sob um dossel de ouro. Por uma breve estação, tudo parece brilhar por dentro.",
    story: "No pico do koyo (mudança das cores do outono), o vale do templo Tofuku-ji incendeia-se em tons escarlates e ocres. A ponte de madeira tradicional Tsūtenkyō parece levitar sobre um mar de folhas de momiji que duram apenas dez a quinze dias antes de caírem nas pedras do riacho.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Fujifilm GFX 100 II",
      lens: "GF 45-100mm f/4 R LM OIS WR",
      aperture: "f/5.6",
      shutter: "1/60s",
      iso: "100",
      focalLength: "63mm",
      locationExact: "Templo Tofuku-ji, Higashiyama, Quioto",
      coordinates: "34.9811° N, 135.7742° E",
      year: "2026"
    }
  },
  {
    id: "tokyo",
    title: "Tóquio, no limiar do dia",
    place: "Tóquio, Japão",
    jp: "東京",
    tags: ["Tóquio", "Noite", "Arquitetura"],
    description: "A torre começa a brilhar sobre a cidade. Camada após camada, o horizonte se estende na suave cor do crepúsculo.",
    story: "Durante a 'Hora Azul', o momento em que a luz solar residual se funde à temperatura de cor dos primeiros arranha-céus que acendem seus escritórios. A icônica Torre de Tóquio destaca-se em seu laranja clássico e carmim, âncora visual de um oceano ininterrupto de luzes urbanas.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Sony α7R V",
      lens: "FE 16-35mm f/2.8 GM II",
      aperture: "f/5.6",
      shutter: "2.5s",
      iso: "400",
      focalLength: "28mm",
      locationExact: "Mirante Roppongi Hills, Minato-ku, Tóquio",
      coordinates: "35.6605° N, 139.7292° E",
      year: "2026"
    }
  },
  {
    id: "onsen",
    title: "Onde o inverno exala",
    place: "Japão · paisagem de inverno",
    jp: "冬",
    tags: ["Natureza", "Pessoas"],
    description: "O vapor flutua sobre a água pálida e galhos cobertos de neve. A paisagem parece pausar entre o calor e o inverno.",
    story: "Flutuação de vapor quente sobre as águas minerais do rio Ginzan sob neve densa. As estalagens centenárias no estilo Taisho Roman alinham-se ao longo da garganta, iluminadas por lamparinas a gás que conferem um ar de conto de fadas atemporal à vila montanhosa.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Leica SL2-S",
      lens: "APO-Summicron-SL 50mm f/2 ASPH",
      aperture: "f/2.0",
      shutter: "1/250s",
      iso: "800",
      focalLength: "50mm",
      locationExact: "Ginzan Onsen, Obanazawa, Yamagata",
      coordinates: "38.5707° N, 140.5306° E",
      year: "2026"
    }
  },
  {
    id: "dotonbori",
    title: "A vida ao longo do canal",
    place: "Dōtonbori, Osaka",
    jp: "大阪",
    tags: ["Osaka", "Pessoas", "Arquitetura"],
    description: "Um barco amarelo navega por um desfiladeiro de letreiros. Cores, reflexos e passos apressados se encontram ao redor do canal.",
    story: "O canal Dōtonbori é a quintessência da energia de Osaka. Painéis monumentais de LED e néon refletem-se em fitas líquidas na água enquanto as embarcações turísticas cortam as pontes repletas de passantes degustando takoyaki quente e cerveja artesanal.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Fujifilm X-T5",
      lens: "XF 18-55mm f/2.8-4 R LM OIS",
      aperture: "f/3.2",
      shutter: "1/160s",
      iso: "1250",
      focalLength: "35mm",
      locationExact: "Ponte Ebisu-bashi, Dōtonbori, Chūō-ku, Osaka",
      coordinates: "34.6687° N, 135.5013° E",
      year: "2026"
    }
  },
  {
    id: "bridge",
    title: "A luz entre as folhas",
    place: "Japão · paisagem fluvial",
    jp: "光",
    tags: ["Natureza", "Arquitetura"],
    description: "A luz baixa do sol desliza pelas árvores e toca a curva de uma ponte vermelha. O rio leva o momento adiante.",
    story: "Raios de sol oblíquos penetram o dossel úmido da floresta sagrada de Nikko. A icônica ponte Shinkyo, curvada em laca vermelha e pilares de pedra vulcânica, une as duas margens do rio Daiya em uma harmonia perfeita entre espiritualidade e natureza viva.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Nikon Z9",
      lens: "NIKKOR Z 70-200mm f/2.8 VR S",
      aperture: "f/4.0",
      shutter: "1/320s",
      iso: "250",
      focalLength: "85mm",
      locationExact: "Ponte Shinkyo, Parque Nacional de Nikko, Tochigi",
      coordinates: "36.7551° N, 139.5989° E",
      year: "2026"
    }
  },
  {
    id: "kobe",
    title: "O porto torna-se azul",
    place: "Kobe, Japão",
    jp: "神戸",
    tags: ["Noite", "Arquitetura"],
    description: "O porto espelha um novo conjunto de cores à medida que o dia dá lugar à noite. Sobre a água, a cidade transforma-se em uma constelação.",
    story: "A silhueta hiperbólica em aço vermelho da Kobe Port Tower erguendo-se sobre a marina do Meriken Park. Conforme a noite cai no mar interior de Seto, as luzes da ponte Akashi Kaikyo ao fundo completam a constelação portuária.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Leica M11-P",
      lens: "Elmarit-M 28mm f/2.8 ASPH",
      aperture: "f/4.0",
      shutter: "1/15s",
      iso: "400",
      focalLength: "28mm",
      locationExact: "Meriken Park, Baía de Kobe, Hyogo",
      coordinates: "34.6828° N, 135.1887° E",
      year: "2026"
    }
  },
  {
    id: "spring",
    title: "Um mundo de vapor nascente",
    place: "Japão · fontes termais",
    jp: "湯",
    tags: ["Natureza", "Templos"],
    description: "O vapor branco sobe em direção à vegetação verde e profunda. Um pequeno torii vermelho marca um vívido ponto de quietude na paisagem.",
    story: "Fontes geotérmicas de Beppu liberando colunas brancas de vapor que se condensam na folhagem dos cedros circundantes. O torii em laca vermelha demarca a fronteira entre as forças telúricas primordiais da terra e a reverência milenar dos santuários xintoístas.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Fujifilm X-Pro3",
      lens: "XF 35mm f/1.4 R",
      aperture: "f/2.8",
      shutter: "1/400s",
      iso: "320",
      focalLength: "35mm",
      locationExact: "Beppu Jigoku Meguri, Oita, Kyushu",
      coordinates: "33.2846° N, 131.5036° E",
      year: "2026"
    }
  },
  {
    id: "snow",
    title: "Acima da floresta branca",
    place: "Japão · paisagem montanhosa",
    jp: "山",
    tags: ["Natureza"],
    description: "Um teleférico vermelho flutua sobre uma floresta transformada pela neve. As formas familiares das árvores tornam-se algo de outro mundo.",
    story: "Os célebres 'monstros de gelo' (Jūhyō) da cordilheira de Zao, esculpidos pelos ventos gelados vindos da Sibéria. A cabine panorâmica do teleférico atravessa a imensidão branca como uma única nota carmim suspensa na pureza gélida do Tohoku.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Sony α7R V",
      lens: "FE 70-200mm f/2.8 GM OSS II",
      aperture: "f/8.0",
      shutter: "1/800s",
      iso: "100",
      focalLength: "135mm",
      locationExact: "Zao Ropeway Summit, Yamagata/Miyagi",
      coordinates: "38.1614° N, 140.3975° E",
      year: "2026"
    }
  },
  {
    id: "sakura",
    title: "Ao longo das águas da primavera",
    place: "Japão · temporada das cerejeiras",
    jp: "桜",
    tags: ["Natureza"],
    description: "Ramos cor-de-rosa desenham a margem da água. Reflexos estendem-se até o horizonte, guardando as últimas cores da primavera.",
    story: "Durante o auge do hanami, as águas mansas do canal Meguro transformam-se em uma 'hanaikada' (jangada de flores), onde milhões de pétalas de cerejeira Somei Yoshino formam uma esteira flutuante sob lanternas de papel rosa.",
    position: "50% 50%",
    aspectRatio: "1.5",
    exif: {
      camera: "Leica SL2",
      lens: "Vario-Elmarit-SL 24-90mm f/2.8-4 ASPH",
      aperture: "f/3.5",
      shutter: "1/640s",
      iso: "160",
      focalLength: "45mm",
      locationExact: "Nakameguro, Rio Meguro, Tóquio",
      coordinates: "35.6427° N, 139.6989° E",
      year: "2026"
    }
  }
];

export const categories = [
  "Todas as fotografias",
  "Tóquio",
  "Quioto",
  "Osaka",
  "Natureza",
  "Templos",
  "Noite",
  "Pessoas",
  "Arquitetura"
] as const;

export const navItems = [
  { name: "Galeria", href: "#gallery" },
  { name: "Histórias", href: "#stories" },
  { name: "Lugares", href: "#places" },
  { name: "Sobre", href: "#about" },
  { name: "Contato", href: "#contact" }
];

export const storySets = [
  { title: "Quioto em Cores", eyebrow: "A tradição no cotidiano", ids: ["kyoto", "bridge", "spring"] },
  { title: "As Horas de Néon", eyebrow: "Quando as cidades ganham vida", ids: ["tokyo", "osaka", "kobe", "dotonbori"] },
  { title: "Montanhas do Japão", eyebrow: "Uma sensação diferente de escala", ids: ["snow", "fuji", "onsen"] },
  { title: "Vapor & Silêncio", eyebrow: "Entre o inverno e o calor", ids: ["onsen", "spring", "snow"] },
  { title: "Ruas de Lanternas", eyebrow: "Seguindo a luz do entardecer", ids: ["osaka", "dotonbori", "kyoto"] },
  { title: "Uma Estação em Flor", eyebrow: "As cores que carregamos", ids: ["sakura", "fuji", "autumn"] }
];

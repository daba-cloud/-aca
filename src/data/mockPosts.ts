import { PostItem } from '../types';

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    type: 'image_card',
    title: 'PROTEST U BEOGRADU',
    subtitle: 'EKSKLUZIVNO',
    excerpt: 'Ekskluzivni snimak drona sa lica mesta donosi nove detalje o trenutnoj situaciji u glavnom gradu. Veliki broj građana okupio se u centru grada zahtevajući hitno rešavanje ekoloških i infrastrukturnih pitanja.',
    timeAgo: 'pre 25 min',
    author: {
      name: 'FOKUS Ekipa',
      handle: '@fokus.rs',
      avatarLetter: 'F',
      avatarColor: 'from-zinc-700 to-zinc-900',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    fromText: 'FROM: @fokus.rs',
    cardHeight: 1350,
    likesCount: 342,
    sharesCount: 89,
    viewsCount: '12.4K'
  },
  {
    id: 'post-2',
    type: 'video',
    title: 'PRENOS JAVNOG SERVISA - UŽIVO UKLJUČENJE',
    subtitle: 'EKSKLUZIVNO',
    excerpt: 'Ekskluzivni snimak drona sa lica mesta donosi nove detalje na koje nismo bili spremni. Pogledajte detaljnu analizu i izjave zvaničnika sa terena.',
    timeAgo: 'pre 1 sat',
    author: {
      name: 'RTS Javni Servis',
      handle: '@rts_vesti',
      avatarLetter: 'R',
      avatarColor: 'from-blue-600 to-indigo-800',
      verified: true
    },
    youtubeId: 'dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    fromText: 'Izvor: Radio Televizija Srbije',
    likesCount: 512,
    sharesCount: 140,
    viewsCount: '28.1K'
  },
  {
    id: 'post-3',
    type: 'fullscreen_card',
    title: 'NOVA ISTRAGA O TOKOVIMA NOVCA',
    subtitle: 'ISTRAŽIVANJE',
    excerpt: 'Glavni tekst istraživanja o javnim nabavkama i tokovima novca u građevinskom sektoru. Kroz višemesečni rad prikupljena je obimna dokumentacija sa terena.',
    timeAgo: 'pre 2 sata',
    author: {
      name: 'KRIK Istraživači',
      handle: '@KRIKrs',
      avatarLetter: 'K',
      avatarColor: 'from-amber-600 to-zinc-900',
      verified: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    fromText: 'Izvor: @KRIKrs',
    likesCount: 689,
    sharesCount: 215,
    viewsCount: '19.8K'
  },
  {
    id: 'post-4',
    type: 'video',
    title: 'EKONOMSKA KRETANJA I ANALIZA TRŽIŠTA',
    subtitle: 'ANALIZA',
    excerpt: 'Kratak opis i detaljna finansijska procena o kretanju inflacije i kamatnih stopa u regionu. Stručnjaci prognoziraju trendove za naredni kvartal.',
    timeAgo: 'pre 2 sata',
    author: {
      name: 'N1 Info',
      handle: '@n1srbija',
      avatarLetter: 'N',
      avatarColor: 'from-red-600 to-rose-900',
      verified: true
    },
    youtubeId: 'frVP9jT7x5Y',
    videoUrl: 'https://www.youtube.com/watch?v=frVP9jT7x5Y',
    fromText: 'Izvor: N1 Televizija',
    likesCount: 278,
    sharesCount: 54,
    viewsCount: '8.9K'
  },
  {
    id: 'post-5',
    type: 'video',
    title: 'INTERVJU SA GLAVNIM ARHITEKTOM',
    subtitle: 'INTERVJU',
    excerpt: 'U ekskluzivnom razgovoru saznajemo planove za novi urbanistički plan prestonice, zelene oaze i regulaciju saobraćajnih gužvi.',
    timeAgo: 'pre 3 sata',
    author: {
      name: 'N1 Info',
      handle: '@n1srbija',
      avatarLetter: 'N',
      avatarColor: 'from-red-600 to-rose-900',
      verified: true
    },
    youtubeId: 'E0izfkzBqlc',
    videoUrl: 'https://www.youtube.com/watch?v=E0izfkzBqlc',
    fromText: 'Izvor: N1 Televizija',
    likesCount: 195,
    sharesCount: 31,
    viewsCount: '6.2K'
  },
  {
    id: 'post-6',
    type: 'video',
    title: 'GEOPOLITIČKI IZVEŠTAJ SA GRANICE',
    subtitle: 'IZVEŠTAJ',
    excerpt: 'Specijalni izveštač prenosi svedočenja meštana i najnovije bezbednosne procene stanja na terenu.',
    timeAgo: 'pre 4 sata',
    author: {
      name: 'N1 Info',
      handle: '@n1srbija',
      avatarLetter: 'N',
      avatarColor: 'from-red-600 to-rose-900',
      verified: true
    },
    youtubeId: 'yCzcHI8j96A',
    videoUrl: 'https://www.youtube.com/watch?v=yCzcHI8j96A',
    fromText: 'Izvor: N1 Televizija',
    likesCount: 420,
    sharesCount: 92,
    viewsCount: '15.3K'
  },
  {
    id: 'post-7',
    type: 'video',
    title: 'SAOPŠTENJE VLADE I OBRAT MINISTRA',
    subtitle: 'SAOPŠTENJE',
    excerpt: 'Kompletan snimak vanredne konferencije za medije povodom novih zakonskih izmena u oblasti energetike.',
    timeAgo: 'pre 5 sati',
    author: {
      name: 'RTS Javni Servis',
      handle: '@rts_vesti',
      avatarLetter: 'R',
      avatarColor: 'from-blue-600 to-indigo-800',
      verified: true
    },
    youtubeId: 'BZpeuF27dfM',
    videoUrl: 'https://www.youtube.com/watch?v=BZpeuF27dfM',
    fromText: 'Izvor: RTS',
    likesCount: 184,
    sharesCount: 22,
    viewsCount: '5.1K'
  },
  {
    id: 'post-8',
    type: 'video',
    title: 'NAJAVA KULTURNIH DOGAĐAJA I PREMIJERA',
    subtitle: 'NAJAVA',
    excerpt: 'Pregled najznačajnijih kulturnih manifestacija, pozorišnih premijera i filmskih festivala u zemlji tokom ovog vikenda.',
    timeAgo: 'pre 6 sati',
    author: {
      name: 'N1 Info',
      handle: '@n1srbija',
      avatarLetter: 'N',
      avatarColor: 'from-red-600 to-rose-900',
      verified: true
    },
    youtubeId: 'n5mPDZHGUZc',
    videoUrl: 'https://www.youtube.com/watch?v=n5mPDZHGUZc',
    fromText: 'Izvor: N1 Kultura',
    likesCount: 153,
    sharesCount: 18,
    viewsCount: '4.7K'
  }
];

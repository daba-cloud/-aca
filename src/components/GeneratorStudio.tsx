import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Sparkles, 
  Eye, 
  Send, 
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Type,
  FileText,
  Layers
} from 'lucide-react';
import { PostItem, GeneratorMode } from '../types';

interface GeneratorStudioProps {
  onPublishToFeed: (newPost: PostItem) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Protest / Masa',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Noćni grad',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Arhitektura / Zgrada',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Studio / Mikrofon',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80'
  }
];

export const GeneratorStudio: React.FC<GeneratorStudioProps> = ({ onPublishToFeed }) => {
  // Form State
  const [naslov, setNaslov] = useState('PROTEST U BEOGRADU');
  const [podnaslov, setPodnaslov] = useState('EKSKLUZIVNO');
  const [tekst, setTekst] = useState('Ekskluzivni snimak drona sa lica mesta donosi nove detalje o trenutnoj situaciji u glavnom gradu. Građani su se okupili u velikom broju zahtevajući odgovore nadležnih institucija.');
  const [fromText, setFromText] = useState('FROM: @fokus.rs');
  const [visinaObjave, setVisinaObjave] = useState<number>(1350);
  const [mode, setMode] = useState<GeneratorMode>('cinematic_card');
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>(PRESET_IMAGES[0].url);
  const [authorName, setAuthorName] = useState('FOKUS Redakcija');

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [outputHtml, setOutputHtml] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Load image whenever selectedImageSrc changes
  useEffect(() => {
    if (!selectedImageSrc) {
      loadedImageRef.current = null;
      drawCanvas();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      drawCanvas();
    };
    img.onerror = () => {
      // If external load fails, continue without blocking
      drawCanvas();
    };
    img.src = selectedImageSrc;
  }, [selectedImageSrc]);

  // Re-draw canvas on parameters change
  useEffect(() => {
    drawCanvas();
  }, [naslov, podnaslov, tekst, fromText, visinaObjave, mode]);

  // Main drawing engine matching the user's Canvas algorithms with higher DPI and polish
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = mode === 'fullscreen_blur' ? 1080 : visinaObjave;
    const MARGINA = mode === 'fullscreen_blur' ? 80 : 100;
    const FONT_FAMILY = '"Ubuntu", "Plus Jakarta Sans", sans-serif';

    canvas.width = W;
    canvas.height = H;

    // Helper: setFont
    const setFont = (size: number, weight: number | string) => {
      ctx.font = `${weight} ${size}px ${FONT_FAMILY}`;
    };

    // Helper: word wrap
    const wrapWords = (textStr: string, maxW: number): string[][] => {
      const words = textStr.split(/\s+/).filter(Boolean);
      const lines: string[][] = [];
      let currentLine: string[] = [];
      let currentWidth = 0;

      words.forEach(word => {
        const wordWidth = ctx.measureText(word).width;
        const spaceWidth = ctx.measureText(' ').width;

        if (currentLine.length > 0 && currentWidth + spaceWidth + wordWidth > maxW) {
          lines.push(currentLine);
          currentLine = [word];
          currentWidth = wordWidth;
        } else {
          if (currentLine.length > 0) currentWidth += spaceWidth;
          currentLine.push(word);
          currentWidth += wordWidth;
        }
      });

      if (currentLine.length > 0) lines.push(currentLine);
      return lines;
    };

    // Helper: Draw Justified text
    const drawJustifiedText = (
      lines: string[][],
      startX: number,
      startY: number,
      maxW: number,
      lineHeight: number
    ) => {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const y = startY + i * lineHeight;

        if (i === lines.length - 1 || line.length <= 1) {
          // Last line or single word line: standard left align
          let currX = startX;
          for (let j = 0; j < line.length; j++) {
            ctx.fillText(line[j], currX, y);
            currX += ctx.measureText(line[j]).width + ctx.measureText(' ').width;
          }
        } else {
          // Justified space distribution
          let textWidth = 0;
          for (let j = 0; j < line.length; j++) {
            textWidth += ctx.measureText(line[j]).width;
          }
          const spacesCount = line.length - 1;
          const extraSpace = spacesCount > 0 ? (maxW - textWidth) / spacesCount : 0;
          let currX = startX;

          for (let j = 0; j < line.length; j++) {
            ctx.fillText(line[j], currX, y);
            currX += ctx.measureText(line[j]).width + extraSpace;
          }
        }
      }
    };

    // Helper: Cover image drawing
    const drawCoverImage = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // ============================================
    // MODE 1: CINEMATIC KARTA SA SJAJEM (USER CODE 1)
    // ============================================
    if (mode === 'cinematic_card') {
      const maxSirina = W - MARGINA * 2;
      const cleanNaslov = naslov.trim().toUpperCase();
      const cleanPodnaslov = podnaslov.trim().toUpperCase();
      const cleanTekst = tekst.trim();
      const cleanFrom = fromText.trim();

      // Pozadina
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      const visinaSlike = 480;

      if (loadedImageRef.current) {
        const img = loadedImageRef.current;
        const imgX = 20;
        const imgY = 20;
        const imgW = W - 40;

        // Cinematic glow border
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
        ctx.shadowBlur = 35;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(imgX, imgY, imgW, visinaSlike);
        ctx.restore();

        // Iscrtaj sliku unutar pravougaonika
        ctx.save();
        ctx.beginPath();
        ctx.rect(imgX, imgY, imgW, visinaSlike);
        ctx.clip();
        drawCoverImage(img, imgX, imgY, imgW, visinaSlike);

        // Donji preliv
        const gradBottom = ctx.createLinearGradient(0, imgY + visinaSlike - 160, 0, imgY + visinaSlike);
        gradBottom.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradBottom.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = gradBottom;
        ctx.fillRect(imgX, imgY + visinaSlike - 160, imgW, 160);

        // Levi i desni preliv
        const gradLeft = ctx.createLinearGradient(imgX, 0, imgX + 80, 0);
        gradLeft.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        gradLeft.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradLeft;
        ctx.fillRect(imgX, imgY, 80, visinaSlike);

        const gradRight = ctx.createLinearGradient(imgX + imgW - 80, 0, imgX + imgW, 0);
        gradRight.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradRight.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
        ctx.fillStyle = gradRight;
        ctx.fillRect(imgX + imgW - 80, imgY, 80, visinaSlike);

        ctx.restore();
      }

      // 'tagged' u gornjem desnom uglu
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffffff';
      setFont(20, 500);
      ctx.fillText('tagged', W - 50, 50);

      // Naslov
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#ffffff';
      setFont(48, 700);

      const redoviNaslova = wrapWords(cleanNaslov, maxSirina);
      let y = loadedImageRef.current ? visinaSlike + 50 : 150;

      redoviNaslova.forEach(redReci => {
        ctx.fillText(redReci.join(' '), W / 2, y);
        y += 60;
      });

      // Podnaslov
      ctx.fillStyle = '#a1a1aa';
      setFont(22, 700);
      y += 10;
      ctx.fillText(cleanPodnaslov, W / 2, y);

      // Linija
      y += 40;
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(MARGINA, y);
      ctx.lineTo(W - MARGINA, y);
      ctx.stroke();

      // Glavni tekst
      y += 35;
      ctx.fillStyle = '#f4f4f5';
      setFont(27, 400);

      const redoviTeksta = wrapWords(cleanTekst, maxSirina);
      drawJustifiedText(redoviTeksta, MARGINA, y, maxSirina, 44);

      // FROM tekst
      if (cleanFrom) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#71717a';
        setFont(20, 400);
        ctx.fillText(cleanFrom, W / 2, H - 35);
      }
    } 
    // ============================================
    // MODE 2: FULLSCREEN BLUR POSTER (USER CODE 2)
    // ============================================
    else {
      const maxSirina = W - MARGINA * 2;
      const VISINA_BLOKA = 460;
      const cleanNaslov = naslov.trim().toUpperCase();
      const cleanTekst = tekst.trim();
      const cleanFrom = fromText.trim();

      // Crna pozadina
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      if (loadedImageRef.current) {
        const img = loadedImageRef.current;
        // Oštra slika
        drawCoverImage(img, 0, 0, W, H);

        // Donji zamućeni deo
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, H - VISINA_BLOKA, W, VISINA_BLOKA);
        ctx.clip();

        // Blur i overlay
        ctx.filter = 'blur(20px)';
        drawCoverImage(img, 0, 0, W, H);
        ctx.filter = 'none';

        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, H - VISINA_BLOKA, W, VISINA_BLOKA);
        ctx.restore();
      }

      // Tekst u donjem delu
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      let y = H - VISINA_BLOKA + 50;

      // Naslov
      ctx.fillStyle = '#ffffff';
      setFont(46, 700);
      const redoviNaslova = wrapWords(cleanNaslov, maxSirina);
      redoviNaslova.forEach(red => {
        ctx.fillText(red.join(' '), MARGINA, y);
        y += 58;
      });

      y += 15;

      // Tekst
      ctx.fillStyle = '#e4e4e7';
      setFont(32, 400);
      const redoviTeksta = wrapWords(cleanTekst, maxSirina);
      redoviTeksta.forEach(red => {
        ctx.fillText(red.join(' '), MARGINA, y);
        y += 42;
      });

      // Izvor
      if (cleanFrom) {
        ctx.fillStyle = '#a1a1aa';
        setFont(22, 400);
        ctx.textBaseline = 'bottom';
        ctx.fillText(cleanFrom, MARGINA, H - 35);
      }
    }

    // Ažuriraj download url i html kod
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setDownloadUrl(dataUrl);

      const generatedCode = `<!-- SLIKOVNA OBJAVA ZA SAJT (FOKUS) -->
<div class="post yt-post-card" style="max-width: 600px; margin: 0 auto 30px auto; background: #000; color: #fff; font-family: 'Ubuntu', sans-serif;">
  <div style="position: relative; width: 100%; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; overflow: hidden; background: #000; margin-bottom: 20px;">
    <img src="${dataUrl}" alt="${naslov}" style="width: 100%; height: auto; display: block;" />
    <span style="position: absolute; top: 15px; right: 15px; font-size: 15px; color: #fff; letter-spacing: 1px;">tagged</span>
  </div>
  <div style="text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 2px; margin-bottom: 8px; text-transform: uppercase;">${naslov}</div>
  <div style="text-align: center; font-size: 13px; font-weight: 700; color: #888; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 15px;">${podnaslov}</div>
  <div style="width: 100%; height: 1px; background: #333; margin: 15px 0;"></div>
  <div style="text-align: justify; font-size: 15px; line-height: 1.6; color: #fff; letter-spacing: 0.5px; margin-bottom: 15px;">${tekst}</div>
  ${fromText ? `<div style="text-align: center; font-size: 13px; color: #888; letter-spacing: 1px; margin-top: 10px;">${fromText}</div>` : ''}
</div>`;

      setOutputHtml(generatedCode);
    } catch (e) {
      // ignore tainted canvas if any
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(outputHtml);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePublish = () => {
    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      type: mode === 'fullscreen_blur' ? 'fullscreen_card' : 'image_card',
      title: naslov,
      subtitle: podnaslov,
      excerpt: tekst,
      timeAgo: 'Upravo sada',
      author: {
        name: authorName,
        handle: fromText.replace('FROM: ', '').replace('Izvor: ', ''),
        avatarLetter: authorName.charAt(0) || 'F',
        avatarColor: 'from-zinc-700 to-zinc-900',
        verified: true
      },
      imageUrl: downloadUrl || selectedImageSrc,
      fromText: fromText,
      likesCount: 1,
      sharesCount: 0,
      viewsCount: '1'
    };

    onPublishToFeed(newPost);
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      
      {/* Studio Zaglavlje */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-ubuntu">
              Fokus Image & Objava Generator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Kreirajte fotografije sa cinematic sjajem, podesite visinu i poravnanje, i objavite direktno u feed ili preuzmite PNG.
          </p>
        </div>

        {/* Tip šablona */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-center sm:self-auto text-xs">
          <button
            onClick={() => setMode('cinematic_card')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'cinematic_card'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            1. Cinematic Glow
          </button>
          <button
            onClick={() => setMode('fullscreen_blur')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'fullscreen_blur'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            2. Fullscreen Blur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEVA KOLONA: KONTROLE FORME */}
        <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-zinc-400" />
              <span>Podešavanja Kartice</span>
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">
              {mode === 'cinematic_card' ? `1080 × ${visinaObjave}px` : '1080 × 1080px'}
            </span>
          </div>

          {/* Glavni naslov */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center justify-between">
              <span>Glavni Naslov</span>
              <span className="text-[10px] text-zinc-500 font-mono">{naslov.length} karaktera</span>
            </label>
            <input
              type="text"
              value={naslov}
              onChange={(e) => setNaslov(e.target.value)}
              placeholder="npr. PROTEST U BEOGRADU"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          {/* Podnaslov / Kategorija */}
          {mode === 'cinematic_card' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                Podnaslov / Kategorija
              </label>
              <input
                type="text"
                value={podnaslov}
                onChange={(e) => setPodnaslov(e.target.value)}
                placeholder="npr. EKSKLUZIVNO ili ANALIZA"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
              />
            </div>
          )}

          {/* Kratak tekst (Justified) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center justify-between">
              <span>Tekst Objave</span>
              <span className="text-[10px] text-emerald-400">Obostrano poravnato</span>
            </label>
            <textarea
              rows={4}
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              placeholder="Unesite kratak tekst vesti..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg p-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors resize-y"
            />
          </div>

          {/* Izbor fotografije */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center justify-between">
              <span>Fotografija</span>
              <span className="text-[10px] text-zinc-500">Kliknite ili učitajte svoju</span>
            </label>

            {/* Brzi preset primeri */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_IMAGES.map((imgItem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageSrc(imgItem.url)}
                  className={`relative aspect-video rounded-md overflow-hidden border transition-all cursor-pointer ${
                    selectedImageSrc === imgItem.url 
                      ? 'border-white ring-2 ring-white/30 scale-102' 
                      : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                  }`}
                  title={imgItem.name}
                >
                  <img src={imgItem.url} alt={imgItem.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Fajl upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="file-upload-input"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload-input"
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-medium text-zinc-300 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>Učitaj sliku sa računara</span>
              </label>
            </div>
          </div>

          {/* Visina objave (Slider) */}
          {mode === 'cinematic_card' && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase text-zinc-400 tracking-wider">
                  Visina objave:
                </span>
                <span className="font-mono text-white font-bold">{visinaObjave}px</span>
              </div>
              <input
                type="range"
                min={800}
                max={1800}
                step={10}
                value={visinaObjave}
                onChange={(e) => setVisinaObjave(parseInt(e.target.value))}
                className="w-full accent-white cursor-pointer bg-zinc-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>800px (Kompaktno)</span>
                <span>1350px (Standard)</span>
                <span>1800px (Dugačko)</span>
              </div>
            </div>
          )}

          {/* FROM / Izvor */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-400 tracking-wider">
                FROM: / Izvor
              </label>
              <input
                type="text"
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
                placeholder="npr. FROM: @fokus.rs"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-zinc-400 tracking-wider">
                Autor Kanala
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="FOKUS Redakcija"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* AKCIJE: Objavi direktno u Feed */}
          <div className="pt-2">
            <button
              onClick={handlePublish}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-zinc-950 font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-zinc-200 transition-all cursor-pointer shadow-lg active:scale-98"
            >
              {isPublished ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-950 font-bold">Objavljeno u Feed!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Objavi u Glavni Feed</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* DESNA KOLONA: INTERAKTIVNI CANVAS I EKSPORT */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Header desne kolone */}
          <div className="w-full flex items-center justify-between mb-3 text-xs text-zinc-400 px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-white uppercase tracking-wider">
                Pregled u realnom vremenu
              </span>
            </div>
            <div className="flex items-center gap-2">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`FOKUS-${naslov.toLowerCase().replace(/\s+/g, '-')}.png`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Preuzmi PNG</span>
                </a>
              )}
            </div>
          </div>

          {/* Canvas kontejner sa realističnim skaliranjem za feed */}
          <div className="w-full max-w-[540px] bg-black border border-zinc-800/80 rounded-2xl overflow-hidden p-2 shadow-2xl flex justify-center items-center">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-xl shadow-lg border border-zinc-900"
              style={{ maxHeight: '720px' }}
            />
          </div>

          {/* HTML Kod sekcija (User workflow) */}
          <div className="w-full max-w-[540px] mt-6 bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                HTML kod sa ugrađenom slikom za web sajt
              </label>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Kopirano u memoriju</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Kopiraj kod</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              value={outputHtml}
              className="w-full h-24 bg-black border border-zinc-800 rounded-lg p-3 font-mono text-[11px] text-emerald-400 outline-none resize-none"
            />
            <p className="text-[11px] text-zinc-500 mt-2">
              Ovaj HTML blok sadrži gotov responsive div sa ugrađenom slikom i stilovima, spreman za lepljenje u vaš index.html ili bilo koji sajt.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Code, 
  Check, 
  Play, 
  Sparkles,
  Download,
  Eye
} from 'lucide-react';
import { PostItem } from '../types';

interface PostCardProps {
  post: PostItem;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenVideo?: (youtubeId: string, title: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onToggleLike,
  onToggleSave,
  onOpenVideo
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyHtmlCode = () => {
    const htmlSnippet = `<!-- FOKUS OBJAVA: ${post.title} -->
<div class="post yt-post-card" style="max-width: 600px; margin: 0 auto 30px auto; background: #000; color: #fff;">
  <div style="position: relative; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
    <img src="${post.imageUrl || 'https://img.youtube.com/vi/' + post.youtubeId + '/maxresdefault.jpg'}" alt="${post.title}" style="width: 100%; height: auto; display: block;" />
    <span style="position: absolute; top: 12px; right: 12px; font-size: 13px; color: #fff; letter-spacing: 1px;">tagged</span>
  </div>
  <div style="text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 16px 0 6px 0; text-transform: uppercase;">${post.title}</div>
  <div style="text-align: center; font-size: 13px; font-weight: 700; color: #888; letter-spacing: 3px; text-transform: uppercase;">${post.subtitle}</div>
  <div style="width: 100%; height: 1px; background: #27272a; margin: 16px 0;"></div>
  <div style="text-align: justify; font-size: 15px; line-height: 1.6; color: #d4d4d8;">${post.excerpt}</div>
  ${post.fromText ? `<div style="text-align: center; font-size: 12px; color: #71717a; margin-top: 14px;">${post.fromText}</div>` : ''}
</div>`;

    navigator.clipboard.writeText(htmlSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <article className="w-full max-w-[600px] mx-auto bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl transition-all hover:border-zinc-700/80">
      
      {/* 1. ZAGLAVLJE OBJAVE (Avatar, Ime, Vreme, Akcije) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${post.author.avatarColor || 'from-zinc-700 to-zinc-900'} border border-white/20 flex items-center justify-center font-bold text-white text-sm shadow-inner`}>
            {post.author.avatarLetter}
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{post.author.name}</span>
              {post.author.verified && (
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold" title="Verifikovan izvor">
                  ✓
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{post.timeAgo}</span>
              {post.author.handle && (
                <>
                  <span>·</span>
                  <span className="text-zinc-500">{post.author.handle}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tip oznaka */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300">
            {post.type === 'video' ? 'VIDEO' : 'CINEMATIC'}
          </span>
        </div>
      </div>

      {/* 2. MEDIJSKI ELEMENT (VIDEO ILI SLIKA) */}
      {post.type === 'video' && post.youtubeId && (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 mb-5 group">
          {isVideoPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${post.youtubeId}?autoplay=1&rel=0`}
              title={post.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
              <img
                src={`https://img.youtube.com/vi/${post.youtubeId}/maxresdefault.jpg`}
                alt={post.title}
                onError={(e) => {
                  // Fallback to hqdefault if maxres fails
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`;
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-zinc-950 flex items-center justify-center shadow-2xl pl-1 group-hover:scale-110 group-hover:bg-white transition-all">
                  <Play className="w-6 h-6 fill-zinc-950" />
                </div>
              </div>
              <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-mono">
                YouTube
              </span>
            </div>
          )}
        </div>
      )}

      {/* Slikovna objava sa cinematic sjajem */}
      {post.type === 'image_card' && (
        <div className="relative w-full rounded-xl overflow-hidden mb-5 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.08)] bg-black">
          {post.imageUrl && (
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* Cinematic sjaj i bočni/donji prelivi */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/10 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/10 to-transparent" />
            </div>
          )}

          {/* Watermark "tagged" */}
          <span className="absolute top-3.5 right-4 text-xs font-mono tracking-wider text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
            tagged
          </span>
        </div>
      )}

      {/* Fullscreen blur style card */}
      {post.type === 'fullscreen_card' && (
        <div className="relative w-full rounded-xl overflow-hidden mb-5 border border-zinc-800 bg-black min-h-[340px] flex flex-col justify-end">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
          )}
          <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-[2px] border-t border-white/10">
            <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase mb-1 block">
              {post.subtitle}
            </span>
            <h3 className="text-xl font-bold uppercase text-white mb-2 leading-tight">
              {post.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>
        </div>
      )}

      {/* 3. NASLOV, PODNASLOV, LINIJA I TEKST */}
      {post.type !== 'fullscreen_card' && (
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2 font-ubuntu">
            {post.title}
          </h2>

          <div className="text-xs font-bold text-zinc-400 tracking-[3px] uppercase mb-4">
            {post.subtitle}
          </div>

          <div className="w-full h-px bg-zinc-800/90 my-3.5 mx-auto" />

          <p className="text-sm leading-relaxed text-zinc-300 text-justify tracking-wide mb-3 px-1">
            {post.excerpt}
          </p>

          {post.fromText && (
            <p className="text-xs text-zinc-500 tracking-wider text-center pt-2">
              {post.fromText}
            </p>
          )}
        </div>
      )}

      {/* 4. FOOTER AKCIJE & STATISTIKA */}
      <div className="mt-5 pt-3.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
        
        {/* Lajk & Statistika */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-zinc-900 ${
              post.isLiked ? 'text-rose-500 font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Lajkuj objavu"
          >
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
            <span>{post.likesCount}</span>
          </button>

          {post.viewsCount && (
            <div className="hidden sm:flex items-center gap-1 text-zinc-500">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.viewsCount}</span>
            </div>
          )}
        </div>

        {/* Desne akcije: Sačuvaj, Deli, Kopiraj HTML */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Kopiraj HTML kod */}
          <button
            onClick={handleCopyHtmlCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer text-[11px]"
            title="Kopiraj gotov HTML kod za tvoj sajt"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Kopirano!</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">KOD</span>
              </>
            )}
          </button>

          {/* Podeli link */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Podeli objavu"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          {/* Sačuvaj */}
          <button
            onClick={() => onToggleSave(post.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              post.isSaved 
                ? 'text-amber-400 bg-zinc-900' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title="Sačuvaj objavu"
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-400' : ''}`} />
          </button>

          {/* YouTube eksterni link */}
          {post.videoUrl && (
            <a
              href={post.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Otvori na YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

      </div>

    </article>
  );
};

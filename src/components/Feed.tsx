import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Tv, 
  Layers, 
  Filter, 
  Bookmark, 
  ArrowUp,
  Radio
} from 'lucide-react';
import { PostItem, CategoryFilter } from '../types';
import { PostCard } from './PostCard';

interface FeedProps {
  posts: PostItem[];
  currentFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenGenerator: () => void;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  currentFilter,
  onFilterChange,
  onToggleLike,
  onToggleSave,
  onOpenGenerator
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Category / Type filter
    if (currentFilter === 'video' && post.type !== 'video') return false;
    if (currentFilter === 'slikovne' && post.type === 'video') return false;
    if (currentFilter === 'ekskluzivno' && !post.subtitle.toLowerCase().includes('ekskluzivno')) return false;
    if (currentFilter === 'analiza' && !post.subtitle.toLowerCase().includes('analiz')) return false;
    if (currentFilter === 'izveštaj' && !post.subtitle.toLowerCase().includes('izveštaj')) return false;
    if (currentFilter === 'rts' && !post.author.name.toLowerCase().includes('rts')) return false;
    if (currentFilter === 'n1' && !post.author.name.toLowerCase().includes('n1')) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchAuthor = post.author.name.toLowerCase().includes(q);
      const matchSubtitle = post.subtitle.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchAuthor && !matchSubtitle) {
        return false;
      }
    }

    return true;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories: { id: CategoryFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'sve', label: 'Sve vesti', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'video', label: 'Video', icon: <Tv className="w-3.5 h-3.5 text-red-400" /> },
    { id: 'slikovne', label: 'Cinematic objave' },
    { id: 'ekskluzivno', label: 'Ekskluzivno' },
    { id: 'analiza', label: 'Analize' },
    { id: 'rts', label: 'RTS', icon: <span className="w-2 h-2 rounded-full bg-blue-500" /> },
    { id: 'n1', label: 'N1', icon: <span className="w-2 h-2 rounded-full bg-red-500" /> }
  ];

  return (
    <div className="w-full max-w-[620px] mx-auto pt-4 pb-20 px-3 sm:px-4">
      
      {/* 1. KONTROLNA TRAKA: Pretraga i Filteri */}
      <div className="sticky top-[68px] z-30 pt-3 pb-3 bg-zinc-950/90 backdrop-blur-md mb-6 border-b border-zinc-800/80 -mx-3 px-3 sm:-mx-4 sm:px-4">
        
        {/* Pretraga */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretraži vesti, autore ili teme..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Horizontalni filter skrol */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = currentFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-950 font-bold shadow-md'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. LISTA OBJAVA */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        /* Prazno stanje */
        <div className="text-center py-16 px-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl my-8">
          <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Nema pronađenih objava
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
            Pokušajte sa drugom ključnom reči ili promenite izabrani filter.
          </p>
          <button
            onClick={() => {
              onFilterChange('sve');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Prikaži sve objave
          </button>
        </div>
      )}

      {/* 3. DNO FEED-A: CTA za kreiranje i skok na vrh */}
      {filteredPosts.length > 0 && (
        <div className="mt-12 text-center border-t border-zinc-800/80 pt-8 space-y-4">
          <p className="text-xs text-zinc-500">
            Pregledali ste sve aktuelne objave u ovom pregledu.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kreiraj novu objavu</span>
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Na vrh</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { 
  X, 
  Newspaper, 
  Sparkles, 
  Bookmark, 
  Tv, 
  Image as ImageIcon, 
  SlidersHorizontal,
  ExternalLink,
  Info,
  Layers,
  Radio
} from 'lucide-react';
import { CategoryFilter } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'feed' | 'generator' | 'saved';
  onTabChange: (tab: 'feed' | 'generator' | 'saved') => void;
  currentFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  totalPostsCount: number;
  savedPostsCount: number;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  currentFilter,
  onFilterChange,
  totalPostsCount,
  savedPostsCount
}) => {
  if (!isOpen) return null;

  const handleSelectTab = (tab: 'feed' | 'generator' | 'saved') => {
    onTabChange(tab);
    onClose();
  };

  const handleSelectCategory = (cat: CategoryFilter) => {
    onFilterChange(cat);
    if (activeTab !== 'feed') {
      onTabChange('feed');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-zinc-950 border-r border-zinc-800 shadow-2xl flex flex-col z-50">
        
        {/* Header Drawer */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">
              FOKUS · MENI
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Zatvori meni"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
          
          {/* Glavne sekcije */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2 px-2">
              Navigacija
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleSelectTab('feed')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'feed' 
                    ? 'bg-zinc-800 text-white font-medium' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-4 h-4 text-zinc-400" />
                  <span>Glavni Feed</span>
                </div>
                <span className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                  {totalPostsCount}
                </span>
              </button>

              <button
                onClick={() => handleSelectTab('generator')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'generator' 
                    ? 'bg-zinc-800 text-white font-medium' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Fokus Generator Studia</span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
                  NEW
                </span>
              </button>

              <button
                onClick={() => handleSelectTab('saved')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-left ${
                  activeTab === 'saved' 
                    ? 'bg-zinc-800 text-white font-medium' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-zinc-400" />
                  <span>Sačuvane Objave</span>
                </div>
                <span className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                  {savedPostsCount}
                </span>
              </button>
            </div>
          </div>

          {/* Filteri po formatu */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2 px-2">
              Tip Sadržaja
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleSelectCategory('sve')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left text-xs ${
                  currentFilter === 'sve' 
                    ? 'bg-zinc-800/80 text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sve objave</span>
              </button>

              <button
                onClick={() => handleSelectCategory('video')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left text-xs ${
                  currentFilter === 'video' 
                    ? 'bg-zinc-800/80 text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span>Video prilozi (YouTube)</span>
              </button>

              <button
                onClick={() => handleSelectCategory('slikovne')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left text-xs ${
                  currentFilter === 'slikovne' 
                    ? 'bg-zinc-800/80 text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Cinematic poster kartice</span>
              </button>
            </div>
          </div>

          {/* Filteri po medijima */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2 px-2">
              Izvori & Mediji
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleSelectCategory('rts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-left text-xs ${
                  currentFilter === 'rts' 
                    ? 'bg-zinc-800/80 text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                    R
                  </div>
                  <span>RTS Javni Servis</span>
                </div>
                <Radio className="w-3 h-3 text-blue-400" />
              </button>

              <button
                onClick={() => handleSelectCategory('n1')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-left text-xs ${
                  currentFilter === 'n1' 
                    ? 'bg-zinc-800/80 text-white font-semibold' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-bold text-white">
                    N
                  </div>
                  <span>N1 Srbija</span>
                </div>
                <Radio className="w-3 h-3 text-red-400" />
              </button>
            </div>
          </div>

          {/* O redizajnu */}
          <div className="pt-2 border-t border-zinc-900">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-1">
                <Info className="w-3.5 h-3.5 text-zinc-300" />
                <span>O redizajnu platforme</span>
              </div>
              <p className="leading-relaxed text-[11px] text-zinc-400">
                Integrisani generator vizuelnih objava i video feed-a sa modernim tipografskim poravnanjem, live canvas eksportom i direktnim objavljivanjem.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Drawer */}
        <div className="p-4 border-t border-zinc-900 text-xs text-zinc-500 flex items-center justify-between">
          <span>TAGOVANJE v2.5</span>
          <span className="font-mono text-[10px]">FOKUS ENGINE</span>
        </div>

      </div>
    </div>
  );
};

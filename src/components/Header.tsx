import React, { useState } from 'react';
import { Menu, Plus, User, Sparkles, Newspaper, Bookmark, Check } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'generator' | 'saved';
  onTabChange: (tab: 'feed' | 'generator' | 'saved') => void;
  onOpenDrawer: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenDrawer,
  savedCount
}) => {
  const [logoMode, setLogoMode] = useState<'tagged' | 'fokus'>('tagged');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copiedProfile, setCopiedProfile] = useState(false);

  const toggleLogo = () => {
    setLogoMode(prev => prev === 'tagged' ? 'fokus' : 'tagged');
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText('aleksandar.dabic.rs@gmail.com');
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };

  const logoLetters = logoMode === 'tagged' 
    ? ['t', 'a', 'g', 'g', 'e', 'd'] 
    : ['f', 'o', 'k', 'u', 's'];

  return (
    <header className="fixed top-0 left-0 right-0 h-[68px] z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-4xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between relative">
        
        {/* LEVA STRANA: Hamburger & Brza navigacija */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Glavni meni"
            title="Otvori meni"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Tabovi na desktopu */}
          <div className="hidden sm:flex items-center p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => onTabChange('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Feed</span>
            </button>
            <button
              onClick={() => onTabChange('generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generator</span>
            </button>
          </div>
        </div>

        {/* SREDINA: Interaktivni kockasti Logo */}
        <div 
          onClick={toggleLogo}
          className="flex items-center gap-1 cursor-pointer select-none group"
          title={`Kliknite da promenite natpis (${logoMode === 'tagged' ? 'tagged' : 'fokus'})`}
        >
          {logoLetters.map((char, index) => (
            <span
              key={`${logoMode}-${index}`}
              className="fokus-box-letter shadow-sm transition-transform duration-150 group-hover:scale-105"
            >
              {char}
            </span>
          ))}
          <span className="sr-only">{logoMode}</span>
        </div>

        {/* DESNA STRANA: Akcije & Profil */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sačuvano */}
          <button
            onClick={() => onTabChange('saved')}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
            title="Sačuvane objave"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Dugme za kreiranje objave na mobilnom */}
          <button
            onClick={() => onTabChange('generator')}
            className="sm:hidden flex items-center justify-center p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
            title="Nova objava"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Dugme na desktopu */}
          <button
            onClick={() => onTabChange('generator')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-950 text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>KREIRAJ</span>
          </button>

          {/* Profil ikona */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
              title="Profil i nalog"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Profil padajući meni */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 text-sm">
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 border border-zinc-600 flex items-center justify-center font-bold text-white text-base">
                      F
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">Aleksandar Dabić</p>
                      <p className="text-xs text-zinc-400 truncate">aleksandar.dabic.rs@gmail.com</p>
                    </div>
                  </div>

                  <div className="pt-3 space-y-1 text-xs text-zinc-300">
                    <div className="px-2 py-1.5 bg-zinc-950/60 rounded border border-zinc-800/80 mb-2">
                      <p className="text-zinc-400">Uloga:</p>
                      <p className="font-medium text-white">Glavni urednik / Kreator sadržaja</p>
                    </div>

                    <button
                      onClick={handleCopyProfile}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-left transition-colors cursor-pointer text-zinc-200"
                    >
                      <span>Kopiraj kontakt email</span>
                      {copiedProfile ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-zinc-400">CTRL+C</span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('generator');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-left transition-colors cursor-pointer text-zinc-200"
                    >
                      <span>Otvori Image Generator</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

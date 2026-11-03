import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { Feed } from './components/Feed';
import { GeneratorStudio } from './components/GeneratorStudio';
import { PostCard } from './components/PostCard';
import { INITIAL_POSTS } from './data/mockPosts';
import { PostItem, CategoryFilter } from './types';
import { Bookmark, Sparkles, Newspaper, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'generator' | 'saved'>('feed');
  const [currentFilter, setCurrentFilter] = useState<CategoryFilter>('sve');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize posts from localStorage or mock
  const [posts, setPosts] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem('fokus_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fokus_posts', JSON.stringify(posts));
  }, [posts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Like
  const handleToggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  // Toggle Bookmark / Save
  const handleToggleSave = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isSaved = !p.isSaved;
        if (isSaved) {
          showToast('Objava sačuvana u beleške');
        }
        return {
          ...p,
          isSaved
        };
      }
      return p;
    }));
  };

  // Publish new post from Generator
  const handlePublishToFeed = (newPost: PostItem) => {
    setPosts(prev => [newPost, ...prev]);
    showToast('Nova objava je uspešno dodata na vrh Feed-a!');
    // Switch to feed after short delay
    setTimeout(() => {
      setActiveTab('feed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const savedPosts = posts.filter(p => p.isSaved);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Toast notifikacija */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-white rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. GLAVNO ZAGLAVLJE */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        savedCount={savedPosts.length}
      />

      {/* 2. SIDEBAR MENI (DRAWER) */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        totalPostsCount={posts.length}
        savedPostsCount={savedPosts.length}
      />

      {/* 3. GLAVNI SADRŽAJ */}
      <main className="flex-1 pt-[68px]">
        
        {/* Prikaz 1: GLAVNI FEED */}
        {activeTab === 'feed' && (
          <Feed
            posts={posts}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onOpenGenerator={() => setActiveTab('generator')}
          />
        )}

        {/* Prikaz 2: FOKUS IMAGE & OBJAVA GENERATOR */}
        {activeTab === 'generator' && (
          <GeneratorStudio onPublishToFeed={handlePublishToFeed} />
        )}

        {/* Prikaz 3: SAČUVANE OBJAVE */}
        {activeTab === 'saved' && (
          <div className="w-full max-w-[620px] mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('feed')}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  <span>Sačuvane Objave ({savedPosts.length})</span>
                </h1>
              </div>
            </div>

            {savedPosts.length > 0 ? (
              <div className="space-y-6">
                {savedPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl">
                <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  Nemate sačuvanih objava
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                  Kliknite na ikonicu obeleživača (bookmark) na bilo kojoj objavi u feed-u da biste je sačuvali za kasnije.
                </p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Nazad na feed
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. DONJA MOBILNA NAVIGACIONA TRAKA */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-14 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-40 flex items-center justify-around px-4">
        <button
          onClick={() => {
            setActiveTab('feed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'generator' ? 'text-amber-400' : 'text-zinc-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'saved' ? 'text-amber-400' : 'text-zinc-500'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Sačuvano ({savedPosts.length})</span>
        </button>
      </nav>

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodProvider, useFoodContext } from './context';
import { tipsData } from './data';
import { Category, FoodItem } from './types';
import { FoodCard } from './components/FoodCard';
import { FoodListItem } from './components/FoodListItem';
import { FoodModal } from './components/FoodModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { CreateFoodModal } from './components/CreateFoodModal';
import { CalendarView } from './components/CalendarView';
import { isSameDay, parseISO } from 'date-fns';
import { Baby, Info, ChevronDown, UserPlus, Search, X, Camera, LayoutGrid, List, Home, Utensils, Calendar as CalendarIcon, Settings, CheckCircle2, ChevronLeft, Plus, ListFilter } from 'lucide-react';

type ViewTab = 'home' | 'foods' | 'calendar' | 'settings';

const Dashboard = () => {
  const { foods, profiles, activeProfile, switchProfile, addProfile, updateActiveProfile } = useFoodContext();
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'הכל' | 'רגישויות'>('הכל');
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'list' : 'grid';
    }
    return 'grid';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateActiveProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isCreateFoodModalOpen, setIsCreateFoodModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'status-tried' | 'status-untried' | 'completed'>('name-asc');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [diarySortOrder, setDiarySortOrder] = useState<'desc' | 'asc'>('desc');
  const [isDiarySortMenuOpen, setIsDiarySortMenuOpen] = useState(false);
  const [diarySearchQuery, setDiarySearchQuery] = useState('');
  const [diaryDateRange, setDiaryDateRange] = useState<'all' | '7days' | '30days' | 'month'>('all');

  const isAnyModalOpen = !!selectedFoodId || isGuidelinesOpen || isCreateFoodModalOpen;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const categories: (Category | 'הכל' | 'רגישויות')[] = ['הכל', 'ירקות', 'פירות', 'חלבונים', 'אלרגנים', 'דגנים', 'תיבול', 'רגישויות'];

  let filteredFoods = selectedCategory === 'הכל' 
    ? foods 
    : selectedCategory === 'רגישויות'
      ? foods.filter(f => f.status === 'רגישות/תגובה')
      : foods.filter(f => f.category === selectedCategory);

  if (searchQuery.trim()) {
    filteredFoods = filteredFoods.filter(f => f.name.includes(searchQuery.trim()));
  }

  // Sorting logic based on selected order
  filteredFoods = [...filteredFoods].sort((a, b) => {
    switch (sortOrder) {
      case 'name-asc':
        return a.name.localeCompare(b.name, 'he');
      case 'name-desc':
        return b.name.localeCompare(a.name, 'he');
      case 'status-tried': {
        const scoreA = a.status !== 'נעול' ? 0 : 1;
        const scoreB = b.status !== 'נעול' ? 0 : 1;
        return scoreA - scoreB || a.name.localeCompare(b.name, 'he');
      }
      case 'status-untried': {
        const scoreA = a.status === 'נעול' ? 0 : 1;
        const scoreB = b.status === 'נעול' ? 0 : 1;
        return scoreA - scoreB || a.name.localeCompare(b.name, 'he');
      }
      case 'completed': {
        const scoreA = a.status === 'הושלם' ? 0 : 1;
        const scoreB = b.status === 'הושלם' ? 0 : 1;
        return scoreA - scoreB || a.name.localeCompare(b.name, 'he');
      }
      default:
        return 0;
    }
  });

  const completedCount = foods.filter(f => f.status === 'הושלם').length;
  const inProgressCount = foods.filter(f => f.status === 'בתהליך').length;
  
  const currentTip = tipsData[selectedCategory] || tipsData['הכל'];
  const selectedFood = selectedFoodId ? foods.find(f => f.id === selectedFoodId) || null : null;

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      addProfile(newProfileName.trim());
      setNewProfileName('');
      setIsAddingProfile(false);
      setShowProfileMenu(false);
    }
  };

  // Get all history items for calendar view
  let allAttempts = foods.flatMap(food => 
    food.attempts.map(attempt => ({ ...attempt, foodName: food.name, foodIcon: food.icon, foodId: food.id }))
  );

  // Apply diary filters
  if (diarySearchQuery.trim()) {
    allAttempts = allAttempts.filter(a => 
      a.foodName.includes(diarySearchQuery.trim()) || 
      a.reaction.includes(diarySearchQuery.trim()) ||
      a.amount.includes(diarySearchQuery.trim())
    );
  }

  if (diaryDateRange !== 'all') {
    const now = new Date();
    allAttempts = allAttempts.filter(a => {
      const date = new Date(a.date);
      if (diaryDateRange === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return date >= sevenDaysAgo;
      }
      if (diaryDateRange === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return date >= thirtyDaysAgo;
      }
      if (diaryDateRange === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }

  allAttempts = allAttempts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return diarySortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const tabs: ViewTab[] = ['home', 'foods', 'calendar', 'settings'];

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    const currentIndex = tabs.indexOf(activeTab);

    // Swipe left (next tab) in RTL, swipe direction is flipped?
    // Actually info.offset.x > 0 means swiping to the RIGHT.
    // In LTR: Swipe right (offset > 0) usually means "go back" (previous index).
    // In RTL: Swipe right (offset > 0) usually means "go forward" (next index)? 
    // Let's test standard logic first.
    
    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    } else if (info.offset.x < -swipeThreshold && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans pb-32 text-slate-800 antialiased overflow-x-hidden" dir="rtl">
      {/* Dynamic Header based on tab */}
      <header className="max-w-5xl mx-auto pt-8 px-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <h2 className="text-3xl font-serif font-black text-brand-sage tracking-tight">
               {activeTab === 'home' && `היי, ${activeProfile?.name || 'אריאל'}`}
               {activeTab === 'foods' && 'ספריית מזונות'}
               {activeTab === 'calendar' && 'היסטוריית טעימות'}
               {activeTab === 'settings' && 'הגדרות ופרופיל'}
             </h2>
             <p className="text-brand-olive/60 text-xs font-bold uppercase tracking-widest mt-1">
               {activeTab === 'home' && 'בואו נראה מה חדש היום'}
               {activeTab === 'foods' && `מתוך ${foods.length} מזונות במאגר`}
               {activeTab === 'calendar' && `${allAttempts.length} טעימות בוצעו`}
               {activeTab === 'settings' && 'ניהול חשבון ודגשים'}
             </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'foods' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateFoodModalOpen(true)}
                className="w-12 h-12 bg-brand-sage text-white rounded-2xl flex items-center justify-center relative cursor-pointer shadow-sm border border-brand-sage transition-all"
                title="הוספת מאכל חדש"
              >
                <Plus size={22} strokeWidth={2.5} />
              </motion.button>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center relative cursor-pointer overflow-hidden border border-brand-sand shadow-sm"
              onClick={() => setActiveTab('settings')}
            >
              {activeProfile?.avatar ? (
                <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">👶</span>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      <motion.main 
        key={activeTab}
        drag={isAnyModalOpen ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="max-w-5xl mx-auto px-4 pb-4 touch-pan-y"
      >
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Progress Card */}
             <div className="bg-[#E9F3E5] rounded-[3rem] p-8 border border-[#D8E9D2] relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-serif font-bold text-3xl text-brand-sage leading-none mb-3">מסע הטעימות</h3>
                      <p className="text-brand-olive/70 text-sm font-medium">השלמת {completedCount} מזונות עד כה</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-[2rem] flex items-center gap-3 border border-white/50 shadow-sm">
                       <CheckCircle2 className="text-brand-sage" size={24} />
                       <span className="font-bold text-brand-sage text-lg">{Math.round((completedCount/foods.length)*100)}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-5 bg-white/40 rounded-full overflow-hidden border border-white/30 mb-8 backdrop-blur-sm">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(completedCount/foods.length)*100}%` }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="h-full bg-brand-sage rounded-full shadow-[0_0_15px_rgba(74,109,58,0.2)]" 
                     />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {[
                       { label: 'ירקות', icon: '🥦', color: 'bg-green-50', text: 'text-green-700', val: `${foods.filter(f=>f.category==='ירקות' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='ירקות').length}` },
                       { label: 'פירות', icon: '🍎', color: 'bg-red-50', text: 'text-red-700', val: `${foods.filter(f=>f.category==='פירות' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='פירות').length}` },
                       { label: 'אלרגנים', icon: '🥜', color: 'bg-amber-50', text: 'text-amber-700', val: `${foods.filter(f=>f.category==='אלרגנים' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='אלרגנים').length}` },
                       { label: 'חלבונים', icon: '🍗', color: 'bg-blue-50', text: 'text-blue-700', val: `${foods.filter(f=>f.category==='חלבונים' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='חלבונים').length}` },
                     ].map((item, i) => (
                       <div key={i} className="bg-white/50 border border-white/50 rounded-[2rem] p-4 flex flex-col items-center gap-1.5 shadow-sm">
                          <span className="text-2xl mb-1">{item.icon}</span>
                          <span className={`text-[11px] font-black uppercase tracking-tighter ${item.text}`}>{item.label}</span>
                          <span className="text-base font-bold text-brand-olive">{item.val}</span>
                       </div>
                     ))}
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-sage/10 rounded-full blur-3xl opacity-50" />
             </div>

             {/* Recent/Daily Tip */}
             <div className={`${currentTip.bg} rounded-[2.5rem] p-8 border ${currentTip.border} flex flex-col sm:flex-row gap-6 items-center shadow-sm`}>
                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-4xl shadow-sm shrink-0 border border-white/50">{currentTip.icon}</div>
                <div className="flex flex-col text-center sm:text-right">
                  <span className={`text-[10px] font-black ${currentTip.textMain} uppercase tracking-[0.2em] mb-2`}>{currentTip.sub}</span>
                  <h4 className={`font-serif font-bold text-2xl leading-tight ${currentTip.textDark} mb-2`}>{currentTip.title}</h4>
                  <p className={`text-sm leading-relaxed ${currentTip.textMain} font-medium`}>
                    {currentTip.content}
                  </p>
                </div>
             </div>

             {/* Quick Actions / Categories Navigation Shortcuts */}
             <div className="flex flex-col gap-4">
                <h4 className="font-serif font-bold text-xl text-brand-olive px-4">גישה מהירה</h4>
                <div className="grid grid-cols-3 gap-4">
                   {[
                     { label: 'אלרגנים', icon: '⚠️', cat: 'אלרגנים', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600' },
                     { label: 'רגישויות', icon: '🔍', cat: 'רגישויות', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
                     { label: 'כל המזונות', icon: '📖', cat: 'הכל', bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-600' },
                   ].map((action, i) => (
                     <motion.button 
                       key={i}
                       whileHover={{ y: -4 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => { setSelectedCategory(action.cat as any); setActiveTab('foods'); }}
                       className={`${action.bg} border ${action.border} p-5 rounded-[2.5rem] flex flex-col items-center gap-3 shadow-sm transition-all`}
                     >
                       <span className="text-3xl">{action.icon}</span>
                       <span className={`text-xs font-black uppercase tracking-wider ${action.text}`}>{action.label}</span>
                     </motion.button>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* FOODS VIEW */}
        {activeTab === 'foods' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search & Categories Fixed at top of scroll or as header section */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-olive/40" />
                  <input
                    type="text"
                    placeholder="חיפוש מזון..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-brand-sand rounded-[1.5rem] pr-12 pl-5 py-4 text-base font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage/30 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-brand-sand shadow-sm gap-1">
                  <div className="relative">
                    <button 
                      onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                      className={`p-2.5 rounded-xl transition-all ${isSortMenuOpen ? 'bg-brand-sage text-white shadow-md' : 'text-slate-400 hover:text-brand-sage hover:bg-brand-sand/30'}`}
                      title="סינון ומיון"
                    >
                      <ListFilter size={20} />
                    </button>

                    <AnimatePresence>
                      {isSortMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-brand-sand z-50 p-1.5 overflow-hidden"
                          >
                            {[
                              { id: 'name-asc', label: 'א-ת (אלפבית נורמלי)', icon: 'AZ' },
                              { id: 'name-desc', label: 'ת-א (אלפבית הפוך)', icon: 'ZA' },
                              { id: 'status-tried', label: 'נוסה תחילה', icon: '✔' },
                              { id: 'status-untried', label: 'טרם נוסה תחילה', icon: '❓' },
                              { id: 'completed', label: 'הושלם תחילה', icon: '🏆' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setSortOrder(opt.id as any);
                                  setIsSortMenuOpen(false);
                                }}
                                className={`w-full text-right px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-between ${
                                  sortOrder === opt.id ? 'bg-brand-cream text-brand-sage' : 'text-slate-600 hover:bg-brand-cream'
                                }`}
                              >
                                <span>{opt.label}</span>
                                <span className="opacity-40">{opt.icon}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="w-px h-6 bg-brand-sand self-center mx-1" />

                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-brand-sage text-white shadow-md' : 'text-slate-400 hover:text-brand-sage hover:bg-brand-sand/30'}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-brand-sage text-white shadow-md' : 'text-slate-400 hover:text-brand-sage hover:bg-brand-sand/30'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar shrink-0 snap-x">
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-8 py-3 rounded-[1.25rem] text-xs font-black transition-all border snap-start uppercase tracking-widest ${
                      selectedCategory === cat 
                        ? (cat === 'רגישויות' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200 scale-105' : 'bg-brand-sage text-white border-brand-sage shadow-lg shadow-brand-sage/20 scale-105') 
                        : (cat === 'רגישויות' ? 'bg-white text-rose-500 border-rose-100 hover:bg-rose-50' : 'bg-white text-slate-400 border-brand-sand hover:bg-brand-sand/50')
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              {filteredFoods.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFoods.map(food => (
                      <FoodCard key={food.id} food={food} onClick={() => setSelectedFoodId(food.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredFoods.map(food => (
                      <FoodListItem key={food.id} food={food} onClick={() => setSelectedFoodId(food.id)} />
                    ))}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <div className="w-20 h-20 bg-white border border-brand-sand/50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Search size={32} strokeWidth={1.5} className="text-slate-200" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">לא מצאתם את המאכל?</h2>
                  <p className="text-sm text-slate-400 mt-1 mb-8">תוכלו להוסיף אותו ידנית ולעקוב אחריו</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreateFoodModalOpen(true)}
                    className="flex items-center gap-3 bg-brand-sage text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-sage/20 transition-all"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                    הוספת מאכל חדש
                  </motion.button>
                </div>
              )}
            </div>
            
            {/* Quick Add Button at bottom of foods list when scrolling */}
            {filteredFoods.length > 0 && (
              <div className="flex justify-center mt-4 mb-20 lg:mb-4">
                <button 
                  onClick={() => setIsCreateFoodModalOpen(true)}
                  className="flex items-center gap-2 text-brand-sage font-bold py-3 px-6 rounded-2xl border-2 border-dashed border-brand-sage/30 hover:border-brand-sage/60 hover:bg-brand-sage/5 transition-all text-sm"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  לא מצאתם מה שחיפשתם? הוסיפו ידנית
                </button>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CalendarView 
              attempts={allAttempts} 
              selectedDate={selectedCalendarDate} 
              onDateSelect={setSelectedCalendarDate} 
            />

            {/* Search & Filter for Diary */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive/40" />
                <input
                  type="text"
                  placeholder="חיפוש ביומן (שם מאכל, תגובה...)"
                  value={diarySearchQuery}
                  onChange={(e) => setDiarySearchQuery(e.target.value)}
                  className="w-full bg-white border border-brand-sand rounded-2xl pr-10 pl-4 py-3 text-base font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage/30 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'all', label: 'כל הזמן' },
                  { id: '7days', label: '7 ימים אחרונים' },
                  { id: '30days', label: '30 ימים אחרונים' },
                  { id: 'month', label: 'החודש הנוכחי' },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setDiaryDateRange(range.id as any)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${
                      diaryDateRange === range.id 
                        ? 'bg-brand-sage text-white border-brand-sage shadow-md' 
                        : 'bg-white text-slate-400 border-brand-sand hover:bg-brand-sand/30'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {allAttempts.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-slate-500">
                      {selectedCalendarDate 
                        ? `טעימות מהתאריך ${selectedCalendarDate.toLocaleDateString('he-IL')}`
                        : 'כל הטעימות האחרונות'}
                    </h4>
                    <div className="relative">
                      <button 
                        onClick={() => setIsDiarySortMenuOpen(!isDiarySortMenuOpen)}
                        className={`p-1.5 rounded-lg transition-all ${isDiarySortMenuOpen ? 'bg-brand-sage text-white' : 'text-slate-400 hover:bg-brand-sand/30'}`}
                      >
                        <ListFilter size={16} />
                      </button>
                      <AnimatePresence>
                        {isDiarySortMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDiarySortMenuOpen(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 5, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-brand-sand z-50 p-1 overflow-hidden"
                            >
                              <button
                                onClick={() => { setDiarySortOrder('desc'); setIsDiarySortMenuOpen(false); }}
                                className={`w-full text-right px-3 py-2 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-between ${
                                  diarySortOrder === 'desc' ? 'bg-brand-cream text-brand-sage' : 'text-slate-600 hover:bg-brand-cream'
                                }`}
                              >
                                <span>הכי חדש תחילה</span>
                                {diarySortOrder === 'desc' && <div className="w-1.5 h-1.5 rounded-full bg-brand-sage" />}
                              </button>
                              <button
                                onClick={() => { setDiarySortOrder('asc'); setIsDiarySortMenuOpen(false); }}
                                className={`w-full text-right px-3 py-2 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-between ${
                                  diarySortOrder === 'asc' ? 'bg-brand-cream text-brand-sage' : 'text-slate-600 hover:bg-brand-cream'
                                }`}
                              >
                                <span>הכי ישן תחילה</span>
                                {diarySortOrder === 'asc' && <div className="w-1.5 h-1.5 rounded-full bg-brand-sage" />}
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {selectedCalendarDate && (
                    <button 
                      onClick={() => setSelectedCalendarDate(null)}
                      className="text-[10px] font-black text-brand-sage uppercase tracking-widest bg-brand-sage/5 px-2 py-1 rounded-lg"
                    >
                      ביטול סינון
                    </button>
                  )}
                </div>
                
                {allAttempts
                  .filter(a => !selectedCalendarDate || isSameDay(parseISO(a.date), selectedCalendarDate))
                  .map((attempt, idx) => (
                  <div key={idx} className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden cursor-pointer active:scale-98 transition-all" onClick={() => setSelectedFoodId(attempt.foodId)}>
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                      {attempt.foodIcon}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[#2D2D2D] truncate">{attempt.foodName}</span>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(attempt.date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                          attempt.reaction === 'אהב/ה' ? 'bg-green-50 text-green-600' :
                          attempt.reaction === 'תגובה אלרגית' ? 'bg-red-50 text-red-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {attempt.reaction}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-500">{attempt.amount}</span>
                      </div>
                    </div>
                    <div className={`absolute right-0 top-0 bottom-0 w-1 ${
                       attempt.reaction === 'אהב/ה' ? 'bg-green-400' :
                       attempt.reaction === 'תגובה אלרגית' ? 'bg-red-400' :
                       'bg-orange-400'
                    }`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon size={32} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold">היומן עדיין ריק</h2>
                  <p className="text-sm">התחילו להוסיף טעימות כדי לראות אותן כאן</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Profile Section */}
             <div className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-5 mb-8">
                  <div 
                    className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center relative group cursor-pointer overflow-hidden border border-orange-100 shadow-inner shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {activeProfile?.avatar ? (
                      <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-orange-200">👶</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-[#2D2D2D] mb-1">הפרופיל של {activeProfile?.name}</h3>
                    <div className="flex flex-wrap gap-2">
                       <button onClick={() => setIsGuidelinesOpen(true)} className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1.5 active:scale-95 transition-all">
                          <Info size={12} /> דגשים ובטיחות
                       </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">החלפת פרופיל</span>
                  <div className="flex flex-col gap-2">
                    {profiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => switchProfile(p.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          p.id === activeProfile?.id 
                            ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' 
                            : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-200'
                        }`}
                      >
                        <span className="font-bold">{p.name}</span>
                        {p.id === activeProfile?.id && <CheckCircle2 size={18} />}
                      </button>
                    ))}
                    
                    {isAddingProfile ? (
                      <form onSubmit={handleAddProfile} className="bg-white border-2 border-dashed border-orange-200 p-4 rounded-2xl flex flex-col gap-3 mt-1">
                        <input
                          autoFocus
                          type="text"
                          placeholder="שם התינוק..."
                          value={newProfileName}
                          onChange={e => setNewProfileName(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-xl p-3 text-base font-bold focus:ring-2 focus:ring-orange-100 outline-none"
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-[#FF9F66] text-white py-3 rounded-xl font-bold active:scale-95 transition-all">הוספה</button>
                          <button type="button" onClick={() => setIsAddingProfile(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold active:scale-95 transition-all">ביטול</button>
                        </div>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setIsAddingProfile(true)}
                        className="flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-orange-400 hover:border-orange-200 transition-all gap-2"
                      >
                        <UserPlus size={18} />
                        <span className="font-bold">הוספת פרופיל נוסף</span>
                      </button>
                    )}
                  </div>
                </div>
             </div>

             {/* App Info / Version */}
             <div className="text-center opacity-30 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D2D2D]">My First Bite v1.2</p>
                <p className="text-[10px] font-bold text-[#2D2D2D] mt-1">נעשה באהבה להורים טריים</p>
             </div>
          </div>
        )}
      </motion.main>

      {/* Modern Bottom Navbar Redesigned */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-md bg-slate-900 border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-full p-1.5 flex items-center justify-between z-[100]">
        {[
          { id: 'home', icon: Home, label: 'בית' },
          { id: 'foods', icon: Utensils, label: 'מזונות' },
          { id: 'calendar', icon: CalendarIcon, label: 'יומן' },
          { id: 'settings', icon: Settings, label: 'פרופיל' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ViewTab)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-full transition-all relative group ${
              activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'
            }`}
          >
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-1 transition-all uppercase tracking-tight ${
              activeTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-0 scale-50 translate-y-2'
            }`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-active"
                className="absolute inset-0 bg-white/10 -z-10 rounded-full"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {selectedFood && (
          <FoodModal 
            food={selectedFood} 
            onClose={() => setSelectedFoodId(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGuidelinesOpen && (
          <GuidelinesModal 
            onClose={() => setIsGuidelinesOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateFoodModalOpen && (
          <CreateFoodModal 
            onClose={() => setIsCreateFoodModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <FoodProvider>
      <Dashboard />
    </FoodProvider>
  );
}

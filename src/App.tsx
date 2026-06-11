import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodProvider, useFoodContext } from './context';
import { Category } from './types';
import { FoodModal } from './components/FoodModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { CreateFoodModal } from './components/CreateFoodModal';
import { CalendarView } from './components/CalendarView';
import { HomeView } from './components/HomeView';
import { FoodsView } from './components/FoodsView';
import { SettingsView } from './components/SettingsView';
import { isSameDay, parseISO } from 'date-fns';
import { getBabyAge } from './utils/babyUtils';
import { Search, X, Home, Utensils, Calendar as CalendarIcon, Settings, ChevronLeft, Plus, ListFilter } from 'lucide-react';

type ViewTab = 'home' | 'foods' | 'calendar' | 'settings';

const Dashboard = () => {
  const { foods, activeProfile } = useFoodContext();
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'הכל' | 'רגישויות'>('הכל');
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'list' : 'grid';
    }
    return 'grid';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isCreateFoodModalOpen, setIsCreateFoodModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'recommended' | 'name-asc' | 'name-desc' | 'status-tried' | 'status-untried' | 'completed'>('recommended');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [diarySortOrder, setDiarySortOrder] = useState<'desc' | 'asc'>('desc');
  const [isDiarySortMenuOpen, setIsDiarySortMenuOpen] = useState(false);
  const [diarySearchQuery, setDiarySearchQuery] = useState('');
  const [diaryDateRange, setDiaryDateRange] = useState<'all' | '7days' | '30days' | 'month'>('all');
  const [progressListType, setProgressListType] = useState<'הושלם' | 'בתהליך' | null>(null);
  const [progressListCategory, setProgressListCategory] = useState<Category | null>(null);

  const isAnyModalOpen = !!selectedFoodId || isGuidelinesOpen || isCreateFoodModalOpen || !!progressListType;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  const selectedFood = selectedFoodId ? foods.find(f => f.id === selectedFoodId) || null : null;

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
    
    if (info.offset.x > swipeThreshold && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (info.offset.x < -swipeThreshold && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans pb-32 text-brand-olive antialiased overflow-x-hidden" dir="rtl">
      {/* Dynamic Header based on tab */}
      <header className="max-w-5xl mx-auto pt-8 px-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <h2 className="text-2xl font-serif font-bold text-brand-sage tracking-tight">
               {activeTab === 'home' && `היי, ${activeProfile?.name || 'אריאל'}`}
               {activeTab === 'foods' && 'ספריית מזונות'}
               {activeTab === 'calendar' && 'היסטוריית טעימות'}
               {activeTab === 'settings' && 'הגדרות ופרופיל'}
             </h2>
             <p className="text-brand-olive/50 text-[10px] font-bold uppercase tracking-wider mt-0.5">
               {activeTab === 'home' && (getBabyAge(activeProfile?.birthDate) ? `${getBabyAge(activeProfile.birthDate)} • בואו נראה מה חדש` : 'בואו נראה מה חדש היום')}
               {activeTab === 'foods' && `מתוך ${foods.length} מזונות במאגר`}
               {activeTab === 'calendar' && `${allAttempts.length} טעימות בוצעו`}
               {activeTab === 'settings' && 'ניהול חשבון ודגשים'}
             </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'foods' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateFoodModalOpen(true)}
                className="w-10 h-10 bg-brand-sage text-white rounded-lg flex items-center justify-center relative cursor-pointer shadow-soft border border-brand-sage transition-all"
                title="הוספת מאכל חדש"
              >
                <Plus size={18} strokeWidth={2.5} />
              </motion.button>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative cursor-pointer overflow-hidden border border-brand-sand/50 shadow-soft"
              onClick={() => setActiveTab('settings')}
            >
              {activeProfile?.avatar ? (
                <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">👶</span>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      <motion.main 
        key={activeTab}
        drag={isAnyModalOpen ? false : "x"}
        dragListener={!isAnyModalOpen}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className={`max-w-5xl mx-auto px-4 pb-4 touch-pan-y ${isAnyModalOpen ? 'pointer-events-none' : ''}`}
      >
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <HomeView
            setSelectedCategory={setSelectedCategory}
            setActiveTab={setActiveTab}
            setProgressListType={setProgressListType}
            setProgressListCategory={setProgressListCategory}
            setSelectedFoodId={setSelectedFoodId}
          />
        )}

        {/* FOODS VIEW */}
        {activeTab === 'foods' && (
          <FoodsView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedFoodId={setSelectedFoodId}
            setIsCreateFoodModalOpen={setIsCreateFoodModalOpen}
          />
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
                  className="w-full bg-white border border-brand-sand rounded-lg pr-10 pl-4 py-3 text-sm font-semibold text-brand-olive shadow-soft focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage/30 outline-none transition-all placeholder:text-slate-300"
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
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all border uppercase tracking-wider ${
                      diaryDateRange === range.id 
                        ? 'bg-brand-sage text-white border-brand-sage shadow-soft' 
                        : 'bg-white text-brand-olive/50 border-brand-sand/40 hover:bg-brand-cream'
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
                    <h4 className="text-xs font-bold text-brand-olive/40">
                      {selectedCalendarDate 
                        ? `טעימות מהתאריך ${selectedCalendarDate.toLocaleDateString('he-IL')}`
                        : 'כל הטעימות האחרונות'}
                    </h4>
                    <div className="relative">
                      <button 
                        onClick={() => setIsDiarySortMenuOpen(!isDiarySortMenuOpen)}
                        className={`p-1.5 rounded transition-all ${isDiarySortMenuOpen ? 'bg-brand-sage text-white shadow-soft' : 'text-brand-olive/40 hover:bg-brand-cream'}`}
                      >
                        <ListFilter size={16} />
                      </button>
                      <AnimatePresence>
                        {isDiarySortMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDiarySortMenuOpen(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 5, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.98 }}
                              className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-brand-sand z-50 p-1 overflow-hidden"
                            >
                              <button
                                onClick={() => { setDiarySortOrder('desc'); setIsDiarySortMenuOpen(false); }}
                                className={`w-full text-right px-3 py-2 text-xs font-bold rounded transition-colors flex items-center justify-between ${
                                  diarySortOrder === 'desc' ? 'bg-brand-cream text-brand-sage' : 'text-brand-olive/60 hover:bg-brand-cream'
                                }`}
                              >
                                <span>הכי חדש תחילה</span>
                                {diarySortOrder === 'desc' && <div className="w-1.5 h-1.5 rounded-full bg-brand-sage" />}
                              </button>
                              <button
                                onClick={() => { setDiarySortOrder('asc'); setIsDiarySortMenuOpen(false); }}
                                className={`w-full text-right px-3 py-2 text-xs font-bold rounded transition-colors flex items-center justify-between ${
                                  diarySortOrder === 'asc' ? 'bg-brand-cream text-brand-sage' : 'text-brand-olive/60 hover:bg-brand-cream'
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
                      className="text-xs font-bold text-brand-sage uppercase tracking-wider bg-brand-cream border border-brand-sand/50 px-2 py-1 rounded-lg"
                    >
                      ביטול סינון
                    </button>
                  )}
                </div>
                
                {allAttempts
                  .filter(a => !selectedCalendarDate || isSameDay(parseISO(a.date), selectedCalendarDate))
                  .map((attempt, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-brand-sand/30 shadow-soft flex items-center gap-4 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all" onClick={() => setSelectedFoodId(attempt.foodId)}>
                    <div className="w-12 h-12 bg-brand-cream/50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                      {attempt.foodIcon}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-brand-olive truncate text-sm">{attempt.foodName}</span>
                        <span className="text-[10px] font-bold text-brand-olive/30">{new Date(attempt.date).toLocaleDateString('he-IL')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          attempt.reaction === 'אהב/ה' ? 'bg-brand-on-primary-container text-brand-sage' :
                          attempt.reaction === 'תגובה אלרגית' ? 'bg-brand-blush/30 text-brand-olive' :
                          'bg-brand-sand text-brand-olive/50'
                        }`}>
                          {attempt.reaction}
                        </span>
                        <span className="text-[10px] font-bold text-brand-olive/50">{attempt.amount}</span>
                        {attempt.photo && (
                          <>
                            <span className="text-brand-sand">•</span>
                            <span className="text-[10px] font-bold text-brand-sage" title="יש תמונה">
                              📸
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`absolute right-0 top-0 bottom-0 w-1 ${
                       attempt.reaction === 'אהב/ה' ? 'bg-brand-sage' :
                       attempt.reaction === 'תגובה אלרגית' ? 'bg-brand-blush' :
                       'bg-brand-sand'
                    }`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                 <div className="w-16 h-16 bg-white border border-brand-sand/50 rounded-xl flex items-center justify-center mb-4 shadow-soft">
                    <CalendarIcon size={24} strokeWidth={1.5} className="text-slate-200" />
                  </div>
                  <h2 className="text-lg font-serif font-bold text-brand-olive">היומן עדיין ריק</h2>
                  <p className="text-xs text-brand-olive/40 mt-1">התחילו להוסיף טעימות כדי לראות אותן כאן</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <SettingsView
            setIsGuidelinesOpen={setIsGuidelinesOpen}
          />
        )}
      </motion.main>

      {/* Modern Bottom Navbar Redesigned to Stitch Light-Mode Brand Style */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-md bg-white/95 backdrop-blur-md border border-brand-sand/60 shadow-[0_8px_30px_rgba(62,62,62,0.08)] rounded-full p-1.5 flex items-center justify-between z-[100]">
        {[
          { id: 'home', icon: Home, label: 'בית' },
          { id: 'foods', icon: Utensils, label: 'מזונות' },
          { id: 'calendar', icon: CalendarIcon, label: 'יומן' },
          { id: 'settings', icon: Settings, label: 'פרופיל' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ViewTab)}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-full transition-all relative group ${
              activeTab === tab.id ? 'text-brand-sage font-bold' : 'text-brand-olive/40 hover:text-brand-sage'
            }`}
          >
            <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className={`text-[10px] font-bold mt-0.5 transition-all uppercase tracking-wider ${
              activeTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-0 scale-50 translate-y-1'
            }`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-active"
                className="absolute inset-0 bg-brand-cream/80 border border-brand-sand/30 -z-10 rounded-full"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
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

      <AnimatePresence>
        {progressListType && (
          <div 
            className="fixed inset-0 z-[150] flex items-center justify-center bg-brand-olive/30 backdrop-blur-sm overflow-x-hidden overflow-y-auto overscroll-none animate-in fade-in duration-300"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setProgressListType(null);
                setProgressListCategory(null);
              }
            }}
            dir="rtl"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 5 }}
              className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col max-h-[75vh] relative z-10 overflow-hidden border border-brand-sand/50 m-4 touch-pan-y"
            >
              <div className="px-5 py-3.5 flex justify-between items-center bg-white border-b border-brand-sand/40 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-cream rounded-lg flex items-center justify-center text-lg shadow-soft border border-brand-sand/30">
                    {progressListCategory 
                      ? (progressListCategory === 'ירקות' ? '🥦' : progressListCategory === 'פירות' ? '🍎' : progressListCategory === 'אלרגנים' ? '🥜' : '🍗')
                      : (progressListType === 'הושלם' ? '🏆' : '⏳')
                    }
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-brand-olive leading-none mb-1">
                      {progressListCategory ? `הושלם: ${progressListCategory}` : (progressListType === 'הושלם' ? 'מזונות שהושלמו' : 'מזונות בתהליך')}
                    </h3>
                    <p className="text-[10px] font-bold text-brand-olive/40 tracking-wider uppercase">
                      {foods.filter(f => f.status === progressListType && (!progressListCategory || f.category === progressListCategory)).length} מזונות ברשימה
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setProgressListType(null);
                    setProgressListCategory(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-brand-olive/40 hover:text-brand-olive transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {foods.filter(f => f.status === progressListType && (!progressListCategory || f.category === progressListCategory)).length > 0 ? (
                    foods.filter(f => f.status === progressListType && (!progressListCategory || f.category === progressListCategory)).map(food => (
                      <div 
                        key={food.id}
                        onClick={() => {
                          setSelectedFoodId(food.id);
                          setProgressListType(null);
                          setProgressListCategory(null);
                        }}
                        className="bg-brand-cream/20 rounded-lg p-3 border border-brand-sand/40 shadow-soft flex items-center gap-3 hover:border-brand-sage/40 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg border border-brand-sand/50 flex items-center justify-center text-xl shrink-0">
                          {food.icon}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-serif font-bold text-brand-olive text-sm leading-tight">{food.name}</span>
                          <span className="text-[9px] font-bold text-brand-olive/40 uppercase tracking-wider">{food.category}</span>
                        </div>
                        <ChevronLeft size={14} className="text-brand-sage" />
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                       <span className="text-4xl mb-3">🍃</span>
                       <p className="font-bold text-xs text-brand-olive">אין פריטים ברשימה זו עדיין</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <FoodProvider { ...{} }>
      <Dashboard />
    </FoodProvider>
  );
}

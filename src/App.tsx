import React, { useState, useRef } from 'react';
import { FoodProvider, useFoodContext } from './context';
import { tipsData } from './data';
import { Category, FoodItem } from './types';
import { FoodCard } from './components/FoodCard';
import { FoodModal } from './components/FoodModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { Baby, Info, ChevronDown, UserPlus, Search, X, Camera } from 'lucide-react';

const Dashboard = () => {
  const { foods, profiles, activeProfile, switchProfile, addProfile, updateActiveProfile } = useFoodContext();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'הכל' | 'רגישויות'>('הכל');
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isAddingProfile, setIsAddingProfile] = useState(false);
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

  const categories: (Category | 'הכל' | 'רגישויות')[] = ['הכל', 'ירקות', 'פירות', 'חלבונים', 'אלרגנים', 'דגנים', 'תיבול', 'רגישויות'];

  let filteredFoods = selectedCategory === 'הכל' 
    ? foods 
    : selectedCategory === 'רגישויות'
      ? foods.filter(f => f.status === 'רגישות/תגובה')
      : foods.filter(f => f.category === selectedCategory);

  if (searchQuery.trim()) {
    filteredFoods = filteredFoods.filter(f => f.name.includes(searchQuery.trim()));
  }

  // מיון מזונות לפי השלב המומלץ
  filteredFoods = [...filteredFoods].sort((a, b) => {
    const phaseA = a.recommendedPhase || 99;
    const phaseB = b.recommendedPhase || 99;
    return phaseA - phaseB;
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

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans pb-20 text-[#3C3C3C]" dir="rtl">
      <header className="max-w-5xl mx-auto mt-6 px-4">
        <div className="flex items-center justify-between bg-white rounded-3xl p-4 sm:px-8 shadow-sm border border-[#EBE6DD]">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center relative group cursor-pointer overflow-hidden border border-orange-200 shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="החלף תמונה"
            >
              {activeProfile?.avatar ? (
                <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🍼</span>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={20} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="text-xl sm:text-2xl font-bold text-[#2D2D2D] flex items-center gap-1 hover:text-gray-600 transition-colors"
                >
                  היומן של {activeProfile?.name || 'אריאל'}
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                <button 
                  onClick={() => setIsGuidelinesOpen(true)}
                  className="p-1.5 sm:p-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                  title="דגשים ובטיחות"
                >
                  <Info size={18} />
                </button>
              </div>
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                   <div className="p-2 flex flex-col gap-1">
                     {profiles.map(p => (
                       <button
                         key={p.id}
                         onClick={() => { switchProfile(p.id); setShowProfileMenu(false); }}
                         className={`text-right w-full px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
                           p.id === activeProfile?.id ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                         }`}
                       >
                         {p.name}
                       </button>
                     ))}
                   </div>
                   <div className="border-t border-gray-100 p-2">
                     {isAddingProfile ? (
                       <form onSubmit={handleAddProfile} className="flex flex-col gap-2 p-2">
                          <input
                            autoFocus
                            type="text"
                            placeholder="שם התינוק"
                            value={newProfileName}
                            onChange={e => setNewProfileName(e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 p-2"
                          />
                          <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-orange-100 text-orange-700 text-xs font-bold py-1.5 rounded-lg active:scale-95 transition-all">שמור</button>
                            <button type="button" onClick={() => setIsAddingProfile(false)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-1.5 rounded-lg active:scale-95 transition-all">ביטול</button>
                          </div>
                       </form>
                     ) : (
                       <button
                         onClick={() => setIsAddingProfile(true)}
                         className="w-full text-right px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl flex items-center gap-2"
                       >
                         <UserPlus size={16} /> תאום / אח נוסף
                       </button>
                     )}
                   </div>
                </div>
              )}
              <p className="text-gray-500 text-xs sm:text-sm font-medium">עוקבים באהבה אחרי כל ביס</p>
            </div>
          </div>
          <div className="hidden flex-row gap-6 items-center sm:flex">
            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">התקדמות כללית</span>
              <div className="flex items-center gap-2" dir="ltr">
                <span className="text-sm font-bold">{completedCount}/{foods.length}</span>
                <div className="w-24 md:w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-400 h-full transition-all duration-500" style={{ width: `${(completedCount / foods.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 flex-1">
          
          {/* Summary Stats */}
          <div className="md:col-span-5 lg:col-span-3 bg-[#E1F0DA] rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between border border-[#CCE2C2] order-2 lg:order-1 lg:row-span-2">
            <h3 className="font-bold text-xl leading-tight text-[#2D2D2D] mb-4">סיכום<br/>חשיפה</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70 text-[#2D2D2D] font-medium">ירקות</span>
                <span className="font-bold text-[#2D2D2D]">{foods.filter(f=>f.category==='ירקות' && f.status === 'הושלם').length}/{foods.filter(f=>f.category==='ירקות').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70 text-[#2D2D2D] font-medium">פירות</span>
                <span className="font-bold text-[#2D2D2D]">{foods.filter(f=>f.category==='פירות' && f.status === 'הושלם').length}/{foods.filter(f=>f.category==='פירות').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70 text-[#2D2D2D] font-medium">אלרגנים</span>
                <span className="font-bold text-[#2D2D2D]">{foods.filter(f=>f.category==='אלרגנים' && f.status === 'הושלם').length}/{foods.filter(f=>f.category==='אלרגנים').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70 text-[#2D2D2D] font-medium">חלבונים</span>
                <span className="font-bold text-[#2D2D2D]">{foods.filter(f=>f.category==='חלבונים' && f.status === 'הושלם').length}/{foods.filter(f=>f.category==='חלבונים').length}</span>
              </div>
            </div>
            {foods.some(f => f.status === 'רגישות/תגובה') && (
              <div className="mt-5 pt-4 border-t border-[#CCE2C2] flex gap-2">
                <span className="bg-red-100 text-red-600 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg">זוהתה רגישות</span>
              </div>
            )}
          </div>

          {/* Food Library - Main Area */}
          <div className="md:col-span-12 lg:col-span-6 bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-[#EBE6DD] flex flex-col order-1 lg:order-2 lg:row-span-3 min-h-[450px] max-h-[75vh] lg:max-h-[85vh]">
            <div className="flex flex-col mb-6 gap-4 shrink-0">
              <div className="flex justify-between items-center w-full min-h-[40px]">
                {isSearchOpen ? (
                  <div className="flex items-center gap-2 w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <Search size={18} className="text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="חיפוש מזון..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-800"
                    />
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
                       <X size={18} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg sm:text-xl text-[#2D2D2D]">ספריית מזונות</h3>
                    <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 rounded-full transition-colors border border-transparent hover:border-orange-100 flex items-center justify-center">
                      <Search size={18} />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 no-scrollbar shrink-0 snap-x" style={{ scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all border snap-start ${
                      selectedCategory === cat 
                        ? (cat === 'רגישויות' ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' : 'bg-gray-100 text-gray-800 border-gray-200 shadow-sm') 
                        : (cat === 'רגישויות' ? 'bg-white text-red-400 border-red-100 hover:bg-red-50' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50')
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto no-scrollbar flex-1 pr-1" style={{ scrollbarWidth: 'none' }}>
              {filteredFoods.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filteredFoods.map(food => (
                    <FoodCard key={food.id} food={food} onClick={() => setSelectedFoodId(food.id)} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 h-full text-gray-400">
                  <Info size={40} className="mb-3 opacity-50" />
                  <h2 className="text-lg font-bold">לא נמצאו מאכלים</h2>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className={`md:col-span-7 lg:col-span-3 ${currentTip.bg} rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between border ${currentTip.border} order-3 lg:row-span-2 transition-all duration-300`}>
            <div>
              <span className={`text-[10px] font-bold ${currentTip.textMain} uppercase tracking-widest block mb-2`}>{currentTip.sub}</span>
              <h4 className={`font-bold text-xl leading-tight ${currentTip.textDark} mb-1`}>{currentTip.title}</h4>
            </div>
            <div className="flex items-center justify-between gap-3 mt-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">{currentTip.icon}</div>
              <p className={`text-xs sm:text-sm leading-snug ${currentTip.textMain} font-medium`}>
                {currentTip.content}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="col-span-1 md:col-span-12 lg:col-span-6 bg-[#F2EFE5] rounded-[2rem] p-5 flex flex-wrap items-center justify-around border border-[#E5E2D8] order-4 gap-4">
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase">סה״כ טעימות</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{foods.reduce((acc, f) => acc + f.attempts.length, 0)}</p>
            </div>
            <div className="w-[1px] h-10 bg-[#D5D2C8] hidden sm:block"></div>
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase">במעקב פעיל</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{inProgressCount}</p>
            </div>
            <div className="w-[1px] h-10 bg-[#D5D2C8] hidden md:block"></div>
            <div className="text-center flex-1 w-full md:w-auto">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase">מזונות הושלמו</p>
              <p className="text-2xl font-bold text-[#2D2D2D]">{completedCount}</p>
            </div>
          </div>

        </div>
      </main>

      {selectedFood && (
        <FoodModal 
          food={selectedFood} 
          onClose={() => setSelectedFoodId(null)} 
        />
      )}

      <GuidelinesModal 
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />
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

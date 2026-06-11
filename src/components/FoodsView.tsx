import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFoodContext } from '../context';
import { Category } from '../types';
import { getBabyAge, getRecommendedPhaseInfo } from '../utils/babyUtils';
import { FoodCard } from './FoodCard';
import { FoodListItem } from './FoodListItem';
import { Baby, Search, ListFilter, LayoutGrid, List, Plus } from 'lucide-react';
import { initialFoods } from '../data';

interface FoodsViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'recommended' | 'name-asc' | 'name-desc' | 'status-tried' | 'status-untried' | 'completed';
  setSortOrder: (order: 'recommended' | 'name-asc' | 'name-desc' | 'status-tried' | 'status-untried' | 'completed') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedCategory: Category | 'הכל' | 'רגישויות';
  setSelectedCategory: (category: Category | 'הכל' | 'רגישויות') => void;
  setSelectedFoodId: (id: string | null) => void;
  setIsCreateFoodModalOpen: (open: boolean) => void;
}

export const FoodsView: React.FC<FoodsViewProps> = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory,
  setSelectedFoodId,
  setIsCreateFoodModalOpen,
}) => {
  const { foods, activeProfile } = useFoodContext();
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

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
      case 'recommended': {
        const indexA = initialFoods.findIndex(f => f.id === a.id);
        const indexB = initialFoods.findIndex(f => f.id === b.id);
        const valA = indexA === -1 ? 9999 : indexA;
        const valB = indexB === -1 ? 9999 : indexB;
        return valA - valB;
      }
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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {activeProfile?.birthDate && (
        <div className="bg-white border border-brand-sand/50 rounded-xl p-4.5 flex gap-4 items-start relative overflow-hidden shadow-soft">
          <div className="absolute top-0 right-0 w-1 h-full bg-brand-sage"></div>
          <div className="bg-brand-cream p-2 rounded-lg border border-brand-sand/30 shadow-soft shrink-0 text-brand-sage">
            <Baby size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="font-bold text-brand-sage text-sm">המלצה לגיל {getBabyAge(activeProfile.birthDate)}</h4>
            <p className="text-brand-olive/70 text-xs leading-relaxed font-semibold">
              {getRecommendedPhaseInfo(activeProfile.birthDate).text}
            </p>
          </div>
        </div>
      )}
      
      {/* Search & Categories */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive/40" />
            <input
              type="text"
              placeholder="חיפוש מזון..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-sand/60 rounded-lg pr-10 pl-4 py-3 text-sm font-semibold text-brand-olive shadow-soft focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage/30 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex bg-white p-1 rounded-lg border border-brand-sand/40 shadow-soft gap-1">
            <div className="relative">
              <button 
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded transition-all ${isSortMenuOpen ? 'bg-brand-sage text-white shadow-soft' : 'text-brand-olive/50 hover:text-brand-sage hover:bg-brand-cream'}`}
                title="סינון ומיון"
              >
                <ListFilter size={16} />
                <span className="text-[11px] font-bold select-none">
                  {sortOrder === 'recommended' && 'מומלץ'}
                  {sortOrder === 'name-asc' && 'א-ת'}
                  {sortOrder === 'name-desc' && 'ת-א'}
                  {sortOrder === 'status-tried' && 'נוסה'}
                  {sortOrder === 'status-untried' && 'טרם נוסה'}
                  {sortOrder === 'completed' && 'הושלם'}
                </span>
              </button>

              <AnimatePresence>
                {isSortMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-brand-sand z-50 p-1 overflow-hidden"
                    >
                      {[
                        { id: 'recommended', label: 'סדר מומלץ (ברירת מחדל)', icon: '⭐' },
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
                          className={`w-full text-right px-3 py-2 text-xs font-bold rounded transition-colors flex items-center justify-between ${
                            sortOrder === opt.id ? 'bg-brand-cream text-brand-sage' : 'text-brand-olive/60 hover:bg-brand-cream'
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

            <div className="w-px h-5 bg-brand-sand self-center mx-0.5" />

            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded transition-all ${viewMode === 'grid' ? 'bg-brand-sage text-white shadow-soft' : 'text-brand-olive/40 hover:text-brand-sage hover:bg-brand-cream'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded transition-all ${viewMode === 'list' ? 'bg-brand-sage text-white shadow-soft' : 'text-brand-olive/40 hover:text-brand-sage hover:bg-brand-cream'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar shrink-0 snap-x">
          {categories.map((cat) => {
            const isAllergen = cat === 'רגישויות' || cat === 'אלרגנים';
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-xs font-bold transition-all border snap-start uppercase tracking-wider ${
                  selectedCategory === cat 
                    ? (isAllergen ? 'bg-brand-primary-container text-white border-brand-primary-container shadow-soft scale-102' : 'bg-brand-primary text-white border-brand-primary shadow-soft scale-102') 
                    : (isAllergen ? 'bg-white text-brand-olive border-brand-blush/30 hover:bg-brand-blush/10' : 'bg-white text-brand-olive/50 border-brand-sand/50 hover:bg-brand-cream')
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
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
            <div className="w-16 h-16 bg-white border border-brand-sand/50 rounded-xl flex items-center justify-center mb-5 shadow-soft">
              <Search size={24} strokeWidth={2} className="text-slate-200" />
            </div>
            <h2 className="text-lg font-serif font-bold text-brand-olive">לא מצאתם את המאכל?</h2>
            <p className="text-xs text-brand-olive/40 mt-1 mb-6">תוכלו להוסיף אותו ידנית ולעקוב אחריו</p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateFoodModalOpen(true)}
              className="flex items-center gap-2 bg-brand-sage text-white px-6 py-3 rounded-lg font-bold shadow-soft transition-all"
            >
              <Plus size={18} strokeWidth={2.5} />
              הוספת מאכל חדש
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Quick Add Button */}
      {filteredFoods.length > 0 && (
        <div className="flex justify-center mt-2 mb-20 lg:mb-4">
          <button 
            onClick={() => setIsCreateFoodModalOpen(true)}
            className="flex items-center gap-2 text-brand-sage font-bold py-2.5 px-5 rounded-lg border-2 border-dashed border-brand-sage/20 hover:border-brand-sage/40 hover:bg-brand-sage/5 transition-all text-xs"
          >
            <Plus size={16} strokeWidth={2.5} />
            לא מצאתם מה שחיפשתם? הוסיפו ידנית
          </button>
        </div>
      )}
    </div>
  );
};

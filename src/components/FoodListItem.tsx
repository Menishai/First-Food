import React from 'react';
import { Star, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem } from '../types';

const statusStyles = {
  'נעול': { 
    wrapper: 'bg-white border-brand-sand grayscale opacity-60', 
    text: 'text-slate-400', 
    iconText: 'טרם נוסה',
    icon: null,
    dot: 'bg-slate-200'
  },
  'בתהליך': { 
    wrapper: 'bg-white border-brand-sage/20 shadow-sm', 
    text: 'text-brand-sage', 
    iconText: 'בתהליך',
    icon: 'stars',
    dot: 'bg-brand-sage animate-pulse shadow-[0_0_8px_rgba(74,109,58,0.3)]'
  },
  'הושלם': { 
    wrapper: 'bg-[#F8FAF6] border-brand-sage/30 shadow-sm', 
    text: 'text-brand-sage', 
    iconText: 'הושלם',
    icon: '✓',
    dot: 'bg-brand-sage'
  },
  'רגישות/תגובה': { 
    wrapper: 'bg-rose-50 border-rose-200 shadow-sm', 
    text: 'text-rose-600', 
    iconText: 'רגישות',
    icon: '⚠️',
    dot: 'bg-rose-500'
  },
};

interface FoodListItemProps {
  food: FoodItem;
  onClick: () => void;
}

export const FoodListItem: React.FC<FoodListItemProps> = ({ food, onClick }) => {
  const style = statusStyles[food.status];
  
  return (
    <motion.button 
      layout
      whileHover={{ y: -2, backgroundColor: '#ffffff', shadow: "0 4px 12px rgba(0,0,0,0.03)" }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative overflow-hidden flex items-center p-4 rounded-[1.5rem] border text-right w-full gap-4 transition-all ${style.wrapper}`}
    >
      <div className="w-14 h-14 bg-brand-sand/50 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:bg-brand-sand">
        {food.icon}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-serif font-black text-lg truncate ${food.status === 'נעול' ? 'text-slate-500' : 'text-slate-900'}`}>
            {food.name}
          </span>
          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
            {style.iconText}
          </span>
          <span className="text-[10px] text-slate-200">•</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">
            {food.attempts.length > 0 
              ? `${food.attempts.length} ניסיונות` 
              : (food.isAllergen ? 'מזון אלרגני' : food.category)
            }
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex gap-1">
          {food.recommendedPhase && (
            <span className="text-[9px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-black border border-sky-100 uppercase tracking-tighter">
              שלב {food.recommendedPhase}
            </span>
          )}
          {food.isAllergen && (
            <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-black border border-rose-100 uppercase tracking-tighter">
              אלרגן
            </span>
          )}
        </div>
        
        {food.status === 'בתהליך' && (
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={11} 
                className={idx < food.attempts.length ? 'fill-brand-sage text-brand-sage' : 'text-slate-200 fill-slate-50'} 
              />
            ))}
          </div>
        )}
        
        {food.status === 'הושלם' && (
          <span className="text-brand-sage font-black text-base">
             ✓
          </span>
        )}

        {food.status === 'נעול' && (
           <ChevronLeft size={18} className="text-slate-300" />
        )}
      </div>
    </motion.button>
  );
};

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem } from '../types';

const statusStyles = {
  'נעול': { 
    wrapper: 'bg-white border-slate-200 grayscale opacity-60', 
    text: 'text-slate-400', 
    iconText: 'טרם נוסה',
    icon: null 
  },
  'בתהליך': { 
    wrapper: 'bg-white border-brand-sage/20 shadow-sm', 
    text: 'text-brand-sage', 
    iconText: 'בתהליך',
    icon: 'stars' 
  },
  'הושלם': { 
    wrapper: 'bg-[#F8FAF6] border-brand-sage border-2 shadow-sm', 
    text: 'text-brand-sage', 
    iconText: 'הושלם',
    icon: '✓' 
  },
  'רגישות/תגובה': { 
    wrapper: 'bg-rose-50 border-rose-500 border-2 shadow-sm', 
    text: 'text-rose-600', 
    iconText: 'רגישות',
    icon: '⚠️' 
  },
};

interface FoodCardProps {
  food: FoodItem;
  onClick: () => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onClick }) => {
  const style = statusStyles[food.status];
  
  return (
    <motion.button 
      layout
      whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col items-start p-5 rounded-[2.5rem] border text-right w-full h-full transition-shadow ${style.wrapper}`}
    >
      {food.status === 'הושלם' && (
        <motion.div 
          key={`shimmer-${food.status}-${food.attempts.length}`}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)',
            width: '200%'
          }}
          initial={{ x: '150%' }}
          animate={{ x: '-150%' }}
          transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
        />
      )}
      
      <div className="w-full flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
          {style.iconText}
        </span>
        
        {style.icon === 'stars' && (
          <span className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={12} 
                className={idx < food.attempts.length ? 'fill-brand-sage text-brand-sage' : 'text-slate-200 fill-slate-50'} 
              />
            ))}
          </span>
        )}

        {typeof style.icon === 'string' && style.icon !== 'stars' && (
          <span className={`font-bold text-lg leading-none ${food.status === 'רגישות/תגובה' ? 'text-rose-500' : 'text-brand-sage'}`}>
            {food.status === 'הושלם' ? (
              <motion.span
                key={`check-${food.status}-${food.attempts.length}`}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="block"
              >
                {style.icon}
              </motion.span>
            ) : (
              style.icon
            )}
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-1 mb-4">
        <span className="text-4xl select-none leading-none mb-1">{food.icon}</span>
        <span className={`font-serif font-black text-xl leading-tight ${food.status === 'נעול' ? 'text-slate-500' : 'text-slate-900'}`}>
          {food.name}
        </span>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-500">
          {food.attempts.length > 0 
            ? `${food.attempts.length} ניסיונות` 
            : (food.status === 'נעול' && food.isAllergen ? 'מזון אלרגני' : food.category)
          }
        </p>
      </div>

      <div className="w-full flex flex-wrap gap-1 justify-end mt-auto">
        {food.recommendedPhase && (
          <span className="text-[10px] bg-sky-50 border border-sky-100 text-sky-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm">
            שלב {food.recommendedPhase}
          </span>
        )}
        {food.isAllergen && (
          <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm">
            אלרגן
          </span>
        )}
      </div>
    </motion.button>
  );
};


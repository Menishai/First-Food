import React from 'react';
import { Star, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem } from '../types';

const statusStyles = {
  'נעול': { 
    wrapper: 'bg-white/50 border-brand-sand/50 grayscale opacity-60', 
    text: 'text-brand-olive/40', 
    iconText: 'טרם נוסה',
    icon: null,
    dot: 'bg-brand-sand'
  },
  'בתהליך': { 
    wrapper: 'bg-white border-brand-sage/20 shadow-soft', 
    text: 'text-brand-sage', 
    iconText: 'בתהליך',
    icon: 'stars',
    dot: 'bg-brand-sage animate-pulse'
  },
  'הושלם': { 
    wrapper: 'bg-white border-brand-sage/30 shadow-soft', 
    text: 'text-brand-sage', 
    iconText: 'הושלם',
    icon: '✓',
    dot: 'bg-brand-sage'
  },
  'רגישות/תגובה': { 
    wrapper: 'bg-white border-brand-blush shadow-soft', 
    text: 'text-brand-charcoal', 
    iconText: 'רגישות',
    icon: '⚠️',
    dot: 'bg-brand-primary-container'
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
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative overflow-hidden flex items-center p-3.5 rounded-xl border text-right w-full gap-4 transition-all ${style.wrapper} ${
        food.isAllergen && food.status !== 'הושלם' ? 'border-amber-300 bg-amber-50/20' : ''
      }`}
    >
      <div className="w-12 h-12 bg-brand-sand/50 rounded-lg overflow-hidden flex items-center justify-center text-2xl shrink-0 border border-brand-sand/30">
        {food.image ? (
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        ) : (
          food.icon
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`font-serif font-bold text-base truncate ${food.status === 'נעול' ? 'text-brand-olive/50' : 'text-brand-olive'}`}>
            {food.name}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
            {style.iconText}
          </span>
          <span className="text-[10px] text-brand-sand">•</span>
          <span className="text-[10px] text-brand-olive/40 font-bold uppercase tracking-wider truncate">
            {food.attempts.length > 0 
              ? `${food.attempts.length} ניסיונות` 
              : (food.isAllergen ? 'מזון אלרגני' : food.category)
            }
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex gap-1">
          {food.recommendedPhase && (
            <span className="text-[9px] bg-brand-cream text-brand-sage px-2 py-0.5 rounded font-bold border border-brand-sand uppercase tracking-wider">
              שלב {food.recommendedPhase}
            </span>
          )}
          {food.isAllergen && (
            <span className="text-[9px] bg-brand-blush/30 text-brand-olive px-2 py-0.5 rounded font-bold border border-brand-blush uppercase tracking-wider">
              אלרגן
            </span>
          )}
        </div>
        
        {food.status === 'בתהליך' && (
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={10} 
                className={idx < food.attempts.length ? 'fill-brand-sage text-brand-sage' : 'text-brand-sand fill-brand-cream'} 
              />
            ))}
          </div>
        )}
        
        {food.status === 'הושלם' && (
          <span className="text-brand-sage font-bold text-sm">
             ✓
          </span>
        )}

        {food.status === 'נעול' && (
           <ChevronLeft size={16} className="text-brand-sand" />
        )}
      </div>
    </motion.button>
  );
};

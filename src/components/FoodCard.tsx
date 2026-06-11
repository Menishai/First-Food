import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem } from '../types';

const statusStyles = {
  'נעול': { 
    wrapper: 'bg-white/50 border-brand-sand/50 grayscale opacity-60', 
    text: 'text-brand-olive/40', 
    iconText: 'טרם נוסה',
    icon: null 
  },
  'בתהליך': { 
    wrapper: 'bg-white border-brand-sage/20 shadow-soft', 
    text: 'text-brand-sage', 
    iconText: 'בתהליך',
    icon: 'stars' 
  },
  'הושלם': { 
    wrapper: 'bg-white border-brand-sage border shadow-soft', 
    text: 'text-brand-sage', 
    iconText: 'הושלם',
    icon: '✓' 
  },
  'רגישות/תגובה': { 
    wrapper: 'bg-white border-brand-blush border shadow-soft', 
    text: 'text-brand-charcoal', 
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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col items-start p-4 rounded-xl border text-right w-full h-full transition-all ${style.wrapper} ${
        food.isAllergen && food.status !== 'הושלם' ? 'border-amber-300 bg-amber-50/20' : ''
      }`}
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
      
      <div className="w-full flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
          {style.iconText}
        </span>
        
        {style.icon === 'stars' && (
          <span className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={11} 
                className={idx < food.attempts.length ? 'fill-brand-sage text-brand-sage' : 'text-brand-sand fill-brand-cream'} 
              />
            ))}
          </span>
        )}

        {typeof style.icon === 'string' && style.icon !== 'stars' && (
          <span className={`font-bold text-base leading-none ${food.status === 'רגישות/תגובה' ? 'text-brand-charcoal' : 'text-brand-sage'}`}>
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
      
      <div className="flex flex-col gap-1 mb-3">
        {food.image ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-cream border border-brand-sand/55 shadow-soft mb-1 select-none flex items-center justify-center">
            <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <span className="text-3xl select-none leading-none mb-1">{food.icon}</span>
        )}
        <span className={`font-serif font-bold text-lg leading-tight ${food.status === 'נעול' ? 'text-brand-olive/50' : 'text-brand-olive'}`}>
          {food.name}
        </span>
        <p className="text-[10px] text-brand-olive/40 font-bold uppercase tracking-wider">
          {food.attempts.length > 0 
            ? `${food.attempts.length} ניסיונות` 
            : (food.status === 'נעול' && food.isAllergen ? 'מזון אלרגני' : food.category)
          }
        </p>
      </div>

      <div className="w-full flex flex-wrap gap-1 justify-end mt-auto">
        {food.recommendedPhase && (
          <span className="text-[9px] bg-brand-cream border border-brand-sand text-brand-sage px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider shadow-soft">
            שלב {food.recommendedPhase}
          </span>
        )}
        {food.isAllergen && (
          <span className="text-[9px] bg-brand-blush/30 border border-brand-blush text-brand-olive px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider shadow-soft">
            אלרגן
          </span>
        )}
      </div>
    </motion.button>
  );
};

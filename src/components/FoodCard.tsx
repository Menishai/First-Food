import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem } from '../types';

const statusStyles = {
  'נעול': { 
    wrapper: 'bg-white border-gray-200 grayscale opacity-70', 
    text: 'text-gray-400', 
    iconText: 'טרם נוסה',
    icon: null 
  },
  'בתהליך': { 
    wrapper: 'bg-white border-[#F5E6C4] shadow-sm', 
    text: 'text-orange-500', 
    iconText: 'בתהליך',
    icon: 'stars' 
  },
  'הושלם': { 
    wrapper: 'bg-[#F8FAF6] border-green-500 border-2 shadow-sm', 
    text: 'text-green-600', 
    iconText: 'הושלם',
    icon: '✓' 
  },
  'רגישות/תגובה': { 
    wrapper: 'bg-red-50 border-red-500 border-2 shadow-sm', 
    text: 'text-red-600', 
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col items-start p-4 rounded-3xl border text-right w-full h-full ${style.wrapper}`}
    >
      {food.status === 'הושלם' && (
        <motion.div 
          key={`shimmer-${food.status}-${food.attempts.length}`}
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)',
            transform: 'skewX(-20deg)',
            width: '200%'
          }}
          initial={{ x: '150%' }}
          animate={{ x: '-150%' }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
        />
      )}
      {style.icon === 'stars' && (
        <span className="absolute top-3 left-3 flex gap-0.5">
          {[1, 2, 3].map((starIdx) => (
            <Star 
              key={starIdx} 
              size={12} 
              className={starIdx <= food.attempts.length ? 'fill-orange-400 text-orange-400' : 'text-gray-200 fill-gray-50'} 
            />
          ))}
        </span>
      )}
      
      {typeof style.icon === 'string' && style.icon !== 'stars' && (
        <span className={`absolute top-3 left-3 font-bold flex items-center justify-center ${food.status === 'רגישות/תגובה' ? 'text-red-500' : 'text-green-500'}`}>
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
      
      <span className={`text-[10px] font-bold block mb-2 uppercase ${style.text}`}>
        {style.iconText}
      </span>
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-3xl select-none leading-none">{food.icon}</span>
        <span className={`font-bold text-lg leading-tight ${food.status === 'נעול' ? 'text-gray-500' : 'text-[#2D2D2D]'}`}>
          {food.name}
        </span>
      </div>
      
      <p className="text-[11px] text-gray-400 font-medium mb-3">
        {food.attempts.length > 0 
          ? `${food.attempts.length} ניסיונות` 
          : (food.status === 'נעול' && food.isAllergen ? 'מזון אלרגני' : food.category)
        }
      </p>

      <div className="w-full flex flex-wrap gap-1 justify-end mt-auto pt-2">
        {food.recommendedPhase && (
          <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold shadow-sm">
            שלב {food.recommendedPhase}
          </span>
        )}
        {food.isAllergen && (
          <span className="text-[10px] bg-red-50 border border-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold shadow-sm">
            אלרגן
          </span>
        )}
      </div>
    </motion.button>
  );
};


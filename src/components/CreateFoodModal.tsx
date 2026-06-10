import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { useFoodContext } from '../context';

interface CreateFoodModalProps {
  onClose: () => void;
}

const CATEGORIES: { id: Category; icon: string; label: string }[] = [
  { id: 'ירקות', icon: '🥦', label: 'ירקות' },
  { id: 'פירות', icon: '🍎', label: 'פירות' },
  { id: 'חלבונים', icon: '🍗', label: 'חלבונים' },
  { id: 'דגנים', icon: '🌾', label: 'דגנים' },
  { id: 'אלרגנים', icon: '🥜', label: 'אלרגנים' },
  { id: 'תיבול', icon: '🌿', label: 'תיבול' },
];

const QUICK_EMOJIS = ['🍓', '🥝', '🫐', '🍍', '🥭', '🌽', '🍟', '🥙', '🍣', '🧀', '🍗', '🥬', '🥦', '🥕', '🥔', '🥖'];

export const CreateFoodModal: React.FC<CreateFoodModalProps> = ({ onClose }) => {
  const { addCustomFood } = useFoodContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('ירקות');
  const [icon, setIcon] = useState('🍎');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCustomFood(name.trim(), category, icon);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-olive/30 backdrop-blur-sm overflow-x-hidden overflow-y-auto" 
      dir="rtl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 5 }}
        className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col max-h-[90vh] relative z-10 overflow-hidden border border-brand-sand/50 m-4 touch-pan-y"
      >
        <div className="px-5 py-3.5 flex justify-between items-center bg-white border-b border-brand-sand/40 relative select-none">
          <div className="flex items-center gap-3">
            <div className="bg-brand-cream text-brand-sage p-2 rounded-lg border border-brand-sand/30 shadow-soft">
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-serif font-bold text-brand-olive leading-none">הוספת מאכל חדש</h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40 mt-0.5">יצירת מאכל שאינו מופיע ברשימה</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-cream text-brand-olive/40 transition-colors active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 overflow-y-auto no-scrollbar">
          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">שם המאכל</label>
            <input 
              type="text" 
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="למשל: דלעת ערמונים, פפאיה..."
              className="p-3 bg-brand-cream/30 border border-brand-sand/60 rounded-lg w-full text-brand-olive focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage focus:outline-none transition-all font-semibold text-sm placeholder:text-brand-olive/20"
            />
          </div>

          {/* Icon Picker */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">אייקון / אמוג׳י</label>
              <div className="bg-brand-cream border border-brand-sand/60 px-3 py-0.5 rounded-lg text-lg shadow-soft font-bold">
                {icon}
              </div>
            </div>
            <div className="grid grid-cols-8 gap-2 mt-1">
              {QUICK_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-xl p-1.5 rounded-lg border transition-all ${icon === emoji ? 'bg-brand-cream border-brand-sage shadow-soft scale-105' : 'bg-white border-brand-sand/50 hover:bg-brand-cream'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">קטגוריה</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${category === cat.id ? 'bg-brand-cream border-brand-sage shadow-soft font-bold' : 'bg-white border-brand-sand/50 hover:bg-brand-cream'}`}
                >
                  <span className="text-xs p-1 rounded bg-white border border-brand-sand/30 shadow-soft">{cat.icon}</span>
                  <span className={`text-xs font-bold ${category === cat.id ? 'text-brand-sage' : 'text-brand-olive/60'}`}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {category === 'אלרגנים' && (
            <div className="bg-brand-blush/20 border border-brand-blush/40 p-3 rounded-lg flex gap-2 items-start">
               <AlertCircle size={14} className="text-brand-sage shrink-0 mt-0.5" />
               <p className="text-xs text-brand-olive leading-relaxed font-bold">
                 שימו לב: מאכלים בקטגוריית ״אלרגנים״ יציגו אזהרה מיוחדת לפני דיווח הטעימה.
               </p>
            </div>
          )}

          <div className="mt-2 space-y-3">
            <button 
              type="submit" 
              className="w-full py-3 bg-brand-sage text-white rounded-lg font-bold text-sm shadow-soft hover:bg-brand-sage/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              הוספת המאכל וסגירה
            </button>
            <p className="text-center text-[10px] text-brand-olive/40 font-medium">המאכל יתווסף לרשימה וניתן יהיה להתחיל לעקוב אחריו מיד</p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

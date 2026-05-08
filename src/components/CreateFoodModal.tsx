import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { useFoodContext } from '../context';

interface CreateFoodModalProps {
  onClose: () => void;
}

const CATEGORIES: { id: Category; icon: string; label: string; color: string }[] = [
  { id: 'ירקות', icon: '🥦', label: 'ירקות', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'פירות', icon: '🍎', label: 'פירות', color: 'bg-rose-50 text-rose-600' },
  { id: 'חלבונים', icon: '🍗', label: 'חלבונים', color: 'bg-amber-50 text-amber-600' },
  { id: 'דגנים', icon: '🌾', label: 'דגנים', color: 'bg-orange-50 text-orange-600' },
  { id: 'אלרגנים', icon: '🥜', label: 'אלרגנים', color: 'bg-red-50 text-red-600' },
  { id: 'תיבול', icon: '🌿', label: 'תיבול', color: 'bg-teal-50 text-teal-600' },
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" 
      dir="rtl"
    >
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-brand-cream w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] relative z-10 overflow-hidden border border-brand-sand"
      >
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-brand-sand relative">
          <div className="flex items-center gap-3">
            <div className="bg-brand-sage/10 text-brand-sage p-2 rounded-xl">
              <Plus size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 leading-none">הוספת מאכל חדש</h2>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">יצירת מאכל שאינו מופיע ברשימה</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-brand-sand/50 rounded-full hover:bg-brand-sand text-slate-500 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">שם המאכל</label>
            <input 
              type="text" 
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="למשל: דלעת ערמונים, פפאיה..."
              className="p-4 bg-white border border-brand-sand rounded-2xl w-full text-slate-800 focus:ring-4 focus:ring-brand-sage/10 focus:border-brand-sage focus:outline-none transition-all font-bold text-lg"
            />
          </div>

          {/* Icon Picker */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">אייקון / אמוג׳י</label>
              <div className="bg-white border border-brand-sand px-3 py-1 rounded-full text-lg shadow-sm">
                {icon}
              </div>
            </div>
            <div className="grid grid-cols-8 gap-2 mt-1">
              {QUICK_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-xl p-2 rounded-xl border transition-all ${icon === emoji ? 'bg-brand-cream border-brand-sage shadow-sm scale-110' : 'bg-white border-brand-sand hover:bg-brand-sand/30'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">קטגוריה</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${category === cat.id ? 'bg-brand-cream border-brand-sage shadow-sm' : 'bg-white border-brand-sand hover:bg-brand-sand/30'}`}
                >
                  <span className={`text-sm p-1.5 rounded-lg ${cat.color}`}>{cat.icon}</span>
                  <span className={`text-xs font-bold ${category === cat.id ? 'text-brand-sage' : 'text-slate-600'}`}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {category === 'אלרגנים' && (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex gap-2 items-start">
               <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-rose-800 leading-relaxed font-bold">
                 שימו לב: מאכלים בקטגוריית ״אלרגנים״ יציגו אזהרה מיוחדת לפני דיווח הטעימה.
               </p>
            </div>
          )}

          <div className="mt-2 space-y-3">
            <button 
              type="submit" 
              className="w-full py-4 bg-brand-sage text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-sage/20 hover:bg-brand-sage/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              הוספת המאכל וסגירה
            </button>
            <p className="text-center text-[10px] text-slate-400 font-medium">המאכל יתווסף לרשימה וניתן יהיה להתחיל לעקוב אחריו מיד</p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

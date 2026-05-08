import React from 'react';
import { motion } from 'motion/react';
import { X, AlertTriangle, Droplets, Egg, Fish, Info } from 'lucide-react';

interface GuidelinesModalProps {
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ onClose }) => {

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto" 
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
        className="bg-brand-cream w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[80vh] relative z-10 overflow-hidden border border-brand-sand"
      >
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-brand-sand relative">
          <div className="flex items-center gap-3">
            <div className="bg-sky-50 text-sky-600 p-2 rounded-xl">
              <Info size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800">דגשי בטיחות</h2>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">הנחיות חשובות לחשיפה בריאה</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-brand-sand/50 rounded-full hover:bg-brand-sand text-slate-500 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          <div className="bg-rose-50 p-4 rounded-2xl flex items-start gap-3 border border-rose-100 shadow-sm">
            <div className="text-2xl mt-0.5 shrink-0">🍯</div>
            <div>
              <h3 className="font-bold text-sm text-rose-800 mb-0.5">דבש</h3>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">אסור לתת דבש מתחת לגיל שנה מחשש לחיידק הבוטוליזם, שעלול להיות מסוכן מאוד במערכת העיכול.</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-3 border border-amber-100 shadow-sm">
            <div className="text-2xl mt-0.5 shrink-0">🧂</div>
            <div>
              <h3 className="font-bold text-sm text-amber-800 mb-0.5">מלח וסוכר</h3>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">הימנעו מהוספת מלח או סוכר. הכליות של התינוק אינן בשלות למלח, וסוכר מזיק לשיניים ללא ערך תזונתי.</p>
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-2xl flex items-start gap-3 border border-sky-100 shadow-sm">
            <div className="text-sky-500 mt-0.5 shrink-0"><Droplets size={24} strokeWidth={2.5} /></div>
            <div>
              <h3 className="font-bold text-sm text-sky-800 mb-0.5">מזון לא מפוסטר</h3>
              <p className="text-xs text-sky-700 leading-relaxed font-medium">אין לתת מיצים או מוצרי חלב שלא עברו פיסטור. הם עלולים להכיל חיידקים מסוכנים למערכת החיסונית.</p>
            </div>
          </div>

          <div className="bg-brand-sand/40 p-4 rounded-2xl flex items-start gap-3 border border-brand-sand shadow-sm">
            <div className="text-brand-sage mt-0.5 shrink-0"><Egg size={24} strokeWidth={2.5} /></div>
            <div>
              <h3 className="font-bold text-sm text-brand-olive mb-0.5">ביצים לא מבושלות</h3>
              <p className="text-xs text-brand-olive/80 leading-relaxed font-medium">ביצים חייבות להיות מבושלות היטב (כמו ביצה קשה). הימנעו מביצה רכה או קצפות המכילות ביצים חיות.</p>
            </div>
          </div>
          
          <div className="bg-cyan-50 p-4 rounded-2xl flex items-start gap-3 border border-cyan-100 shadow-sm">
            <div className="text-cyan-600 mt-0.5 shrink-0"><Fish size={24} strokeWidth={2.5} /></div>
            <div>
              <h3 className="font-bold text-sm text-cyan-800 mb-0.5">דגים נאים ועצמות</h3>
              <p className="text-xs text-cyan-700 leading-relaxed font-medium">אין לתת דגים נאים. יש לוודא שהדג מבושל לחלוטין ולהוציא כל עצם, אפילו הקטנה ביותר, מחשש לחנק.</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl flex items-start gap-3 border border-purple-100 shadow-sm">
            <div className="text-2xl mt-0.5 shrink-0">🥛</div>
            <div>
              <h3 className="font-bold text-sm text-purple-800 mb-0.5">חלב פרה</h3>
              <p className="text-xs text-purple-700 leading-relaxed font-medium">אין לחשוף לחלב ניגר לשתייה לפני גיל שנה. ניתן לשלב מוצרי חלב מותססים (יוגורט, גבינה לבנה) בהדרגה.</p>
            </div>
          </div>

          <div className="bg-slate-100/50 p-4 rounded-2xl flex items-start gap-3 border border-slate-200 mt-2 shadow-inner">
             <div className="text-slate-500 mt-0.5 shrink-0"><AlertTriangle size={24} strokeWidth={2.5} /></div>
             <div>
               <h3 className="font-bold text-sm text-slate-800 mb-0.5">סכנת חנק</h3>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">חיתכו פירות וירקות עגולים (ענבים) לאורך. זרעים ואגוזים יש לטחון היטב ולא להגיש שלמים לעולם.</p>
             </div>
          </div>
          
        </div>
      </motion.div>
    </motion.div>
  );
};

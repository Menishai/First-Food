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
      className="fixed inset-0 z-[150] flex items-center justify-center bg-brand-olive/30 backdrop-blur-sm overflow-x-hidden overflow-y-auto" 
      dir="rtl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 5 }}
        className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col max-h-[80vh] relative z-10 overflow-hidden border border-brand-sand/50 m-4 touch-pan-y"
      >
        <div className="px-5 py-3.5 flex justify-between items-center bg-white border-b border-brand-sand/40 relative select-none">
          <div className="flex items-center gap-3">
            <div className="bg-brand-cream text-brand-sage p-2 rounded-lg border border-brand-sand/30 shadow-soft">
              <Info size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-serif font-bold text-brand-olive leading-none">דגשי בטיחות</h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40 mt-0.5">הנחיות חשובות לחשיפה בריאה</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-cream text-brand-olive/40 transition-colors active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 no-scrollbar">
          {[
            {
              title: 'דבש',
              desc: 'אסור לתת דבש מתחת לגיל שנה מחשש לחיידק הבוטוליזם, שעלול להיות מסוכן מאוד במערכת העיכול.',
              icon: '🍯',
              alert: true
            },
            {
              title: 'מלח וסוכר',
              desc: 'הימנעו מהוספת מלח או סוכר. הכליות של התינוק אינן בשלות למלח, וסוכר מזיק לשיניים ללא ערך תזונתי.',
              icon: '🧂',
              alert: false
            },
            {
              title: 'מזון לא מפוסטר',
              desc: 'אין לתת מיצים או מוצרי חלב שלא עברו פיסטור. הם עלולים להכיל חיידקים מסוכנים למערכת החיסונית.',
              element: <Droplets size={22} className="text-brand-sage" />,
              alert: false
            },
            {
              title: 'ביצים לא מבושלות',
              desc: 'ביצים חייבות להיות מבושלות היטב (כמו ביצה קשה). הימנעו מביצה רכה או קצפות המכילות ביצים חיות.',
              element: <Egg size={22} className="text-brand-sage" />,
              alert: false
            },
            {
              title: 'דגים נאים ועצמות',
              desc: 'אין לתת דגים נאים. יש לוודא שהדג מבושל לחלוטין ולהוציא כל עצם, אפילו הקטנה ביותר, מחשש לחנק.',
              element: <Fish size={22} className="text-brand-sage" />,
              alert: false
            },
            {
              title: 'חלב פרה',
              desc: 'אין לחשוף לחלב ניגר לשתייה לפני גיל שנה. ניתן לשלב מוצרי חלב מותססים (יוגורט, גבינה לבנה) בהדרגה.',
              icon: '🥛',
              alert: false
            },
            {
              title: 'סכנת חנק',
              desc: 'חיתכו פירות וירקות עגולים (ענבים) לאורך. זרעים ואגוזים יש לטחון היטב ולא להגיש שלמים לעולם.',
              element: <AlertTriangle size={22} className="text-brand-sage" />,
              alert: true
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white border p-4 rounded-lg flex items-start gap-3 shadow-soft ${
                item.alert ? 'border-brand-blush' : 'border-brand-sand/50'
              }`}
            >
              <div className="text-xl shrink-0 mt-0.5">
                {item.element ? item.element : item.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-serif font-bold text-sm text-brand-olive">{item.title}</h3>
                <p className="text-xs text-brand-olive/70 leading-relaxed font-semibold">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

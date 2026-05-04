import React from 'react';
import { X, AlertTriangle, Droplets, Egg, Fish, Info } from 'lucide-react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex justify-between items-center bg-blue-50/50 border-b border-blue-100 rounded-t-3xl relative">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <Info size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">דגשים לחשיפה בטוחה</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-slate-100 text-slate-500 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-red-50 p-4 rounded-2xl flex items-start gap-4 border border-red-100">
            <div className="text-2xl mt-1">🍯</div>
            <div>
              <h3 className="font-bold text-red-800 mb-1">דבש</h3>
              <p className="text-sm text-red-700">אסור לתת דבש לתינוקות מתחת לגיל שנה מחשש לחיידק הבוטוליזם, שעלול להיות מסוכן מאוד במערכת העיכול של התינוק.</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-2xl flex items-start gap-4 border border-orange-100">
            <div className="text-2xl mt-1">🧂</div>
            <div>
              <h3 className="font-bold text-orange-800 mb-1">מלח וסוכר</h3>
              <p className="text-sm text-orange-700">הימנעו מהוספת מלח או סוכר למזון. הכליות של התינוק אינן בשלות להתמודד עם כמויות מלח, וסוכר אינו תורם תזונתית ומזיק לשיניים.</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-4 border border-amber-100">
            <div className="text-amber-500 mt-1"><DropIcon /></div>
            <div>
              <h3 className="font-bold text-amber-800 mb-1">מזון לא מפוסטר</h3>
              <p className="text-sm text-amber-700">אין לתת מיצים, מוצרי חלב או מזונות אחרים שאינם מפוסטרים, העלולים להכיל חיידקים מסוכנים למערכת החיסונית של התינוק.</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-2xl flex items-start gap-4 border border-yellow-100">
            <div className="text-yellow-600 mt-1"><Egg size={24} /></div>
            <div>
              <h3 className="font-bold text-yellow-800 mb-1">ביצים לא מבושלות</h3>
              <p className="text-sm text-yellow-700">ביצים חייבות להיות מבושלות היטב (כמו ביצה קשה). הימנעו מביצת עין, ביצה רכה או מאכלים המכילים ביצים חיות.</p>
            </div>
          </div>
          
          <div className="bg-cyan-50 p-4 rounded-2xl flex items-start gap-4 border border-cyan-100">
            <div className="text-cyan-600 mt-1"><Fish size={24} /></div>
            <div>
              <h3 className="font-bold text-cyan-800 mb-1">דגים נאים ועצמות</h3>
              <p className="text-sm text-cyan-700">אין לתת דגים נאים או לא מבושלים לחלוטין. יש לוודא שהדג מבושל היטב ולהוציא כל עצם אפילו הקטנה ביותר מחשש לחנק.</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl flex items-start gap-4 border border-purple-100">
            <div className="text-2xl mt-1">🥛</div>
            <div>
              <h3 className="font-bold text-purple-800 mb-1">חלב פרה</h3>
              <p className="text-sm text-purple-700">לא מומלץ לחשוף לחלב ניגר לשתייה לפני גיל שנה, שכן הוא עלול לגרום לאנמיה עקב ריכוז ברזל נמוך וקשיי ספיגה. עם זאת, ניתן לשלב מוצרי חלב (כמו גבינות ויוגורט) בהדרגה החל מגיל 9 חודשים.</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-4 border border-gray-100 mt-4">
             <div className="text-gray-500 mt-1"><AlertTriangle size={24} /></div>
             <div>
               <h3 className="font-bold text-gray-800 mb-1">סכנת חנק</h3>
               <p className="text-sm text-gray-600">יש לחתוך פירות וירקות עגולים וקטנים (כמו ענבים, עגבניות שרי, נקניקיות) לאורך. זרעים ואגוזים למיניהם יש לטחון היטב ולא להגיש שלמים.</p>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const DropIcon = () => (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
)

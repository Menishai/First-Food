import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useFoodContext } from '../context';
import { tipsData } from '../data';
import { Category, Reaction } from '../types';
import { getBabyAge, getLast7DaysStats } from '../utils/babyUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ChevronLeft, Award, Lock, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';

interface HomeViewProps {
  setSelectedCategory: (category: Category | 'הכל' | 'רגישויות') => void;
  setActiveTab: (tab: 'home' | 'foods' | 'calendar' | 'settings') => void;
  setProgressListType: (type: 'הושלם' | 'בתהליך' | null) => void;
  setProgressListCategory: (category: Category | null) => void;
  setSelectedFoodId?: (id: string | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setSelectedCategory,
  setActiveTab,
  setProgressListType,
  setProgressListCategory,
  setSelectedFoodId,
}) => {
  const { foods, activeProfile, addAttempt } = useFoodContext();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const completedCount = foods.filter(f => f.status === 'הושלם').length;
  const inProgressCount = foods.filter(f => f.status === 'בתהליך').length;

  const selectedCategory = 'הכל'; // Fallback / default
  const currentTip = tipsData[selectedCategory] || tipsData['הכל'];

  // Next Recommended Taste helper
  const nextFood = foods.find(f => 
    !f.id.startsWith('custom-') && 
    !f.isAromaticOnly && 
    (f.status === 'נעול' || f.status === 'בתהליך')
  ) || null;

  const handleFastLog = (foodId: string, foodName: string, reaction: Reaction) => {
    const today = new Date().toISOString().split('T')[0];
    addAttempt(foodId, {
      date: today,
      amount: 'טעימה',
      reaction,
      preparation: 'טחון',
      notes: ''
    });
    setSuccessMessage(`רשמנו טעימה של ${foodName} בהצלחה! 🎉`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Baby age in months
  const birthDateStr = activeProfile?.birthDate;
  const ageInMonths = (() => {
    if (!birthDateStr) return 6; // default fallback
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 30.4375;
  })();

  const babyAge = getBabyAge(birthDateStr);

  const milestones = [
    { title: '4-6 חודשים', label: 'חשיפה ראשונית', desc: 'מחיות חלקות (בטטה, גזר, קישוא, בוטנים מדוללים)', minAge: 4, maxAge: 6 },
    { title: '6-9 חודשים', label: 'מרקמים וחלבונים', desc: 'מעוך וגושים רכים (עוף, בקר, ביצה, הודו)', minAge: 6, maxAge: 9 },
    { title: '9-12 חודשים', label: 'אוכל אצבעות רך', desc: 'קצוץ וגבינות (יוגורט, גבינה לבנה, פסטה רכה)', minAge: 9, maxAge: 12 },
    { title: 'שנה ומעלה', label: 'ארוחות משפחה', desc: 'מעבר מלא לתפריט משפחתי מגוון וחלב פרה כמשקה', minAge: 12, maxAge: 999 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Card */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/50 shadow-soft relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => setProgressListType('הושלם')}
              className="cursor-pointer group"
            >
              <h3 className="font-serif font-bold text-2xl text-brand-sage leading-none mb-2 group-hover:text-brand-primary-container transition-colors">מסע הטעימות</h3>
              <p className="text-brand-olive/60 text-xs font-semibold flex items-center gap-1">
                השלמת {completedCount} מזונות עד כה
                <ChevronLeft size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setProgressListType('בתהליך')}
              className="bg-brand-cream p-3 rounded-lg flex items-center gap-3 border border-brand-sand shadow-soft cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-brand-sage leading-none mb-1 opacity-60">בתהליך</span>
                <span className="font-bold text-brand-sage text-sm">{inProgressCount}</span>
              </div>
              <div className="w-px h-6 bg-brand-sand" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-brand-sage leading-none mb-1 opacity-60">הושלם</span>
                <span className="font-bold text-brand-sage text-sm">{foods.length > 0 ? Math.round((completedCount / foods.length) * 100) : 0}%</span>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full h-3 bg-brand-sand rounded-full overflow-hidden mb-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${foods.length > 0 ? (completedCount / foods.length) * 100 : 0}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-brand-sage rounded-full" 
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'ירקות', icon: '🥦', color: 'bg-brand-cream/50', text: 'text-brand-sage', cat: 'ירקות', val: `${foods.filter(f=>f.category==='ירקות' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='ירקות').length}` },
              { label: 'פירות', icon: '🍎', color: 'bg-brand-cream/50', text: 'text-brand-sage', cat: 'פירות', val: `${foods.filter(f=>f.category==='פירות' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='פירות').length}` },
              { label: 'אלרגנים', icon: '🥜', color: 'bg-brand-cream/50', text: 'text-amber-700', cat: 'אלרגנים', val: `${foods.filter(f=>f.category==='אלרגנים' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='אלרגנים').length}` },
              { label: 'חלבונים', icon: '🍗', color: 'bg-brand-cream/50', text: 'text-brand-sage', cat: 'חלבונים', val: `${foods.filter(f=>f.category==='חלבונים' && f.status === 'הושלם').length}/${foods.filter(f=>f.category==='חלבונים').length}` },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -1, backgroundColor: '#FFFFFF' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setProgressListType('הושלם');
                  setProgressListCategory(item.cat as Category);
                }}
                className="bg-brand-cream/30 border border-brand-sand/50 rounded-lg p-3 flex flex-col items-center gap-1 shadow-soft cursor-pointer transition-all"
              >
                <span className="text-xl mb-0.5">{item.icon}</span>
                <span className={`text-[10px] font-bold uppercase tracking-tight ${item.text}`}>{item.label}</span>
                <span className="text-base font-bold text-brand-olive">{item.val}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Recommended Taste Card with Fast-Log */}
      {nextFood ? (
        <div className="bg-white rounded-xl p-6 border border-brand-sand/50 shadow-soft flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-brand-sage"></div>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {nextFood.image ? (
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-brand-sand/60 bg-brand-cream flex items-center justify-center shrink-0">
                  <img src={nextFood.image} alt={nextFood.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-brand-cream rounded-lg flex items-center justify-center text-3xl shadow-soft shrink-0 border border-brand-sand/50">
                  {nextFood.icon}
                </div>
              )}
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider">טעימה מומלצת הבאה</span>
                <h4 className="font-serif font-bold text-xl leading-tight text-brand-olive mt-0.5">{nextFood.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] bg-brand-cream text-brand-sage px-2 py-0.5 rounded font-bold border border-brand-sand/30">
                    {nextFood.category}
                  </span>
                  {nextFood.recommendedPhase && (
                    <span className="text-[9px] bg-brand-cream text-brand-sage px-2 py-0.5 rounded font-bold border border-brand-sand/30">
                      שלב {nextFood.recommendedPhase}
                    </span>
                  )}
                  {nextFood.isAllergen && (
                    <span className="text-[9px] bg-brand-blush text-brand-charcoal px-2 py-0.5 rounded font-bold border border-brand-blush/30 flex items-center gap-0.5">
                      <AlertTriangle size={8} className="text-red-500" /> אלרגן
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {setSelectedFoodId && (
              <button
                onClick={() => setSelectedFoodId(nextFood.id)}
                className="text-[10px] font-bold text-brand-sage hover:underline bg-brand-cream px-3 py-1.5 rounded-lg border border-brand-sand shadow-soft transition-all"
              >
                פרטים ורישום מלא
              </button>
            )}
          </div>

          <div className="h-px bg-brand-sand/40 w-full"></div>

          {/* Fast-Log reaction selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-brand-olive/50 text-right">דיווח טעימה מהיר (היום, כמות: טעימה, מרקם: טחון)</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'אהב/ה', label: 'אהב/ה', emoji: '😍', colorClass: 'hover:bg-green-50 text-green-700 border-green-200' },
                { id: 'ניטרלי', label: 'ניטרלי', emoji: '😐', colorClass: 'hover:bg-blue-50 text-blue-700 border-blue-100' },
                { id: 'סירב/ה', label: 'סירב/ה', emoji: '🙅', colorClass: 'hover:bg-amber-50 text-amber-700 border-amber-200' }
              ].map((r) => (
                <motion.button
                  key={r.id}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFastLog(nextFood.id, nextFood.name, r.id as Reaction)}
                  className={`py-2 px-2 bg-white border rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-all border-brand-sand/60 ${r.colorClass}`}
                >
                  <span className="text-base">{r.emoji}</span>
                  <span>{r.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 bg-green-50 border border-brand-sand rounded-lg text-xs font-bold text-brand-sage text-center"
            >
              {successMessage}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-brand-sand/50 shadow-soft flex flex-col items-center justify-center text-center gap-2">
          <span className="text-4xl">🏆</span>
          <h4 className="font-serif font-bold text-lg text-brand-olive">כל הכבוד!</h4>
          <p className="text-xs text-brand-olive/60 font-semibold">סיימתם את כל המזונות המומלצים בספרייה!</p>
        </div>
      )}

      {/* Developmental Milestone Timeline */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/50 shadow-soft flex flex-col gap-4 text-right">
        <div className="flex justify-between items-center">
          <h4 className="font-serif font-bold text-lg text-brand-sage">ציר זמן התפתחותי</h4>
          <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-wider">שלב נוכחי: {babyAge || 'גיל לא מוגדר'}</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 relative mt-2">
          {/* Progress bar line */}
          <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-brand-sand -z-0"></div>
          
          {milestones.map((m, idx) => {
            const isCompleted = ageInMonths >= m.maxAge;
            const isActive = ageInMonths >= m.minAge && ageInMonths < m.maxAge;
            
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-1.5 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-soft
                  ${isActive 
                    ? 'bg-brand-sage border-brand-sage text-white scale-110 ring-4 ring-brand-sage/10 font-bold' 
                    : isCompleted 
                      ? 'bg-brand-cream border-brand-sage text-brand-sage' 
                      : 'bg-white border-brand-sand text-brand-olive/30'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} className="text-brand-sage" /> : <span>{idx + 1}</span>}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[9px] font-bold leading-tight ${isActive ? 'text-brand-sage' : 'text-brand-olive/60'}`}>{m.title}</span>
                  <span className={`text-[8px] font-medium leading-tight text-brand-olive/40 ${isActive ? 'font-bold text-brand-olive/70' : ''}`}>{m.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Description of active milestone */}
        {(() => {
          const activeMilestone = milestones.find(m => ageInMonths >= m.minAge && ageInMonths < m.maxAge) || milestones[milestones.length - 1];
          if (activeMilestone) {
            return (
              <div className="bg-brand-cream/35 border border-brand-sand p-3.5 rounded-lg flex gap-2.5 items-start mt-2 shadow-soft">
                <Sparkles size={16} className="text-brand-sage shrink-0 mt-0.5 animate-pulse" />
                <div className="flex flex-col gap-0.5 text-right">
                  <span className="text-[10px] font-bold text-brand-sage uppercase">מה כדאי להציע כעת?</span>
                  <p className="text-xs text-brand-olive/80 leading-relaxed font-semibold">
                    {activeMilestone.desc}
                  </p>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Milestone Badges & Gamification */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/50 shadow-soft flex flex-col gap-4 text-right">
        <div className="flex justify-between items-center">
          <h4 className="font-serif font-bold text-lg text-brand-sage flex items-center gap-1.5">
            <Award className="text-brand-sage" size={18} />
            הישגים ומדליות
          </h4>
          <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-wider">חגיגת התקדמות</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {[
            { 
              title: 'גיבור/ת אלרגנים', 
              desc: '3 אלרגנים בהצלחה', 
              icon: '🛡️', 
              current: foods.filter(f => f.isAllergen && f.status === 'הושלם').length, 
              target: 3 
            },
            { 
              title: 'אוהב/ת ירקות', 
              desc: '5 ירקות בהצלחה', 
              icon: '🥬', 
              current: foods.filter(f => f.category === 'ירקות' && f.status === 'הושלם').length, 
              target: 5 
            },
            { 
              title: 'חובב/ת פירות', 
              desc: '5 פירות בהצלחה', 
              icon: '🍎', 
              current: foods.filter(f => f.category === 'פירות' && f.status === 'הושלם').length, 
              target: 5 
            },
            { 
              title: 'חלבון חזק', 
              desc: '3 חלבונים בהצלחה', 
              icon: '🍗', 
              current: foods.filter(f => f.category === 'חלבונים' && f.status === 'הושלם').length, 
              target: 3 
            },
            { 
              title: 'טועם/ת מתמיד/ה', 
              desc: '10 טעימות ביומן', 
              icon: '🏆', 
              current: foods.reduce((acc, f) => acc + f.attempts.length, 0), 
              target: 10 
            }
          ].map((badge, idx) => {
            const isUnlocked = badge.current >= badge.target;
            const pct = Math.min(Math.round((badge.current / badge.target) * 100), 100);
            
            return (
              <motion.div
                key={idx}
                whileHover={isUnlocked ? { y: -2 } : {}}
                className={`p-3 border rounded-xl flex flex-col items-center text-center gap-1.5 shadow-soft transition-all relative overflow-hidden
                  ${isUnlocked 
                    ? 'bg-brand-cream/40 border-brand-sage/30 text-brand-olive' 
                    : 'bg-gray-50/50 border-gray-200 text-gray-400 opacity-60'
                  }`}
              >
                <span className={`text-3xl filter ${isUnlocked ? 'drop-shadow-md' : 'grayscale'}`}>
                  {badge.icon}
                </span>
                
                <div className="flex flex-col gap-0.5">
                  <span className={`text-[10px] font-bold leading-tight ${isUnlocked ? 'text-brand-sage' : 'text-gray-500'}`}>
                    {badge.title}
                  </span>
                  <span className="text-[8px] font-semibold text-brand-olive/40 leading-none">
                    {badge.desc}
                  </span>
                </div>

                <div className="w-full mt-1">
                  <div className="flex justify-between items-center text-[8px] font-bold mb-0.5">
                    <span>{pct}%</span>
                    <span>{badge.current}/{badge.target}</span>
                  </div>
                  <div className="w-full h-1 bg-brand-sand/55 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isUnlocked ? 'bg-brand-sage' : 'bg-gray-300'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="absolute top-1 right-1 text-gray-300">
                    <Lock size={10} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent/Daily Tip */}
      <div className={`bg-white rounded-xl p-6 border ${currentTip.border} flex flex-col sm:flex-row gap-4 items-center`}>
        <div className="w-16 h-16 bg-brand-cream rounded-lg flex items-center justify-center text-3xl shadow-soft shrink-0 border border-brand-sand/50">{currentTip.icon}</div>
        <div className="flex flex-col text-center sm:text-right">
          <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-[0.15em] mb-1">{currentTip.sub}</span>
          <h4 className="font-serif font-bold text-lg leading-tight text-brand-sage mb-1">{currentTip.title}</h4>
          <p className="text-xs leading-relaxed text-brand-olive/70 font-medium">
            {currentTip.content}
          </p>
        </div>
      </div>

      {/* Stats & Trends Section */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/50 shadow-soft flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-lg text-brand-sage flex items-center gap-1.5">
            <TrendingUp className="text-brand-primary-container" size={18} />
            גרפים ומגמות
          </h4>
          <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-wider">מעקב התפתחות</span>
        </div>
        
        {/* Category Progress Bars */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-tight">התקדמות לפי קטגוריות</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'ירקות', completed: foods.filter(f => f.category === 'ירקות' && f.status === 'הושלם').length, total: foods.filter(f => f.category === 'ירקות').length },
              { name: 'פירות', completed: foods.filter(f => f.category === 'פירות' && f.status === 'הושלם').length, total: foods.filter(f => f.category === 'פירות').length },
              { name: 'חלבונים', completed: foods.filter(f => f.category === 'חלבונים' && f.status === 'הושלם').length, total: foods.filter(f => f.category === 'חלבונים').length },
              { name: 'אלרגנים', completed: foods.filter(f => f.category === 'אלרגנים' && f.status === 'הושלם').length, total: foods.filter(f => f.category === 'אלרגנים').length },
              { name: 'דגנים', completed: foods.filter(f => f.category === 'דגנים' && f.status === 'הושלם').length, total: foods.filter(f => f.category === 'דגנים').length },
              { name: 'תיבול', completed: foods.filter(f => f.category === 'תיבול' && f.status === 'הושלם').length, total: foods.filter(f => f.category === 'תיבול').length },
            ].map((cat, idx) => {
              const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
              return (
                <div key={idx} className="bg-brand-cream/30 border border-brand-sand/50 rounded-lg p-3 flex flex-col gap-1 shadow-soft">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-brand-olive">{cat.name}</span>
                    <span className="text-brand-olive/50">{cat.completed} מתוך {cat.total} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full bg-brand-sage rounded-full"
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tastings Activity Chart */}
        {foods.some(f => f.attempts.length > 0) && (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-brand-olive/60 uppercase tracking-tight">פעילות טעימות ב-7 הימים האחרונים</span>
            <div className="h-40 w-full bg-brand-cream/30 border border-brand-sand/50 rounded-lg p-2 shadow-soft" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getLast7DaysStats(foods)} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#EBE6DD" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #EFEEEB', fontSize: '11px', fontWeight: 'bold', textAlign: 'right', backgroundColor: '#FFFFFF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="מספר טעימות" 
                    stroke="#475B4C" 
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#fff', stroke: '#475B4C', strokeWidth: 1.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Summaries: Loved vs Sensitivities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Loved Foods */}
          <div className="bg-brand-cream/20 border border-brand-sand/60 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-xs font-bold text-brand-sage uppercase tracking-tight flex items-center gap-1">
              😍 המועדפים של {activeProfile?.name || 'אריאל'}
            </span>
            <div className="flex flex-col gap-1.5">
              {foods.filter(f => f.attempts.some(a => a.reaction === 'אהב/ה')).slice(0, 3).length > 0 ? (
                foods.filter(f => f.attempts.some(a => a.reaction === 'אהב/ה')).slice(0, 3).map(f => (
                  <div 
                    key={f.id} 
                    onClick={() => setSelectedFoodId && setSelectedFoodId(f.id)}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-brand-sand/40 text-xs font-bold text-brand-olive shadow-soft cursor-pointer hover:border-brand-sage/40 transition-colors"
                  >
                    <span className="text-base">{f.icon}</span>
                    <span>{f.name}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-brand-olive/40 italic font-medium">עדיין אין מאכלים אהובים...</span>
              )}
            </div>
          </div>

          {/* Sensitivities */}
          <div className="bg-brand-cream/20 border border-brand-sand/60 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-xs font-bold text-brand-olive/60 uppercase tracking-tight flex items-center gap-1">
              ⚠️ רגישויות וסירובים
            </span>
            <div className="flex flex-col gap-1.5">
              {foods.filter(f => f.status === 'רגישות/תגובה' || f.attempts.some(a => a.reaction === 'סירב/ה')).slice(0, 3).length > 0 ? (
                foods.filter(f => f.status === 'רגישות/תגובה' || f.attempts.some(a => a.reaction === 'סירב/ה')).slice(0, 3).map(f => {
                  const hasAllergy = f.status === 'רגישות/תגובה' || f.attempts.some(a => a.reaction === 'תגובה אלרגית');
                  return (
                    <div 
                      key={f.id} 
                      onClick={() => setSelectedFoodId && setSelectedFoodId(f.id)}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg border bg-white text-xs font-bold shadow-soft border-brand-sand/40 text-brand-olive cursor-pointer hover:border-brand-sage/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{f.icon}</span>
                        <span>{f.name}</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded ${
                        hasAllergy ? 'bg-brand-blush/30 text-brand-olive' : 'bg-brand-sand text-brand-olive/60'
                      }`}>
                        {hasAllergy ? 'רגישות' : 'סירוב'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-brand-olive/40 italic font-medium">לא נרשמו רגישויות או סירובים...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Categories Navigation Shortcuts */}
      <div className="flex flex-col gap-3">
        <h4 className="font-serif font-bold text-lg text-brand-sage px-2">גישה מהירה</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'אלרגנים', icon: '⚠️', cat: 'אלרגנים', bg: 'bg-white', border: 'border-brand-blush/30', text: 'text-brand-olive' },
            { label: 'רגישויות', icon: '🔍', cat: 'רגישויות', bg: 'bg-white', border: 'border-brand-sand/50', text: 'text-brand-olive' },
            { label: 'כל המזונות', icon: '📖', cat: 'הכל', bg: 'bg-white', border: 'border-brand-sand/50', text: 'text-brand-olive' },
          ].map((action, i) => (
            <motion.button 
              key={i}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedCategory(action.cat as any); setActiveTab('foods'); }}
              className={`${action.bg} border ${action.border} p-4 rounded-xl flex flex-col items-center gap-2 shadow-soft transition-all`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${action.text}`}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { useFoodContext } from '../context';
import { tipsData } from '../data';
import { Category } from '../types';
import { getBabyAge, getLast7DaysStats } from '../utils/babyUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ChevronLeft } from 'lucide-react';

interface HomeViewProps {
  setSelectedCategory: (category: Category | 'הכל' | 'רגישויות') => void;
  setActiveTab: (tab: 'home' | 'foods' | 'calendar' | 'settings') => void;
  setProgressListType: (type: 'הושלם' | 'בתהליך' | null) => void;
  setProgressListCategory: (category: Category | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setSelectedCategory,
  setActiveTab,
  setProgressListType,
  setProgressListCategory,
}) => {
  const { foods, activeProfile } = useFoodContext();

  const completedCount = foods.filter(f => f.status === 'הושלם').length;
  const inProgressCount = foods.filter(f => f.status === 'בתהליך').length;

  const selectedCategory = 'הכל'; // Fallback / default
  const currentTip = tipsData[selectedCategory] || tipsData['הכל'];

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
                  <div key={f.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-brand-sand/40 text-xs font-bold text-brand-olive shadow-soft">
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
                    <div key={f.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg border bg-white text-xs font-bold shadow-soft border-brand-sand/40 text-brand-olive">
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

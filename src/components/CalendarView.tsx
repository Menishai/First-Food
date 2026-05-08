import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Attempt {
  id: string;
  foodId: string;
  foodName: string;
  foodIcon: string;
  date: string;
  amount: string;
  reaction: string;
}

interface CalendarViewProps {
  attempts: Attempt[];
  onDateSelect: (date: Date | null) => void;
  selectedDate: Date | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ attempts, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getAttemptsForDay = (day: Date) => {
    return attempts.filter(a => isSameDay(parseISO(a.date), day));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-t-[2rem] border-b border-brand-sand">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-brand-sand/30 rounded-xl transition-all text-brand-olive active:scale-90"
        >
          <ChevronRight size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-base font-black text-slate-800 capitalize leading-none mb-1">
            {format(currentMonth, 'MMMM', { locale: he })}
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {format(currentMonth, 'yyyy')}
          </span>
        </div>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-brand-sand/30 rounded-xl transition-all text-brand-olive active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const daysName = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-brand-sand bg-white/50">
        {daysName.map((day, i) => (
          <div key={i} className="py-2 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    return (
      <div className="grid grid-cols-7 bg-white rounded-b-[2rem] overflow-hidden">
        {days.map((day, i) => {
          const dayAttempts = getAttemptsForDay(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          // Colors for dots
          const hasAllergy = dayAttempts.some(a => a.reaction === 'תגובה אלרגית');
          const hasLiked = dayAttempts.some(a => a.reaction === 'אהב/ה');
          const hasRegular = dayAttempts.some(a => a.reaction !== 'אהב/ה' && a.reaction !== 'תגובה אלרגית');

          return (
            <button
              key={i}
              onClick={() => onDateSelect(isSelected ? null : day)}
              className={`relative h-14 flex flex-col items-center justify-center transition-all border-[0.5px] border-brand-sand/30 ${
                !isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'
              } ${isSelected ? 'bg-brand-sage/10 ring-1 ring-inset ring-brand-sage' : 'hover:bg-brand-cream'}`}
            >
              <span className={`text-sm font-bold ${
                !isCurrentMonth ? 'text-slate-300' : 
                isToday ? 'text-brand-sage underline decoration-2 underline-offset-4' : 'text-slate-700'
              }`}>
                {format(day, 'd')}
              </span>
              
              <div className="flex gap-0.5 mt-1">
                {hasAllergy && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" />}
                {hasLiked && <div className="w-1.5 h-1.5 rounded-full bg-brand-sage shadow-sm" />}
                {hasRegular && !hasAllergy && !hasLiked && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />}
                {dayAttempts.length > 3 && <div className="w-1 h-1 rounded-full bg-slate-300" />}
              </div>

              {isSelected && (
                <motion.div 
                  layoutId="calendar-select"
                  className="absolute inset-0 border-2 border-brand-sage z-10 pointer-events-none"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderSummary = () => {
    const monthAttempts = attempts.filter(a => isSameMonth(parseISO(a.date), monthStart));
    const allergies = monthAttempts.filter(a => a.reaction === 'תגובה אלרגית').length;
    
    return (
      <div className="flex gap-4 p-4 bg-brand-sand/10 border-t border-brand-sand">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">טעימות החודש</span>
          <span className="text-xl font-black text-slate-800">{monthAttempts.length}</span>
        </div>
        <div className="w-px h-8 bg-brand-sand/50 self-center" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">רגישויות קרו</span>
          <span className={`text-xl font-black ${allergies > 0 ? 'text-rose-500' : 'text-slate-800'}`}>
            {allergies}
          </span>
        </div>
        <div className="mr-auto flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-brand-sand shadow-sm">
           <div className="w-2 h-2 rounded-full bg-brand-sage" />
           <span className="text-[10px] font-bold text-slate-500">בוצעו חשיפות</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col border border-brand-sand rounded-[2rem] shadow-sm overflow-hidden bg-white mb-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderSummary()}
    </div>
  );
};

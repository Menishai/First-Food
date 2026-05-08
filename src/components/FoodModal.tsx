import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Calendar, AlertCircle, CheckCircle2, Droplets, Download, TrendingUp, ChevronDown, Share2, Image as ImageIcon, FileText, FileSpreadsheet, File, MessageCircle, Info } from 'lucide-react';
import { FoodItem, Amount, Reaction, Status, Preparation } from '../types';
import { tipsData } from '../data';
import { useFoodContext } from '../context';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import * as htmlToImage from 'html-to-image';

interface FoodModalProps {
  food: FoodItem;
  onClose: () => void;
}

export const FoodModal: React.FC<FoodModalProps> = ({ food, onClose }) => {
  const { foods, addAttempt, activeProfile, acknowledgeAllergen } = useFoodContext();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<Amount>('טעימה');
  const [reaction, setReaction] = useState<Reaction>('אהב/ה');
  const [preparation, setPreparation] = useState<Preparation>('טחון');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [isRuleExpanded, setIsRuleExpanded] = useState(false);
  const [isTipExpanded, setIsTipExpanded] = useState(false);
  const [isAllergenExpanded, setIsAllergenExpanded] = useState(!food.allergenWarningAcknowledged);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const amounts: Amount[] = ['טעימה', 'חצי מנה', 'מנה שלמה'];
  const reactions: Reaction[] = ['אהב/ה', 'ניטרלי', 'סירב/ה', 'תגובה אלרגית'];
  const preparations: Preparation[] = ['טחון', 'מעוך', 'מאודה', 'מבושל', 'חי', 'אחר'];

  const amountIcons: Record<string, string> = {
    'טעימה': '🥄',
    'חצי מנה': '🥣',
    'מנה שלמה': '🍲'
  };

  const hasRefusal = food.attempts.some(a => a.reaction === 'סירב/ה');
  const requiredAttempts = hasRefusal ? 4 : 3;

  const renderNotes = (text: string) => {
    const parts = text.split(/\*(.*?)\*/);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-[#2D2D2D] not-italic">{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttempt(food.id, { date, amount, reaction, preparation, notes });
    // Reset form mostly but keep date
    setAmount('טעימה');
    setReaction('אהב/ה');
    setPreparation('טחון');
    setNotes('');
    onClose();
  };

  const exportToCSV = () => {
    const headers = ['תאריך טעימה', 'מאכל', 'כמות', 'תגובה', 'הערות'];
    const rows = food.attempts.map((a, i) => [
      new Date(a.date).toLocaleDateString('he-IL'),
      food.name,
      a.amount,
      a.reaction,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    // Add BOM for Hebrew character support in Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `סיכום_${food.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowShareMenu(false);
  };

  const downloadImage = () => {
    setShowShareMenu(false);
    
    setTimeout(async () => {
      if (!shareCardRef.current) return;
      try {
        const dataUrl = await htmlToImage.toPng(shareCardRef.current, { 
          backgroundColor: '#F9F7F2', 
          pixelRatio: 2,
          quality: 1
        });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `טעימה_${food.name.replace(/\s+/g, '_')}.png`;
        link.click();
      } catch (error) {
        console.error('Failed to capture image', error);
      }
    }, 100);
  };

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const rows = food.attempts.map((a) => ({
        'תאריך טעימה': new Date(a.date).toLocaleDateString('he-IL'),
        'מאכל': food.name,
        'כמות': a.amount,
        'תגובה': a.reaction,
        'הערות': a.notes || ''
      }));
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, food.name);
      XLSX.writeFile(workbook, `סיכום_${food.name}.xlsx`);
    } catch (error) {
       console.error('Failed to export to excel', error);
    }
    setShowShareMenu(false);
  };

  const printToPDFAll = () => {
    const eatenFoods = foods.filter(f => f.attempts.length > 0);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let html = `
    <html dir="rtl" lang="he">
     <head>
       <title>כל הטעימות</title>
       <style>
         body { font-family: sans-serif; padding: 20px; color: #333; }
         h2 { color: #ff9f66; border-bottom: 2px solid #ff9f66; padding-bottom: 10px; }
         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
         th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: right; }
         th { background-color: #f9f7f2; color: #555; }
         tr:nth-child(even) { background-color: #fafbfc; }
       </style>
     </head>
     <body>
       <h2>דו"ח כל הטעימות</h2>
       <table>
         <thead>
            <tr>
              <th>מאכל</th>
              <th>קטגוריה</th>
              <th>תאריך אחרון</th>
              <th>תגובה אחרונה</th>
              <th>מס' פעמים</th>
              <th>הערות</th>
            </tr>
         </thead>
         <tbody>
    `;
    
    eatenFoods.forEach(f => {
       const lastAttempt = f.attempts[0];
       html += `
         <tr>
           <td>${f.icon} ${f.name}</td>
           <td>${f.category}</td>
           <td>${lastAttempt ? new Date(lastAttempt.date).toLocaleDateString('he-IL') : '-'}</td>
           <td>${lastAttempt ? lastAttempt.reaction : '-'}</td>
           <td>${f.attempts.length}</td>
           <td>${lastAttempt && lastAttempt.notes ? lastAttempt.notes : '-'}</td>
         </tr>
       `;
    });
    
    html += `
         </tbody>
       </table>
       <script>
         window.onload = function() { 
           setTimeout(function() {
             window.print(); 
           }, 500); 
         }
       </script>
     </body>
    </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setShowShareMenu(false);
  };

  const shareWhatsApp = () => {
    let text = `היי! רצינו לשתף שטעימנו ${food.name} ${food.icon}!\n`;
    if (food.attempts.length > 0) {
       text += `היו לנו כבר ${food.attempts.length} התנסויות.\n`;
       const last = food.attempts[0];
       text += `בפעם האחרונה התגובה הייתה: ${last.reaction}.\n`;
       if (last.notes) {
           text += `הערות: ${last.notes}\n`;
       }
    }
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md overflow-x-hidden overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        ref={modalRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-brand-cream w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-brand-sand relative z-10 m-0 sm:m-4 touch-pan-y"
      >
        {/* Header */}
        <div className="px-5 py-2.5 flex justify-between items-center bg-white relative border-b border-brand-sand">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">{food.icon}</span>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">{food.name}</h2>
              <div className="text-[9px] font-bold uppercase tracking-widest text-brand-sage">{food.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                title="שיתוף וייצוא"
                className="p-1.5 bg-brand-sand/30 rounded-full hover:bg-brand-sand text-slate-600 transition-colors shadow-sm flex items-center justify-center"
              >
                <Share2 size={14} />
              </motion.button>
              
              {showShareMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-brand-sand overflow-hidden z-50 p-1"
                >
                  <div className="flex flex-col gap-0.5">
                    <button onClick={downloadImage} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-blue-50 text-blue-500 rounded-md"><ImageIcon size={14} /></div>
                      שמירה כתמונה
                    </button>
                    <button onClick={shareWhatsApp} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-green-50 text-green-500 rounded-md"><MessageCircle size={14} /></div>
                      שיתוף בוואטסאפ
                    </button>
                    <div className="h-px bg-brand-sand/50 my-1 mx-2"></div>
                    <button onClick={exportToCSV} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-slate-50 text-slate-500 rounded-md"><FileText size={14} /></div>
                      טעימה נוכחית (CSV)
                    </button>
                    <button onClick={exportToExcel} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-emerald-50 text-emerald-500 rounded-md"><FileSpreadsheet size={14} /></div>
                      טעימה נוכחית (Excel)
                    </button>
                    <button onClick={printToPDFAll} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-rose-50 text-rose-500 rounded-md"><File size={14} /></div>
                      כל הטעימות ביומן (PDF)
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-all"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Tabs Segmented Control */}
        <div className="px-5 py-2 bg-white/50 border-b border-brand-sand">
          <div className="flex bg-brand-sand/30 p-1 rounded-xl relative">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all relative z-10 ${
                activeTab === 'form' 
                  ? 'text-brand-olive' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              דיווח טעימה
            </button>
            <button
              onClick={() => food.attempts.length > 0 && setActiveTab('history')}
              disabled={food.attempts.length === 0}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all relative z-10 ${
                activeTab === 'history' 
                  ? 'text-brand-olive' 
                  : 'text-slate-400 hover:text-slate-600'
              } ${food.attempts.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              היסטוריה והתקדמות
            </button>
            <motion.div 
              layoutId="activeTab"
              initial={false}
              animate={{ x: activeTab === 'form' ? '0%' : '-100%' }}
              className="absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 pb-12 flex flex-col gap-4">
          
          {activeTab === 'form' ? (
            <>
              {food.isAllergen && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shrink-0 shadow-sm">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-400"></div>
                  
                  <button 
                    type="button"
                    onClick={() => setIsAllergenExpanded(!isAllergenExpanded)}
                    className="flex justify-between items-center w-full text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <AlertCircle className="text-rose-600" size={20} />
                      </div>
                      <h4 className="font-bold text-rose-800 text-sm">מזון אלרגני - שימו לב!</h4>
                    </div>
                    <ChevronDown size={18} className={`text-rose-400 transition-transform duration-300 ${isAllergenExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isAllergenExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="flex flex-col gap-4 mt-2 pr-2 overflow-hidden"
                    >
                      <p className="text-rose-800 text-sm leading-relaxed font-bold">
                        מומלץ לחשוף למזון זה בשעות הבוקר או הצהריים, סמוך להשגחה צמודה.
                      </p>
                      <ul className="text-rose-700/80 text-[13px] list-disc list-inside space-y-2 font-bold leading-relaxed">
                        <li>אין לחשוף במקביל למזון חדש נוסף באותו יום.</li>
                        <li>הגישו כמות מזערית ביום הראשון.</li>
                        <li>במידה ומופיעה <span className="text-rose-900 underline decoration-rose-300">פריחה, נפיחות, קשיי נשימה או הקאה</span>: יש להפסיק מיד, להימנע מהמזון, ולהתייעץ בדחיפות עם רופא.</li>
                      </ul>
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeAllergen(food.id);
                            setIsAllergenExpanded(false);
                          }}
                          className="bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 text-[11px] font-black uppercase tracking-widest py-2 px-5 rounded-2xl transition-all shadow-sm active:scale-95"
                        >
                          אישור חשיפה
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Category Tip */}
              {tipsData[food.category] && (
                <div className={`${tipsData[food.category].bg} border ${tipsData[food.category].border} p-4 rounded-2xl flex flex-col gap-3 shrink-0 shadow-sm relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 w-1.5 h-full opacity-20 ${tipsData[food.category].bg === 'bg-amber-50' ? 'bg-amber-400' : 'bg-brand-sage'}`}></div>
                  <button 
                    type="button"
                    onClick={() => setIsTipExpanded(!isTipExpanded)}
                    className="flex justify-between items-center w-full text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                       <span className={`text-xl drop-shadow-sm`}>{tipsData[food.category].icon}</span>
                       <span className={`font-bold ${tipsData[food.category].textDark} text-sm group-hover:opacity-80 transition-opacity`}>טיפ: {tipsData[food.category].title}</span>
                    </div>
                    <ChevronDown size={18} className={`${tipsData[food.category].textMain} transition-transform duration-300 ${isTipExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isTipExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-1 overflow-hidden"
                    >
                      <p className={`text-sm ${tipsData[food.category].textDark} leading-relaxed font-bold opacity-90`}>
                        {tipsData[food.category].content}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

          {/* Serving Suggestion */}
          {food.servingSuggestion && (
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex gap-3 items-start relative overflow-hidden shrink-0 shadow-sm">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-sky-400/30"></div>
              <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                <Info className="text-sky-500" size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="font-bold text-sky-800 text-sm">איך להגיש?</h4>
                <p className="text-sky-700 text-xs leading-relaxed">
                  {food.servingSuggestion}
                </p>
                {food.recommendedPhase && (
                  <div className="mt-2 text-[9px] font-bold text-sky-600 bg-white border border-sky-100 inline-block px-2 py-1 rounded-full uppercase tracking-wider w-fit">
                    שלב {food.recommendedPhase}
                  </div>
                )}
              </div>
            </div>
          )}

          {food.isAromaticOnly && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start relative overflow-hidden shrink-0 shadow-sm">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-400/30"></div>
              <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                <AlertCircle className="text-amber-500" size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="font-bold text-amber-800 text-sm">תיבול בלבד!</h4>
                <p className="text-amber-700 text-xs leading-relaxed">
                  מרכיב זה נועד להענקת טעם למי הבישול בלבד. יש להוציאו לפני הטחינה וההגשה.
                </p>
              </div>
            </div>
          )}

          <div className="bg-brand-sand/30 border border-brand-sand p-4 rounded-2xl flex flex-col gap-3 shrink-0 shadow-sm relative">
            <button 
              type="button"
              onClick={() => setIsRuleExpanded(!isRuleExpanded)}
              className="flex justify-between items-center w-full text-right cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                  <TrendingUp className="text-brand-sage" size={18} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-brand-olive text-sm group-hover:text-brand-olive/80 transition-colors">מעקב חשיפות</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {Math.min(food.attempts.length, requiredAttempts)} מתוך {requiredAttempts} חשיפות
                  </span>
                </div>
              </div>
              <ChevronDown size={18} className={`text-brand-sage transition-transform duration-300 ${isRuleExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isRuleExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="flex flex-col gap-4 overflow-hidden pt-2"
              >
                <p className="text-[13px] text-brand-olive/70 font-bold leading-relaxed">
                  {hasRefusal 
                    ? "מאחר ונרשם סירוב, מומלץ לבצע חשיפה רביעית כדי להתרגל לטעם. אל תתייאשו, זהו תהליך למידה!"
                    : "מומלץ להגיש מאכל חדש במשך 3 ימים ברצף כדי לוודא הסתגלות מלאה ושלילת תגובה אלרגית."}
                </p>
                <div className="flex gap-2">
                  {Array.from({ length: requiredAttempts }).map((_, idx) => (
                    <div key={idx} className={`flex-1 h-2 rounded-full relative overflow-hidden ${idx < food.attempts.length ? 'bg-brand-sage/20' : 'bg-slate-200/50'}`}>
                      {idx < food.attempts.length && (
                        <motion.div 
                          initial={{ x: "-100%" }}
                          animate={{ x: 0 }}
                          className="absolute inset-0 bg-brand-sage"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Add Attempt Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 shrink-0 bg-white p-6 rounded-2xl border border-brand-sand shadow-sm">
            <h3 className="text-lg font-bold flex items-center gap-2.5 text-slate-800 leading-none">
              <div className="bg-brand-sand/50 p-1.5 rounded-lg text-brand-sage"><Plus size={18} strokeWidth={2.5} /></div>
              דיווח טעימה חדשה
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">תאריך</label>
              <div className="relative">
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-sage pointer-events-none" size={18} />
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="p-3 pr-10 border border-brand-sand rounded-xl w-full text-base text-slate-800 focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage focus:outline-none transition-all font-bold bg-brand-cream/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">כמות</label>
              <div className="flex rounded-xl bg-brand-sand/20 p-1 border border-brand-sand/30">
                {amounts.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`flex-1 py-1.5 px-0.5 text-[10px] font-bold rounded-lg transition-all ${amount === a ? 'bg-white shadow text-brand-sage' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}
                  >
                    <span className="flex flex-col items-center gap-0.5">
                      <span className="text-base">{amountIcons[a]}</span>
                      {a}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">צורת הגשה</label>
              <div className="grid grid-cols-3 gap-1.5 bg-brand-sand/20 p-1 rounded-xl border border-brand-sand/30">
                {preparations.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreparation(p)}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg transition-all ${preparation === p ? 'bg-white shadow text-brand-sage' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
               <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">איך התינוק הגיב?</label>
               <div className="grid grid-cols-3 gap-2">
                  {reactions.filter(r => r !== 'תגובה אלרגית').map(r => (
                    <motion.button
                      key={r}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setReaction(r)}
                      className={`py-3 px-1 border rounded-xl font-bold transition-all text-[11px] flex flex-col items-center justify-center gap-1
                        ${reaction === r 
                          ? 'bg-brand-cream border-brand-sage text-brand-sage shadow shadow-brand-sage/10' 
                          : 'bg-white border-brand-sand text-slate-400 hover:border-brand-sand/80'
                        }`}
                    >
                      <span className="text-lg drop-shadow-sm">
                        {r === 'אהב/ה' && '😍'}
                        {r === 'ניטרלי' && '😐'}
                        {r === 'סירב/ה' && '🙅'}
                      </span>
                      {r}
                    </motion.button>
                  ))}
               </div>
               
               {reaction === 'סירב/ה' && (
                 <motion.div 
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mt-1 bg-amber-50 border border-amber-100 p-2.5 rounded-xl flex gap-2 items-start"
                 >
                   <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-amber-800 leading-relaxed font-bold">
                     לא לדאוג! לעיתים נדרשות 10-15 חשיפות למאכל חדש כדי להתרגל. נסו שיטת הכנה אחרת.
                   </p>
                 </motion.div>
               )}
            </div>

            <div className={`p-4 border rounded-xl mt-1 transition-all duration-300 ${reaction === 'תגובה אלרגית' ? 'bg-rose-50 border-rose-200' : 'bg-brand-cream/20 border-brand-sand'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                   <div className={`p-1.5 rounded-lg shadow-sm ${reaction === 'תגובה אלרגית' ? 'bg-white text-rose-500' : 'bg-white text-slate-300'}`}>
                    <AlertCircle size={15} strokeWidth={2.5} />
                   </div>
                   <div className="flex flex-col">
                    <label htmlFor="reaction-toggle" className={`text-xs font-bold cursor-pointer transition-colors ${reaction === 'תגובה אלרגית' ? "text-rose-800" : "text-slate-500"}`}>
                      נצפתה רגישות?
                    </label>
                    <span className="text-[9px] font-bold text-slate-400">תגובה אלרגית או פריחה</span>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="reaction-toggle"
                    className="sr-only peer"
                    checked={reaction === 'תגובה אלרגית'}
                    onChange={(e) => setReaction(e.target.checked ? 'תגובה אלרגית' : 'אהב/ה')}
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-1rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              {reaction === 'תגובה אלרגית' && (
                <div className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100 flex gap-2 items-start shadow-inner">
                    <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-rose-800 leading-relaxed font-bold">
                      יש לפנות לרופא להתייעצות בהקדם. דאגו לתעד את התסמינים לרופא.
                    </p>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-rose-400 block mb-2">תסמינים:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['פריחה', 'אדמומיות', 'הקאות', 'שלשולים', 'נפיחות', 'קוצר נשימה', 'אי שקט'].map(symptom => {
                        const isSelected = notes.includes(symptom);
                        return (
                          <button
                            key={symptom}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNotes(notes.replace(symptom, '').replace(', ,', ',').trim());
                              } else {
                                if (notes.length === 0) setNotes(symptom);
                                else setNotes(`${notes.trim()}, ${symptom}`);
                              }
                            }}
                            className={`py-1 px-2.5 text-[10px] font-bold rounded-lg transition-all border ${
                              isSelected
                                ? 'bg-rose-500 text-white border-rose-600'
                                : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
                            }`}
                          >
                            {symptom}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-[9px] font-bold uppercase tracking-wider ${reaction === 'תגובה אלרגית' ? 'text-rose-400' : 'text-slate-400'}`}>
                {reaction === 'תגובה אלרגית' ? 'פירוט נוסף לרופא' : 'הערות'}
              </label>
              <textarea 
                rows={1}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`p-2.5 border border-brand-sand rounded-xl w-full text-base text-slate-800 focus:ring-2 focus:outline-none transition-all font-bold ${
                   reaction === 'תגובה אלרגית' ? 'focus:ring-rose-200 border-rose-300 bg-rose-50/10' : 'focus:ring-brand-sage/10 bg-brand-cream/5'
                }`}
                placeholder={reaction === 'תגובה אלרגית' ? "תארו את התגובה..." : "איך היה? (אופציונלי)"}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01, backgroundColor: "#3a562d" }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              className="mt-1 w-full py-3.5 bg-brand-sage text-white rounded-xl font-bold text-base shadow-lg shadow-brand-sage/10 transition-all"
            >
              שמירת טעימה
            </motion.button>
          </form>
            </>
          ) : (
            <div className="flex flex-col gap-6">
              {food.attempts.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                      <div className="bg-brand-sand/50 p-1.5 rounded-lg text-brand-olive"><TrendingUp size={18} strokeWidth={2.5} /></div>
                      מגמת התקדמות
                    </h3>
              
                    <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white border border-brand-sand p-2.5 rounded-xl shadow-sm" dir="rtl">
                      <span className="text-brand-sage">מקרא:</span>
                      <span className="flex items-center gap-1 opacity-70">🥄 טעימה</span>
                      <span className="flex items-center gap-1 opacity-70">🥣 חצי מנה</span>
                      <span className="flex items-center gap-1 opacity-70">🍲 מנה שלמה</span>
                    </div>

                    <div className="h-48 w-full bg-white border border-brand-sand rounded-2xl p-4 shadow-sm" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...food.attempts].reverse().map((a, i) => ({
                          name: `ט#${i + 1}`,
                          date: new Date(a.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
                          reactionValue: a.reaction === 'אהב/ה' ? 3 : a.reaction === 'ניטרלי' ? 2 : a.reaction === 'סירב/ה' ? 1 : 0,
                          reaction: a.reaction,
                          amount: a.amount
                        }))} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                          <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F0EBE0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} />
                          <YAxis 
                            domain={[0, 3]} 
                            ticks={[0, 1, 2, 3]} 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(val) => val === 3 ? '😍' : val === 2 ? '😐' : val === 1 ? '🙅' : '⚠️'}
                            tick={{ fontSize: 14 }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: '1px solid #EBE6DD', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right', fontSize: '11px', fontWeight: 'bold' }}
                            formatter={(val: any, name: any, props: any) => [`${props.payload.reaction} ${amountIcons[props.payload.amount] || ''}`, 'תגובה']}
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="reactionValue" 
                            stroke="#5C7A4D" 
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#5C7A4D' }}
                            activeDot={{ r: 6, fill: '#5C7A4D', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                      <div className="bg-brand-sand/50 p-1.5 rounded-lg text-brand-olive"><Calendar size={18} strokeWidth={2.5} /></div>
                      כל הטעימות
                    </h3>
                    <div className="flex flex-col gap-3 relative">
                      <div className="absolute top-0 bottom-0 right-[15px] w-0.5 bg-brand-sand/50 -z-0"></div>
                      {food.attempts.map((attempt, index) => (
                        <div key={attempt.id} className="flex items-start gap-3 relative z-10">
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm border-2 border-white ${
                             attempt.reaction === 'אהב/ה' ? 'bg-brand-sage' :
                             attempt.reaction === 'תגובה אלרגית' ? 'bg-rose-500' :
                             attempt.reaction === 'סירב/ה' ? 'bg-slate-300' :
                             'bg-amber-400'
                          }`}>
                            <span className="text-white text-[10px] font-bold">{food.attempts.length - index}</span>
                          </div>
                          <div className="flex-1 bg-white p-4 rounded-2xl border border-brand-sand shadow-sm">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800">טעימה של {food.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    {new Date(attempt.date).toLocaleDateString('he-IL')}
                                  </span>
                                  <span className="text-slate-200 text-[8px]">•</span>
                                  <span className="text-[8px] font-bold uppercase tracking-wider text-brand-sage">
                                    {amountIcons[attempt.amount]} {attempt.amount}
                                  </span>
                                </div>
                              </div>
                              <div className={`text-[8px] px-2 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border ${
                                 attempt.reaction === 'אהב/ה' ? 'bg-brand-sage/5 text-brand-sage border-brand-sage/10' :
                                 attempt.reaction === 'תגובה אלרגית' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                 attempt.reaction === 'סירב/ה' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                                 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {attempt.reaction === 'אהב/ה' && <span className="text-[10px]">😍</span>}
                                {attempt.reaction === 'ניטרלי' && <span className="text-[10px]">😐</span>}
                                {attempt.reaction === 'סירב/ה' && <span className="text-[10px]">🙅</span>}
                                {attempt.reaction === 'תגובה אלרגית' && <AlertCircle size={10} strokeWidth={3} />}
                                <span>{attempt.reaction}</span>
                              </div>
                            </div>
                            {attempt.notes && (
                              <div className="text-[11px] text-slate-600 mt-2 bg-brand-cream/30 p-3 rounded-xl italic font-medium leading-relaxed border border-brand-sand/30">
                                {renderNotes(attempt.notes)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Hidden Render Container for Image Export */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -1 }}>
        <div 
          ref={shareCardRef} 
          className="bg-[#F9F7F2] p-12 flex flex-col items-center justify-center font-sans tracking-tight"
          style={{ width: '1080px', height: '1080px', direction: 'rtl' }}
        >
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm flex flex-col items-center w-full h-full border border-[#EBE6DD]">
            <div className="text-center space-y-6 mt-10">
              <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-6xl shadow-inner border border-orange-200 overflow-hidden">
                 {activeProfile?.avatar ? (
                   <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span>🍼</span>
                 )}
              </div>
              <h1 className="text-4xl font-bold text-slate-800">היומן של {activeProfile?.name || 'אריאל'}</h1>
            </div>

            <div className="mt-16 flex flex-col items-center flex-1 w-full p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-orange-50 to-transparent opacity-60"></div>
              <span className="text-[7rem] leading-none mb-6 relative z-10 filter drop-shadow-xl">{food.icon}</span>
              <h2 className="text-6xl font-extrabold text-slate-800 mb-3 relative z-10">{food.name}</h2>
              <div className="text-2xl text-slate-500 font-bold mb-10 relative z-10 px-6 py-2 bg-white rounded-full border border-slate-200 shadow-sm">{food.category}</div>
              
              <div className="flex gap-8 w-full justify-center relative z-10 mt-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm flex flex-col items-center flex-1 border border-slate-100">
                     <span className="text-slate-400 text-xl font-bold mb-2">מספר טעימות</span>
                     <span className="text-5xl font-black text-orange-500">{food.attempts.length}</span>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm flex flex-col items-center flex-1 border border-slate-100">
                     <span className="text-slate-400 text-xl font-bold mb-2">סטטוס</span>
                     <span className="text-4xl font-black text-[#4B7D96] mt-2">{food.status}</span>
                  </div>
              </div>
            </div>
            
            <div className="mt-10 text-center flex items-center gap-3 text-slate-400 text-xl font-bold">
              <span>נוצר באפליקציית "מעקב טעימות ראשונות"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

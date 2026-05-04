import React, { useState, useRef } from 'react';
import { X, Plus, Calendar, AlertCircle, CheckCircle2, Droplets, Download, TrendingUp, ChevronDown, Share2, Image as ImageIcon, FileText, FileSpreadsheet, File, MessageCircle, Info } from 'lucide-react';
import { FoodItem, Amount, Reaction, Status } from '../types';
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

  const amountIcons: Record<string, string> = {
    'טעימה': '🥄',
    'חצי מנה': '🥣',
    'מנה שלמה': '🍲'
  };

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
    addAttempt(food.id, { date, amount, reaction, notes });
    // Reset form mostly but keep date
    setAmount('טעימה');
    setReaction('אהב/ה');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm sm:p-0">
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center bg-slate-50 relative">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{food.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{food.name}</h2>
              <div className="text-sm text-slate-500 font-medium">{food.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                title="שיתוף וייצוא"
                className="p-2 bg-white rounded-full border border-gray-200 hover:bg-orange-50 hover:text-orange-600 text-slate-500 transition-colors shadow-sm flex items-center justify-center"
              >
                <Share2 size={20} />
              </button>
              
              {showShareMenu && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-2 flex flex-col">
                    <button onClick={downloadImage} className="flex items-center gap-3 w-full text-right px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <ImageIcon size={18} className="text-blue-500" />
                      שמירה כתמונה
                    </button>
                    <button onClick={shareWhatsApp} className="flex items-center gap-3 w-full text-right px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <MessageCircle size={18} className="text-green-500" />
                      שיתוף בוואטסאפ
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button onClick={exportToCSV} className="flex items-center gap-3 w-full text-right px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <FileText size={18} className="text-slate-500" />
                      טעימה נוכחית (CSV)
                    </button>
                    <button onClick={exportToExcel} className="flex items-center gap-3 w-full text-right px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <FileSpreadsheet size={18} className="text-emerald-500" />
                      טעימה נוכחית (Excel)
                    </button>
                    <button onClick={printToPDFAll} className="flex items-center gap-3 w-full text-right px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                      <File size={18} className="text-red-500" />
                      כל הטעימות ביומן (PDF)
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs Segmented Control */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'form' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              דיווח טעימה
            </button>
            <button
              onClick={() => food.attempts.length > 0 && setActiveTab('history')}
              disabled={food.attempts.length === 0}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'history' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              } ${food.attempts.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              היסטוריה והתקדמות
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 flex flex-col gap-8">
          
          {activeTab === 'form' ? (
            <>
              {food.isAllergen && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden shrink-0 shadow-sm">
                  <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                  
                  <button 
                    type="button"
                    onClick={() => setIsAllergenExpanded(!isAllergenExpanded)}
                    className="flex justify-between items-center w-full text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-1.5 rounded-full shadow-sm">
                        <AlertCircle className="text-red-600" size={24} />
                      </div>
                      <h4 className="font-bold text-red-800 text-lg">מזון אלרגני - שימו לב!</h4>
                    </div>
                    <ChevronDown size={20} className={`text-red-600 transition-transform duration-300 ${isAllergenExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isAllergenExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-3 mt-2 pr-1 sm:pr-2">
                      <p className="text-red-800 text-sm leading-relaxed font-medium">
                        מומלץ לחשוף למזון זה בשעות הבוקר או הצהריים, סמוך להשגחה.
                      </p>
                      <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                        <li>אין לחשוף במקביל למזון חדש נוסף באותו יום.</li>
                        <li>הגישו כמות מזערית ביום הראשון.</li>
                        <li>במידה ומופיעה <strong>פריחה, נפיחות, קשיי נשימה או הקאה</strong> לאחר הטעימה: יש להפסיק מיד את החשיפה, להימנע לחלוטין ממתן המזון שוב, ולהתייעץ בדחיפות עם רופא או לגשת למוקד רפואי.</li>
                      </ul>
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeAllergen(food.id);
                            setIsAllergenExpanded(false);
                          }}
                          className="bg-white text-red-600 border border-red-200 hover:bg-red-50 text-sm font-bold py-1.5 px-4 rounded-xl transition-colors shadow-sm"
                        >
                          הבנתי
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Category Tip */}
              {tipsData[food.category] && (
                <div className={`${tipsData[food.category].bg} border ${tipsData[food.category].border} p-4 rounded-2xl flex flex-col gap-3 shrink-0`}>
                  <button 
                    type="button"
                    onClick={() => setIsTipExpanded(!isTipExpanded)}
                    className="flex justify-between items-center w-full text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                       <span className={`text-xl ${tipsData[food.category].textMain}`}>{tipsData[food.category].icon}</span>
                       <span className={`font-bold ${tipsData[food.category].textDark} text-sm group-hover:opacity-80 transition-opacity`}>טיפ למאכל: {tipsData[food.category].title}</span>
                    </div>
                    <ChevronDown size={18} className={`${tipsData[food.category].textMain} transition-transform duration-300 ${isTipExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isTipExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-1">
                      <p className={`text-xs ${tipsData[food.category].textDark} leading-snug`}>
                        {tipsData[food.category].content}
                      </p>
                    </div>
                  )}
                </div>
              )}

          {/* Serving Suggestion */}
          {food.servingSuggestion && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-1 h-full bg-blue-400"></div>
              <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-blue-800 text-sm mb-1">איך מכינים ומגישים?</h4>
                <p className="text-blue-700 text-xs leading-relaxed">
                  {food.servingSuggestion}
                </p>
                {food.recommendedPhase && (
                  <div className="mt-2 text-xs font-bold text-blue-600 bg-blue-200/50 inline-block px-2 py-0.5 rounded-lg">
                    שלב מומלץ: {food.recommendedPhase}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aromatic Only Warning */}
          {food.isAromaticOnly && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-400"></div>
              <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-amber-800 text-sm mb-1">תיבול בלבד - לא להגשה!</h4>
                <p className="text-amber-700 text-xs leading-relaxed">
                  מרכיב זה נועד להענקת טעם למי הבישול בלבד. יש להוציאו לפני הטחינה וההגשה לתינוק.
                </p>
              </div>
            </div>
          )}

          {/* 3 Day Rule Progress */}
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex flex-col gap-3 shrink-0">
            <button 
              type="button"
              onClick={() => setIsRuleExpanded(!isRuleExpanded)}
              className="flex justify-between items-center w-full text-right cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-800 text-sm group-hover:text-orange-900 transition-colors">חוק ה-3 ימים</span>
                <span className="text-xs font-bold text-orange-600 bg-orange-200/50 px-2 py-0.5 rounded-full">
                  {Math.min(food.attempts.length, 3)}/3
                </span>
              </div>
              <ChevronDown size={18} className={`text-orange-600 transition-transform duration-300 ${isRuleExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isRuleExpanded && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-orange-700 leading-snug">
                  מומלץ להגיש מאכל חדש במשך 3 ימים ברצף כדי לוודא שאין תגובה אלרגית ולוודא הסתגלות, לפני שילובו באופן קבוע עם מאכלים אחרים.
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3].map(day => (
                    <div key={day} className={`flex-1 h-2 rounded-full ${day <= food.attempts.length ? 'bg-orange-400' : 'bg-orange-200'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Attempt Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 shrink-0">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#2D2D2D]">
              <Plus className="text-[#FF9F66]" /> מזל טוב! טעימה חדשה
            </h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">תאריך</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-3 border rounded-xl w-full text-slate-800 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600">כמות</label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {amounts.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`flex-1 py-2 px-2 text-sm font-bold rounded-lg transition-all ${amount === a ? 'bg-white shadow text-[#FF9F66]' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold text-slate-600">איך היה?</label>
               <div className="grid grid-cols-3 gap-2">
                  {reactions.filter(r => r !== 'תגובה אלרגית').map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReaction(r)}
                      className={`py-3 px-2 border rounded-xl font-bold transition-all text-xs sm:text-sm flex flex-col items-center justify-center gap-1
                        ${reaction === r 
                          ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-xl">
                        {r === 'אהב/ה' && '😍'}
                        {r === 'ניטרלי' && '😐'}
                        {r === 'סירב/ה' && '🙅'}
                      </span>
                      {r}
                    </button>
                  ))}
               </div>
            </div>

            <div className={`p-4 border rounded-xl mt-2 transition-colors ${reaction === 'תגובה אלרגית' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <AlertCircle className={reaction === 'תגובה אלרגית' ? "text-red-500" : "text-slate-400"} size={20} />
                   <label htmlFor="reaction-toggle" className={`text-sm font-bold cursor-pointer transition-colors ${reaction === 'תגובה אלרגית' ? "text-red-700" : "text-slate-600"}`}>
                     נצפתה רגישות / תגובה אלרגית?
                   </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="reaction-toggle"
                    className="sr-only peer"
                    checked={reaction === 'תגובה אלרגית'}
                    onChange={(e) => setReaction(e.target.checked ? 'תגובה אלרגית' : 'אהב/ה')}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              {reaction === 'תגובה אלרגית' && (
                <div className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="text-sm font-semibold text-red-700 block mb-2">תסמינים שנצפו:</label>
                    <div className="flex flex-wrap gap-2">
                      {['פריחה', 'אדמומיות', 'הקאות', 'שלשולים', 'נפיחות', 'קוצר נשימה', 'אי שקט'].map(symptom => {
                        const isSelected = notes.includes(symptom);
                        return (
                          <button
                            key={symptom}
                            type="button"
                            onClick={() => {
                              const isSelected = notes.includes(symptom);
                              if (isSelected) {
                                let newNotes = notes.replace(symptom, '');
                                newNotes = newNotes.replace(/,\s*,/g, ',').replace(/^[\s,]+/, '').replace(/[\s,]+$/, '');
                                if (newNotes) newNotes += ', ';
                                setNotes(newNotes);
                              } else {
                                let newNotes = notes.trim();
                                newNotes = newNotes.replace(/,+$/, '');
                                if (newNotes) {
                                  setNotes(`${newNotes}, ${symptom}, `);
                                } else {
                                  setNotes(`${symptom}, `);
                                }
                              }
                            }}
                            className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all border ${
                              isSelected
                                ? 'bg-red-500 text-white border-red-600 shadow-sm'
                                : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
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

            <div className="flex flex-col gap-2">
              <label className={`text-sm font-semibold ${reaction === 'תגובה אלרגית' ? 'text-red-700 mt-2' : 'text-slate-600'}`}>
                {reaction === 'תגובה אלרגית' ? 'פירוט נוסף (חובה לפנות לרופא)' : 'הערות (אופציונלי)'}
              </label>
              <textarea 
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onClick={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  if (target.selectionStart === notes.length && notes.length > 0) {
                    if (!notes.trim().endsWith(',')) {
                      setNotes(notes.trim() + ', ');
                    }
                  }
                }}
                className={`p-3 border rounded-xl w-full text-sm text-slate-800 focus:ring-2 focus:outline-none ${
                   reaction === 'תגובה אלרגית' ? 'focus:ring-red-300 border-red-300 bg-red-50/50' : 'focus:ring-amber-200 border-slate-200'
                }`}
                placeholder={reaction === 'תגובה אלרגית' ? "תארו את התגובה במדויק (מתי החלה, כמה זמן נמשכה...)" : "איך היה? האם שילבתם עם משהו אחר?"}
              />
            </div>

            <button type="submit" className="mt-2 w-full py-3.5 bg-[#FF9F66] hover:bg-[#f08a4d] text-white rounded-xl font-bold text-lg shadow-md transition-all active:scale-95">
              שמור טעימה
            </button>
          </form>
            </>
          ) : (
            <>
              {/* History */}
              {food.attempts.length > 0 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[#2D2D2D]">
                <TrendingUp className="text-[#4B7D96]" size={20} /> התקדמות
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl shadow-sm" dir="rtl">
                <span className="font-bold text-slate-700 ml-1">מקרא כמויות:</span>
                <span className="flex items-center gap-1">🥄 טעימה</span>
                <span className="flex items-center gap-1">🥣 חצי מנה</span>
                <span className="flex items-center gap-1">🍲 מנה שלמה</span>
              </div>

              <div className="h-48 w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...food.attempts].reverse().map((a, i) => ({
                    name: `ט#${i + 1}`,
                    date: new Date(a.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
                    reactionValue: a.reaction === 'אהב/ה' ? 3 : a.reaction === 'ניטרלי' ? 2 : a.reaction === 'סירב/ה' ? 1 : 0,
                    reaction: a.reaction,
                    amount: a.amount
                  }))} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis 
                      domain={[0, 3]} 
                      ticks={[0, 1, 2, 3]} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(val) => val === 3 ? '😍' : val === 2 ? '😐' : val === 1 ? '🙅' : '⚠️'}
                      tick={{ fontSize: 14 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right', fontSize: '12px' }}
                      formatter={(val: any, name: any, props: any) => [`${props.payload.reaction} ${amountIcons[props.payload.amount] || ''}`, 'תגובה']}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="reactionValue" 
                      stroke="#FF9F66" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#FF9F66' }}
                      activeDot={{ r: 6, fill: '#FF9F66', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h3 className="text-lg font-bold flex items-center gap-2 text-[#2D2D2D] mt-2">
                <Calendar className="text-[#4B7D96]" size={20} /> היסטוריית טעימות
              </h3>
              <div className="flex flex-col gap-4">
                {food.attempts.map((attempt, index) => (
                  <div key={attempt.id} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm ${
                       attempt.reaction === 'אהב/ה' ? 'bg-green-400' :
                       attempt.reaction === 'תגובה אלרגית' ? 'bg-red-400' :
                       attempt.reaction === 'סירב/ה' ? 'bg-gray-300' :
                       'bg-orange-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#2D2D2D] truncate">{food.name} - טעימה {food.attempts.length - index}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {new Date(attempt.date).toLocaleDateString('he-IL')} • {amountIcons[attempt.amount]} {attempt.amount}
                          </p>
                        </div>
                        <div className={`text-[10px] sm:text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 shrink-0 ${
                           attempt.reaction === 'אהב/ה' ? 'bg-green-50 text-green-700' :
                           attempt.reaction === 'תגובה אלרגית' ? 'bg-red-50 text-red-700' :
                           attempt.reaction === 'סירב/ה' ? 'bg-gray-100 text-gray-600' :
                           'bg-orange-50 text-orange-700'
                        }`}>
                          {attempt.reaction === 'אהב/ה' && <span className="text-sm">😍</span>}
                          {attempt.reaction === 'ניטרלי' && <span className="text-sm">😐</span>}
                          {attempt.reaction === 'סירב/ה' && <span className="text-sm">🙅</span>}
                          {attempt.reaction === 'תגובה אלרגית' && <AlertCircle size={14} className="" />}
                          <span>{attempt.reaction}</span>
                        </div>
                      </div>
                      {attempt.notes && (
                        <p className="text-xs text-gray-500 mt-2 bg-[#F9F7F2] p-2.5 rounded-xl italic break-words border border-[#EBE6DD]">
                          {renderNotes(attempt.notes)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
      
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

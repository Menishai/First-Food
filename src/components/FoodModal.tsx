import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Calendar, AlertCircle, CheckCircle2, TrendingUp, ChevronDown, Share2, Image as ImageIcon, FileText, FileSpreadsheet, File, MessageCircle, Info } from 'lucide-react';
import { FoodItem, Amount, Reaction, Preparation } from '../types';
import { tipsData } from '../data';
import { getScientificDetails } from '../data/foodDetails';
import { useFoodContext } from '../context';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as htmlToImage from 'html-to-image';

interface FoodModalProps {
  food: FoodItem;
  onClose: () => void;
}

interface FoodDetailsViewProps {
  food: FoodItem;
  onLogClick: () => void;
}

const FoodDetailsView: React.FC<FoodDetailsViewProps> = ({ food, onLogClick }) => {
  const scientific = getScientificDetails(food);
  
  const statusLabels = {
    'נעול': { text: 'טרם נוסה', bg: 'bg-brand-sand/50 text-brand-olive/50 border border-brand-sand' },
    'בתהליך': { text: 'בתהליך חשיפה', bg: 'bg-brand-cream text-brand-sage border border-brand-sand shadow-soft' },
    'הושלם': { text: 'הושלם (בטוח לשימוש)', bg: 'bg-brand-on-primary-container text-brand-sage border border-brand-sage/10 shadow-soft' },
    'רגישות/תגובה': { text: 'רגישות / להימנע', bg: 'bg-red-50 text-red-700 border border-red-100 shadow-soft' }
  };

  const statusLabel = statusLabels[food.status] || { text: food.status, bg: 'bg-brand-sand text-brand-olive' };

  return (
    <div className="flex flex-col gap-4 text-right animate-in fade-in duration-200">
      {/* Hero Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-brand-sand/65 shadow-soft shrink-0">
        {food.image ? (
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-cream flex items-center justify-center text-7xl select-none">
            {food.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 right-4 flex items-center gap-2">
          {food.recommendedPhase && (
            <span className="px-2.5 py-0.5 rounded-lg bg-brand-cream text-brand-sage font-bold text-[9px] border border-brand-sand shadow-soft">
              שלב {food.recommendedPhase}
            </span>
          )}
          {food.isAllergen && (
            <span className="px-2.5 py-0.5 rounded-lg bg-brand-blush text-brand-charcoal font-bold text-[9px] border border-brand-blush shadow-soft">
              אלרגן
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="bg-white p-5 rounded-xl border border-brand-sand/40 shadow-soft flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="font-serif text-lg font-bold text-brand-olive">{food.name}</h1>
          <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[9px] uppercase tracking-wider ${statusLabel.bg}`}>
            {statusLabel.text}
          </span>
        </div>
        <p className="text-xs text-brand-olive/70 font-semibold leading-relaxed">
          {scientific.description}
        </p>
      </div>

      {/* Nutritional Highlights (Bento Grid) */}
      <div>
        <h3 className="font-serif text-xs font-bold text-brand-olive/40 uppercase tracking-wider mb-2.5 mr-1">מדגישים תזונתיים</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {scientific.highlights.map((h, i) => (
            <div key={i} className="bg-white border border-brand-sand/55 p-3.5 rounded-xl flex flex-col items-center justify-center text-center shadow-soft">
              <span className="text-[9px] font-bold text-brand-olive/40 mb-1 leading-none">{h.label}</span>
              <span className="font-serif text-sm font-extrabold text-brand-sage leading-tight">{h.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preparation Guide */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-xs font-bold text-brand-olive/40 uppercase tracking-wider mb-0.5 mr-1">מדריך הכנה והגשה בטוחה</h3>
        
        {/* 6 Months */}
        <div className="p-4 rounded-xl bg-white border border-brand-sand/50 shadow-soft flex gap-3.5 items-start text-right animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-brand-cream border border-brand-sand flex items-center justify-center shrink-0 text-brand-sage font-extrabold text-[11px] shadow-soft">
            6ח'
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold text-brand-sage">גיל 6 חודשים (חשיפה ראשונית)</h4>
            <p className="text-[11px] text-brand-olive/60 mt-1.5 font-semibold leading-relaxed">
              {scientific.preparation.age6m}
            </p>
          </div>
        </div>

        {/* 9 Months */}
        <div className="p-4 rounded-xl bg-white border border-brand-sand/50 shadow-soft flex gap-3.5 items-start text-right animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-brand-cream border border-brand-sand flex items-center justify-center shrink-0 text-brand-sage font-extrabold text-[11px] shadow-soft">
            9ח'
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold text-brand-sage">גיל 9 חודשים (התקדמות במרקמים)</h4>
            <p className="text-[11px] text-brand-olive/60 mt-1.5 font-semibold leading-relaxed">
              {scientific.preparation.age9m}
            </p>
          </div>
        </div>

        {/* 12+ Months */}
        <div className="p-4 rounded-xl bg-white border border-brand-sand/50 shadow-soft flex gap-3.5 items-start text-right animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-brand-cream border border-brand-sand flex items-center justify-center shrink-0 text-brand-sage font-extrabold text-[11px] shadow-soft">
            12+
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-xs font-bold text-brand-sage">גיל 12 חודשים ומעלה (פעוטות)</h4>
            <p className="text-[11px] text-brand-olive/60 mt-1.5 font-semibold leading-relaxed">
              {scientific.preparation.age12m}
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Allergies Card */}
      <div className={`p-4 rounded-xl border flex flex-col gap-2.5 shadow-soft ${
        food.isAllergen ? 'bg-red-50/30 border-brand-blush/40' : 'bg-brand-cream/30 border-brand-sand'
      }`}>
        <div className="flex items-center gap-2 mb-0.5">
          <AlertCircle className={food.isAllergen ? 'text-red-600 animate-pulse' : 'text-brand-sage'} size={18} />
          <h4 className={`font-serif text-xs font-bold ${food.isAllergen ? 'text-red-800' : 'text-brand-sage'}`}>
            דגשי בטיחות ואלרגיות
          </h4>
        </div>
        <p className="text-[11px] text-brand-olive/75 font-semibold leading-relaxed">
          {scientific.safety.overview}
        </p>
        <div className="flex flex-col gap-1.5 mt-1 border-t border-brand-sand/40 pt-2.5">
          {scientific.safety.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[10px] text-brand-olive/60 font-semibold leading-relaxed">
              <span className="text-brand-sage mt-0.5">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Log Button */}
      <button
        type="button"
        onClick={onLogClick}
        className="w-full py-3.5 bg-brand-sage text-white rounded-xl font-bold text-xs shadow-soft hover:bg-brand-sage/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
      >
        <Plus size={16} strokeWidth={2.5} />
        דיווח טעימה של {food.name}
      </button>
    </div>
  );
};

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 250;
        
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
};

export const FoodModal: React.FC<FoodModalProps> = ({ food, onClose }) => {
  const { foods, addAttempt, activeProfile, acknowledgeAllergen } = useFoodContext();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<Amount>('טעימה');
  const [reaction, setReaction] = useState<Reaction>('אהב/ה');
  const [preparation, setPreparation] = useState<Preparation>('טחון');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'form' | 'history'>('form');
  const [isRuleExpanded, setIsRuleExpanded] = useState(false);
  const [isTipExpanded, setIsTipExpanded] = useState(false);
  const [isAllergenExpanded, setIsAllergenExpanded] = useState(!food.allergenWarningAcknowledged);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

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
        return <strong key={index} className="font-bold text-brand-olive not-italic">{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttempt(food.id, { date, amount, reaction, preparation, notes, photo });
    setAmount('טעימה');
    setReaction('אהב/ה');
    setPreparation('טחון');
    setNotes('');
    setPhoto(undefined);
    onClose();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await resizeImage(file);
        setPhoto(compressed);
      } catch (err) {
        console.error('Failed to compress image:', err);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['תאריך טעימה', 'מאכל', 'כמות', 'תגובה', 'הערות'];
    const rows = food.attempts.map((a) => [
      new Date(a.date).toLocaleDateString('he-IL'),
      food.name,
      a.amount,
      a.reaction,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
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
          backgroundColor: '#FBF9F6', 
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
         body { font-family: sans-serif; padding: 20px; color: #1B1C1A; }
         h2 { color: #475B4C; border-bottom: 2px solid #EFEEEB; padding-bottom: 10px; }
         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
         th, td { border: 1px solid #EFEEEB; padding: 12px 8px; text-align: right; }
         th { background-color: #FBF9F6; color: #475B4C; }
         tr:nth-child(even) { background-color: #FBF9F6; }
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
      className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-brand-olive/30 backdrop-blur-sm overflow-x-hidden overflow-y-auto overscroll-none"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        ref={modalRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-xl shadow-xl overflow-hidden flex flex-col h-[85vh] sm:h-[680px] max-h-[92vh] border border-brand-sand/50 relative z-10 m-0 sm:m-4 touch-pan-y"
      >
        {/* Header */}
        <div className="px-5 py-3.5 flex justify-between items-center bg-white relative border-b border-brand-sand/40 select-none">
          <div className="flex items-center gap-2">
            {food.image ? (
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand-sand/60 bg-brand-cream flex items-center justify-center shrink-0">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <span className="text-2xl">{food.icon}</span>
            )}
            <div>
              <h2 className="text-base font-serif font-bold text-brand-olive leading-tight">{food.name}</h2>
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-sage">{food.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                title="שיתוף וייצוא"
                className="w-8 h-8 bg-brand-cream border border-brand-sand/60 text-brand-olive/60 rounded-lg shadow-soft flex items-center justify-center transition-all"
              >
                <Share2 size={14} />
              </motion.button>
              
              {showShareMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute left-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-brand-sand z-50 p-1"
                >
                  <div className="flex flex-col gap-0.5">
                    <button onClick={downloadImage} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs font-bold text-brand-olive/70 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-brand-cream text-brand-sage rounded"><ImageIcon size={14} /></div>
                      שמירה כתמונה
                    </button>
                    <button onClick={shareWhatsApp} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs font-bold text-brand-olive/70 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-brand-cream text-brand-sage rounded"><MessageCircle size={14} /></div>
                      שיתוף בוואטסאפ
                    </button>
                    <div className="h-px bg-brand-sand/50 my-1 mx-2"></div>
                    <button onClick={exportToCSV} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs font-bold text-brand-olive/70 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-brand-cream text-brand-sage rounded"><FileText size={14} /></div>
                      טעימה נוכחית (CSV)
                    </button>
                    <button onClick={exportToExcel} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs font-bold text-brand-olive/70 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-brand-cream text-brand-sage rounded"><FileSpreadsheet size={14} /></div>
                      טעימה נוכחית (Excel)
                    </button>
                    <button onClick={printToPDFAll} className="flex items-center gap-2 w-full text-right px-2.5 py-1.5 text-xs font-bold text-brand-olive/70 hover:bg-brand-cream rounded-lg transition-colors">
                      <div className="p-1 bg-brand-cream text-brand-sage rounded"><File size={14} /></div>
                      כל הטעימות ביומן (PDF)
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-cream text-brand-olive/40 hover:text-brand-olive transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="px-5 py-2 bg-white border-b border-brand-sand/40">
          <div className="flex bg-brand-sand/30 p-1 rounded-lg relative">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-1.5 text-xs font-bold rounded transition-all relative z-10 ${
                activeTab === 'form' 
                  ? 'text-brand-sage font-extrabold' 
                  : 'text-brand-olive/40 hover:text-brand-olive'
              }`}
            >
              דיווח טעימה
            </button>
            <button
              onClick={() => food.attempts.length > 0 && setActiveTab('history')}
              disabled={food.attempts.length === 0}
              className={`flex-1 py-1.5 text-xs font-bold rounded transition-all relative z-10 ${
                activeTab === 'history' 
                  ? 'text-brand-sage font-extrabold' 
                  : 'text-brand-olive/40 hover:text-brand-olive'
              } ${food.attempts.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              היסטוריה
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-1.5 text-xs font-bold rounded transition-all relative z-10 ${
                activeTab === 'details' 
                  ? 'text-brand-sage font-extrabold' 
                  : 'text-brand-olive/40 hover:text-brand-olive'
              }`}
            >
              פרטי המאכל
            </button>
            <motion.div 
              layoutId="activeTabDetails"
              initial={false}
              animate={{ x: activeTab === 'form' ? '0%' : activeTab === 'history' ? '-100%' : '-200%' }}
              className="absolute top-1 bottom-1 right-1 w-[calc(33.333%-4px)] bg-white rounded shadow-soft border border-brand-sand/40 z-0"
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              {activeTab === 'details' ? (
                <FoodDetailsView food={food} onLogClick={() => setActiveTab('form')} />
              ) : activeTab === 'form' ? (
            <>
              {food.isAllergen && (
                <div className="bg-white border border-brand-blush rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden shrink-0 shadow-soft">
                  <div className="absolute top-0 right-0 w-1 h-full bg-brand-blush"></div>
                  
                  <button 
                    type="button"
                    onClick={() => setIsAllergenExpanded(!isAllergenExpanded)}
                    className="flex justify-between items-center w-full text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-brand-cream p-1.5 rounded border border-brand-sand/40">
                        <AlertCircle className="text-brand-primary" size={18} />
                      </div>
                      <h4 className="font-serif font-bold text-brand-olive text-sm">מזון אלרגני - שימו לב!</h4>
                    </div>
                    <ChevronDown size={16} className={`text-brand-olive/40 transition-transform duration-300 ${isAllergenExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isAllergenExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="flex flex-col gap-3 mt-2 pr-1 overflow-hidden"
                    >
                      <p className="text-brand-olive/80 text-xs leading-relaxed font-bold">
                        מומלץ לחשוף למזון זה בשעות הבוקר ביום שבו התינוק בריא, כדי שתוכלו לעקוב אחריו במשך 2-3 שעות סמוך להשגחה צמודה.
                      </p>
                      <ul className="text-brand-olive/75 text-xs list-disc list-inside space-y-1.5 font-semibold leading-relaxed">
                        <li>אין לחשוף במקביל למזון חדש נוסף באותו יום.</li>
                        <li>הגישו כמות מזערית ביום הראשון.</li>
                        <li>במידה ומופיעה פריחה, נפיחות, קשיי נשימה או הקאה: יש להפסיק מיד, להימנע מהמזון, ולהתייעץ בדחיפות עם רופא.</li>
                      </ul>
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeAllergen(food.id);
                            setIsAllergenExpanded(false);
                          }}
                          className="bg-brand-cream text-brand-sage border border-brand-sand hover:bg-brand-sand/40 text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-lg transition-all shadow-soft active:scale-95"
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
                <div className="bg-white border border-brand-sand/50 p-4 rounded-lg flex flex-col gap-3 shrink-0 shadow-soft relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-brand-sage opacity-40"></div>
                  <button 
                    type="button"
                    onClick={() => setIsTipExpanded(!isTipExpanded)}
                    className="flex justify-between items-center w-full text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                       <span className="text-xl">{tipsData[food.category].icon}</span>
                       <span className="font-serif font-bold text-brand-sage text-sm">טיפ: {tipsData[food.category].title}</span>
                    </div>
                    <ChevronDown size={16} className="text-brand-sage/60 transition-transform duration-300 ${isTipExpanded ? 'rotate-180' : ''}" />
                  </button>
                  {isTipExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-1 overflow-hidden"
                    >
                      <p className="text-xs text-brand-olive/70 leading-relaxed font-semibold">
                        {tipsData[food.category].content}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Serving Suggestion */}
              {food.servingSuggestion && (
                <div className="bg-white border border-brand-sand/50 rounded-lg p-4 flex gap-3 items-start relative overflow-hidden shrink-0 shadow-soft">
                  <div className="absolute top-0 right-0 w-1 h-full bg-brand-sage/20"></div>
                  <div className="bg-brand-cream p-1.5 rounded border border-brand-sand/40 shrink-0 text-brand-sage">
                    <Info size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-bold text-brand-sage text-xs">איך להגיש?</h4>
                    <p className="text-brand-olive/70 text-xs leading-relaxed font-semibold">
                      {food.servingSuggestion}
                    </p>
                    {food.recommendedPhase && (
                      <div className="mt-2 text-[9px] font-bold text-brand-sage bg-brand-cream border border-brand-sand px-2 py-0.5 rounded uppercase tracking-wider w-fit shadow-soft">
                        שלב {food.recommendedPhase}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {food.isAromaticOnly && (
                <div className="bg-white border border-brand-sand rounded-lg p-4 flex gap-3 items-start relative overflow-hidden shrink-0 shadow-soft">
                  <div className="absolute top-0 right-0 w-1 h-full bg-amber-400"></div>
                  <div className="bg-brand-cream p-1.5 rounded border border-brand-sand/40 shrink-0 text-amber-600">
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-bold text-amber-700 text-xs">תיבול בלבד!</h4>
                    <p className="text-brand-olive/60 text-xs leading-relaxed font-semibold">
                      מרכיב זה נועד להענקת טעם למי הבישול בלבד. יש להוציאו לפני הטחינה וההגשה.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-brand-cream/30 border border-brand-sand p-4 rounded-lg flex flex-col gap-3 shrink-0 shadow-soft">
                <button 
                  type="button"
                  onClick={() => setIsRuleExpanded(!isRuleExpanded)}
                  className="flex justify-between items-center w-full text-right cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded border border-brand-sand/40 shrink-0 text-brand-sage shadow-soft">
                      <TrendingUp size={16} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-brand-olive text-xs">מעקב חשיפות</span>
                      <span className="text-[9px] font-bold text-brand-olive/40 uppercase tracking-wider">
                        {Math.min(food.attempts.length, requiredAttempts)} מתוך {requiredAttempts} חשיפות
                      </span>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-brand-sage transition-transform duration-300 ${isRuleExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isRuleExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="flex flex-col gap-3 overflow-hidden pt-1"
                  >
                    <p className="text-xs text-brand-olive/70 font-semibold leading-relaxed">
                      {hasRefusal 
                        ? "מאחר ונרשם סירוב, מומלץ לבצע חשיפה רביעית כדי להתרגל לטעם. אל תתייאשו, זהו תהליך למידה!"
                        : "מומלץ להגיש מאכל חדש במשך 3 ימים ברצף כדי לוודא הסתגלות מלאה ושלילת תגובה אלרגית."}
                    </p>
                    <div className="flex gap-2">
                      {Array.from({ length: requiredAttempts }).map((_, idx) => (
                        <div key={idx} className={`flex-1 h-1.5 rounded bg-brand-sand overflow-hidden relative`}>
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 shrink-0 bg-white p-5 rounded-lg border border-brand-sand/40 shadow-soft">
                <h3 className="text-sm font-serif font-bold flex items-center gap-2 text-brand-olive leading-none">
                  <div className="bg-brand-cream p-1.5 rounded border border-brand-sand/50 text-brand-sage shadow-soft"><Plus size={14} strokeWidth={2.5} /></div>
                  דיווח טעימה חדשה
                </h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">תאריך</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-sage pointer-events-none" size={16} />
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="p-2.5 pr-9 border border-brand-sand rounded-lg w-full text-xs font-semibold text-brand-olive focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage focus:outline-none transition-all bg-brand-cream/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">כמות</label>
                  <div className="flex rounded-lg bg-brand-sand/30 p-1 border border-brand-sand/20">
                    {amounts.map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAmount(a)}
                        className={`flex-1 py-1 px-0.5 text-[10px] font-bold rounded transition-all ${amount === a ? 'bg-white border border-brand-sand/40 text-brand-sage shadow-soft' : 'text-brand-olive/40 hover:text-brand-olive'}`}
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">צורת הגשה</label>
                  <div className="grid grid-cols-3 gap-1 bg-brand-sand/30 p-1 rounded-lg border border-brand-sand/20">
                    {preparations.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPreparation(p)}
                        className={`py-1.5 px-1 text-[10px] font-bold rounded transition-all ${preparation === p ? 'bg-white border border-brand-sand/40 text-brand-sage shadow-soft' : 'text-brand-olive/40 hover:text-brand-olive'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">איך התינוק הגיב?</label>
                   <div className="grid grid-cols-4 gap-2">
                     {[
                       { id: 'אהב/ה', label: 'אהב/ה', emoji: '😍', colorClass: 'border-green-200 text-green-700 bg-green-50/50' },
                       { id: 'ניטרלי', label: 'ניטרלי', emoji: '😐', colorClass: 'border-blue-100 text-blue-700 bg-blue-50/30' },
                       { id: 'סירב/ה', label: 'סירב/ה', emoji: '🙅', colorClass: 'border-amber-200 text-amber-700 bg-amber-50/30' },
                       { id: 'תגובה אלרגית', label: 'רגישות', emoji: '⚠️', colorClass: 'border-red-200 text-red-700 bg-red-50/50' },
                     ].map((r) => {
                       const isSelected = reaction === r.id;
                       return (
                         <button
                           key={r.id}
                           type="button"
                           onClick={() => setReaction(r.id as Reaction)}
                           className={`py-2 px-1 border rounded-lg font-bold transition-all text-[11px] flex flex-col items-center justify-center gap-1 shadow-soft
                             ${isSelected 
                               ? `${r.colorClass} border-2 border-brand-sage` 
                               : 'bg-white border-brand-sand text-brand-olive/40 hover:bg-brand-cream'
                             }`}
                         >
                           <span className="text-lg">{r.emoji}</span>
                           <span className="truncate">{r.label}</span>
                         </button>
                       );
                     })}
                   </div>
                   
                   {reaction === 'סירב/ה' && (
                     <div className="mt-1 bg-brand-cream border border-brand-sand/50 p-2.5 rounded-lg flex gap-2 items-start shadow-soft">
                       <Info size={14} className="text-brand-sage shrink-0 mt-0.5" />
                       <p className="text-[10px] text-brand-olive/70 leading-relaxed font-bold">
                         לא לדאוג! לעיתים נדרשות 10-15 חשיפות למאכל חדש כדי להתרגל. נסו שיטת הכנה אחרת.
                       </p>
                     </div>
                   )}
                </div>

                {reaction === 'תגובה אלרגית' && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 bg-brand-blush/20 border border-brand-blush p-4 rounded-lg shadow-soft">
                    <div className="bg-white/80 p-2.5 rounded border border-brand-blush/30 flex gap-2 items-start shadow-inner">
                      <AlertCircle size={12} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-brand-charcoal leading-relaxed font-bold">
                        יש לפנות לרופא להתייעצות בהקדם. דאגו לתעד את התסמינים לרופא.
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40 block mb-1.5">תסמינים:</label>
                      <div className="flex flex-wrap gap-1">
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
                              className={`py-1 px-2 text-[10px] font-bold rounded border transition-all ${
                                isSelected
                                  ? 'bg-brand-sage text-white border-brand-sage'
                                  : 'bg-white text-brand-sage border-brand-sand hover:bg-brand-cream'
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">הוספת תמונה של הטעימה</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-sand rounded-lg text-xs font-bold text-brand-sage shadow-soft hover:bg-brand-cream transition-all"
                    >
                      <ImageIcon size={14} />
                      <span>{photo ? 'שינוי תמונה' : 'בחירת תמונה (מצלמה/גלריה)'}</span>
                    </button>
                    <input 
                      type="file" 
                      ref={photoInputRef} 
                      onChange={handlePhotoChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    {photo && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-sand shadow-soft shrink-0">
                        <img src={photo} alt="Attached" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhoto(undefined)}
                          className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-soft"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${reaction === 'תגובה אלרגית' ? 'text-brand-blush' : 'text-brand-olive/40'}`}>
                    {reaction === 'תגובה אלרגית' ? 'פירוט נוסף לרופא' : 'הערות'}
                  </label>
                  <textarea 
                    rows={1}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="p-2.5 border border-brand-sand rounded-lg w-full text-xs text-brand-olive focus:outline-none transition-all font-semibold bg-brand-cream/5 focus:ring-2 focus:ring-brand-sage/15"
                    placeholder={reaction === 'תגובה אלרגית' ? "תארו את התגובה..." : "איך היה? (אופציונלי)"}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-brand-sage text-white rounded-lg font-bold text-sm shadow-soft hover:bg-brand-sage/95 active:scale-[0.98] transition-all"
                >
                  שמירת טעימה
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col gap-5">
              {food.attempts.length > 0 && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-serif font-bold flex items-center gap-1.5 text-brand-olive">
                      <div className="bg-brand-cream p-1.5 rounded border border-brand-sand/50 text-brand-sage shadow-soft"><TrendingUp size={14} strokeWidth={2.5} /></div>
                      מגמת התקדמות
                    </h3>
              
                    <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-bold uppercase tracking-wider text-brand-olive/40 bg-white border border-brand-sand p-2 rounded-lg shadow-soft" dir="rtl">
                      <span className="text-brand-sage">מקרא:</span>
                      <span className="flex items-center gap-0.5 opacity-80">🥄 טעימה</span>
                      <span className="flex items-center gap-0.5 opacity-80">🥣 חצי מנה</span>
                      <span className="flex items-center gap-0.5 opacity-80">🍲 מנה שלמה</span>
                    </div>

                    <div className="h-44 w-full bg-white border border-brand-sand/40 rounded-lg p-3 shadow-soft" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...food.attempts].reverse().map((a, i) => ({
                          name: `ט#${i + 1}`,
                          date: new Date(a.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
                          reactionValue: a.reaction === 'אהב/ה' ? 3 : a.reaction === 'ניטרלי' ? 2 : a.reaction === 'סירב/ה' ? 1 : 0,
                          reaction: a.reaction,
                          amount: a.amount
                        }))} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                          <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#EFEEEB" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 500 }} />
                          <YAxis 
                            domain={[0, 3]} 
                            ticks={[0, 1, 2, 3]} 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(val) => val === 3 ? '😍' : val === 2 ? '😐' : val === 1 ? '🙅' : '⚠️'}
                            tick={{ fontSize: 13 }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #EFEEEB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right', fontSize: '11px', fontWeight: 'bold' }}
                            formatter={(val: any, name: any, props: any) => [`${props.payload.reaction} ${amountIcons[props.payload.amount] || ''}`, 'תגובה']}
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="reactionValue" 
                            stroke="#475B4C" 
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 1.5, fill: '#fff', stroke: '#475B4C' }}
                            activeDot={{ r: 5, fill: '#475B4C', stroke: '#fff', strokeWidth: 1.5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-serif font-bold flex items-center gap-1.5 text-brand-olive">
                      <div className="bg-brand-cream p-1.5 rounded border border-brand-sand/50 text-brand-sage shadow-soft"><Calendar size={14} strokeWidth={2.5} /></div>
                      כל הטעימות
                    </h3>
                    <div className="flex flex-col gap-3 relative">
                      <div className="absolute top-0 bottom-0 right-[15px] w-0.5 bg-brand-sand/60 -z-0"></div>
                      {food.attempts.map((attempt, index) => (
                        <div key={attempt.id} className="flex items-start gap-3 relative z-10">
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-soft border-2 border-white ${
                             attempt.reaction === 'אהב/ה' ? 'bg-brand-sage' :
                             attempt.reaction === 'תגובה אלרגית' ? 'bg-brand-blush' :
                             attempt.reaction === 'סירב/ה' ? 'bg-brand-sand' :
                             'bg-brand-sand'
                          }`}>
                            <span className="text-brand-olive text-xs font-bold">{food.attempts.length - index}</span>
                          </div>
                          <div className="flex-1 bg-white p-4 rounded-lg border border-brand-sand/40 shadow-soft">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-brand-olive">טעימה של {food.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">
                                    {new Date(attempt.date).toLocaleDateString('he-IL')}
                                  </span>
                                  <span className="text-brand-sand text-xs">•</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-sage">
                                    {amountIcons[attempt.amount]} {attempt.amount}
                                  </span>
                                </div>
                              </div>
                              <div className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5 shadow-soft border ${
                                 attempt.reaction === 'אהב/ה' ? 'bg-brand-on-primary-container text-brand-sage border-brand-sage/10' :
                                 attempt.reaction === 'תגובה אלרגית' ? 'bg-brand-blush/30 text-brand-charcoal border-brand-blush/40' :
                                 attempt.reaction === 'סירב/ה' ? 'bg-brand-sand/50 text-brand-olive/50 border-brand-sand' :
                                 'bg-brand-sand/80 text-brand-olive border-brand-sand'
                              }`}>
                                {attempt.reaction === 'אהב/ה' && <span className="text-[9px]">😍</span>}
                                {attempt.reaction === 'ניטרלי' && <span className="text-[9px]">😐</span>}
                                {attempt.reaction === 'סירב/ה' && <span className="text-[9px]">🙅</span>}
                                {attempt.reaction === 'תגובה אלרגית' && <AlertCircle size={9} strokeWidth={3} />}
                                <span>{attempt.reaction}</span>
                              </div>
                            </div>
                            {attempt.photo && (
                              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-brand-sand shadow-soft cursor-pointer relative group active:scale-95 transition-all mb-2">
                                <img 
                                  src={attempt.photo} 
                                  alt="טעימה" 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                  onClick={() => setSelectedLightboxImage(attempt.photo || null)}
                                />
                              </div>
                            )}
                            {attempt.notes && (
                              <div className="text-xs text-brand-olive/80 mt-2 bg-brand-cream/30 p-2.5 rounded-lg italic font-medium leading-relaxed border border-brand-sand/30">
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
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Hidden Render Container for Image Export */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -1 }}>
        <div 
          ref={shareCardRef} 
          className="bg-[#FBF9F6] p-12 flex flex-col items-center justify-center font-sans tracking-tight"
          style={{ width: '1080px', height: '1080px', direction: 'rtl' }}
        >
          <div className="bg-white p-12 rounded-2xl shadow-soft flex flex-col items-center w-full h-full border border-brand-sand/50">
            <div className="text-center space-y-4 mt-10">
              <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-5xl shadow-soft border border-brand-sand overflow-hidden">
                 {activeProfile?.avatar ? (
                   <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span>🍼</span>
                 )}
              </div>
              <h1 className="text-3xl font-serif font-bold text-brand-olive">היומן של {activeProfile?.name || 'אריאל'}</h1>
            </div>

            <div className="mt-12 flex flex-col items-center flex-1 w-full p-10 bg-brand-cream rounded-xl border border-brand-sand/40 relative overflow-hidden">
              {food.image ? (
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-brand-sand bg-brand-cream flex items-center justify-center mb-4 filter drop-shadow-xl shadow-soft">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-[7rem] leading-none mb-4 filter drop-shadow-xl">{food.icon}</span>
              )}
              <h2 className="text-5xl font-serif font-bold text-brand-olive mb-2">{food.name}</h2>
              <div className="text-xl text-brand-sage font-bold mb-8 px-5 py-1 bg-white rounded-lg border border-brand-sand shadow-soft">{food.category}</div>
              
              <div className="flex gap-6 w-full justify-center mt-6">
                  <div className="bg-white p-6 rounded-xl shadow-soft flex flex-col items-center flex-1 border border-brand-sand/35">
                     <span className="text-brand-olive/40 text-sm font-bold mb-2">מספר טעימות</span>
                     <span className="text-4xl font-serif font-bold text-brand-sage">{food.attempts.length}</span>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-soft flex flex-col items-center flex-1 border border-brand-sand/35">
                     <span className="text-brand-olive/40 text-sm font-bold mb-2">סטטוס</span>
                     <span className="text-3xl font-serif font-bold text-brand-sage mt-1">{food.status}</span>
                  </div>
              </div>
            </div>
            
            <div className="mt-8 text-center flex items-center gap-2 text-brand-olive/30 text-base font-bold">
              <span>נוצר באפליקציית "מעקב טעימות ראשונות"</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setSelectedLightboxImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-full max-h-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedLightboxImage} 
                alt="הגדלת תמונה" 
                className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl border-2 border-white/25 object-contain" 
              />
              <button 
                type="button"
                onClick={() => setSelectedLightboxImage(null)}
                className="px-6 py-2 bg-white text-brand-olive font-bold text-xs rounded-full shadow-soft active:scale-95 transition-all"
              >
                סגירה
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

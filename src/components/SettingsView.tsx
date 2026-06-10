import React, { useState, useRef, useEffect } from 'react';
import { useFoodContext } from '../context';
import { getBabyAge } from '../utils/babyUtils';
import { exportBackupJSON, exportAllToExcel, printMedicalPDFAll } from '../utils/exportUtils';
import { initialFoods } from '../data';
import { 
  Camera, 
  Info, 
  CheckCircle2, 
  UserPlus, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  File, 
  AlertCircle, 
  ChevronDown, 
  Bell, 
  Users, 
  ChevronLeft 
} from 'lucide-react';

interface SettingsViewProps {
  setIsGuidelinesOpen: (open: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ setIsGuidelinesOpen }) => {
  const { 
    profiles, 
    activeProfile, 
    activeProfileId, 
    updateActiveProfile, 
    switchProfile, 
    addProfile, 
    importBackupData,
    foods
  } = useFoodContext();

  const [newProfileName, setNewProfileName] = useState('');
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [isEditingProfileOpen, setIsEditingProfileOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  const [reminderEnabled, setReminderEnabled] = useState(activeProfile?.reminderEnabled ?? false);
  const [reminderTime, setReminderTime] = useState(activeProfile?.reminderTime ?? '10:00');
  const [reminderType, setReminderType] = useState(activeProfile?.reminderType ?? 'both');

  const [syncCodeToPaste, setSyncCodeToPaste] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setReminderEnabled(activeProfile?.reminderEnabled ?? false);
    setReminderTime(activeProfile?.reminderTime ?? '10:00');
    setReminderType(activeProfile?.reminderType ?? 'both');
  }, [activeProfileId, activeProfile]);

  const generateSyncCode = () => {
    if (!activeProfile) return '';
    const syncObj = {
      name: activeProfile.name,
      birthDate: activeProfile.birthDate,
      avatar: activeProfile.avatar,
      reminderEnabled: activeProfile.reminderEnabled,
      reminderTime: activeProfile.reminderTime,
      reminderType: activeProfile.reminderType,
      foods: foods.map(f => ({
        id: f.id,
        status: f.status,
        attempts: f.attempts,
        allergenWarningAcknowledged: f.allergenWarningAcknowledged
      }))
    };
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(syncObj))));
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  const handleCopySyncCode = () => {
    const code = generateSyncCode();
    if (code) {
      navigator.clipboard.writeText(code);
      alert('קוד הסנכרון הועתק ללוח! שלחו אותו לבן/בת הזוג.');
    }
  };

  const handleImportSyncCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncCodeToPaste.trim()) return;

    try {
      const decodedStr = decodeURIComponent(escape(atob(syncCodeToPaste.trim())));
      const data = JSON.parse(decodedStr);

      if (!data.name || !Array.isArray(data.foods)) {
        setSyncStatusMsg('שגיאה: מבנה הקוד אינו תקין. ודאו שהעתקתם את הקוד המלא.');
        return;
      }

      if (confirm(`האם ברצונכם לסנכרן ולדרוס את נתוני הפרופיל הנוכחי עם הנתונים של ${data.name}?`)) {
        const initialIds = initialFoods.map(f => f.id);
        const importedCustomFoods = data.foods.filter((f: any) => !initialIds.includes(f.id));
        const mergedFoods = initialFoods.map(initialFood => {
          const existingFood = data.foods.find((f: any) => f.id === initialFood.id);
          if (existingFood) {
            return {
              ...initialFood,
              status: existingFood.status,
              attempts: existingFood.attempts,
              allergenWarningAcknowledged: existingFood.allergenWarningAcknowledged
            };
          }
          return initialFood;
        });

        updateActiveProfile({
          name: data.name,
          birthDate: data.birthDate || activeProfile?.birthDate,
          avatar: data.avatar || activeProfile?.avatar,
          reminderEnabled: data.reminderEnabled !== undefined ? data.reminderEnabled : activeProfile?.reminderEnabled,
          reminderTime: data.reminderTime || activeProfile?.reminderTime,
          reminderType: data.reminderType || activeProfile?.reminderType,
          foods: [...mergedFoods, ...importedCustomFoods]
        });

        setSyncStatusMsg('הפרופיל סונכרן בהצלחה!');
        setSyncCodeToPaste('');
        alert(`נתוני הפרופיל של ${data.name} סונכרנו בהצלחה!`);
      }
    } catch (err) {
      console.error(err);
      setSyncStatusMsg('שגיאה בפענוח הקוד. אנא ודאו שהעתקתם קוד תקין.');
    }
  };

  const handleSaveReminders = async () => {
    updateActiveProfile({
      reminderEnabled,
      reminderTime,
      reminderType
    });

    if (reminderEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          try {
            new Notification(`התראות הטעימות הופעלו!`, {
              body: `נזכיר לך להציע טעימות חדשות מדי יום בשעה ${reminderTime}`,
              icon: 'https://cdn-icons-png.flaticon.com/512/2950/2950137.png',
              dir: 'rtl'
            });
          } catch (e) {
            console.warn('Could not launch standard Web Notification:', e);
          }
        }
      }
      alert(`ההתראות הופעלו בהצלחה לשעה ${reminderTime}!`);
    } else {
      alert('ההתראות היומיות כובו.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateActiveProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (confirm('ייבוא קובץ גיבוי ידרוס את כל הנתונים הנוכחיים שלכם. האם אתם בטוחים שברצונכם להמשיך?')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const success = importBackupData(result);
          if (success) {
            alert('הגיבוי שוחזר בהצלחה!');
          } else {
            alert('שגיאה בשחזור הגיבוי. אנא ודאו שמדובר בקובץ גיבוי תקין של האפליקציה.');
          }
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      addProfile(newProfileName.trim());
      setNewProfileName('');
      setIsAddingProfile(false);
    }
  };

  const babyAge = getBabyAge(activeProfile?.birthDate);

  // Statistics calculation
  const triedFoods = foods.filter(f => f.attempts.length > 0);
  const completedFoods = foods.filter(f => f.status === 'הושלם');
  const avoidFoods = foods.filter(f => f.status === 'רגישות/תגובה');
  
  // Progress towards 100 foods milestone
  const progressPercentage = Math.min(Math.round((triedFoods.length / 100) * 100), 100);

  // Timeline Phase breakdown
  const phase1Foods = completedFoods.filter(f => f.recommendedPhase === 1);
  const phase2Foods = completedFoods.filter(f => f.recommendedPhase === 2);
  const phase3Foods = completedFoods.filter(f => f.recommendedPhase === 3);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Overview Section */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/40 shadow-soft text-center flex flex-col items-center">
        <div 
          className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center relative group cursor-pointer overflow-hidden border border-brand-sand/50 shadow-soft shrink-0 mb-3"
          onClick={() => fileInputRef.current?.click()}
        >
          {activeProfile?.avatar ? (
            <img src={activeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl text-brand-sage/50">👶</span>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={20} />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
        </div>
        
        <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">המסע של {activeProfile?.name}</h2>
        <p className="text-xs font-bold text-brand-olive/50 uppercase tracking-wider mt-1.5">
          {babyAge || 'גיל לא מוגדר'} • תחילת מוצקים: חודש 6
        </p>

        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setIsGuidelinesOpen(true)} 
            className="text-[10px] font-bold uppercase tracking-wider bg-brand-cream text-brand-sage px-4 py-2 rounded-lg border border-brand-sand flex items-center gap-1.5 active:scale-98 transition-all shadow-soft"
          >
            <Info size={13} /> הנחיות בטיחות ודגשים
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Foods Card */}
        <div className="col-span-2 bg-white rounded-xl p-6 border border-brand-sand/40 shadow-soft flex items-center justify-between text-right">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-wider">סה"כ מאכלים שנוסו</span>
            <span className="font-serif text-4xl font-bold text-brand-olive mt-1">{triedFoods.length}</span>
            <p className="text-xs text-brand-olive/60 mt-4 font-semibold leading-relaxed">
              {activeProfile?.name || 'התינוק/ת'} בדרך להגיע ליעד של 100 מאכלים עד יום הולדת שנה!
            </p>
          </div>
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#EFEEEB" strokeWidth="4" fill="transparent" />
              <circle cx="32" cy="32" r="26" stroke="#475B4C" strokeWidth="4" fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - progressPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-brand-olive">{progressPercentage}%</span>
          </div>
        </div>

        {/* Safe Foods Card */}
        <div className="bg-white rounded-xl p-5 border border-brand-sand/40 shadow-soft flex flex-col items-start gap-1 text-right w-full">
          <div className="flex items-center gap-1.5 text-brand-sage mb-1.5">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold text-brand-olive">בטוחים לשימוש</span>
          </div>
          <span className="font-serif text-3xl font-bold text-brand-olive">{completedFoods.length}</span>
          <span className="text-[10px] text-brand-olive/40 font-bold uppercase tracking-wider mt-1">סבילות מאושרת</span>
        </div>

        {/* Avoid Foods Card */}
        <div className="bg-white rounded-xl p-5 border border-brand-sand/40 shadow-soft flex flex-col items-start gap-1 text-right w-full">
          <div className="flex items-center gap-1.5 text-red-600 mb-1.5">
            <AlertCircle size={18} />
            <span className="text-xs font-bold text-brand-olive">רגישות / להימנע</span>
          </div>
          <span className="font-serif text-3xl font-bold text-brand-olive">{avoidFoods.length}</span>
          <span className="text-[10px] text-brand-olive/40 font-bold uppercase tracking-wider mt-1">זוהתה תגובה</span>
        </div>
      </div>

      {/* Introduction Timeline */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/40 shadow-soft flex flex-col gap-5 text-right">
        <h3 className="font-serif text-base font-bold text-[#2D2D2D] mb-1">ציר זמן חשיפת מזונות</h3>
        
        <div className="relative border-r-2 border-brand-sand/30 mr-3.5 space-y-6 pb-2" dir="rtl">
          {/* Milestone 3: Phase 3 */}
          <div className="relative pr-6">
            <div className={`absolute -right-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-soft ${
              phase3Foods.length > 0 ? 'bg-brand-sage' : 'bg-brand-sand'
            }`} />
            <div className="flex flex-col gap-1">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-soft uppercase tracking-wider ${
                  phase3Foods.length > 0 ? 'bg-brand-cream text-brand-sage border border-brand-sand' : 'bg-brand-sand/30 text-brand-olive/40'
                }`}>
                  שלב 3: גיל 8+ חודשים
                </span>
              </div>
              <h4 className="text-xs font-bold text-brand-olive mt-1.5">חלבונים ומרקמים מורכבים</h4>
              <p className="text-[11px] text-brand-olive/60 font-semibold leading-relaxed">
                שילוב בשר בקר, הודו, דגים ותבלינים עדינים. מעבר למרקם קצוץ או נגיסי אצבע קלים.
              </p>
              {phase3Foods.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {phase3Foods.map(f => (
                    <span key={f.id} className="text-[9px] bg-brand-cream border border-brand-sand/50 text-brand-sage px-2.5 py-0.5 rounded font-bold flex items-center gap-1 shadow-soft">
                      <span>{f.icon}</span>
                      <span>{f.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[9px] text-brand-olive/30 font-bold mt-1.5 block">טרם הושלמו מזונות משלב זה</span>
              )}
            </div>
          </div>

          {/* Milestone 2: Phase 2 */}
          <div className="relative pr-6">
            <div className={`absolute -right-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-soft ${
              phase2Foods.length > 0 ? 'bg-brand-sage' : 'bg-brand-sand'
            }`} />
            <div className="flex flex-col gap-1">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-soft uppercase tracking-wider ${
                  phase2Foods.length > 0 ? 'bg-brand-cream text-brand-sage border border-brand-sand' : 'bg-brand-sand/30 text-brand-olive/40'
                }`}>
                  שלב 2: גיל 7 חודשים
                </span>
              </div>
              <h4 className="text-xs font-bold text-brand-olive mt-1.5">התקדמות במרקמים ואלרגנים</h4>
              <p className="text-[11px] text-brand-olive/60 font-semibold leading-relaxed">
                ביצים, עוף, מוצרי חלב מותססים (מגיל 9 חודשים), דגנים וירקות מרוסקים גס/מעוכים.
              </p>
              {phase2Foods.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {phase2Foods.map(f => (
                    <span key={f.id} className="text-[9px] bg-brand-cream border border-brand-sand/50 text-brand-sage px-2.5 py-0.5 rounded font-bold flex items-center gap-1 shadow-soft">
                      <span>{f.icon}</span>
                      <span>{f.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[9px] text-brand-olive/30 font-bold mt-1.5 block">טרם הושלמו מזונות משלב זה</span>
              )}
            </div>
          </div>

          {/* Milestone 1: Phase 1 */}
          <div className="relative pr-6">
            <div className={`absolute -right-[7px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-soft ${
              phase1Foods.length > 0 ? 'bg-brand-sage' : 'bg-brand-sand'
            }`} />
            <div className="flex flex-col gap-1">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-soft uppercase tracking-wider ${
                  phase1Foods.length > 0 ? 'bg-brand-cream text-brand-sage border border-brand-sand' : 'bg-brand-sand/30 text-brand-olive/40'
                }`}>
                  שלב 1: גיל 6 חודשים
                </span>
              </div>
              <h4 className="text-xs font-bold text-brand-olive mt-1.5">חשיפה ראשונית ומחיות חלקות</h4>
              <p className="text-[11px] text-brand-olive/60 font-semibold leading-relaxed">
                ירקות ופירות פשוטים מאודים וטחונים למרקם חלק במיוחד, לצד אלרגנים מדוללים (טחינה, בוטנים).
              </p>
              {phase1Foods.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {phase1Foods.map(f => (
                    <span key={f.id} className="text-[9px] bg-brand-cream border border-brand-sand/50 text-brand-sage px-2.5 py-0.5 rounded font-bold flex items-center gap-1 shadow-soft">
                      <span>{f.icon}</span>
                      <span>{f.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[9px] text-brand-olive/30 font-bold mt-1.5 block">טרם הושלמו מזונות משלב זה</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Profiles collapsible */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/40 shadow-soft text-right">
        <button
          onClick={() => setIsEditingProfileOpen(!isEditingProfileOpen)}
          className="flex justify-between items-center w-full text-right"
        >
          <span className="font-serif text-base font-bold text-[#2D2D2D]">הגדרות וניהול פרופילים</span>
          <ChevronDown size={18} className={`text-brand-sage transition-transform duration-300 ${isEditingProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {isEditingProfileOpen && (
          <div className="mt-5 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Active Profile Editor Form */}
            <div className="bg-brand-cream/30 border border-brand-sand/50 p-4 rounded-xl flex flex-col gap-4 shadow-soft">
              <span className="text-[10px] font-bold text-brand-primary-container uppercase tracking-wider">עדכון פרטי תינוק/ת</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-olive/40">שם התינוק/ת</label>
                  <input 
                    type="text" 
                    value={activeProfile?.name || ''}
                    onChange={(e) => updateActiveProfile({ name: e.target.value })}
                    className="p-3 bg-white border border-brand-sand rounded-lg text-xs font-semibold text-brand-olive outline-none focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage/30 shadow-soft transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-brand-olive/40">תאריך לידה</label>
                  <input 
                    type="date" 
                    value={activeProfile?.birthDate || ''}
                    onChange={(e) => updateActiveProfile({ birthDate: e.target.value })}
                    className="p-3 bg-white border border-brand-sand rounded-lg text-xs font-semibold text-brand-olive outline-none focus:ring-2 focus:ring-brand-sage/10 focus:border-brand-sage/30 shadow-soft transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Profile switching */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-wider">החלפת פרופיל</span>
              <div className="flex flex-col gap-2">
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => switchProfile(p.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all shadow-soft ${
                      p.id === activeProfile?.id 
                        ? 'bg-brand-cream border-brand-sage text-brand-sage font-bold' 
                        : 'bg-white border-brand-sand/40 text-brand-olive/60 hover:bg-brand-cream hover:border-brand-sand'
                    }`}
                  >
                    <span className="text-xs">{p.name}</span>
                    {p.id === activeProfile?.id && <CheckCircle2 size={16} className="text-brand-sage" />}
                  </button>
                ))}
                
                {isAddingProfile ? (
                  <form onSubmit={handleAddProfile} className="bg-white border-2 border-dashed border-brand-sage/20 p-4 rounded-xl flex flex-col gap-3 mt-1 shadow-soft">
                    <input
                      autoFocus
                      type="text"
                      placeholder="שם התינוק..."
                      value={newProfileName}
                      onChange={e => setNewProfileName(e.target.value)}
                      className="w-full bg-brand-cream border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-brand-sage/10 outline-none"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-brand-sage text-white py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all">הוספה</button>
                      <button type="button" onClick={() => setIsAddingProfile(false)} className="flex-1 bg-brand-cream text-brand-olive/60 py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all border border-brand-sand">ביטול</button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsAddingProfile(true)}
                    className="flex items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-brand-sand/60 text-brand-olive/40 hover:text-brand-sage hover:border-brand-sage/30 transition-all gap-2"
                  >
                    <UserPlus size={16} />
                    <span className="text-xs font-bold">הוספת פרופיל נוסף</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account & Data buttons */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/40 shadow-soft flex flex-col gap-4 text-right">
        <h3 className="font-serif text-base font-bold text-[#2D2D2D]">חשבון ונתונים</h3>
        <div className="flex flex-col gap-2.5">
          
          {/* Reminders Accordion */}
          <div className="border border-brand-sand/45 rounded-xl overflow-hidden shadow-soft">
            <button 
              onClick={() => setIsReminderOpen(!isReminderOpen)}
              className="flex items-center justify-between p-4 bg-brand-cream/30 hover:bg-brand-cream/60 transition-colors text-right w-full"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-brand-sage" />
                <span className="text-xs font-bold text-brand-olive">תזכורות והתראות יומיות</span>
                {reminderEnabled && (
                  <span className="text-[9px] bg-brand-sage text-white px-2 py-0.5 rounded font-bold">פעיל ({reminderTime})</span>
                )}
              </div>
              <ChevronLeft size={16} className={`text-brand-sage/60 transition-transform ${isReminderOpen ? '-rotate-90' : ''}`} />
            </button>
            
            {isReminderOpen && (
              <div className="p-4 bg-white border-t border-brand-sand/40 flex flex-col gap-4 text-right animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-olive">הפעלת תזכורות יומיות</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={reminderEnabled} 
                      onChange={(e) => setReminderEnabled(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-brand-sand peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-sage"></div>
                  </label>
                </div>
                
                {reminderEnabled && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-olive/50">שעת התזכורת</label>
                      <input 
                        type="time" 
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="p-2.5 bg-brand-cream border border-brand-sand rounded-lg text-xs font-semibold text-brand-olive outline-none focus:ring-2 focus:ring-brand-sage/10"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-brand-olive/50">סוג התזכורת</label>
                      <select 
                        value={reminderType}
                        onChange={(e) => setReminderType(e.target.value)}
                        className="p-2.5 bg-brand-cream border border-brand-sand rounded-lg text-xs font-semibold text-brand-olive outline-none focus:ring-2 focus:ring-brand-sage/10"
                      >
                        <option value="both">הכול (תזכורת חשיפה + רישום ביומן)</option>
                        <option value="tastes">רעיונות לחשיפה יומית בלבד</option>
                        <option value="log">תזכורת לתיעוד בלבד</option>
                      </select>
                    </div>
                  </>
                )}

                <button 
                  onClick={handleSaveReminders}
                  className="bg-brand-sage text-white py-2 rounded-lg text-xs font-bold active:scale-98 transition-all shadow-soft"
                >
                  שמירת הגדרות תזכורת
                </button>
              </div>
            )}
          </div>
          
          {/* Partner Sync Accordion */}
          <div className="border border-brand-sand/45 rounded-xl overflow-hidden shadow-soft">
            <button 
              onClick={() => {
                setIsSyncOpen(!isSyncOpen);
                setSyncStatusMsg(null);
              }}
              className="flex items-center justify-between p-4 bg-brand-cream/30 hover:bg-brand-cream/60 transition-colors text-right w-full"
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-brand-sage" />
                <span className="text-xs font-bold text-brand-olive font-serif">שיתוף וסנכרון עם בן/בת הזוג</span>
              </div>
              <ChevronLeft size={16} className={`text-brand-sage/60 transition-transform ${isSyncOpen ? '-rotate-90' : ''}`} />
            </button>

            {isSyncOpen && (
              <div className="p-4 bg-white border-t border-brand-sand/40 flex flex-col gap-4 text-right animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-[11px] text-brand-olive/60 font-semibold leading-relaxed">
                  היות והאפליקציה שומרת את הנתונים באופן מקומי ומאובטח במכשירכם, תוכלו להשתמש בקוד סנכרון כדי לשתף ולהעביר את כל ההתקדמות של {activeProfile?.name || 'התינוק/ת'} לבן/בת הזוג.
                </p>

                {/* Option 1: Copy Sync Code */}
                <div className="bg-brand-cream/35 border border-brand-sand/65 p-3 rounded-lg flex flex-col gap-2 shadow-soft">
                  <span className="text-[10px] font-bold text-brand-sage uppercase">1. ייצוא קוד סנכרון לשותף</span>
                  <p className="text-[10px] text-brand-olive/50">
                    לחצו להעתקת קוד הסנכרון ושלחו אותו לשותף/ה בשיחה (WhatsApp וכדומה):
                  </p>
                  <button 
                    onClick={handleCopySyncCode}
                    className="bg-brand-cream border border-brand-sand text-brand-sage hover:bg-brand-sand/40 py-2.5 rounded-lg text-xs font-bold active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    העתקת קוד סנכרון לקליפבורד
                  </button>
                </div>

                {/* Option 2: Paste Sync Code */}
                <form onSubmit={handleImportSyncCode} className="bg-brand-cream/35 border border-brand-sand/65 p-3 rounded-lg flex flex-col gap-3.5 shadow-soft">
                  <span className="text-[10px] font-bold text-brand-sage uppercase">2. ייבוא קוד סנכרון מהשותף</span>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-brand-olive/50">הדביקו כאן את הקוד שקיבלתם מבן/בת הזוג:</label>
                    <textarea 
                      value={syncCodeToPaste}
                      onChange={(e) => setSyncCodeToPaste(e.target.value)}
                      placeholder="הדביקו את הקוד המורכב כאן..."
                      className="w-full bg-white border border-brand-sand rounded-lg p-2.5 text-[10px] font-mono outline-none focus:ring-2 focus:ring-brand-sage/10 h-20 resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-brand-sage text-white py-2.5 rounded-lg text-xs font-bold active:scale-98 transition-all"
                  >
                    סנכרן נתונים במכשיר זה
                  </button>
                </form>

                {syncStatusMsg && (
                  <div className={`p-2.5 rounded text-xs font-bold text-center ${
                    syncStatusMsg.startsWith('שגיאה') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-brand-sage border border-brand-sand'
                  }`}>
                    {syncStatusMsg}
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={() => printMedicalPDFAll(foods, activeProfile?.name, activeProfile?.birthDate, babyAge)}
            className="flex items-center justify-between p-4 bg-brand-cream/30 border border-brand-sand/45 rounded-xl hover:bg-brand-cream/60 transition-colors shadow-soft text-right w-full"
          >
            <div className="flex items-center gap-3">
              <File size={18} className="text-brand-sage" />
              <span className="text-xs font-bold text-brand-olive">ייצוא דו"ח רפואי מלא (PDF)</span>
            </div>
            <ChevronLeft size={16} className="text-brand-sage/60" />
          </button>
        </div>
      </div>

      {/* Backup & Restore section */}
      <div className="bg-white rounded-xl p-6 border border-brand-sand/40 shadow-soft flex flex-col gap-4 text-right">
        <div className="flex flex-col">
          <h3 className="font-serif text-base font-bold text-[#2D2D2D] mb-0.5">גיבוי ושחזור קבצים</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-olive/40">שמירה ידנית של נתוני האפליקציה</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={() => exportBackupJSON(profiles, activeProfileId, activeProfile?.name)}
            className="flex items-center justify-center gap-1.5 p-3 bg-brand-cream border border-brand-sand/60 text-brand-olive hover:bg-brand-sand/40 transition-all rounded-lg font-bold text-xs shadow-soft"
            title="ייצוא קובץ JSON לשחזור נתונים במכשיר אחר"
          >
            <Download size={14} />
            שמירת קובץ גיבוי (JSON)
          </button>

          <button
            onClick={() => exportAllToExcel(foods, activeProfile?.name)}
            className="flex items-center justify-center gap-1.5 p-3 bg-brand-cream border border-brand-sand/60 text-brand-olive hover:bg-brand-sand/40 transition-all rounded-lg font-bold text-xs shadow-soft"
            title="ייצוא קובץ Excel מפורט לצפייה בטבלה"
          >
            <FileSpreadsheet size={14} />
            ייצוא ל-Excel (.xlsx)
          </button>
        </div>

        <div className="h-px bg-brand-sand/60 my-1"></div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-brand-olive/40 uppercase tracking-wider px-1">שחזור נתונים מגיבוי</span>
          <button
            onClick={() => jsonInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-brand-sand/80 hover:border-brand-sage/35 text-brand-olive/50 hover:text-brand-sage transition-all rounded-lg font-bold text-xs bg-brand-cream/30"
          >
            <Upload size={14} />
            טעינת קובץ גיבוי לשחזור (.json)
          </button>
          <input
            type="file"
            ref={jsonInputRef}
            onChange={handleJSONImport}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* App Info / Version */}
      <div className="text-center opacity-30 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-olive">My First Bite v1.2</p>
        <p className="text-[9px] font-medium text-brand-olive mt-0.5">נעשה באהבה להורים טריים</p>
      </div>
    </div>
  );
};

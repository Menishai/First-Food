import { FoodItem } from './types';

export const tipsData: Record<string, { title: string, content: string, icon: string, sub: string, bg: string, border: string, textMain: string, textDark: string }> = {
  'הכל': {
     title: 'חוק ה-3 ימים',
     content: 'חשפו את התינוק למזון חדש במשך 3 ימים רצופים במרקם חלק. זה יעזור לכם לבודד רגישויות ולעזור לתינוק להתרגל לטעם.',
     icon: '🕒',
     sub: 'טיפ מנצח לטעימות',
     bg: 'bg-[#D1E9F6]',
     border: 'border-[#BBD9E8]',
     textMain: 'text-[#4B7D96]',
     textDark: 'text-[#2D2D2D]'
  },
  'ירקות': {
     title: 'התחילו עם ירקות מתוקים',
     content: 'ירקות כמו בטטה, גזר ודלעת הם התחלה מצוינת! חשוב לאדות ולטחון היטב למרקם חלק במיוחד לטעימות הראשונות.',
     icon: '🍠',
     sub: 'מומלץ לחשיפה מגיל חצי שנה',
     bg: 'bg-[#D1E9F6]',
     border: 'border-[#BBD9E8]',
     textMain: 'text-[#4B7D96]',
     textDark: 'text-[#2D2D2D]'
  },
  'פירות': {
     title: 'פירות אחרי ירקות',
     content: 'מומלץ להתחיל קודם עם ירקות כדי שהתינוק יתרגל לטעמים פחות מתוקים. לאחר מכן, פירות כמו תפוח או אגס טחונים הם להיט.',
     icon: '🍎',
     sub: 'עשירים בויטמינים וטעימים',
     bg: 'bg-[#FEF5E7]',
     border: 'border-[#FDEBD0]',
     textMain: 'text-[#E67E22]',
     textDark: 'text-[#D35400]'
  },
  'חלבונים': {
     title: 'העשרת ברזל חיונית',
     content: 'מגיל חצי שנה מאגרי הברזל מדלדלים, ולכן בשר, הודו ועוף נחוצים מאד. טחנו אותם למרקם דליל עם ציר או מי בישול.',
     icon: '🍗',
     sub: 'התפתחות ובניית שריר',
     bg: 'bg-[#F9E79F]/30',
     border: 'border-[#F1C40F]/50',
     textMain: 'text-[#B7950B]',
     textDark: 'text-[#9A7D0A]'
  },
  'אלרגנים': {
     title: 'חשיפה זהירה בבוקר',
     content: 'חשפו לאלרגנים בשעות הבוקר, לא בזמן מחלה, וכאשר התינוק נינוח. כך תוכלו להגיב מיד לכל תגובה.',
     icon: '⚠️',
     sub: 'בטיחות קודמת לכל',
     bg: 'bg-[#FADBD8]',
     border: 'border-[#F5B7B1]',
     textMain: 'text-[#C0392B]',
     textDark: 'text-[#922B21]'
  },
  'דגנים': {
     title: 'פחמימות מורכבות',
     content: 'שיבולת שועל היא בחירה נהדרת – מזינה, עשירה בסיבים וקלה לעיכול. ניתן לערבב עם מים, חלב אם או תמ"ל.',
     icon: '🌾',
     sub: 'סיבים תזונתיים ושובע',
     bg: 'bg-[#E1F0DA]',
     border: 'border-[#CCE2C2]',
     textMain: 'text-[#5A8742]',
     textDark: 'text-[#3B5B2D]'
  },
  'רגישויות': {
     title: 'מעקב ודיווח רפואי',
     content: 'כאן מרוכזים המזונות שעוררו תגובה אלרגית. במקרה של רגישות, הפסיקו חשיפה ופנו לייעוץ של רופא ילדים או אלרגולוג.',
     icon: '🩺',
     sub: 'ייעוץ רפואי ולמעקב',
     bg: 'bg-red-50',
     border: 'border-red-200',
     textMain: 'text-red-700',
     textDark: 'text-red-900'
  },
  'תיבול': {
     title: 'תיבול וטעם',
     content: 'הוסיפו טעמים חדשים (כמו כמון, קינמון) למזון קיים כדי לגוון את התזונה של התינוק.',
     icon: '🌿',
     sub: 'חשיפה לטעמים שונים',
     bg: 'bg-green-50',
     border: 'border-green-200',
     textMain: 'text-green-700',
     textDark: 'text-green-900'
  }
};

export const initialFoods: FoodItem[] = [
  // שלב 1 - חשיפה ראשונית
  // ==========================================
  // ירקות
  { id: 'f1', name: 'בטטה', icon: '🍠', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "אידוי או בישול עד ריכוך ומעיכה למחית חלקה." },
  { id: 'f2', name: 'גזר', icon: '🥕', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף, בישול במים עד ריכוך מלא וטחינה." },
  { id: 'f3', name: 'קישוא', icon: '🥒', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף (אופציונלי), בישול קצר וטחינה." },
  { id: 'f4', name: 'דלעת', icon: '🎃', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול במים או אידוי ומעיכה." },
  { id: 'f10', name: 'אבוקדו', icon: '🥑', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "מעיכה במזלג (ללא בישול)." },
  // פירות
  { id: 'f11', name: 'תפוח', icon: '🍎', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "אידוי קל וטחינה, או גרור דק מאוד." },
  { id: 'f12', name: 'אגס', icon: '🍐', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף וטחינה (בשלב מתקדם אפשר לגרד)." },
  { id: 'f13', name: 'בננה', icon: '🍌', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "מעיכה במזלג למרקם חלק." },
  { id: 'f14', name: 'מלון', icon: '🍈', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1 },
  { id: 'f15', name: 'אבטיח', icon: '🍉', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1 },
  // חלבונים
  { id: 'f20', name: 'הודו (אדום)', icon: '🦃', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול ארוך עם ירקות שורש וטחינה דקה מאוד." },
  { id: 'f22', name: 'עדשים (כתומות)', icon: '🍛', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול עד ריכוך מלא (מתפרק בקלות) וטחינה." },
  { id: 'f23', name: 'חומוס', icon: '🧆', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1 },
  // אלרגנים
  { id: 'f24', name: 'טחינה (שומשום)', icon: '🫙', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "טחינה גולמית מדוללת מאוד במים." },
  { id: 'f25', name: 'חמאת בוטנים', icon: '🥜', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: 'חובה לדלל במים או חלב אם/תמ"ל עד מרקם נוזלי מאוד. אסור לתת כגוש.' },
  // דגנים
  { id: 'f29', name: 'שיבולת שועל', icon: '🌾', category: 'דגנים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: 'בישול עם מים/חלב אם/תמ"ל להכנת דייסה דלילה.' },
  { id: 'f30', name: 'אורז', icon: '🍚', category: 'דגנים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול רך מאוד וטחינה." },
  // תיבול
  { id: 's1', name: 'שורש פטרוזיליה', icon: '🌿', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, isAromaticOnly: true, servingSuggestion: "בישול בתוך המרק להענקת טעם והוצאה לפני הטחינה." },
  { id: 's2', name: 'שום', icon: '🧄', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, isAromaticOnly: true, servingSuggestion: "בישול שן שלמה והוצאתה." },

  // ==========================================
  // שלב 2 - התקדמות במרקמים
  // ==========================================
  // ירקות
  { id: 'f5', name: 'תפוח אדמה', icon: '🥔', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול עד ריכוך ומעיכה (עדיף עם מעט נוזלי בישול)." },
  { id: 'f6', name: 'ברוקולי', icon: '🥦', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "אידוי פרחי הברוקולי וטחינה." },
  { id: 'f7', name: 'כרובית', icon: '🥦', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "אידוי פרחי הכרובית וטחינה." },
  { id: 'f8', name: 'אפונה', icon: '🫛', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול וטחינה דקה מאוד (מומלץ לסנן קליפות בשלב ראשון)." },
  { id: 'f9', name: 'שעועית ירוקה', icon: '🫛', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2 },
  // פירות
  { id: 'f16', name: 'מנגו', icon: '🥭', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "טחינה למחית חלקה." },
  { id: 'f17', name: 'פפאיה', icon: '🥭', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2 },
  { id: 'f18', name: 'אפרסק', icon: '🍑', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2 },
  // חלבונים
  { id: 'f19', name: 'עוף', icon: '🍗', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2 },
  { id: 'f21', name: 'בקר', icon: '🥩', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול ארוך וטחינה חלקה במיוחד." },
  // אלרגנים
  { id: 'f26', name: 'ביצה', icon: '🥚', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "ביצה קשה מבושלת היטב, טחונה בתוך מחית ירקות." },
  { id: 'f27', name: 'דג', icon: '🐟', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 2 },
  // תיבול
  { id: 's3', name: 'כמון', icon: '🧂', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, isAromaticOnly: false, servingSuggestion: "הוספת קמצוץ קטן למחית ירקות או קטניות." },
  { id: 's4', name: 'קינמון', icon: '🪵', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, isAromaticOnly: false, servingSuggestion: "הוספת קמצוץ למחית פירות או דייסה." },

  // ==========================================
  // שלב 3 - חשיפה מאוחרת
  // ==========================================
  { id: 'v8', name: 'סלק', icon: '🟣', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 3, servingSuggestion: "בישול ארוך עד ריכוך מלא וטחינה." },
  { id: 'f28', name: 'חלב פרה', icon: '🥛', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 3, servingSuggestion: "שתיית חלב ניגר מומלצת מגיל שנה. מוצרי חלב החל מגיל 9 חודשים בהדרגה." },
];

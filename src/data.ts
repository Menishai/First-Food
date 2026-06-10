import { FoodItem } from './types';

export const tipsData: Record<string, { title: string, content: string, icon: string, sub: string, bg: string, border: string, textMain: string, textDark: string }> = {
  'הכל': {
     title: 'חוק ה-1 עד 2 ימים',
     content: 'ההנחיה העדכנית היא להמתין כיומיים בין חשיפה למזונות חדשים (ולא 3 ימים כפי שהיה נהוג בעבר). הציעו כל מאכל בנפרד במרקם חלק כדי שתוכלו לזהות רגישויות בקלות.',
     icon: '🕒',
     sub: 'טיפ מנצח לטעימות',
     bg: 'bg-white',
     border: 'border-brand-sand/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-brand-primary font-serif'
  },
  'ירקות': {
     title: 'התחילו עם ירקות מתוקים',
     content: 'ירקות כמו בטטה, גזר ודלעת הם התחלה מצוינת! חשוב לאדות ולטחון היטב למרקם חלק במיוחד לטעימות הראשונות.',
     icon: '🍠',
     sub: 'מומלץ לחשיפה מגיל חצי שנה',
     bg: 'bg-white',
     border: 'border-brand-sand/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-brand-primary font-serif'
  },
  'פירות': {
     title: 'פירות אחרי ירקות',
     content: 'מומלץ להתחיל קודם עם ירקות כדי שהתינוק יתרגל לטעמים פחות מתוקים. לאחר מכן, פירות כמו תפוח או אגס טחונים הם להיט.',
     icon: '🍎',
     sub: 'עשירים בויטמינים וטעימים',
     bg: 'bg-white',
     border: 'border-brand-sand/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-brand-primary font-serif'
  },
  'חלבונים': {
     title: 'העשרת ברזל חיונית',
     content: 'מגיל חצי שנה מאגרי הברזל מדלדלים, ולכן בשר, הודו ועוף נחוצים מאד. טחנו אותם למרקם דליל עם ציר או מי בישול.',
     icon: '🍗',
     sub: 'התפתחות ובניית שריר',
     bg: 'bg-white',
     border: 'border-brand-sand/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-brand-primary font-serif'
  },
  'אלרגנים': {
     title: 'חשיפה זהירה בבוקר',
     content: 'חשפו לאלרגנים בשעות הבוקר, לא בזמן מחלה, וכאשר התינוק נינוח. כך תוכלו להגיב מיד לכל תגובה.',
     icon: '⚠️',
     sub: 'בטיחות קודמת לכל',
     bg: 'bg-white',
     border: 'border-brand-blush/30 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-red-700 font-serif'
  },
  'דגנים': {
     title: 'פחמימות מורכבות',
     content: 'שיבולת שועל היא בחירה נהדרת – מזינה, עשירה בסיבים וקלה לעיכול. ניתן לערבב עם מים, חלב אם או תמ"ל.',
     icon: '🌾',
     sub: 'סיבים תזונתיים ושובע',
     bg: 'bg-white',
     border: 'border-brand-sand/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-brand-primary font-serif'
  },
  'רגישויות': {
     title: 'מעקב ודיווח רפואי',
     content: 'כאן מרוכזים המזונות שעוררו תגובה אלרגית. במקרה של רגישות, הפסיקו חשיפה ופנו לייעוץ של רופא ילדים או אלרגולוג.',
     icon: '🩺',
     sub: 'ייעוץ רפואי ולמעקב',
     bg: 'bg-white',
     border: 'border-brand-blush/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-red-700 font-serif'
  },
  'תיבול': {
     title: 'תיבול וטעם',
     content: 'הוסיפו טעמים חדשים (כמו כמון, קינמון) למזון קיים כדי לגוון את התזונה של התינוק.',
     icon: '🌿',
     sub: 'חשיפה לטעמים שונים',
     bg: 'bg-white',
     border: 'border-brand-sand/50 shadow-soft',
     textMain: 'text-brand-olive/70',
     textDark: 'text-brand-primary font-serif'
  }
};

export const initialFoods: FoodItem[] = [
  // שלב 1 - חשיפה ראשונית
  // ==========================================
  // ירקות
  { id: 'f1', name: 'בטטה', icon: '🍠', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "אידוי או בישול עד ריכוך ומעיכה למחית חלקה.", image: "/images/f1.jpg" },
  { id: 'f2', name: 'גזר', icon: '🥕', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף, בישול במים עד ריכוך מלא וטחינה.", image: "/images/f2.jpg" },
  { id: 'f3', name: 'קישוא', icon: '🥒', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף (אופציונלי), בישול קצר וטחינה.", image: "/images/f3.jpg" },
  { id: 'f4', name: 'דלעת', icon: '🎃', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול במים או אידוי ומעיכה.", image: "/images/f4.jpg" },
  { id: 'f10', name: 'אבוקדו', icon: '🥑', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "מעיכה במזלג (ללא בישול).", image: "/images/f10.jpg" },
  { id: 'f33', name: 'דלורית', icon: '🎃', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף, סילוק גרעינים, אידוי או אפייה בתנור עד ריכוך מלא וטחינה.", image: "/images/f33.jpg" },
  // פירות
  { id: 'f11', name: 'תפוח', icon: '🍎', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "אידוי קל וטחינה, או גרור דק מאוד.", image: "/images/f11.jpg" },
  { id: 'f12', name: 'אגס', icon: '🍐', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף וטחינה (בשלב מתקדם אפשר לגרד).", image: "/images/f12.jpg" },
  { id: 'f13', name: 'בננה', icon: '🍌', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "מעיכה במזלג למרקם חלק.", image: "/images/f13.jpg" },
  { id: 'f14', name: 'מלון', icon: '🍈', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, image: "/images/f14.jpg" },
  { id: 'f15', name: 'אבטיח', icon: '🍉', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, image: "/images/f15.jpg" },
  { id: 'f31', name: 'שזיף', icon: '🍇', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "קילוף הקליפה, אידוי הפרי במעט מים חמימים, וטחינה למחית דלילה וחלקה.", image: "/images/f31.jpg" },
  // חלבונים
  { id: 'f20', name: 'הודו (אדום)', icon: '🦃', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול ארוך עם ירקות שורש וטחינה דקה מאוד.", image: "/images/f20.jpg" },
  { id: 'f22', name: 'עדשים (כתומות)', icon: '🍛', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול עד ריכוך מלא (מתפרק בקלות) וטחינה.", image: "/images/f22.jpg" },
  { id: 'f23', name: 'חומוס', icon: '🧆', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, image: "/images/f23.jpg" },
  // אלרגנים
  { id: 'f24', name: 'טחינה (שומשום)', icon: '🫙', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "טחינה גולמית מדוללת מאוד במים.", image: "/images/f24.jpg" },
  { id: 'f25', name: 'חמאת בוטנים', icon: '🥜', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: 'חובה לדלל במים או חלב אם/תמ"ל עד מרקם נוזלי מאוד. אסור לתת כגוש.', image: "/images/f25.jpg" },
  // דגנים
  { id: 'f29', name: 'שיבולת שועל', icon: '🌾', category: 'דגנים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: 'בישול עם מים/חלב אם/תמ"ל להכנת דייסה דלילה.', image: "/images/f29.jpg" },
  { id: 'f30', name: 'אורז', icon: '🍚', category: 'דגנים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, servingSuggestion: "בישול רך מאוד וטחינה.", image: "/images/f30.jpg" },
  // תיבול
  { id: 's1', name: 'שורש פטרוזיליה', icon: '🌿', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, isAromaticOnly: true, servingSuggestion: "בישול בתוך המרק להענקת טעם והוצאה לפני הטחינה.", image: "/images/s1.jpg" },
  { id: 's2', name: 'שום', icon: '🧄', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 1, isAromaticOnly: true, servingSuggestion: "בישול שן שלמה והוצאתה.", image: "/images/s2.jpg" },

  // ==========================================
  // שלב 2 - התקדמות במרקמים
  // ==========================================
  // ירקות
  { id: 'f5', name: 'תפוח אדמה', icon: '🥔', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול עד ריכוך ומעיכה (עדיף עם מעט נוזלי בישול).", image: "/images/f5.jpg" },
  { id: 'f6', name: 'ברוקולי', icon: '🥦', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "אידוי פרחי הברוקולי וטחינה.", image: "/images/f6.jpg" },
  { id: 'f7', name: 'כרובית', icon: '🥦', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "אידוי פרחי הכרובית וטחינה.", image: "/images/f7.jpg" },
  { id: 'f8', name: 'אפונה', icon: '🫛', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול וטחינה דקה מאוד (מומלץ לסנן קליפות בשלב ראשון).", image: "/images/f8.jpg" },
  { id: 'f9', name: 'שעועית ירוקה', icon: '🫛', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, image: "/images/f9.jpg" },
  { id: 'f36', name: 'תרד', icon: '🥬', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "אידוי קצר, סחיטה יסודית של נוזלים עודפים וטחינה למחית חלקה.", image: "/images/f36.jpg" },
  // פירות
  { id: 'f16', name: 'מנגו', icon: '🥭', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "טחינה למחית חלקה.", image: "/images/f16.jpg" },
  { id: 'f17', name: 'פפאיה', icon: '🥭', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, image: "/images/f17.jpg" },
  { id: 'f18', name: 'אפרסק', icon: '🍑', category: 'פירות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, image: "/images/f18.jpg" },
  // חלבונים
  { id: 'f19', name: 'עוף', icon: '🍗', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, image: "/images/f19.jpg" },
  { id: 'f21', name: 'בקר', icon: '🥩', category: 'חלבונים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול ארוך וטחינה חלקה במיוחד.", image: "/images/f21.jpg" },
  // אלרגנים
  { id: 'f26', name: 'ביצה', icon: '🥚', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "ביצה קשה מבושלת היטב, טחונה בתוך מחית ירקות.", image: "/images/f26.jpg" },
  { id: 'f27', name: 'דג', icon: '🐟', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 2, image: "/images/f27.jpg" },
  { id: 'f32', name: 'סלמון', icon: '🐟', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול יסודי של הפילה, פירוק קפדני לווידוא היעדר עצמות ומעיכה דקה.", image: "/images/f32.jpg" },
  // דגנים
  { id: 'f34', name: 'קינואה', icon: '🌾', category: 'דגנים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול יסודי במים עד ריכוך מלא ופתיחת הגרגרים, וטחינה או מעיכה.", image: "/images/f34.jpg" },
  { id: 'f37', name: 'גריסי פנינה', icon: '🌾', category: 'דגנים', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, servingSuggestion: "בישול ארוך מאוד עד ריכוך מוחלט וטחינה חלקה.", image: "/images/f37.jpg" },
  // תיבול
  { id: 's3', name: 'כמון', icon: '🧂', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, isAromaticOnly: false, servingSuggestion: "הוספת קמצוץ קטן למחית ירקות או קטניות.", image: "/images/s3.jpg" },
  { id: 's4', name: 'קינמון', icon: '🪵', category: 'תיבול', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 2, isAromaticOnly: false, servingSuggestion: "הוספת קמצוץ למחית פירות או דייסה.", image: "/images/s4.jpg" },

  // ==========================================
  // שלב 3 - חשיפה מאוחרת
  // ==========================================
  { id: 'v8', name: 'סלק', icon: '🟣', category: 'ירקות', isAllergen: false, status: 'נעול', attempts: [], recommendedPhase: 3, servingSuggestion: "בישול ארוך עד ריכוך מלא וטחינה.", image: "/images/v8.jpg" },
  { id: 'f28', name: 'חלב פרה', icon: '🥛', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 3, servingSuggestion: "שתיית חלב ניגר מומלצת מגיל שנה. מוצרי חלב החל מגיל 9 חודשים בהדרגה.", image: "/images/f28.jpg" },
  { id: 'f35', name: 'יוגורט טבעי', icon: '🥛', category: 'אלרגנים', isAllergen: true, status: 'נעול', attempts: [], recommendedPhase: 3, servingSuggestion: "הגשת יוגורט טבעי ללא סוכר (7% שומן ומעלה) בכפית.", image: "/images/f35.jpg" }
];

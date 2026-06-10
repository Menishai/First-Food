import { FoodItem } from '../types';

export const getBabyAge = (birthDateStr?: string): string | null => {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  
  const totalMonths = years * 12 + months;
  
  if (totalMonths === 0) {
    if (days === 0) return 'נולד/ה היום!';
    if (days === 1) return 'בן/בת יום אחד';
    return `בן/בת ${days} ימים`;
  }
  
  let ageStr = `בן/בת ${totalMonths} חודשים`;
  if (days > 0) {
    ageStr += ` ו-${days} ימים`;
  }
  return ageStr;
};

export const getRecommendedPhaseInfo = (birthDateStr?: string): { phase: number; text: string } => {
  if (!birthDateStr) return { phase: 1, text: 'הזינו תאריך לידה לקבלת המלצה מותאמת התפתחותית' };
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = diffDays / 30.4375;

  if (months < 4) {
    return { phase: 0, text: 'המלצה: הנקה או תמ"ל בלבד (מומלץ להתחיל טעימות מגיל 4-6 חודשים בהתאם למוכנות התינוק)' };
  } else if (months >= 4 && months < 6) {
    return { phase: 1, text: 'המלצה לשלב 1: טעימות מזעריות במרקם חלק (ירקות/פירות קלים, אלרגנים נפוצים מדוללים)' };
  } else if (months >= 6 && months < 9) {
    return { phase: 2, text: 'המלצה לשלב 2: מעבר למרקם מעוך/גושים רכים. חשיפת ביצים, עוף, הודו ובקר' };
  } else if (months >= 9 && months < 12) {
    return { phase: 3, text: 'המלצה לשלב 3: מוצרי חלב מותססים (יוגורט/גבינה מ-9 חודשים), מרקם קצוץ, שילוב במנות משפחתיות' };
  } else {
    return { phase: 3, text: 'המלצה לגיל שנה ומעלה: מעבר מלא לארוחות משפחתיות מגוונות, מותר לשלב חלב פרה כמשקה' };
  }
};

export const getLast7DaysStats = (foods: FoodItem[]): { name: string; 'מספר טעימות': number }[] => {
  const result = [];
  const allAttemptsList = foods.flatMap(food => 
    food.attempts.map(attempt => ({ ...attempt, foodName: food.name }))
  );
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    const count = allAttemptsList.filter(a => a.date === dateString).length;
    result.push({
      name: d.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric' }),
      'מספר טעימות': count
    });
  }
  return result;
};

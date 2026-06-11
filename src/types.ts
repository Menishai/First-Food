export type Category = 'ירקות' | 'פירות' | 'חלבונים' | 'אלרגנים' | 'דגנים' | 'תיבול';
export type Status = 'נעול' | 'בתהליך' | 'הושלם' | 'רגישות/תגובה';
export type Amount = 'טעימה' | 'חצי מנה' | 'מנה שלמה';
export type Reaction = 'אהב/ה' | 'ניטרלי' | 'סירב/ה' | 'תגובה אלרגית';
export type Preparation = 'מאודה' | 'מבושל' | 'טחון' | 'מעוך' | 'חי' | 'אחר';

export interface Attempt {
  id: string;
  date: string;
  amount: Amount;
  reaction: Reaction;
  preparation?: Preparation;
  notes?: string;
  photo?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  birthDate?: string;
  foods: FoodItem[];
  reminderEnabled?: boolean;
  reminderTime?: string;
  reminderType?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  category: Category;
  isAllergen: boolean;
  status: Status;
  attempts: Attempt[];
  subCategory?: string;
  recommendedPhase?: number;
  isAromaticOnly?: boolean;
  servingSuggestion?: string;
  allergenWarningAcknowledged?: boolean;
  image?: string;
}

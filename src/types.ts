export type Category = 'ירקות' | 'פירות' | 'חלבונים' | 'אלרגנים' | 'דגנים' | 'תיבול';
export type Status = 'נעול' | 'בתהליך' | 'הושלם' | 'רגישות/תגובה';
export type Amount = 'טעימה' | 'חצי מנה' | 'מנה שלמה';
export type Reaction = 'אהב/ה' | 'ניטרלי' | 'סירב/ה' | 'תגובה אלרגית';

export interface Attempt {
  id: string;
  date: string;
  amount: Amount;
  reaction: Reaction;
  notes?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  foods: FoodItem[];
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
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, Attempt, Status, Profile } from './types';
import { initialFoods } from './data';

interface FoodContextType {
  profiles: Profile[];
  activeProfileId: string;
  activeProfile: Profile;
  addProfile: (name: string) => void;
  switchProfile: (id: string) => void;
  updateActiveProfile: (data: Partial<Profile>) => void;
  foods: FoodItem[];
  addAttempt: (foodId: string, attempt: Omit<Attempt, 'id'>) => void;
  updateStatus: (foodId: string, status: Status) => void;
  acknowledgeAllergen: (foodId: string) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem('babyFirstTastesProfiles');
      if (saved) {
        const parsedProfiles = JSON.parse(saved);
        return parsedProfiles.map((p: any) => ({
          ...p,
          foods: initialFoods.map(initialFood => {
            const existingFood = p.foods?.find((f: any) => f.id === initialFood.id);
            if (existingFood) {
              return {
                ...initialFood,
                status: existingFood.status,
                attempts: existingFood.attempts
              };
            }
            return initialFood;
          })
        }));
      }
      
      // Migration from old app state
      const legacySaved = localStorage.getItem('babyFirstTastes');
      if (legacySaved) {
         const oldFoods = JSON.parse(legacySaved);
         return [{ id: 'default', name: 'אריאל', foods: initialFoods.map(initialFood => {
           const existingFood = oldFoods?.find((f: any) => f.id === initialFood.id);
           if (existingFood) {
             return { ...initialFood, status: existingFood.status, attempts: existingFood.attempts };
           }
           return initialFood;
         }) }];
      }
    } catch (e) {
      console.error('Failed to parse from local storage', e);
    }
    return [{ id: '1', name: 'אריאל', foods: initialFoods }];
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('babyFirstTastesActiveProfile') || (profiles[0]?.id || '1');
  });

  useEffect(() => {
    localStorage.setItem('babyFirstTastesProfiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('babyFirstTastesActiveProfile', activeProfileId);
  }, [activeProfileId]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const foods = activeProfile?.foods || [];

  const addProfile = (name: string) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name,
      foods: initialFoods
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const switchProfile = (id: string) => {
    setActiveProfileId(id);
  };

  const updateProfileFoods = (newFoods: FoodItem[]) => {
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, foods: newFoods } : p));
  };

  const updateActiveProfile = (data: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, ...data } : p));
  };

  const addAttempt = (foodId: string, attempt: Omit<Attempt, 'id'>) => {
    const newFoods = foods.map((food) => {
      if (food.id !== foodId) return food;

      const newAttempt: Attempt = { ...attempt, id: Date.now().toString() };
      const updatedAttempts = [newAttempt, ...food.attempts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      let newStatus = food.status;
      
      if (attempt.reaction === 'תגובה אלרגית') {
        newStatus = 'רגישות/תגובה';
      } else if (food.status === 'נעול' || food.status === 'בתהליך') {
        if (updatedAttempts.length >= 3 && !updatedAttempts.some(a => a.reaction === 'תגובה אלרגית')) {
          newStatus = 'הושלם';
        } else {
          newStatus = 'בתהליך';
        }
      }

      return { ...food, attempts: updatedAttempts, status: newStatus };
    });
    updateProfileFoods(newFoods);
  };

  const updateStatus = (foodId: string, status: Status) => {
    updateProfileFoods(foods.map((food) => (food.id === foodId ? { ...food, status } : food)));
  };

  const acknowledgeAllergen = (foodId: string) => {
    updateProfileFoods(foods.map((food) => (food.id === foodId ? { ...food, allergenWarningAcknowledged: true } : food)));
  };

  return (
    <FoodContext.Provider value={{
      profiles, activeProfileId, activeProfile, addProfile, switchProfile, updateActiveProfile,
      foods, addAttempt, updateStatus, acknowledgeAllergen
    }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};

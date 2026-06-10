import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, Attempt, Status, Profile, Category } from './types';
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
  addCustomFood: (name: string, category: Category, icon: string) => void;
  updateStatus: (foodId: string, status: Status) => void;
  acknowledgeAllergen: (foodId: string) => void;
  importBackupData: (jsonData: string) => boolean;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem('babyFirstTastesProfiles');
      if (saved) {
        const parsedProfiles = JSON.parse(saved);
        return parsedProfiles.map((p: any) => {
          // Merger initial foods with existing data, but ALSO keep custom foods
          const initialIds = initialFoods.map(f => f.id);
          const customFoods = p.foods?.filter((f: any) => !initialIds.includes(f.id)) || [];
          
          const mergedInitialFoods = initialFoods.map(initialFood => {
            const existingFood = p.foods?.find((f: any) => f.id === initialFood.id);
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

          return {
            ...p,
            foods: [...mergedInitialFoods, ...customFoods]
          };
        });
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

  const addCustomFood = (name: string, category: Category, icon: string) => {
    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name,
      icon,
      category,
      isAllergen: category === 'אלרגנים',
      status: 'נעול',
      attempts: []
    };
    updateProfileFoods([newFood, ...foods]);
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
        const hasRefusal = updatedAttempts.some(a => a.reaction === 'סירב/ה');
        const requiredAttempts = hasRefusal ? 4 : 3;
        
        if (updatedAttempts.length >= requiredAttempts && !updatedAttempts.some(a => a.reaction === 'תגובה אלרגית')) {
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

  const importBackupData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      let importedProfiles: Profile[] = [];
      let importedActiveId = '';

      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed)) {
          importedProfiles = parsed;
        } else if (Array.isArray(parsed.profiles)) {
          importedProfiles = parsed.profiles;
          if (typeof parsed.activeProfileId === 'string') {
            importedActiveId = parsed.activeProfileId;
          }
        }
      }

      if (importedProfiles.length === 0) return false;
      const isValid = importedProfiles.every(p => 
        typeof p.id === 'string' && 
        typeof p.name === 'string' && 
        Array.isArray(p.foods)
      );

      if (!isValid) return false;

      const validatedProfiles = importedProfiles.map(p => {
        const initialIds = initialFoods.map(f => f.id);
        const customFoods = p.foods.filter(f => !initialIds.includes(f.id));
        const mergedFoods = initialFoods.map(initialFood => {
          const existingFood = p.foods.find(f => f.id === initialFood.id);
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

        return {
          ...p,
          foods: [...mergedFoods, ...customFoods]
        };
      });

      setProfiles(validatedProfiles);
      if (importedActiveId && validatedProfiles.some(p => p.id === importedActiveId)) {
        setActiveProfileId(importedActiveId);
      } else if (validatedProfiles[0]) {
        setActiveProfileId(validatedProfiles[0].id);
      }
      return true;
    } catch (e) {
      console.error('Failed to import backup data:', e);
      return false;
    }
  };

  return (
    <FoodContext.Provider value={{
      profiles, activeProfileId, activeProfile, addProfile, switchProfile, updateActiveProfile,
      foods, addAttempt, addCustomFood, updateStatus, acknowledgeAllergen, importBackupData
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

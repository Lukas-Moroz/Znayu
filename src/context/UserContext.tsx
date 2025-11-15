import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserProgress, MissedQuestion } from '../types/models';

interface UserContextType {
  userData: UserProgress;
  adminMode: boolean;
  updateCurrentModule: (moduleId: number) => void;
  updateCurrentChapter: (chapterId: number) => void;
  addMissedQuestion: (missedQuestion: MissedQuestion) => void;
  removeMissedQuestion: (exerciseId: number) => void;
  getMissedQuestionsByAssignment: () => Record<string, MissedQuestion[]>;
  toggleVocabPack: (packId: number) => void;
  incrementStreak: () => void;
  completeModule0: () => void;
  toggleAdminMode: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserProgress>({
    user_id: 1,
    current_module: 1,
    current_chapter: 1,
    streak_count: 0,
    missed_questions: [],
    active_vocab_packs: [],
    module_0_complete: false,
    completed_sections: [],
  });
  const [adminMode, setAdminMode] = useState<boolean>(false);

  const updateCurrentModule = (moduleId: number) => {
    setUserData(prev => ({ ...prev, current_module: moduleId }));
  };

  const updateCurrentChapter = (chapterId: number) => {
    setUserData(prev => ({ ...prev, current_chapter: chapterId }));
  };

  const addMissedQuestion = (missedQuestion: MissedQuestion) => {
    setUserData(prev => {
      // Check if this exercise is already in missed questions
      const alreadyExists = prev.missed_questions.some(
        mq => mq.exerciseId === missedQuestion.exerciseId
      );
      
      if (alreadyExists) {
        return prev; // Don't add duplicates
      }
      
      return {
        ...prev,
        missed_questions: [...prev.missed_questions, missedQuestion]
      };
    });
  };

  const removeMissedQuestion = (exerciseId: number) => {
    setUserData(prev => ({
      ...prev,
      missed_questions: prev.missed_questions.filter(mq => mq.exerciseId !== exerciseId)
    }));
  };

  const getMissedQuestionsByAssignment = (): Record<string, MissedQuestion[]> => {
    const grouped: Record<string, MissedQuestion[]> = {};
    
    userData.missed_questions.forEach(mq => {
      // Group by chapter only, consolidating all sections
      const chapterId = mq.chapterId ?? 'unknown';
      const key = `chapter_${chapterId}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(mq);
    });
    
    return grouped;
  };

  const toggleVocabPack = (packId: number) => {
    setUserData(prev => {
      const isActive = prev.active_vocab_packs.includes(packId);
      return {
        ...prev,
        active_vocab_packs: isActive
          ? prev.active_vocab_packs.filter(id => id !== packId)
          : [...prev.active_vocab_packs, packId]
      };
    });
  };

  const incrementStreak = () => {
    setUserData(prev => ({ ...prev, streak_count: prev.streak_count + 1 }));
  };

  const completeModule0 = () => {
    setUserData(prev => ({ ...prev, module_0_complete: true }));
  };

  const toggleAdminMode = () => {
    setAdminMode(prev => !prev);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        adminMode,
        updateCurrentModule,
        updateCurrentChapter,
        addMissedQuestion,
        removeMissedQuestion,
        getMissedQuestionsByAssignment,
        toggleVocabPack,
        incrementStreak,
        completeModule0,
        toggleAdminMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


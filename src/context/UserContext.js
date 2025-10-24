import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    user_id: 1,
    current_module: 1,
    streak_count: 0,
    missed_question_ids: [],
    active_vocab_packs: [],
    module_0_complete: false,
  });

  const updateCurrentModule = (moduleId) => {
    setUserData(prev => ({ ...prev, current_module: moduleId }));
  };

  const addMissedQuestion = (exerciseId) => {
    setUserData(prev => ({
      ...prev,
      missed_question_ids: [...new Set([...prev.missed_question_ids, exerciseId])]
    }));
  };

  const removeMissedQuestion = (exerciseId) => {
    setUserData(prev => ({
      ...prev,
      missed_question_ids: prev.missed_question_ids.filter(id => id !== exerciseId)
    }));
  };

  const toggleVocabPack = (packId) => {
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

  return (
    <UserContext.Provider
      value={{
        userData,
        updateCurrentModule,
        addMissedQuestion,
        removeMissedQuestion,
        toggleVocabPack,
        incrementStreak,
        completeModule0,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
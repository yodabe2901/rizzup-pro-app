import React, { createContext, useContext } from 'react';

// A simple context to expose user-related data and helpers across the app.
const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};

export const UserProvider = ({ children, value }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

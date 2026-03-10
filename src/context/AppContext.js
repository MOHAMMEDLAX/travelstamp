import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {

  const [lang, setLang]         = useState('ar');

  return (
    <AppContext.Provider value={{ lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
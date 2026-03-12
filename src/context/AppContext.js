import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLangState] = useState(
    localStorage.getItem('lang') || 'ar'
  );

  const setLang = (newLang) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  return (
    <AppContext.Provider value={{ lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
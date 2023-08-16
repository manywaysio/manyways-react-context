import { useContext, createContext } from "react";

const ManywaysContext = createContext(null);

const ManywaysProvider = ({ children }) => {
  return (
    <ManywaysContext.Provider value={{}}>{children}</ManywaysContext.Provider>
  );
};

const useManyways = () => useContext(ManywaysContext);

export { ManywaysProvider, useManyways };

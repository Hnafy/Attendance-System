import { createContext, useContext, useState } from "react";

const LecturesContext = createContext();

export function LecturesProvider({ children }) {
  let [lectures, setLectures] = useState([])
  return (
    <LecturesContext.Provider value={{ lectures, setLectures}}>
      {children}
    </LecturesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLectures() {
  return useContext(LecturesContext);
}

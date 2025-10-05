import { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(false);
  let [mood, setMood] = useState("add");
  let [id, setId] = useState("");
  return (
    <DialogContext.Provider value={{ dialog, setDialog, mood, setMood,id,setId }}>
      {children}
    </DialogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDialog() {
  return useContext(DialogContext);
}

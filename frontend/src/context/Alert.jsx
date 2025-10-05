import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  let [alert,setAlert] = useState({
      visible:false,
      type:"",
      message:""
    })
  
  return (
    <AlertContext.Provider value={{ alert,setAlert}}>
      {children}
    </AlertContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlert() {
  return useContext(AlertContext);
}
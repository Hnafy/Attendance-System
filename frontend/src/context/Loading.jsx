import { createContext, useContext, useState } from "react"

let LoadContext = createContext()
export function LoadingProvider({children}){
  const [loading, setLoading] = useState(false);
  return(
    <LoadContext.Provider value={{loading,setLoading}}>
      {children}
    </LoadContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  return useContext(LoadContext);
}

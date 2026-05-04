import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { notifyError } from "./Utils/toastify";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (user === null) {
      axios.get('/api/auth/profile')
        .then(({ data }) => setUser(data))
        .catch(err => {
          setUser(null)
          notifyError(err)
        })
    }
  }, [user]);



  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}
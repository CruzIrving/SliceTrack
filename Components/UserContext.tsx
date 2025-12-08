import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserType {
  name: string;
  email: string;
  phone: string;
  image?: string;
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe estar dentro de UserProvider");
  return context;
};

"use client";
import { createContext, FC, PropsWithChildren, use, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  token: string;
}
interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshTrigger: number;
  triggerAuthRefresh: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: FC<PropsWithChildren<{ user?: User | null }>> = (
  $
) => {
  const [user, setUser] = useState<null | User>($.user || null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerAuthRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AuthContext value={{ user, setUser, refreshTrigger, triggerAuthRefresh }}>
      {$.children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const contextValue = use(AuthContext);
  if (!contextValue)
    throw new Error("useAuth must be used within a AuthProvider");
  return contextValue;
};

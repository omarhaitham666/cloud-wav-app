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
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: FC<PropsWithChildren<{ user?: User | null }>> = (
  $
) => {
  const [user, setUser] = useState<null | User>($.user || null);
  return <AuthContext value={{ user, setUser }}>{$.children}</AuthContext>;
};

export const useAuth = () => {
  const contextValue = use(AuthContext);
  if (!contextValue)
    throw new Error("useAuth must be used within a AuthProvider");
  return contextValue;
};

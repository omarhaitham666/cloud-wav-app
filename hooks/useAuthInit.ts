import { useAuth } from "@/store/auth-context";
import { getToken } from "@/utils/secureStore";
import { useEffect, useState } from "react";

export const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken("access_token");
        if (token) {
          // If token exists, you might want to validate it or fetch user data
          // For now, we'll just set a basic user object
          // In a real app, you'd validate the token and fetch user data
          setUser({
            id: "",
            name: "",
            email: "",
            image: "",
            role: "",
            token: token,
          });
        }
      } catch (error) {
        console.log("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser]);

  return { isLoading };
};

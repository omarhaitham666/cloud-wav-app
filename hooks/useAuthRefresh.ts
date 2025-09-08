import { useAuth } from "@/store/auth-context";
import { useEffect } from "react";

/**
 * Custom hook that triggers a callback when auth state changes
 * Useful for refreshing data after login/register
 */
export const useAuthRefresh = (callback: () => void | Promise<void>) => {
  const { refreshTrigger } = useAuth();

  useEffect(() => {
    if (refreshTrigger > 0) {
      callback();
    }
  }, [refreshTrigger, callback]);
};

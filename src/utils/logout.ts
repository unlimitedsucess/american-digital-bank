// utils/logout.ts
"use client";

import { AppDispatch } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Plain logout function (no hooks here)
export const logout = (dispatch: AppDispatch, router: any, isAdmin?: boolean) => {
  try {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear redux token
    dispatch(tokenActions.deleteToken());

    // Redirect based on role
    if (isAdmin) {
      router.push("/adminlogin");
    } else {
      router.push("/login");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ✅ Hook wrapper for React components
// ✅ Hook wrapper for React components
export const useLogout = (dispatch: AppDispatch, isAdmin?: boolean) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // detect seller from URL if no explicit isAdmin passed
  const isSeller = searchParams.get("seller") !== null;

  return () => logout(dispatch, router, isAdmin ?? isSeller);
};


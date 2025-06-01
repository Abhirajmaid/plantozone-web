"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const useAuth = () => {
    const { data: session, status } = useSession();
    const [authState, setAuthState] = useState({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        if (status === "loading") return; // Avoid updating state while loading

        if (status === "authenticated" && session?.user) {
            // Save to sessionStorage
            sessionStorage.setItem("user", JSON.stringify(session.user));
            setAuthState({
                user: session.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            // Retrieve from sessionStorage if available
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setAuthState({
                    user: JSON.parse(storedUser),
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        }
    }, [session, status]);

    return authState;
};

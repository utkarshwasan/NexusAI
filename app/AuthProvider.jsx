"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserContext } from "./_context/UserContext";

function AuthProvider({ children }) {
  const user = useUser();
  const createUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState(null);

  const createNewUser = useCallback(async () => {
    if (!user?.primaryEmail) return;

    try {
      const result = await createUser({
        name: user.displayName ?? "Anonymous",
        email: user.primaryEmail,
      });
      setUserData(result);
    } catch (error) {
      console.error("Failed to create/sync user:", error);
    }
  }, [user?.primaryEmail, user?.displayName, createUser]);

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user, createNewUser]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;

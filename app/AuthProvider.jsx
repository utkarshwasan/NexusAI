"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserContext } from "./_context/UserContext";
import ClientOnly from "./ClientOnly";

function AuthProvider({ children }) {
  const user = useUser();
  const CreateUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState();

  useEffect(() => {
    // This effect is now safely run only on the client-side
    // because it's inside the ClientOnly wrapper.
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  const CreateNewUser = async () => {
    const result = await CreateUser({
      name: user?.displayName,
      email: user.primaryEmail,
    });
    setUserData(result);
  };

  return (
    <ClientOnly>
      <UserContext.Provider value={{ userData, setUserData }}>
        {children}
      </UserContext.Provider>
    </ClientOnly>
  );
}

export default AuthProvider;

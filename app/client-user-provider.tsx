// app/client-user-provider.tsx
"use client";

import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export default function ClientUserProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
    // Optionally, you can also handle user state changes here
  }, [user, setUser]);

  return <>{children}</>;
}

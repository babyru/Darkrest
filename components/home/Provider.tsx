'use client'

import supabaseClient from "@/utils/supabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default Provider;

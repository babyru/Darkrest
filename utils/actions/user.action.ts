"use server";

import { headers } from "next/headers";
import supabaseClient from "../supabase";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log({ error });
    throw new Error("signUpAction error");
  }

  console.log("signUpAction", { data });
};

export const updateProfile = async (formData: FormData) => {
  const { name, username, bio, avatarUrl, bannerUrl } =
    Object.fromEntries(formData);

  const updatedProfile = {
    name,
    username,
    bio,
    avatar: avatarUrl,
    banner: bannerUrl,
  };
  console.log("updateProfile", updatedProfile);
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .update({
        name,
        username,
        bio,
        avatar: avatarUrl,
        banner: bannerUrl,
      })
      .eq("username", username)
      .select();

    console.log("update profile", { data, error });
  } catch (error) {
    console.log({ error });
  }
};

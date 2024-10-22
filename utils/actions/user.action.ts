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
    // console.log({ error });
    // throw new Error("signUpAction error");
    return;
  }

  // console.log("signUpAction", { data });
};

export const updateProfile = async (formData: FormData) => {
  const { name, username, bio, avatarUrl, bannerUrl, id } =
    Object.fromEntries(formData);

  const updatedProfile = {
    username,
    name,
    bio,
    avatar: avatarUrl,
    banner: bannerUrl,
  };

  // console.log("updateProfile", updatedProfile);
  try {
    const { data, error } = await supabaseClient
      .from("users")
      .update(updatedProfile)
      .eq("id", id)
      .select();

    if (data) {
      const { data: updatePosts, error: updatePostsError } =
        await supabaseClient
          .from("posts")
          .update({ name, username })
          .in("id", data[0].posts)
          .select();

      // console.log("update profile", { data, error });
      // console.log("update posts", { updatePosts, updatePostsError });
    }
  } catch (error) {
    // console.log({ error });
  }
};

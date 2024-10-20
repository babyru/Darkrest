"use server";

import supabaseClient from "../supabase";

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

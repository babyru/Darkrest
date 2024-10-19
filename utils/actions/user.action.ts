"use server";

export const updateProfile = async (formData: FormData) => {
  const { name, username, bio, avatarUrl, bannerUrl } =
    Object.fromEntries(formData);

  console.log("updateProfile", {
    name,
    username,
    bio,
    avatarUrl,
    bannerUrl,
  });
};

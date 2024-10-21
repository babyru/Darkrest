"use server";

import supabaseClient from "../supabase";

const convertToArray = (value: string, removerHashtag?: boolean) => {
  const arrayedValue = removerHashtag
    ? value
        .replaceAll(" ", "")
        .replaceAll("#", "")
        .replaceAll(",", ", ")
        .split(", ")
    : value.replaceAll(" ", "").replaceAll(",", ", ").split(", ");

  return arrayedValue;
};

export const createPost = async (formData: FormData) => {
  const {
    title,
    description,
    links,
    tags,
    imageUrl,
    imageDownloadUrl,
    username,
    name,
    id,
  } = Object.fromEntries(formData);

  const arrLinks = convertToArray(links as string);
  const arrTags = convertToArray(tags as string, true);

  const newData = {
    id,
    title,
    description,
    image: imageUrl,
    name,
    username,
    downloadUrl: imageDownloadUrl,
    links: arrLinks,
    tags: arrTags,
  };

  // console.log("createAction", newData);

  try {
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("username", username);

    if (userData) {
      const { data: postData, error: postError } = await supabaseClient
        .from("posts")
        .insert(newData)
        .select();

      // console.log({ userData, userError });

      const { data: updateUser, error: updateUserError } = await supabaseClient
        .from("users")
        .update({ posts: [...(userData[0].posts || []), id] })
        .eq("username", username)
        .select();

      // console.log({ postData, postError });
      // console.log({ updateUser, updateUserError });
    }
  } catch (error) {
    // throw new Error("error creating post");
    return;
  }
};

export const updatePost = async (formData: FormData) => {
  const { title, description, links, tags, imageUrl, imageDownloadUrl, id } =
    Object.fromEntries(formData);

  const arrLinks = convertToArray(links as string);
  const arrTags = convertToArray(tags as string, true);

  const updatedData = {
    title,
    description,
    image: imageUrl,
    downloadUrl: imageDownloadUrl,
    links: arrLinks,
    tags: arrTags,
  };

  // console.log("updateAction", updatedData);

  try {
    const { data, error } = await supabaseClient
      .from("posts")
      .update(updatedData)
      .eq("id", id);

    // console.log({ data, error });
  } catch (error) {
    // throw new Error("error updating post");
    return;
  }
};

export const deletePost = async (id: string) => {
  try {
    const { data, error } = await supabaseClient
      .from("posts")
      .delete()
      .eq("id", id)
      .select();

    return data;
  } catch (error) {
    return;
  }
};

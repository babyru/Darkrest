"use server";

export const createPost = async (formData: FormData) => {
  const { title, description, links, tags, imageUrl, imageDownloadUrl, likes } =
    Object.fromEntries(formData);

  console.log("createAction", {
    title,
    description,
    links,
    tags,
    imageUrl,
    imageDownloadUrl,
    likes,
  });
};

export const updatePost = async (formData: FormData) => {
  const { title, description, links, tags, imageUrl, imageDownloadUrl, likes } =
    Object.fromEntries(formData);

  console.log("updateAction", {
    title,
    description,
    links,
    tags,
    imageUrl,
    imageDownloadUrl,
    likes,
  });
};

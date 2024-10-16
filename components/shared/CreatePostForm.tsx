"use client";

import { useToast } from "@/hooks/use-toast";
import { createPost, updatePost } from "@/lib/actions/image.action.";
import { PutBlobResult } from "@vercel/blob";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

const CreatePostForm = ({
  imageUrlProp,
  imageDownloadUrlProp,
  titleProp,
  descriptionProp,
  linksProp,
  tagsProp,
  createOrUpdate = "create",
  isReadyToSubmit = false,
  user,
}: {
  imageUrlProp?: string;
  imageDownloadUrlProp?: string;
  titleProp?: string;
  descriptionProp?: string;
  linksProp?: string;
  tagsProp?: string;
  createOrUpdate?: "create" | "update";
  isReadyToSubmit?: boolean;
  user?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(imageUrlProp || null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState<string | null>(
    imageDownloadUrlProp || null,
  );
  const [isReadyToUpload, setIsReadyToUpload] = useState(
    isReadyToSubmit || false,
  );
  const [inputValues, setInputValues] = useState({
    title: titleProp || "",
    description: descriptionProp || "",
    links: linksProp || "",
    tags: tagsProp || "",
  });
  const { toast } = useToast();

  const router = useRouter();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
    }

    if (file) {
      const fetchBlob = async () => {
        const res = await fetch(`/api/upload-image?filename=${file.name}`, {
          method: "POST",
          body: file,
        });

        const newBlob = (await res.json()) as PutBlobResult;

        setImageUrl(newBlob.url);
        setImageDownloadUrl(newBlob.downloadUrl);
        newBlob && setIsReadyToUpload(true);
      };

      fetchBlob();
    }
  };

  return (
    <>
      <div className="w-full">
        <input
          type="file"
          accept="image/*"
          id="image-uploader"
          className="hidden"
          onChange={handleImageUpload}
        />
        <label
          htmlFor="image-uploader"
          className="relative m-auto flex h-[600px] max-w-lg cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-icon bg-button shadow-inner"
        >
          {imageUrl && (
            <>
              <img
                src={imageUrl}
                alt="image"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute bottom-0 left-0 flex h-full w-full items-center justify-center bg-icon/45 text-xl font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:opacity-100"
                onClick={() => setIsReadyToUpload(false)}
              >
                Change Picture
              </div>
            </>
          )}

          {!imageUrl && (
            <>
              <Upload className="h-10 w-10 text-icon" />
              <p className="text-sm font-semibold text-icon">Upload Image</p>
            </>
          )}
        </label>
        {/* image link upload 👇. for now disabled */}
        <>
          {/* <hr className="my-5 border border-icon" />
        <label
          htmlFor="image-url"
          className="text-sm font-semibold text-myForeground"
        >
          (Optional) Enter a valid image URL
        </label>
        <input
          type="url"
          id="image-url"
          placeholder="Image URL"
          className="input-style mt-1 text-myForeground/45 focus:text-myForeground"
          value={image ? (image as string) : ""}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            setImage(e.target.value)
          }
        /> */}
        </>
      </div>

      <form
        action={(formData: FormData) => {
          if (createOrUpdate === "create") {
            createPost(formData);
            setInputValues({
              title: "",
              description: "",
              links: "",
              tags: "",
            });
            setImageUrl(null);
            setImageDownloadUrl(null);
            setIsReadyToUpload(false);
          } else {
            updatePost(formData);
          }
        }}
        onSubmit={() => {
          createOrUpdate === "update" &&
            isReadyToUpload &&
            router.push(`/profile/${user}/`);
        }}
        className="mb-10 flex w-full flex-col gap-10 md:mb-0"
      >
        <label
          htmlFor="title"
          className={`-mb-7 ${imageUrl ? "opacity-100" : "opacity-45"}`}
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          className={`input-style ${imageUrl ? "cursor-text" : "cursor-not-allowed opacity-45"}`}
          disabled={!imageUrl}
          value={inputValues.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              title: e.target.value,
            }))
          }
        />

        <label
          htmlFor="description"
          className={`-mb-7 ${imageUrl ? "opacity-100" : "opacity-45"}`}
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          className={`input-style h-32 ${imageUrl ? "cursor-text" : "cursor-not-allowed opacity-45"}`}
          disabled={!imageUrl}
          value={inputValues.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              description: e.target.value,
            }))
          }
        />

        <label
          htmlFor="links"
          className={`-mb-7 ${imageUrl ? "opacity-100" : "opacity-45"}`}
        >
          Links
        </label>
        <input
          type="url"
          id="links"
          name="links"
          placeholder="Links"
          className={`input-style ${imageUrl ? "cursor-text" : "cursor-not-allowed opacity-45"}`}
          disabled={!imageUrl}
          value={inputValues.links}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              links: e.target.value,
            }))
          }
        />

        <label
          htmlFor="tags"
          className={`-mb-7 ${imageUrl ? "opacity-100" : "opacity-45"}`}
        >
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="Tags"
          className={`input-style ${imageUrl ? "cursor-text" : "cursor-not-allowed opacity-45"}`}
          disabled={!imageUrl}
          value={inputValues.tags}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              tags: e.target.value,
            }))
          }
        />

        <input
          type="text"
          name="imageUrl"
          hidden
          value={imageUrl ? imageUrl : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setImageUrl(e.target.value)
          }
        />

        <input
          type="text"
          name="imageDownloadUrl"
          hidden
          value={imageDownloadUrl ? imageDownloadUrl : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setImageUrl(e.target.value)
          }
        />

        <button
          type="submit"
          className={` ${imageUrl && isReadyToUpload ? "primary-btn cursor-pointer" : "cursor-not-allowed rounded-full bg-button px-3 py-2 opacity-45"} flex items-center justify-center gap-2`}
          disabled={!imageUrl && !isReadyToUpload}
          onClick={() => {
            if (createOrUpdate === "create") {
              toast({
                title: "Post created successfully",
              });
            } else {
              toast({
                title: "Post updated successfully",
              });
            }
          }}
        >
          {createOrUpdate === "create" ? "Create" : "Update"}
          {imageUrl && !isReadyToUpload && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
        </button>
      </form>
    </>
  );
};

export default CreatePostForm;

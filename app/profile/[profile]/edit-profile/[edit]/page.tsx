"use client";

import ImageUploader from "@/components/shared/ImageUploader";
import { users } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/lib/actions/user.action";
import { PutBlobResult } from "@vercel/blob";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface InputValuesProps {
  name: string;
  username: string;
  bio: string;
}

const EditPostPage = ({ params: { edit } }: { params: { edit: string } }) => {
  const user = users.filter((user) => user.username === edit);
  const { toast } = useToast();

  const [avatarUrl, setAvatarUrl] = useState(user[0].avatar);
  const [bannerUrl, setBannerUrl] = useState(user[0].banner);

  const [isReadyToUpload, setIsReadyToUpload] = useState(true);
  const [inputValues, setInputValues] = useState<InputValuesProps>({
    name: "",
    username: "",
    bio: "",
  });

  const router = useRouter();

  useEffect(() => {
    setInputValues({
      name: user[0].name,
      username: user[0].username,
      bio: user[0].bio,
    });
  }, []);

  useEffect(() => {
    console.log("avatar", avatarUrl);
    console.log("banner", bannerUrl);
  }, [avatarUrl, bannerUrl]);

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     setAvatarUrl(reader.result as string);
    //   };
    // }
    setIsReadyToUpload(false);
    if (file) {
      const fetchBlob = async () => {
        const res = await fetch(`/api/upload-image?filename=${file.name}`, {
          method: "POST",
          body: file,
        });

        const newBlob = (await res.json()) as PutBlobResult;

        setAvatarUrl(newBlob.url);
        newBlob && setIsReadyToUpload(true);
      };

      fetchBlob();
    }
  };

  const handleBannerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     setBannerUrl(reader.result as string);
    //   };
    // }

    setIsReadyToUpload(false);
    if (file) {
      const fetchBlob = async () => {
        const res = await fetch(`/api/upload-image?filename=${file.name}`, {
          method: "POST",
          body: file,
        });

        const newBlob = (await res.json()) as PutBlobResult;

        setBannerUrl(newBlob.url);
        newBlob && setIsReadyToUpload(true);
      };

      fetchBlob();
    }
  };

  return (
    <div className="m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 text-myForeground md:flex-row md:gap-10">
      <div className="flex w-full flex-col items-start gap-10 font-semibold text-myForeground/45">
        <div className="flex w-full flex-col gap-2">
          <p>Banner (optional)</p>
          <ImageUploader
            key={"banner"}
            label={"banner"}
            imageUrl={bannerUrl}
            handleImageUpload={handleBannerUpload}
            className="h-72 w-full max-w-4xl rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p>Profile picture</p>
          <ImageUploader
            key={"avatar"}
            label={"avatar"}
            imageUrl={avatarUrl}
            handleImageUpload={handleAvatarUpload}
            className="max-h-52 min-h-52 min-w-52 max-w-52 rounded-full"
          />
        </div>
      </div>

      <form
        action={async (formData: FormData) => {
          isReadyToUpload && updateProfile(formData);
        }}
        onSubmit={() => {
          if (isReadyToUpload) {
            toast({
              title: "Profile updated successfully",
            });
            router.push(`/profile/${user[0].username}`);
          }
        }}
        className="mb-10 flex w-full flex-col gap-10 md:mb-0"
      >
        <label htmlFor="name" className={`-mb-7`}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="name"
          className={`input-style`}
          value={inputValues.name}
          onChange={(e) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              name: e.target.value,
            }))
          }
        />

        <label htmlFor="username" className={`-mb-7`}>
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className={`input-style`}
          value={inputValues.username}
          onChange={(e) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              username: e.target.value,
            }))
          }
        />

        <label htmlFor="bio" className={`-mb-7`}>
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="bio"
          className={`input-style h-32`}
          value={inputValues.bio}
          onChange={(e) =>
            setInputValues((prevValue) => ({
              ...prevValue,
              bio: e.target.value,
            }))
          }
        />

        <input
          type="text"
          name="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          hidden
        />

        <input
          type="text"
          name="bannerUrl"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          hidden
        />

        <div className="flex w-full items-center justify-center gap-2">
          <button
            type="submit"
            className={`secondary-btn flex w-full items-center justify-center gap-2 bg-button ${
              !isReadyToUpload
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-icon"
            }`}
            disabled={!isReadyToUpload}
          >
            {!isReadyToUpload ? "Uploading..." : "Update"}
            {!isReadyToUpload && <Loader2 className="h-5 w-5 animate-spin" />}
          </button>

          <button
            type="button"
            className="secondary-btn flex w-full items-center justify-center gap-2 bg-button hover:bg-red-500"
            onClick={() => {
              router.push(`/profile/${user[0].username}`);
              toast({
                title: "Profile update was discarded",
              });
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;

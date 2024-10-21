"use client";

import ImageUploader from "@/components/shared/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/utils/actions/user.action";
import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PutBlobResult } from "@vercel/blob";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

interface InputValuesProps {
  name: string;
  username: string;
  bio: string;
}

const EditPostPage = ({ params: { edit } }: { params: { edit: string } }) => {
  const { session } = useSessionContext();
  const [currentUser, setCurrentUser] = useState<string>("");

  const [userData, setUserData] = useState<UserProp[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [inputValues, setInputValues] = useState<InputValuesProps>({
    name: "",
    username: "",
    bio: "",
  });
  const [isReadyToUpload, setIsReadyToUpload] = useState(true);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // this fetches the current user details and updates the state
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (session) {
        const { data, error } = await supabaseClient
          .from("users")
          .select("username")
          .eq("id", session.user.id);

        if (error) {
          // console.error(error);
          return;
        }

        setCurrentUser(data[0].username);
      }
    };

    fetchCurrentUser();
  }, [session, pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("username", edit);

      if (data) {
        setUserData(data);
        setAvatarUrl(data[0].avatar);
        setBannerUrl(data[0].banner);
        setInputValues({
          name: data[0].name,
          username: data[0].username,
          bio: data[0].bio,
        });
      } else {
        // console.log({ error });
      }
    };

    fetchUserData();
  }, []);

  // console.log(userData, edit);

  if (userData.length > 0) {
    const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
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

    if (edit === currentUser) {
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
                changePic={true}
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
                changePic={true}
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
                  duration: 3000,
                });
                router.push(`/profile/${userData[0].username}`);
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
                {!isReadyToUpload && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
              </button>

              <button
                type="button"
                className="secondary-btn flex w-full items-center justify-center gap-2 bg-button hover:bg-red-500"
                onClick={() => {
                  router.push(`/profile/${userData[0].username}`);
                  toast({
                    title: "Profile update was discarded",
                    duration: 3000,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      );
    } else {
      router.push(`/profile/${userData[0].username}`);
    }
  }
};

export default EditPostPage;

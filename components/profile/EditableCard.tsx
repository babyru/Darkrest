import { Pen, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AvatarWithLoader from "../shared/AvatarWithLoader";
import supabaseClient from "@/utils/supabase";
import { deletePost } from "@/utils/actions/post.action";
import { revalidatePath } from "next/cache";

const EditableCard = ({
  id,
  title,
  image,
  name,
  avatar,
  user,
  searchParams,
  username,
}: {
  id: string;
  title: string;
  image: string;
  name: string;
  avatar: string;
  user: string;
  searchParams: string | undefined;
  username: string;
}) => {
  return (
    <div className="mb-5 transition-all duration-300 hover:scale-[1.02]">
      <div className="relative h-fit w-full overflow-hidden rounded-xl bg-button">
        {(searchParams === "posts" || searchParams === undefined) &&
          user === username && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Link
                href={`/profile/${username}/edit-post/${id}`}
                className="primary-btn flex h-10 w-10 items-center justify-center"
              >
                <Pen className="h-full w-full text-myForeground" />
              </Link>
              <button
                className="primary-btn flex h-10 w-10 items-center justify-center"
                onClick={() => {
                  const deleteConfirmation = confirm(
                    "do you want to delete post",
                  );

                  if (deleteConfirmation) {
                    // console.log("wanna delete");
                    deletePost(id);
                    if (typeof window !== undefined) {
                      window.location.reload();
                    }
                  }
                }}
              >
                <Trash className="h-full w-full text-myForeground" />
              </button>
            </div>
          )}

        <Link href={`/post/${id}`}>
          {image && (
            <Image
              src={image}
              alt={title}
              width={1000}
              height={1000}
              className="size-full"
            />
          )}
        </Link>
      </div>

      <h1 className="mb-2 mt-4 text-lg font-semibold text-myForeground">
        {title}
      </h1>

      <Link href={`/profile/${username}`} className="flex items-center gap-2">
        {avatar && <AvatarWithLoader avatar={avatar} name={name} />}

        <h1 className="text-sm font-semibold text-myForeground">{name}</h1>
      </Link>
    </div>
  );
};

export default EditableCard;

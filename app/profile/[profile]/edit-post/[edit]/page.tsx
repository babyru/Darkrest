"use client";

import { useEffect, useState } from "react";
import CreatePostForm from "@/components/shared/CreatePostForm";
import supabaseClient from "@/utils/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";

const EditPostPage = ({ params: { edit } }: { params: { edit: string } }) => {
  const [post, setPost] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: postData, error: postError } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", edit);

      if (postData) {
        setPost(postData[0]);
        const { data: userDetailsData } = await supabaseClient
          .from("users")
          .select("*")
          .eq("username", postData[0].username);
        setUserDetails(userDetailsData);
      }
      setLoading(false);
    };

    fetchData();
  }, [edit]);

  const router = useRouter();

  if (loading) {
    return (
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%]">
        <Image
          src={"/icons/loader.gif"}
          alt="loader"
          width={100}
          height={100}
          className="my-5 size-12"
        />
      </div>
    );
  }

  if (!post || !userDetails) {
    router.push("/"); // Handle error state
  }

  return (
    <div className="m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 text-myForeground md:flex-row md:gap-10">
      <CreatePostForm
        createOrUpdate="update"
        titleProp={post.title}
        descriptionProp={post.description!}
        linksProp={post.links?.join(", ") || ""}
        tagsProp={post.tags?.join(", ") || ""}
        imageUrlProp={post.image}
        imageDownloadUrlProp={post.downloadUrl!}
        isReadyToSubmit={true}
        username={userDetails[0].username as string}
        name={userDetails[0].name as string}
        likesProp={post.likes}
        idProp={post.id}
      />
    </div>
  );
};

export default EditPostPage;

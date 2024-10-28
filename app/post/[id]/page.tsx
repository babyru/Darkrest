import AllPosts from "@/components/shared/AllPosts";
import AmbientImage from "@/components/shared/AmbientImage";
import PostDetails from "@/components/post/PostDetails";
import supabaseClient from "@/utils/supabase";
import { getSinglePost } from "@/utils/actions/post.action";
import React from "react";

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log(id);

  const singlePost = await getSinglePost("id", id);

  console.log({ singlePost });

  if (singlePost) {
    const { data: username, error: usernameError } = await supabaseClient
      .from("users")
      .select("username")
      .eq("username", singlePost[0].username);

    // console.log("username", username, usernameError);
    if (username) {
      return (
        <div className="page-size mt-24 px-6 text-myForeground">
          <section className="m-auto flex h-fit min-h-96 w-full max-w-4xl flex-col items-start justify-center gap-10 rounded-xl bg-button/25 p-5 md:flex-row">
            <div className="w-full rounded-xl">
              {singlePost[0]?.image ? (
                <AmbientImage
                  src={singlePost[0]?.image as string}
                  alt={singlePost[0]?.title as string}
                  ambient={30}
                />
              ) : (
                <div className="bg-skeleton relative w-full"></div>
              )}
            </div>

            <PostDetails
              postDetail={singlePost[0]!}
              username={username[0].username}
            />
          </section>
          <AllPosts query={singlePost[0]?.title || ""} />
        </div>
      );
    }
  } else {
    // alert("loading data");
  }
};

export default PostPage;

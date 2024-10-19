import CreatePostForm from "@/components/shared/CreatePostForm";
import supabaseClient from "@/utils/supabase";
const EditPostPage = async ({
  params: { edit },
}: {
  params: { edit: string };
}) => {
  const { data: post, error } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("id", edit);

  console.log(post);
  if (post) {
    const { data: userDetails, error: userDetailsError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("name", post[0].name);

    if (userDetails) {
      return (
        <div className="m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 text-myForeground md:flex-row md:gap-10">
          <CreatePostForm
            createOrUpdate="update"
            titleProp={post[0].title}
            descriptionProp={post[0].description!}
            linksProp={post[0].links?.join(", ") || ""}
            tagsProp={post[0].tags?.join(", ") || ""}
            imageUrlProp={post[0].image}
            imageDownloadUrlProp={post[0].downloadUrl!}
            isReadyToSubmit={true}
            username={userDetails[0].username as string}
            name={userDetails[0].name as string}
            likesProp={post[0].likes}
            idProp={post[0].id}
          />
        </div>
      );
    }
  } else {
    alert("error fetching posts in edit post");
  }
};

export default EditPostPage;

import CreatePostForm from "@/components/shared/CreatePostForm";
import { posts } from "@/constants";
const EditPostPage = ({ params: { edit } }: { params: { edit: string } }) => {
  const post = posts.filter((post) => post.id === edit);

  console.log(post);
  return (
    <div className="text-myForeground m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 md:flex-row md:gap-10">
      <CreatePostForm
        createOrUpdate="update"
        titleProp={post[0].title}
        descriptionProp={post[0].description!}
        linksProp={post[0].links.join(", ")}
        tagsProp={post[0].tags.join(", ")}
        imageUrlProp={post[0].image}
        imageDownloadUrlProp={post[0].downloadUrl!}
        isReadyToSubmit={true}
        user={post[0].name.toLocaleLowerCase().replace(" ", "_")}
      />
    </div>
  );
};

export default EditPostPage;

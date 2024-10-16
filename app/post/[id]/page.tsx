import AllPosts from "@/components/shared/AllPosts";
import AmbientImage from "@/components/shared/AmbientImage";
import PostDetails from "@/components/post/PostDetails";
import { posts } from "@/constants";

const page = ({ params }: { params: { id: string } }) => {
  const post = posts.find((p) => p.id === params?.id);

  console.log(post);

  return (
    <div className="page-size text-myForeground mt-24 px-6">
      <section className="m-auto flex h-fit w-full max-w-4xl flex-col items-start justify-center gap-10 rounded-xl bg-button/25 p-5 md:flex-row">
        <div className="w-full rounded-xl">
          <AmbientImage
            src={
              "https://vjkurbrp7v9schki.public.blob.vercel-storage.com/(Edited%20images)-MLPTJSTSHEn5v87FlUEgEsOuLU0yU2.jpg"
            }
            alt={post?.title as string}
            ambient={30}
          />
        </div>

        <PostDetails details={post!} />
      </section>
      <AllPosts query={""} posts={posts} />
    </div>
  );
};

export default page;

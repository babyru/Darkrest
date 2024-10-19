import AllPosts from "@/components/shared/AllPosts";
import supabaseClient from "@/utils/supabase";
// import { posts } from "@/constants";

const HomePage = async ({ searchParams: { query } }: SearchParamProps) => {
  const { data, error } = await supabaseClient.from("posts").select("*");

  return (
    <div className="page-size mt-24 px-6">
      <AllPosts query={(query as string) || ""} posts={data as PostProp[]} />
    </div>
  );
};

export default HomePage;

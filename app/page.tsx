import AllPosts from "@/components/shared/AllPosts";

const HomePage = ({ searchParams: { query } }: SearchParamProps) => {
  return (
    <div className="page-size relative mt-24 min-h-screen px-6 pb-20">
      <AllPosts query={(query as string) || ""} />
      puppy
    </div>
  );
};

export default HomePage;

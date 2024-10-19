 
import AllPosts from "@/components/shared/AllPosts";
 
 
const HomePage = ({ searchParams: { query } }: SearchParamProps) => {
  return (
    <div className="page-size mt-24 px-6">
      <AllPosts query={(query as string) || ""}/>
    </div>
  );
};

export default HomePage;

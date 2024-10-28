import AllPosts from "@/components/shared/AllPosts";
import React from "react";

const HomePage = ({ searchParams }: SearchParamProps) => {
  const query = React.use(searchParams).query;
  
  return (
    <div className="page-size relative mt-24 min-h-screen px-6 pb-20">
      <AllPosts query={(query as string) || ""} />
    </div>
  );
};

export default HomePage;

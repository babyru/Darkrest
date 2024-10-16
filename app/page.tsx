"use client";

import AllPosts from "@/components/shared/AllPosts";
import { posts } from "@/constants";
import React from "react";

const HomePage = ({ searchParams: { query } }: SearchParamProps) => {
  return (
    <div className="page-size mt-24 px-6">
      <AllPosts query={(query as string) || ""} posts={posts} />
    </div>
  );
};

export default HomePage;

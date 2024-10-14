"use client";

import DarkCard from "@/components/DarkCard";
import { posts } from "@/constants";
import React from "react";
import Masonry from "react-masonry-css";

const Page = ({ searchParams: { query } }: SearchParamProps) => {
  const breakPoints = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
  };

  const filteredPosts = posts.filter((post) =>
    query
      ? post.title.toLocaleLowerCase().includes(query as string)
      : post.title.toLocaleLowerCase().includes(""),
  );

  return (
    <div className="page-size mt-24 px-6">
      <Masonry breakpointCols={breakPoints} className="flex gap-5">
        {filteredPosts.map(({ id, title, description, image, user, userImage }) => (
          <DarkCard
            key={id}
            id={`${id}`}
            title={title}
            description={description}
            image={image}
            user={user}
            userImage={userImage}
          />
        ))}
      </Masonry>
    </div>
  );
};

export default Page;

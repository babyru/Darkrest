"use client";
import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import EditableCard from "./EditableCard";

interface PostProp {
  id: string;
  title: string;
  image: string;
  name: string;
  avatar: string;
  tags: string[];
}

const Posts = ({
  query = "",
  posts,
  filterBy = "name",
  user = "",
}: {
  query?: string;
  posts: PostProp[];
  filterOrSort?: "sort" | "filter";
  filterBy?: "name" | "id";
  user?: string;
}) => {
  const [filteredPosts, setFilteredPosts] = React.useState<PostProp[]>([]);

  useEffect(() => {
    const filteredPosts = posts.filter((post) =>
      post[filterBy].toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );

    setFilteredPosts(filteredPosts);
  }, [query]);

  const breakPoints = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
  };

  return (
    <div className="page-size mt-24 px-6">
      <Masonry breakpointCols={breakPoints} className="flex gap-5">
        {filteredPosts.map(({ id, title, image, name, avatar }) => (
          <EditableCard
            key={id}
            id={`${id}`}
            title={title}
            image={image}
            name={name}
            avatar={avatar}
            user={user}
          />
        ))}
      </Masonry>
    </div>
  );
};

export default Posts;

"use client";

import DarkCard from "@/components/shared/DarkCard";
import supabaseClient from "@/utils/supabase";
import React, { useEffect } from "react";
import Masonry from "react-masonry-css";

const AllPosts = ({
  query = "",
  posts,
  filterOrSort = "sort",
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
  const [users, setUsers] = React.useState<UserProp[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient.from("users").select("*");
      if (data) {
        setUsers(data);
      } else {
        alert(`error fetching users allPost`);
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  // this is sorting the data (posts)
  useEffect(() => {
    const sortedPosts = posts.sort((a, b) => {
      if (query) {
        if (
          a.name.toLowerCase().includes(query.toLowerCase() as string) ||
          a.title.toLocaleLowerCase().includes(query as string) ||
          a.tags?.some((tag) =>
            tag.toLocaleLowerCase().includes(query as string),
          )
        )
          return -1;
        if (
          b.name.toLowerCase().includes(query.toLowerCase() as string) ||
          b.title.toLocaleLowerCase().includes(query as string) ||
          b.tags?.some((tag) =>
            tag.toLocaleLowerCase().includes(query as string),
          )
        )
          return 1;
      }
      return Math.random() - 0.5;
    });

    const filteredPosts = posts.filter((post) =>
      post[filterBy].toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );

    filterOrSort === "sort"
      ? setFilteredPosts(sortedPosts)
      : setFilteredPosts(filteredPosts);
  }, [query]);

  const breakPoints = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
  };

  if (users) {
    return (
      <div className="page-size mt-24 px-6">
        <Masonry breakpointCols={breakPoints} className="flex gap-5">
          {filteredPosts.map(({ id, title, image, name }, i) => (
            <DarkCard
              key={id}
              id={`${id}`}
              title={title}
              image={image}
              name={name}
              avatar={users.find((user) => user.name === name)?.avatar!}
              username={users.find((user) => user.name === name)?.username!}
            />
          ))}
        </Masonry>
      </div>
    );
  } else {
    alert("loading data");
  }
};

export default AllPosts;

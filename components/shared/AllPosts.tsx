"use client";

import DarkCard from "@/components/shared/DarkCard";
import supabaseClient from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

const AllPosts = ({
  query = "",
  filterBy = "name",
  user = "",
}: {
  query?: string;
  filterBy?: "name" | "id";
  user?: string;
}) => {
  const [data, setData] = useState<PostProp[]>([]);
  const [filteredPosts, setFilteredPosts] = React.useState<PostProp[]>(data);
  const [users, setUsers] = useState<UserProp[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabaseClient.from("posts").select("*");
      console.log("allPosts data", { data, error });
      if (data) {
        setData(data);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient.from("users").select("*");
      console.log("allPosts users", { data, error });
      if (data) {
        setUsers(data);
      } else {
        // alert(`error fetching users allPost`);
        console.log(error);
      }
    };

    fetchUsers();
  }, [data]);

  // this is sorting the data (posts)
  useEffect(() => {
    const sortedPosts = data?.sort((a, b) => {
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
            tag
              .replace("#", "")
              .toLocaleLowerCase()
              .includes(query as string),
          )
        )
          return 1;
      }
      return Math.random() - 0.5;
    });

    console.log("sortedPosts", sortedPosts);
    setFilteredPosts(sortedPosts);
  }, [query, data]);

  const breakPoints = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
  };

  console.log("filteredPosts", filteredPosts);

  return (
    <div className="page-size mt-24 px-6">
      <Masonry breakpointCols={breakPoints} className="flex gap-5">
        {filteredPosts?.map(({ id, title, image, name }, i) => (
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
};

export default AllPosts;

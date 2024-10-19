"use client";
import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import EditableCard from "./EditableCard";
import supabaseClient from "@/utils/supabase";

interface PostProp {
  id: string;
  title: string;
  image: string;
  name: string;
  tags: string[];
}

const Posts = ({
  posts,
  user = "",
  searchParams,
}: {
  query: string;
  posts: PostProp[];
  user: string;
  searchParams: string | undefined;
}) => {
  const [userData, setUserData] = React.useState<UserProp[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabaseClient.from("users").select("*");
      if (data) {
        console.log("got data");
        setUserData(data);
      } else {
        alert("error fetching users in Posts");
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  // console.log(posts);

  const breakPoints = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
  };

  if (userData) {
    return (
      <div className="page-size mt-24 px-6">
        <Masonry breakpointCols={breakPoints} className="flex gap-5">
          {posts.map(({ id, title, image, name }) => {
            const ownerDetails = userData.find((user) =>
              user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
            );

            return (
              <EditableCard
                key={id}
                id={`${id}`}
                title={title}
                image={image}
                name={name}
                username={ownerDetails?.username! as string}
                avatar={ownerDetails?.avatar! as string} // have to change to avatar
                user={user}
                searchParams={searchParams}
              />
            );
          })}
        </Masonry>
      </div>
    );
  }
};

export default Posts;

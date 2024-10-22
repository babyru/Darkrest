"use client";

import DarkCard from "@/components/shared/DarkCard";
import supabaseClient from "@/utils/supabase";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";

const AllPosts = ({ query = "" }: { query?: string }) => {
  const [data, setData] = useState<PostProp[]>([]);
  const [filteredPosts, setFilteredPosts] = React.useState<PostProp[]>(data);
  const [users, setUsers] = useState<UserProp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [incLimit, setIncLimit] = useState(false);
  const [limit, setLimit] = useState(20);
  const { inView, ref } = useInView();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabaseClient.from("posts").select("*");

      if (error) {
        return;
      }

      console.log(data.length, limit);

      if (data.length < limit) {
        console.log("first");
        setIsLoading(false);
        setIncLimit(false);
      } else {
        setIsLoading(true);
        setIncLimit(true);
      }
    };

    fetchData();
  }, [inView, pathname]);

  useEffect(() => {
    if (inView && incLimit) {
      router.push(`?limit=${limit}`, { scroll: false });
      setLimit((prevValue) => prevValue + 20);
    }
  }, [inView, pathname]);

  // console.log("session", session);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .limit(limit);
      console.log("allPosts data", { data, error });
      if (data) {
        setData(data);
      }
    };

    fetchData();
  }, [limit]);

  console.log("second");

  useEffect(() => {
    const fetchPostsByQuery = async (query: string) => {
      if (query) {
        const { data, error } = await supabaseClient
          .from("posts")
          .select("*")
          .ilike("name", query)
          .ilike("description", query)
          // .contains("tags", [query]); // Wrap query in an array

        console.log(123, { data, error });

        if (error) {
          console.error("Error fetching posts:", error);
          return [];
        }

        return data;
      }
    };

    // fetchPostsByQuery(query);
  }, [query]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient.from("users").select("*");
      // console.log("allPosts users", { data, error });
      if (data) {
        setUsers(data);
      } else {
        // alert(`error fetching users allPost`);
        // console.log(error);
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

    // console.log("sortedPosts", sortedPosts);
    setFilteredPosts(sortedPosts);
  }, [query, data]);

  const breakPoints = {
    default: 5,
    1280: 4,
    1024: 3,
    768: 2,
  };

  // console.log("filteredPosts", filteredPosts);

  return (
    <div className="page-size relative mt-24 px-6 pb-20">
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
      {isLoading && (
        <div
          className="absolute bottom-0 left-[50%] -translate-x-[50%]"
          ref={ref}
        >
          <Image
            src={"/icons/loader.gif"}
            alt="loader"
            width={100}
            height={100}
            className="my-5 size-12"
          />
        </div>
      )}
    </div>
  );
};

export default AllPosts;

"use client";

import Posts from "@/components/profile/Posts";
import ProfileHeroSection from "@/components/profile/ProfileHeroSection";
import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Profile = ({
  params: { profile },
  searchParams: { page },
}: {
  params: { profile: string };
  searchParams: { page: string | undefined };
}) => {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState<UserProp>();
  const [createdPosts, setCreatedPosts] = useState<PostProp[]>();
  const [savedPost, setSavedPost] = useState<PostProp[]>();
  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();

  useEffect(() => {
    const fetchUser = async () => {
      if (session && session.user.id) {
        const { data: user, error: userError } = await supabaseClient
          .from("users")
          .select("username")
          .eq("id", session.user.id);

        if (userError) {
          // console.error(userError);
          return
        } else {
          setUser(user[0].username);
        }
      }
    };

    fetchUser();
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData, error: userDataError } = await supabaseClient
        .from("users")
        .select("*")
        .eq("username", profile);

      if (userDataError) {
        // console.error(userDataError);
        return;
      } else {
        setUserData(userData[0]);
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (userData) {
        const { data: createdPosts, error: createdPostsError } =
          await supabaseClient
            .from("posts")
            .select("*")
            .in("id", userData.posts);

        if (createdPostsError) {
          // console.error(createdPostsError);
          return;
        } else {
          setCreatedPosts(createdPosts);
        }

        const { data: savedPost, error: savedPostError } = await supabaseClient
          .from("posts")
          .select("*")
          .in("id", userData.saved);

        if (savedPostError) {
          // console.error(savedPostError);
          return;
        } else {
          setSavedPost(savedPost);
        }
      }
    };

    fetchPosts();
  }, [userData]);

  if (loading) {
    return (
      <div className="absolute left-[50%] top-[50%] -translate-x-[50%]">
        <Image
          src={"/icons/loader.gif"}
          alt="loader"
          width={100}
          height={100}
          className="my-5 size-12"
        />
      </div>
    );
  }

  if (userData) {
    // console.log("createdPosts", createdPosts);
    // console.log({ savedPost, createdPosts });
    // console.log("userData", userData);

    return (
      <div className="page-size mt-24 px-6">
        <ProfileHeroSection
          banner={userData.banner}
          avatar={userData.avatar}
          name={userData.name}
          username={userData.username}
          bio={userData.bio}
          followers={userData.followers}
          following={userData.following}
          currentUser={user}
        />

        <nav className="mt-10 flex items-center justify-center gap-2 text-myForeground">
          <Link
            href={`/profile/${profile}?page=posts`}
            className={`secondary-btn ${page === "posts" || page === undefined ? "bg-icon" : "bg-button hover:bg-icon"}`}
          >
            Posts
          </Link>
          <Link
            href={`/profile/${profile}?page=saved`}
            className={`secondary-btn ${page === "saved" ? "bg-icon" : "bg-button hover:bg-icon"}`}
          >
            Saved
          </Link>
        </nav>

        {page === "posts" || page === undefined ? (
          <Posts posts={createdPosts || []} searchParams={page} user={user} />
        ) : savedPost?.length !== 0 && savedPost !== null ? (
          <>
            <Posts posts={savedPost || []} user={user} searchParams={page} />
          </>
        ) : (
          <div className="my-10 text-center text-lg font-semibold text-myForeground">
            No saved posts found
          </div>
        )}
      </div>
    );
  }
};

export default Profile;

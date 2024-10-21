"use client";

import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PencilIcon, UserCheck, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ProfileHeroSection = ({
  currentUser,
  avatar,
  banner = "",
  name,
  username,
  bio,
  followers,
  following,
}: {
  currentUser: string;
  avatar: string;
  banner: string;
  name: string;
  username: string;
  bio: string;
  followers: string[];
  following: string[];
}) => {
  const [isUserImageLoaded, setIsUserImageLoaded] = useState(false);
  const [isBannerImageLoaded, setIsBannerImageLoaded] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserProp>();
  const { session } = useSessionContext();

  // fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("username", currentUser);

      if (error) {
        // console.log("error fetching current user", error);
        // throw new Error("error fetching current user");
        return;
      }

      if (data && data.length > 0) {
        // console.log(data[0]);
        setCurrentUserDetails(data[0]);
        if (data[0].following?.includes(username)) {
          // console.log("he is followed in supabase so updated to true");
          setIsFollowed(true);
        }
      }
    };

    fetchCurrentUser();
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!currentUserDetails) return;

    if (isFollowed) {
      // console.log("un-followed");
      const { data, error } = await supabaseClient
        .from("users")
        .update({
          following: currentUserDetails.following.filter(
            (user) => user !== username,
          ),
        })
        .eq("username", currentUser)
        .select();

      // console.log({ data, error });
    } else {
      //  console.log("following");
      const { data, error } = await supabaseClient
        .from("users")
        .update({
          following: [...currentUserDetails.following, username],
        })
        .eq("username", currentUser)
        .select();

      // console.log({ data, error });
    }
  };

  return (
    <section className={`relative mx-auto w-full max-w-4xl`}>
      <div
        className={`relative w-full ${banner && (isBannerImageLoaded ? "" : "bg-skeleton bg-myBackground")} overflow-x-clip rounded-xl`}
      >
        {banner && (
          <Image
            src={banner}
            alt="banner"
            width={1000}
            height={1000}
            className={`h-72 w-full rounded-xl object-cover opacity-70 sm:h-96`}
            onLoad={() => {
              setIsBannerImageLoaded(true);
            }}
          />
        )}
        <div
          className={`${banner ? "absolute -bottom-20 left-[50%] -translate-x-[50%]" : "mx-auto"} ${isUserImageLoaded ? "" : "bg-skeleton relative bg-myBackground"} max-h-40 min-h-40 min-w-40 max-w-40 overflow-hidden rounded-full border-2 border-myForeground`}
        >
          {avatar && (
            <Image
              src={avatar || "/icons/user-placeholder.svg"}
              alt="profile"
              width={500}
              height={500}
              onLoad={() => {
                setIsUserImageLoaded(true);
              }}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div
        className={` ${banner ? "mt-24" : "mt-7"} mx-auto flex w-[70%] flex-col items-center justify-center gap-2 text-myForeground`}
      >
        <div className="relative">
          <h1 className="text-2xl font-bold">{name}</h1>
          {username === currentUser ? (
            <Link
              href={`/profile/${currentUser}/edit-profile/${currentUser}`}
              className={`secondary-btn mx-auto flex w-fit items-center justify-center gap-2 text-sm hover:bg-icon sm:absolute sm:-right-[130px] sm:top-0`}
            >
              Edit Profile <PencilIcon className="h-4 w-4" />
            </Link>
          ) : session ? (
            <button
              className={`secondary-btn mx-auto mt-3 flex w-fit items-center justify-center gap-2 text-sm hover:bg-icon sm:absolute sm:top-0 sm:mt-0 ${isFollowed ? "bg-icon sm:-right-24" : "bg-button hover:bg-icon sm:-right-20"}`}
              onClick={() => {
                setIsFollowed((prevValue) => !prevValue);
                handleFollow();
              }}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          ) : (
            <Link
              href={"/sign-in"}
              className={`secondary-btn mx-auto mt-3 flex w-fit items-center justify-center gap-2 text-sm hover:bg-icon sm:absolute sm:top-0 sm:mt-0 ${isFollowed ? "bg-icon sm:-right-24" : "bg-button hover:bg-icon sm:-right-20"}`}
            >
              Follow
            </Link>
          )}
        </div>

        {bio && <p className="text-center text-sm">{bio}</p>}
        <div className="flex items-center justify-center gap-2">
          <Image src={"/icons/logo.svg"} alt="logo" width={20} height={20} />
          <p className="text-sm opacity-45">{username}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-1">
            <p className="opacity-45">{followers?.length || 0} followers</p>
            <UserRoundCheck className="size-3 opacity-45" />
          </div>

          <div className="flex items-center justify-center gap-1">
            <p className="opacity-45">{following?.length || 0} following</p>
            <UserCheck className="size-3 opacity-45" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeroSection;

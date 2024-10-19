"use client";

import { PencilIcon, UserCheck, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ProfileHeroSection = ({
  user,
  avatar,
  banner = "",
  name,
  username,
  bio,
  followers,
  following,
}: {
  user: string;
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
          className={`${banner ? "absolute -bottom-20 left-[50%] -translate-x-[50%]" : "mx-auto"} ${isUserImageLoaded ? "" : "bg-skeleton bg-myBackground"} max-h-40 min-h-40 min-w-40 max-w-40 overflow-hidden rounded-full border-2 border-myForeground`}
        >
          {avatar && (
            <Image
              src={avatar!}
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
          {username === user ? (
            <Link
              href={`/profile/${user}/edit-profile/${user}`}
              className={`secondary-btn mx-auto flex w-fit items-center justify-center gap-2 text-sm hover:bg-icon sm:absolute sm:-right-[130px] sm:top-0`}
            >
              Edit Profile <PencilIcon className="h-4 w-4" />
            </Link>
          ) : (
            <button
              className={`secondary-btn mx-auto mt-3 flex w-fit items-center justify-center gap-2 text-sm hover:bg-icon sm:absolute sm:top-0 sm:mt-0 ${isFollowed ? "bg-icon sm:-right-24" : "bg-button hover:bg-icon sm:-right-20"}`}
              onClick={() => setIsFollowed((prevValue) => !prevValue)}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
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

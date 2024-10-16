"use client";

import { Star, UserCheck, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ProfileHeroSection = ({
  profile,
  banner = "",
  name,
  username,
  bio,
  followers,
  following,
}: {
  profile: string;
  banner: string;
  name: string;
  username: string;
  bio: string;
  followers: string[];
  following: string[];
}) => {
  const [isUserImageLoaded, setIsUserImageLoaded] = useState(false);
  const [isBannerImageLoaded, setIsBannerImageLoaded] = useState(false);

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
            className={`h-96 w-full rounded-xl object-cover opacity-70`}
            onLoad={() => {
              setIsBannerImageLoaded(true);
            }}
          />
        )}
        <div
          className={`${banner ? "absolute -bottom-20 left-[50%] -translate-x-[50%]" : "mx-auto"} ${isUserImageLoaded ? "" : "bg-skeleton bg-myBackground"} border-myForeground max-h-40 min-h-40 min-w-40 max-w-40 overflow-hidden rounded-full border-2`}
        >
          <Image
            src={profile!}
            alt="profile"
            width={500}
            height={500}
            onLoad={() => {
              setIsUserImageLoaded(true);
            }}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div
        className={` ${banner ? "mt-24" : "mt-7"} text-myForeground mx-auto flex w-[70%] flex-col items-center justify-center gap-2`}
      >
        <h1 className="text-2xl font-bold">{name}</h1>
        {bio && <p className="text-center text-sm">{bio}</p>}
        <div className="flex items-center justify-center gap-2">
          <Image src={"/icons/logo.svg"} alt="profile" width={20} height={20} />
          <p className="text-sm opacity-45">{username}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-1">
            <p className="opacity-45">{followers.length} followers</p>
            <UserRoundCheck className="size-3 opacity-45" />
          </div>

          <div className="flex items-center justify-center gap-1">
            <p className="opacity-45">{following.length} following</p>
            <UserCheck className="size-3 opacity-45" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeroSection;

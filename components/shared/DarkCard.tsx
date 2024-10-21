import Image from "next/image";
import Link from "next/link";
import React from "react";
import AvatarWithLoader from "./AvatarWithLoader";
import DarkCardImage from "./darkcard image/DarkCardImage";

const DarkCard = ({
  id,
  title,
  image,
  name,
  avatar,
  username,
}: {
  id: string;
  title: string;
  image: string;
  name: string;
  avatar: string;
  username: string;
}) => {
  return (
    <div className="mb-5 transition-all duration-300 hover:scale-[1.02]">
      <DarkCardImage id={id} image={image} title={title} />
      <h1 className="mb-2 mt-4 text-lg font-semibold text-myForeground">
        {title}
      </h1>
      <Link href={`/profile/${username}`} className="flex items-center gap-2">
        {avatar ? (
          <AvatarWithLoader avatar={avatar} name={name} />
        ) : (
          <div
            className={`bg-skeleton relative size-8 overflow-hidden rounded-full`}
          ></div>
        )}
        <h1 className="text-sm font-semibold text-myForeground">{name}</h1>
      </Link>
    </div>
  );
};

export default DarkCard;

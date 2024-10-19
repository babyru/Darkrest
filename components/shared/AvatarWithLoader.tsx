"use client";

import Image from "next/image";
import React, { useState } from "react";

const AvatarWithLoader = ({
  avatar,
  name,
}: {
  avatar: string;
  name: string;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`${
        !imageLoaded && "bg-skeleton"
      } size-8 overflow-hidden rounded-full relative`}
    >
      <Image
        src={avatar}
        alt={name}
        width={200}
        height={200}
        className="object-cover"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default AvatarWithLoader;

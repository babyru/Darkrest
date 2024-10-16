import Image from "next/image";
import Link from "next/link";
import React from "react";

const DarkCard = ({
  id,
  title,
  image,
  name,
  userImage,
}: {
  id: string;
  title: string;
  image: string;
  name: string;
  userImage: string;
}) => {
  return (
    <div className="mb-5 transition-all duration-300 hover:scale-[1.02]">
      <div className="h-fit w-full overflow-hidden rounded-xl bg-button">
        <Link href={`/post/${id}`}>
          <Image
            src={image}
            alt={title}
            width={1000}
            height={1000}
            className="size-full"
          />
        </Link>
      </div>
      <h1 className="text-myForeground mb-2 mt-4 text-lg font-semibold">
        {title}
      </h1>
      <Link
        href={`/profile/${name.toLocaleLowerCase().replace(" ", "_")}`}
        className="flex items-center gap-2"
      >
        <div className="size-8 overflow-hidden rounded-full">
          <Image
            src={userImage}
            alt={name}
            width={200}
            height={200}
            className="object-cover"
          />
        </div>
        <h1 className="text-myForeground text-sm font-semibold">{name}</h1>
      </Link>
    </div>
  );
};

export default DarkCard;

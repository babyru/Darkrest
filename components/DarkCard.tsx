import Image from "next/image";
import Link from "next/link";
import React from "react";

const DarkCard = ({
  id,
  title,
  image,
  user,
  userImage,
}: {
  id: string;
  title: string;
  description: string;
  image: string;
  user: string;
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
      <h1 className="mb-2 mt-4 text-lg font-semibold text-foreground">
        {title}
      </h1>
      <Link
        href={`/profile/${user.toLocaleLowerCase()}`}
        className="flex items-center gap-2"
      >
        <div className="size-8 overflow-hidden rounded-full">
          <Image
            src={userImage}
            alt={user}
            width={200}
            height={200}
            className="object-cover"
          />
        </div>
        <h1 className="text-sm font-semibold text-foreground">{user}</h1>
      </Link>
    </div>
  );
};

export default DarkCard;

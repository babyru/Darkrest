"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const DarkCardImage = ({
  id,
  image,
  title,
}: {
  id: string;
  image: string;
  title: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative h-fit w-full overflow-hidden rounded-xl ${isLoading ? "bg-skeleton" : "bg-button"}`}
    >
      <Link href={`/post/${id}`}>
        <Image
          src={image}
          alt={title}
          width={1000}
          height={1000}
          className="size-full"
          onLoad={() => setIsLoading(false)}
        />
      </Link>
    </div>
  );
};

export default DarkCardImage;

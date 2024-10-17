"use client";

import { Download, Heart, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface PostProp {
  id: string;
  title: string;
  image: string;
  name: string;
  avatar: string;
  likes: number;
  downloadUrl: string;
  links: string[];
  followers: number;
}

const PostDetails = ({ details }: { details: PostProp }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [copy, setCopy] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const pathname = usePathname();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(pathname)
      .then(() => {
        setCopy(true);
      })
      .catch((err) => {
        console.error("Failed to copy pathname to clipboard: ", err);
      });
  };

  if (copy) {
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  }

  const followers = () => {
    let numberOfFollowers = "";
    const followerCount = Math.abs(details.followers);
    const followerString = String(followerCount);

    switch (followerString.length) {
      case 9: // 100,000,000 to 999,999,999
      case 8: // 10,000,000 to 99,999,999
        numberOfFollowers = `${followerString.slice(0, -6)}M`;
        break;
      case 7: // 1,000,000 to 9,999,999
        numberOfFollowers = `${followerString.slice(0, 1)}.${followerString.slice(1, 2)}M`;
        break;
      case 6: // 100,000 to 999,999
        numberOfFollowers = `${followerString.slice(0, 3)}K`;
        break;
      case 5: // 10,000 to 99,999
        numberOfFollowers = `${followerString.slice(0, 2)}K`;
        break;
      case 4: // 1,000 to 9,999
        numberOfFollowers = `${followerString.slice(0, 1)}.${followerString.slice(1, 2)}K`;
        break;
      default:
        numberOfFollowers = followerString;
    }

    return numberOfFollowers;
  };

  function extractHostname(url: string) {
    // This regex matches the protocol and hostname
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/i;

    const match = url.match(regex);

    // If there's a match, return the captured group (hostname)
    // Otherwise, return null or the original string
    return match ? match[1] : null;
  }

  return (
    <div className="flex h-full w-full flex-col gap-10 py-5">
      <nav className="flex items-center justify-between gap-5 sm:gap-10">
        <div className="flex items-center justify-start gap-5 sm:gap-10">
          <div className="details-icon-container">
            <Heart
              className={`details-icon text-icon ${isLiked ? "text-pink-700" : "text-icon"}`}
              onClick={() => setIsLiked((prevValue) => !prevValue)}
            />
            <p className={`text-myForeground/70 -ml-2 font-semibold`}>
              {details.likes}
            </p>
          </div>

          <a href={details.downloadUrl}>
            <Download className={`details-icon text-icon`} />
          </a>
          <div className="relative">
            <Link2 className={`details-icon text-icon`} onClick={handleCopy} />

            <p
              className={`absolute -top-8 rounded bg-button ${copy ? "opacity-100" : "opacity-0"} px-2 py-1 text-sm transition-all duration-500`}
            >
              Copied
            </p>
          </div>
        </div>

        <button
          className={`secondary-btn ${isSaved ? "bg-icon" : "bg-button hover:bg-icon"}`}
          onClick={() => setIsSaved((prevValue) => !prevValue)}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </nav>

      <div className="flex flex-col items-start justify-start gap-2">
        <h1 className="text-3xl font-semibold">{details.title}</h1>
        <div className="flex flex-wrap items-center justify-start gap-2">
          {details.links.map((link) => (
            <a
              key={link}
              href={link}
              target="_blank"
              className="text-myForeground/70 underline transition-all hover:text-icon"
            >
              {extractHostname(link)}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${details.name.toLocaleLowerCase().replace(" ", "_")}`}
            className="flex max-h-14 min-h-14 min-w-14 max-w-14 overflow-hidden rounded-full"
          >
            <Image
              src={details.avatar}
              width={200}
              height={200}
              alt="user-image"
              className="h-full w-full object-cover"
            />
          </Link>
          <div>
            <Link
              href={`/profile/${details.name.toLocaleLowerCase().replace(" ", "_")}`}
              className="text-xl font-semibold"
            >
              {details.name}
            </Link>
            <p className="text-sm font-thin">{followers()} followers</p>
          </div>
        </div>

        <button
          className={`secondary-btn ${isFollowed ? "bg-icon" : "bg-button hover:bg-icon"}`}
          onClick={() => setIsFollowed((prevValue) => !prevValue)}
        >
          {isFollowed ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default PostDetails;

"use client";

import { useToast } from "@/hooks/use-toast";
import supabaseClient from "@/utils/supabase";
import { Download, Heart, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const PostDetails = ({
  postDetail,
  username,
}: {
  postDetail: PostProp;
  username: string;
}) => {
  const currentUser = "noah_white";

  const [isLiked, setIsLiked] = useState(
    postDetail.likes.includes(currentUser) ? true : false,
  );
  const [numberOfLikes, setNumberOfLikes] = useState(
    postDetail.likes.length || 0,
  );
  const [copy, setCopy] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [users, setUsers] = useState<UserProp[]>([]);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserProp>();
  const [isUserSeeing, setIsUserSeeing] = useState(false);

  const pathname = usePathname();
  const { toast } = useToast();

  const updateData = async (
    toBeUpdated: "saved" | "followers",
    shouldSave: boolean,
    value: string,
    setData: Dispatch<SetStateAction<boolean>>,
  ) => {
    if (!currentUserDetails) return;

    let savedUpdate: Array<string> = [];

    if (shouldSave) {
      console.log(`added to ${toBeUpdated}`);
      savedUpdate = [
        ...(currentUserDetails[toBeUpdated]?.filter((post) => post !== value) ||
          []),
        value,
      ];
      setData(true);
    } else {
      console.log(`removed from ${toBeUpdated}`);
      savedUpdate = [
        ...currentUserDetails[toBeUpdated].filter((post) => post !== value),
      ];
      setData(false);
    }

    try {
      const { data, error } = await supabaseClient
        .from("users")
        .update({ [toBeUpdated]: savedUpdate })
        .eq("username", currentUserDetails.username)
        .select();

      console.log("updateData", { data, error });
    } catch (error) {
      console.log([error]);
    }
  };

  const handleSavePost = async () => {
    updateData("saved", isSaved, postDetail.id, setIsSaved);
  };

  const handleFollow = async () => {
    updateData("followers", isFollowed, username, setIsFollowed);
  };

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    let updatedLikes: string[] = [...postDetail.likes];

    if (newIsLiked) {
      if (!updatedLikes.includes(currentUser)) {
        console.log("adding like");
        updatedLikes.push(currentUser);
      }
    } else {
      console.log("removing like");
      updatedLikes = updatedLikes.filter((like) => like !== currentUser);
    }

    try {
      const { data, error } = await supabaseClient
        .from("posts")
        .update({ likes: updatedLikes })
        .eq("id", postDetail.id)
        .select();

      if (error) throw error;

      if (data) {
        console.log("handleLike", data);
        setNumberOfLikes(data[0].likes.length);
        postDetail.likes = data[0].likes; // Update the postDetail prop
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      setIsLiked(!newIsLiked);
    }
  };

  useEffect(() => {
    handleSavePost();
  }, [isSaved]);

  useEffect(() => {
    handleFollow();
  }, [isFollowed]);

  useEffect(() => {
    setIsLiked(postDetail.likes.includes(currentUser));
    setNumberOfLikes(postDetail.likes.length);
  }, [postDetail.likes, currentUser]);

  // fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("username", currentUser);

      if (data) {
        // console.log(data[0]);
        setCurrentUserDetails(data[0]);
        if (data[0].saved?.includes(postDetail.id)) {
          console.log("it is saved in supabase so updated to true");
          setIsSaved(true);
        }
        if (data[0].followers?.includes(username)) {
          console.log("he is followed in supabase so updated to true");
          setIsFollowed(true);
        }
      }
    };

    fetchCurrentUser();

    // check if current user is seeing their own post
    if (username === currentUser) {
      console.log("user is seeing");

      setIsUserSeeing(true);
    } else {
      setIsUserSeeing(false);
    }
  }, []);

  // fetch post owner details
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("name", postDetail.name);
      if (data) {
        setUsers(data);
      } else {
        alert(`unable to fetch user ${error}`);
      }
    };

    fetchUsers();
  }, []);

  const userDetails = users.find((user) => user.name === postDetail.name);

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

  const NumberOfFollowers = () => {
    const followers = userDetails?.followers;

    let numberOfFollowers = "";
    const followerCount = Math.abs(followers?.length as number);
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

  const extractHostnameFromLink = (url: string) => {
    // This regex matches the protocol and hostname
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/i;

    const match = url.match(regex);

    // If there's a match, return the captured group (hostname)
    // Otherwise, return null or the original string
    return match ? match[1] : null;
  };

  return (
    <div className="flex h-full w-full flex-col gap-10 py-5">
      <nav className="flex items-center justify-between gap-5 sm:gap-10">
        <div className="flex items-center justify-start gap-5 sm:gap-10">
          <div className="details-icon-container">
            <Heart
              className={`details-icon text-icon ${isLiked ? "text-pink-700" : "text-icon"}`}
              onClick={handleLike}
            />
            <p className={`-ml-2 font-semibold text-myForeground/70`}>
              {numberOfLikes}
            </p>
          </div>

          <a
            href={postDetail.downloadUrl}
            onClick={() =>
              toast({
                title: "Image downloaded",
                duration: 2000,
              })
            }
          >
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
          onClick={() => {
            setIsSaved((prevValue) => !prevValue);
            // handleSavePost();
            // addData(currentUserDetails, "saved", postDetail.id, setIsSaved);
          }}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </nav>

      <div className="flex flex-col items-start justify-start gap-2">
        <h1 className="text-3xl font-semibold">{postDetail.title}</h1>
        <div className="flex flex-wrap items-center justify-start gap-2">
          {postDetail.links &&
            postDetail.links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                className="text-myForeground/70 underline transition-all hover:text-icon"
              >
                {extractHostnameFromLink(link)}
              </a>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${username}`}
            className={`flex ${!userDetails?.avatar && "bg-skeleton relative"} max-h-14 min-h-14 min-w-14 max-w-14 overflow-hidden rounded-full`}
          >
            {userDetails?.avatar && (
              <Image
                src={userDetails?.avatar as string}
                width={200}
                height={200}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            )}
          </Link>
          <div>
            <Link
              href={`/profile/${username}`}
              className="text-xl font-semibold"
            >
              {postDetail.name}
            </Link>

            <p className="text-sm font-thin">{NumberOfFollowers()} followers</p>
          </div>
        </div>
        {!isUserSeeing && (
          <button
            className={`secondary-btn ${isFollowed ? "bg-icon" : "bg-button hover:bg-icon"}`}
            onClick={() => setIsFollowed((prevValue) => !prevValue)}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDetails;

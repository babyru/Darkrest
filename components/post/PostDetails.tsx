"use client";

import { useToast } from "@/hooks/use-toast";
import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Download, Heart, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const PostDetails = ({
  postDetail,
  username,
}: {
  postDetail: PostProp;
  username: string;
}) => {
  const { session } = useSessionContext();
  const [currentUserDetails, setCurrentUserDetails] = useState<UserProp>();

  const [isLiked, setIsLiked] = useState(
    postDetail.likes.includes(currentUserDetails?.username || "")
      ? true
      : false,
  );
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [copy, setCopy] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [postUser, setPostUser] = useState<UserProp>();
  const [isUserSeeing, setIsUserSeeing] = useState(false);

  const pathname = usePathname();
  const { toast } = useToast();

  const router = useRouter();

  // this fetches the current user details and updates the state
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (session) {
        const { data, error } = await supabaseClient
          .from("users")
          .select("*")
          .eq("id", session.user.id);

        if (error) {
          // console.error(error);
          return;
        }

        setCurrentUserDetails(data[0]);
        if (data[0].saved?.includes(postDetail.id)) {
          console.log("it is saved in supabase so updated to true");
          setIsSaved(true);
        }

        // console.log(data[0]);

        if (data[0].following?.includes(username)) {
          // console.log("he is followed in supabase so updated to true");
          setIsFollowed(true);
        }

        if (username === data[0].username) {
          // console.log("user is seeing");
          setIsUserSeeing(true);
        } else {
          setIsUserSeeing(false);
        }
      }
    };

    fetchCurrentUser();
  }, [session, pathname]);

  // this updates data for save and follow on the current users end
  const updateData = async (
    toBeUpdated: "saved" | "following",
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
      // console.log([error]);
    }
  };

  const handleSavePost = async () => {
    updateData("saved", isSaved, postDetail.id, setIsSaved);
  };

  const handleFollow = async () => {
    updateData("following", isFollowed, username, setIsFollowed);
  };

  // handles the add and remove like
  const handleLike = async () => {
    let updatedLike: Array<string> = [];
    if (currentUserDetails) {
      if (!isLiked) {
        // console.log("add like");
        updatedLike = [
          ...(postDetail.likes?.filter(
            (like) => like !== currentUserDetails.username,
          ) || []),
          currentUserDetails.username,
        ];
        setIsLiked(true);
      } else {
        // console.log("removed like");
        updatedLike = [
          ...postDetail.likes.filter(
            (like) => like !== currentUserDetails?.username,
          ),
        ];
        setIsLiked(false);
      }

      try {
        const { data, error } = await supabaseClient
          .from("posts")
          .update({ likes: updatedLike })
          .eq("id", postDetail.id)
          .select();

        if (error) {
          // console.log({ error });
          // throw new Error("error liking or removing like");
          return;
        }

        setNumberOfLikes(data[0].likes.length);
      } catch (error) {
        // console.log("got an error liking or removing like", { error });
      }
    }
  };

  const handleUpdateFollowing = async () => {
    let updatedFollowers: Array<string> = [];

    if (currentUserDetails) {
      const { data, error } = await supabaseClient
        .from("users")
        .select("followers")
        .eq("username", username);

      if (error) {
        // console.log({ error });
        // throw new Error("error fetching followers");
        return;
      }

      if (!isFollowed) {
        // console.log("added follower");
        updatedFollowers = [
          ...(data[0].followers?.filter(
            (follower: string) => follower !== currentUserDetails.username,
          ) || []),
          currentUserDetails.username,
        ];
      } else {
        // console.log("removed follower");

        updatedFollowers = [
          ...data[0].followers.filter(
            (follower: string) => follower !== currentUserDetails.username,
          ),
        ];
      }

      try {
        const { data, error } = await supabaseClient
          .from("users")
          .update({ followers: updatedFollowers })
          .eq("username", postUser?.username)
          .select();
        // console.log({ data, error });

        if (error) {
          // console.log({ error });
          // throw new Error("error updating followers");
          return;
        }

        if (data) {
          if (data[0].followers) {
            setFollowers(data[0].followers.length);
          }
        }
      } catch (error) {
        // console.log("got an error trying to update followers");
      }
    }
  };

  useEffect(() => {
    handleSavePost();
  }, [isSaved]);

  useEffect(() => {
    handleFollow();
  }, [isFollowed]);

  // setting the current number of likes
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (currentUserDetails) {
        const { data, error } = await supabaseClient
          .from("posts")
          .select("*")
          .eq("id", postDetail.id);

        if (error) {
          // console.log({ error });
          // throw new Error("error fetching post details");
          return;
        }

        if (data) {
          // console.log(data[0].likes);
          if (data[0].likes.includes(currentUserDetails.username)) {
            // console.log("is liked in supabase so updated to true");
            setIsLiked(true);
          }
          setNumberOfLikes(data[0].likes?.length);
        }
      }
    };

    fetchPostDetails();
  }, [currentUserDetails]);

  // fetch post owner details
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("username", postDetail.username);
      if (data) {
        setPostUser(data[0]);
        setFollowers(data[0].followers?.length || 0);
        if (data[0].followers?.includes(currentUserDetails?.username)) {
          setIsFollowed(true);
        }
      } else {
        // alert(`unable to fetch user ${error}`);
      }
    };

    fetchUsers();
  }, []);

  // copies the url
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

  // sets copy back to false after a sec
  if (copy) {
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  }

  // calculates number of followers
  const NumberOfFollowers = () => {
    let numberOfFollowers = "";
    const followerCount = Math.abs(followers);
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

    if (Number.isNaN(followerCount)) {
      return 0;
    } else {
      return numberOfFollowers;
    }
  };

  // extracts the host name from the links given
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
              onClick={() => {
                session ? handleLike() : router.push("/sign-in");
              }}
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
                duration: 3000,
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
            if (session) {
              setIsSaved((prevValue) => !prevValue);
              handleUpdateFollowing();
            } else {
              router.push("/sign-in");
            }
          }}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </nav>

      <div className="flex flex-col items-start justify-start gap-2">
        <h1 className="text-3xl font-semibold">{postDetail.title}</h1>

        {postDetail.description && <p>{postDetail.description}</p>}

        <div className="flex flex-wrap items-center justify-start gap-2">
          {postDetail.tags.length >= 1 &&
            postDetail.tags.map((tag, i) => (
              <p
                key={i}
                className="cursor-pointer text-myForeground/70 transition-all hover:text-icon"
                onClick={() => router.push(`/?query=${tag.replace("#", "")}`)}
              >
                {postDetail.tags.length >= 1 && "#"}
                {tag.includes("#") ? tag.replace("#", "") : tag}
              </p>
            ))}
        </div>
        <div className="flex flex-wrap items-center justify-start gap-2">
          {postDetail.links &&
            postDetail.links.map((link, i) => (
              <a
                key={i}
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
            className={`flex ${!postUser?.avatar && "bg-skeleton relative"} max-h-14 min-h-14 min-w-14 max-w-14 overflow-hidden rounded-full`}
          >
            {postUser?.avatar && (
              <Image
                src={postUser?.avatar as string}
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
            onClick={() => {
              if (session) {
                setIsFollowed((prevValue) => !prevValue);
                handleUpdateFollowing();
              } else {
                router.push("/sign-in");
              }
            }}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDetails;

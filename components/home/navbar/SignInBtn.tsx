"use client";

import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SignInBtn = () => {
  const { session } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        if (session.user.user_metadata) {
          console.log(2, session?.user.id);

          const newUserData = {
            id: session.user.id,
            name: session.user.user_metadata.name,
            username: (session.user.user_metadata.name as string)
              .toLowerCase()
              .replaceAll(" ", "_"),
            email: session.user.email,
            avatar: session.user.user_metadata.avatar_url,
          };

          const { data: userData, error: userError } = await supabaseClient
            .from("users")
            .select("email")
            .eq("email", newUserData.email);

          if (userError) {
            // console.error("Error checking user existence:", userError);
            // throw new Error("Failed to check user existence");
            return;
          }

          if (userData.length === 0) {
            const { data: usernameData, error: usernameError } =
              await supabaseClient
                .from("users")
                .select("username")
                .eq("username", newUserData.username);

            if (usernameError) {
              // console.error("Error checking username existence:", usernameError);
              // throw new Error("Failed to check username existence");
              return;
            }

            const { data: insertData, error: insertError } =
              await supabaseClient
                .from("users")
                .insert({
                  ...newUserData,
                  username:
                    usernameData.length > 0
                      ? newUserData.username +
                        Math.floor(Math.random() * 10000)
                          .toString()
                          .padStart(4, "0")
                      : newUserData.username,
                })
                .select();

            setUser(
              usernameData.length > 0
                ? newUserData.username +
                    Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")
                : newUserData.username,
            );

            console.log("successfully created user in DB", {
              insertData,
              insertError,
            });
          }
          return;
        }
      }
    };

    fetchUser();
  }, [session, pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("first");
      if (session && session.user.id) {
        console.log("second");
        const { data: user, error: userError } = await supabaseClient
          .from("users")
          .select("username")
          .eq("id", session?.user.id);

        console.log({ user, userError });
        if (userError) {
          console.error(userError);
          return;
        }
        if (user.length > 0) {
          setUser(user[0].username);
        }
      }
    };

    fetchUser();
  }, [session]);

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      // throw new Error("unable to sign out");
      return;
    }
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (session) {
        const { data, error } = await supabaseClient
          .from("users")
          .select("avatar")
          .eq("id", session?.user.id);

        if (error) {
          // throw new Error("unable to fetch avatar");
          return;
        }

        setAvatarUrl(data[0]?.avatar || null);
      }
    };

    fetchAvatarUrl();
  }, [session]);

  return (
    <>
      {session ? (
        <div className="relative mr-2 transition-all">
          <div
            className={`${isOpen ? "block" : "hidden"} fixed right-0 top-0 -z-10 h-screen w-screen bg-black/45 backdrop-blur-[3px] transition-all`}
            onClick={() => setIsOpen(false)}
          />

          <div className="max-h-8 min-h-8 min-w-8 max-w-8 overflow-hidden rounded-full">
            <Image
              src={avatarUrl || "/icons/user-placeholder.svg"}
              alt={"profile"}
              width={200}
              height={200}
              className="cursor-pointer object-cover"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>

          <div
            className={`absolute ${isOpen ? "top-14 opacity-100" : "top-full opacity-0"} right-0 flex flex-col text-nowrap rounded-md bg-button transition-all`}
          >
            <Link
              href={`/profile/${user}`}
              className="rounded-md px-10 py-3 hover:bg-icon"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-md px-10 py-3 hover:bg-icon"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <Link
          href={"/sign-in"}
          className="flex items-center gap-2 transition-all md:text-nowrap md:rounded-full md:bg-icon md:px-3 md:py-2 md:hover:bg-icon"
        >
          <span className="hidden text-nowrap md:block">Sign In</span>
          <LogIn className="-ml-1 h-7 w-7 text-icon md:-ml-0 md:hidden" />
        </Link>
      )}
    </>
  );
};

export default SignInBtn;

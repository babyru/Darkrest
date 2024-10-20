"use client";

import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SignInBtn = () => {
  const { session } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (session && session.user.id) {
        const { data: user, error: userError } = await supabaseClient
          .from("users")
          .select("username")
          .eq("id", session?.user.id);

        if (userError) {
          console.error(userError);
        } else {
          setUser(user[0].username);
        }
      }
    };

    fetchUser();
  }, [session]);

  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      throw new Error("unble to sign out");
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (session) {
        const { data, error } = await supabaseClient
          .from("users")
          .select("avatar")
          .eq("id", session?.user.id);

        if (error) {
          throw new Error("unable to fetch avatar");
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

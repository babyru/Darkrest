"use client";

import CreatePostForm from "@/components/shared/CreatePostForm";
import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
const CreatePage = () => {
  const [currentUser, setCurrentUser] = useState<UserProp>();
  const { session } = useSessionContext();

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
        } else {
          setCurrentUser(data[0]);
        }
      }
    };

    fetchCurrentUser();
  }, [session]);

  if (currentUser) {
    return (
      <div className="m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 text-myForeground md:flex-row md:gap-10">
        <CreatePostForm
          createOrUpdate="create"
          username={currentUser.username}
          name={currentUser.name}
        />
      </div>
    );
  }
};

export default CreatePage;

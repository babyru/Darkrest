"use client";

import { useToast } from "@/hooks/use-toast";
import supabaseClient from "@/utils/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PutBlobResult } from "@vercel/blob";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface InputValuesProps {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const signIn = () => {
  const [inputValues, setInputValues] = useState<InputValuesProps>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isReadyToUpload, setIsReadyToUpload] = useState(true);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [otherErrors, setOtherErrors] = useState("");
  const { session } = useSessionContext();

  const router = useRouter();

  const handleGoogleSignUp = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
    });
  }; // Ensure this closing brace is correct

  const handleEmailSignUp = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      // console.log({ error });
      setOtherErrors(error.message);
      return;
    }

    // try {
    //   if (data && session && session.user.user_metadata) {
    //     // console.log(session?.user.user_metadata);

    //     const newUserData = {
    //       id: session.user.id,
    //       name: session.user.user_metadata.name,
    //       username: (session.user.user_metadata.name as string)
    //         .toLowerCase()
    //         .replaceAll(" ", "_"),
    //       email: session.user.email,
    //       avatar: session.user.user_metadata.avatar_url,
    //     };

    //     const { data: userData, error: userError } = await supabaseClient
    //       .from("users")
    //       .select("email")
    //       .eq("email", newUserData.email);

    //     if (userError) {
    //       console.error("Error checking user existence:", userError);
    //       throw new Error("Failed to check user existence");
    //     }

    //     if (userData.length === 0) {
    //       const { data: usernameData, error: usernameError } =
    //         await supabaseClient
    //           .from("users")
    //           .select("username")
    //           .eq("username", newUserData.username);

    //       if (usernameError) {
    //         console.error("Error checking username existence:", usernameError);
    //         throw new Error("Failed to check username existence");
    //       }

    //       const { data: insertData, error: insertError } = await supabaseClient
    //         .from("users")
    //         .insert({
    //           ...newUserData,
    //           username:
    //             usernameData.length > 0
    //               ? newUserData.username +
    //                 Math.floor(Math.random() * 10000)
    //                   .toString()
    //                   .padStart(4, "0")
    //               : newUserData.username,
    //         });

    //       // console.log("successfully created user in DB", {
    //         insertData,
    //         insertError,
    //       });
    //     }
    //     return;
    //   } else {
    //     // console.log({ error });
    //     throw new Error("error signing in");
    //   }
    // } catch (error) {
    //   throw new Error("handleGoogleSignUp error");
    // }
  };

  const handleAction = async (formData: FormData) => {
    const { username, email, password } = Object.fromEntries(formData);
    // isReadyToUpload && updateProfile(formData);

    const { data, error } = await supabaseClient
      .from("users")
      .select("username")
      .eq("username", username);
    // console.log(data, error);

    if (error) {
      // console.log("error checking username existence");
      return;
    }

    if (data.length > 0) {
      setIsUsernameTaken(true);
    }

    handleEmailSignUp(email as string, password as string);
  };

  if (!session) {
    return (
      <div className="m-auto mt-44 flex w-screen max-w-xl flex-col gap-20 rounded-xl bg-button/25 px-6 py-10 text-myForeground shadow-2xl shadow-icon/15 md:flex-row md:gap-10">
        <form
          action={async (formData: FormData) => {
            handleAction(formData);
          }}
          className="mb-10 flex w-full flex-col gap-10 md:mb-0"
        >
          <button
            className="rounded-lg bg-button py-5 font-semibold transition-all duration-300 hover:bg-myForeground hover:text-button"
            type="button"
            onClick={handleGoogleSignUp}
          >
            Sign in with Google
          </button>

          {otherErrors && <p className="-my-3 text-red-500">{otherErrors}</p>}

          {/* email sign up no hidden */}
          <div className="hidden">
            <label htmlFor="email" className={`-mb-7`}>
              <span
                className={`${emailError ? "text-red-500" : "text-myForeground"}`}
              >
                {emailError ? emailError : "Email"}
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              required
              className={`input-style`}
              value={inputValues.email}
              onChange={(e) =>
                setInputValues((prevValue) => ({
                  ...prevValue,
                  email: e.target.value,
                  name: e.target.value.split("@")[0],
                  username: e.target.value
                    .toLowerCase()
                    .replace(" ", "_")
                    .replaceAll(".", "")
                    .split("@")[0],
                }))
              }
            />

            <label htmlFor="password" className={`-mb-7`}>
              Password
            </label>
            <input
              type="password"
              required
              id="password"
              name="password"
              placeholder="password"
              className={`input-style`}
              minLength={6}
              value={inputValues.password}
              onChange={(e) =>
                setInputValues((prevValue) => ({
                  ...prevValue,
                  password: e.target.value,
                }))
              }
            />

            <label htmlFor="confirmPassword" className={`-mb-7`}>
              <span
                className={`${passwordMatch ? "text-myForeground" : "text-red-500"}`}
              >
                {passwordMatch ? "Confirm password" : "Passwords do not match"}
              </span>
            </label>
            <input
              type="password"
              required
              id="confirmPassword"
              name="confirmPassword"
              className={`input-style`}
              minLength={6}
              value={inputValues.confirmPassword}
              onChange={(e) => {
                if (inputValues.password !== e.target.value) {
                  setPasswordMatch(false);
                } else {
                  setPasswordMatch(true);
                }
                setInputValues((prevValue) => ({
                  ...prevValue,
                  confirmPassword: e.target.value,
                }));
              }}
            />

            {/* name */}
            <input
              type="text"
              id="name"
              name="name"
              placeholder="name"
              className={`input-style`}
              hidden
              value={inputValues.name}
              onChange={(e) =>
                setInputValues((prevValue) => ({
                  ...prevValue,
                  name: e.target.value,
                  username:
                    e.target.value.toLowerCase().replace(" ", "_") ||
                    prevValue.username,
                }))
              }
            />

            {/* username */}
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              className={`input-style`}
              hidden
              value={
                inputValues.username
                  ? isUsernameTaken
                    ? inputValues.username +
                      "_" +
                      Math.floor(Math.random() * 10000)
                        .toString()
                        .padStart(4, "0")
                    : inputValues.username
                  : ""
              }
              onChange={(e) =>
                setInputValues((prevValue) => ({
                  ...prevValue,
                  username: e.target.value,
                }))
              }
            />

            <button
              type="submit"
              className={`secondary-btn flex w-full items-center justify-center gap-2 bg-button ${
                !isReadyToUpload
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-icon"
              }`}
              disabled={!isReadyToUpload}
            >
              {!isReadyToUpload ? "Creating..." : "Create"}
              {!isReadyToUpload && <Loader2 className="h-5 w-5 animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    router.push("/");
  }
};

export default signIn;

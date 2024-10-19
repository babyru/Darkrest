import Posts from "@/components/profile/Posts";
import ProfileHeroSection from "@/components/profile/ProfileHeroSection";
import supabaseClient from "@/utils/supabase";
import Link from "next/link";

const Profile = async ({
  params: { profile },
  searchParams: { page },
}: {
  params: { profile: string };
  searchParams: { page: string | undefined };
}) => {
 const user = 'noah_white'
  // const data = users.find((user) => user.username === profile!);
  const { data: userData, error: userDataError } = await supabaseClient
    .from("users")
    .select("*")
    .eq("username", profile);

  if (userData) {
    const { data: createdPosts, error: createdPostsError } =
      await supabaseClient
        .from("posts")
        .select("*")
        .in("id", userData[0].posts);

    const { data: savedPost, error: savedPostError } = await supabaseClient
      .from("posts")
      .select("*")
      .in("id", userData[0].saved);

console.log(userData)

    if (createdPosts && savedPost) {
      return (
        <div className="page-size mt-24 px-6">
          <ProfileHeroSection
            banner={userData[0]?.banner!}
            avatar={userData[0]?.avatar!}
            name={userData[0]?.name!}
            username={userData[0]?.username!}
            bio={userData[0]?.bio!}
            followers={userData[0]?.followers!}
            following={userData[0]?.following!}
            user={user}
          />

          <nav className="mt-10 flex items-center justify-center gap-2 text-myForeground">
            <Link
              href={`/profile/${profile}?page=posts`}
              className={`secondary-btn ${page === "posts" || page === undefined ? "bg-icon" : "bg-button hover:bg-icon"}`}
            >
              Posts
            </Link>
            <Link
              href={`/profile/${profile}?page=saved`}
              className={`secondary-btn ${page === "saved" ? "bg-icon" : "bg-button hover:bg-icon"}`}
            >
              Saved
            </Link>
          </nav>

          {page === "posts" || page === undefined ? (
            <Posts
              query={userData[0]?.name!}
              posts={createdPosts}
              searchParams={page}
              user={user}
            />
          ) : savedPost.length !== 0 ? (
            <Posts
              query={userData[0]?.name!}
              posts={savedPost}
              user={user}
              searchParams={page}
            />
          ) : (
            <div className="my-10 text-center text-lg font-semibold text-myForeground">
              No saved posts found
            </div>
          )}
        </div>
      );
    } else {
      alert("error loading data");
    }
  }
};

export default Profile;

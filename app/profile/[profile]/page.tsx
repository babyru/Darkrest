import Posts from "@/components/profile/Posts";
import ProfileHeroSection from "@/components/profile/ProfileHeroSection";
import AllPosts from "@/components/shared/AllPosts";
import { posts, users } from "@/constants";
import Link from "next/link";

const Profile = ({
  params: { profile },
  searchParams: { page },
}: {
  params: { profile: string };
  searchParams: { page: string | undefined };
}) => {
  const userData = users.find((user) => user.username === profile!);
  const savedPosts = posts.filter((post) => userData?.saved.includes(post.id));

  const user = "noah_white";

  return (
    <div className="page-size mt-24 px-6">
      <ProfileHeroSection
        banner={userData?.banner!}
        profile={userData?.image!}
        name={userData?.name!}
        username={userData?.username!}
        bio={userData?.bio!}
        followers={userData?.followers!}
        following={userData?.following!}
      />
      <nav className="text-myForeground mt-10 flex items-center justify-center gap-2">
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
          query={userData?.name!}
          posts={posts}
          filterOrSort="filter"
          filterBy="name"
          user={user}
        />
      ) : (
        <AllPosts posts={savedPosts} />
      )}
    </div>
  );
};

export default Profile;

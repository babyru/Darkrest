import CreatePostForm from "@/components/shared/CreatePostForm";
import supabaseClient from "@/utils/supabase";
const CreatePage = async () => {
  const currentUser = "noah_white";

  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("username", currentUser);

  if (data) {
    return (
      <div className="m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 text-myForeground md:flex-row md:gap-10">
        <CreatePostForm
          createOrUpdate="create"
          username={currentUser}
          name={data[0].name as string}
        />
      </div>
    );
  }
};

export default CreatePage;

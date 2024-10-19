import CreatePostForm from "@/components/shared/CreatePostForm";
const CreatePage = () => {
 const user = 'noah_white'
  return (
    <div className="m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 text-myForeground md:flex-row md:gap-10">
      <CreatePostForm createOrUpdate="create" user={user} />
    </div>
  );
};

export default CreatePage;

import CreatePostForm from "@/components/shared/CreatePostForm";
const CreatePage = () => {
  return (
    <div className="text-myForeground m-auto mt-24 flex w-screen max-w-4xl flex-col gap-20 px-6 md:flex-row md:gap-10">
      <CreatePostForm createOrUpdate="create" />
    </div>
  );
};

export default CreatePage;

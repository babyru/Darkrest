declare type SearchParamProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { search: string };
};

declare type PostProp = {
  id: string;
  created_at: Date;
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
  name: string;
  username: string;
  likes: string[];
  links: string[];
  tags: string[];
};

declare type UserProp = {
  id: string;
  created_at: Date;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  followers: string[];
  following: string[];
  posts: string[];
  saved: string[];
};

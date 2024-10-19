import { navLinks } from "@/constants";
import Link from "next/link";
import { CustomCombobox } from "../shared/Combobox";
import { Bell, LogIn, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import MobileNav from "./MobileNav";
import supabaseClient from "@/utils/supabase";

const Navbar = async () => {
  const signedIn = true;

  const { data, error } = await supabaseClient.from("posts").select("*");

  if (data) {
    return (
      <header className="fixed top-0 z-10 h-16 w-screen bg-myBackground">
        <nav className="page-size h-full overflow-x-clip px-6 text-myForeground">
          <div className="flex h-full items-center justify-between gap-5">
            <Link href={"/"}>
              <Image
                src="/icons/logo.svg"
                alt="logo"
                width={100}
                height={100}
                priority
                className="max-h-12 min-h-12 min-w-12 max-w-12"
              />
            </Link>

            <div className="hidden items-center gap-5 sm:flex">
              {navLinks.slice(0, 2).map(({ id, name, href }) => (
                <Link key={id} href={href} className="primary-btn">
                  {name}
                </Link>
              ))}
            </div>

            <CustomCombobox items={data as PostProp[]} placeholder={"Search"} />

            {navLinks.length > 2 && (
              <div className="hidden items-center gap-5 sm:flex">
                {navLinks.slice(2).map(({ id, name, href }) => (
                  <Link key={id} href={href} className="text-icon">
                    {name.toLocaleLowerCase() === "notification" ? (
                      <Bell />
                    ) : (
                      <MessageCircleMore />
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* mobile nav */}
            <MobileNav />

            {/* profile and sign in */}
            {signedIn ? (
              <Link
                href={"/profile/noah_white"}
                className="max-h-8 min-h-8 min-w-8 max-w-8 overflow-hidden rounded-full bg-button transition-all hover:bg-icon"
              >
                <Image
                  src={"/images/user (6).jpg"}
                  alt={"profile"}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </Link>
            ) : (
              <Link
                href={"/sign-in"}
                className="flex items-center gap-2 transition-all hover:bg-icon md:text-nowrap md:rounded-full md:bg-icon md:px-3 md:py-2"
              >
                <span className="hidden text-nowrap md:block">Sign In</span>
                <LogIn className="-ml-1 h-7 w-7 text-icon md:-ml-0 md:hidden" />
              </Link>
            )}
          </div>
        </nav>
      </header>
    );
  } else {
    alert(`navbar fetch error ${error}`);
  }
};

export default Navbar;

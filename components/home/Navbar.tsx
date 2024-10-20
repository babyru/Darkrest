import { navLinks } from "@/constants";
import Link from "next/link";
import { CustomCombobox } from "../shared/Combobox";
import { Bell, LogIn, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import MobileNav from "./MobileNav";
import SignInBtn from "./navbar/SignInBtn";
 
const Navbar = async () => {
  const signedIn = false;

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

          <CustomCombobox placeholder={"Search"} />

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
          <SignInBtn />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

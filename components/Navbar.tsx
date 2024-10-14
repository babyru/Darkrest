import { kailasaFeatures, navLinks } from "@/constants";
import Link from "next/link";
import { CustomCombobox } from "./Combobox";
import { Bell, ChevronDown, Menu, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <header className="fixed top-0 h-16 w-screen bg-background">
      <nav className="page-size h-full overflow-x-clip px-6 text-foreground">
        <div className="flex h-full items-center justify-between gap-5">
          <Link href={"/"}>
            <Image
              src="/logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="max-h-12 min-h-12 min-w-12 max-w-12"
            />
          </Link>

          <div className="hidden items-center gap-5 sm:flex">
            {navLinks.slice(0, 2).map(({ id, name, href }) => (
              <Link
                key={id}
                href={href}
                className="rounded-full bg-button px-3 py-2 transition-all hover:bg-icon"
              >
                {name}
              </Link>
            ))}
          </div>

          <CustomCombobox items={kailasaFeatures} placeholder={"Search"} />

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

          {/* mobile nav */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

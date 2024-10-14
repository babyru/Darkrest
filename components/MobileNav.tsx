"use client";

import { navLinks } from "@/constants";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative sm:hidden">
      <div
        className={`fixed right-0 top-0 h-screen w-screen ${isOpen ? "block" : "hidden"} bg-black/20`}
        onClick={() => setIsOpen(false)}
      />
      <ChevronLeftCircle
        className={`h-7 w-7 text-icon ${isOpen ? "rotate-180" : "rotate-0"} transition-all`}
        onClick={() => setIsOpen((prevValue) => !prevValue)}
      />
      <div
        className={`absolute ${isOpen ? "right-0 opacity-100" : "-right-96 scale-90 opacity-45"} top-10 flex flex-col items-center rounded-md bg-button transition-all`}
      >
        {navLinks.map(({ id, name, href }) => (
          <Link
            key={id}
            href={href}
            className="w-full rounded py-2 pl-4 pr-10 text-start transition-all hover:bg-icon"
          >
            <button onClick={() => setIsOpen(false)}>{name}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;

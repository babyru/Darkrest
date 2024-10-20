import { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/home/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/home/Provider";

export const metadata: Metadata = {
  title: "Darkrest",
  description:
    "Discover and save your favorite images on Darkrest, a visual discovery and planning website where you can find and save ideas for your interests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className="bg-myBackground">
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}

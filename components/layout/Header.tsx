"use client";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Button from "../ui/Button";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="bg-primary w-10 h-10 rounded-full flex justify-center items-center text-white font-bold text-2xl">
            JK
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold">JobKit</h1>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Button variant="secondary"> <Link href="/auth/login">Sign In</Link></Button>
          <Button variant="primary"><Link href="/auth/register">Sign Up</Link></Button>
        </div>

        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-2">
          <Button variant="secondary" className="w-full">
            Sign In
          </Button>
          <Button variant="primary" className="w-full">
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;

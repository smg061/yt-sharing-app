import { useState } from "react";
import { Link } from "react-router-dom";
import useVoting from "../hooks/useVoteToSkip";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./Button/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

function NavLink({
  children,
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  to: string;
}) {
  return (
    <div
      className={twMerge(
        `mx-2 flex items-center h-full  rounded-md justify-center`,
        className
      )}
    >
      <Link
        {...props}
        className="  hover:bg-violet-400 rounded  h-1/2 pt-1"
        to={props.to}
      >
        {children}
      </Link>
    </div>
  );
}

const links = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Rooms",
    to: "/rooms",
  },
  {
    label: "Draw Together",
    to: "/draw",
  },
  {
    label: "Write Together",
    to: "/write",
  },
];

const Header = () => {
  const { logout } = useAuth();
  const [uwu, setUwu] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  return (
    <div className="rounded-lg flex w-screen bg-slate-600 h-max md:h-16 items-center">
      <div className=" gap-4 items-center justify-start rows-span-1 rounded w-[75%] hidden md:flex">
        <div className="w-42 flex justify-center  px-2 hover:bg-violet-400   transition-colors duration-500 ease-in-out rounded-md ">
          <div
            className="flex align-center justify-center "
            onMouseOver={() => setUwu(false)}
            onMouseLeave={() => setUwu(true)}
          >
            <p className="text-6xl mx-px rounded text-slate-100 ">
              {uwu ? "uwu" : "owo"}
              <span className="text-sm mx-[-1px]">.io</span>
            </p>
          </div>
        </div>
        {links.map((link) => (
          <NavLink key={link.label} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="md:hidden w-[75%]">
        <Button
          variant={"ghost"}
          className="hover:bg-violet-500 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <HamburgerMenuIcon />
        </Button>
        {menuOpen && (
          <div className="flex flex-col w-full">
            {links.map((link) => (
              <NavLink key={link.label} to={link.to} className="w-full hover:bg-violet-400">
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <div className=" items-start md:items-center gap-4  justify-end pr-4 flex  w-[25%]">
        <div className="flex items-center justify-center">
          <Link to="/login" className="bg-violet-400 rounded">
            <Button variant={"ghost"} className="hover:bg-violet-500 rounded">
              Login
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant={"secondary"}
            className="hover:bg-slate-500"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;

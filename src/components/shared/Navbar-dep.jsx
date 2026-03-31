import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/Sheet";
import { Hamburger } from "../ui/animated-hamburger";
import PulseLoader from "./PulseLoader";
import Button from "../ui/Button";
import { CakeSlice, Coins, FilePen, LogOut, Star, UserPlus, Users } from "lucide-react";
import {
  useGetCurrentUser,
  useSignOutAccount,
} from "../../lib/react_query/queriesAndMutations";
import { useUserContext, INITIAL_USER } from "../../context/AuthContext";
import { communityPaths } from "../../constants";
import { NAV_ITEMS } from "../../constants";
import { formatDate, userAge } from "../../lib/utils";

const Navbar = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });

  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { data: currentUser } = useGetCurrentUser();

  const handleSignOut = async () => {
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
  };

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [isHamActive, setIsHamActive] = useState(false);

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="navbar absolute w-full z-50">
      <div className="bg-primary w-full p-2 md:px-5 gap-5 flex">
        <div className=" w-full md:justify-start justify-between items-center flex gap-2">
          <Hamburger
            onClick={() => setIsHamActive((prev) => !prev)}
            isOpen={isHamActive}
          />
          <Link to="/" className="flex md:gap-3 gap-1 items-center">
            <img
              src="/assets/images/nanogram_logo-no-bg.svg"
              alt="Logo"
              className=" md:size-[3.75rem] md:flex hidden"
              loading="lazy"
            />
            <h1 className=" md:text-3xl text-2xl font-bold text-neutral-white md:flex hidden nanogram ">
              NANOGRAM
            </h1>
          </Link>
        </div>
        <div className="w-full flex justify-center items-center">
          <img
            src="/assets/images/nanogram_logo-no-bg.svg"
            alt="Logo"
            className="size-14 md:hidden flex "
            loading="lazy"
          />
          <div className="lg:flex hidden">
            <SlideTabs />
          </div>
        </div>
        <div className="w-full justify-end flex items-center overflow-hidden pr-2">
          {isLoading ? (
            <PulseLoader className="md:size-[56px] size-10  " />
          ) : user?.id !== "" ? (
            <div className="flex-center gap-3">
              <Sheet>
                <SheetTrigger>
                  <img
                    src={user.imageUrl || "/assets/icons/user.svg"}
                    alt="Avatar"
                    className="size-14 rounded-full bg-neutral-white md:p-0.5 p-[1px]"
                    loading="lazy"
                  />
                </SheetTrigger>
                <SheetContent className="flex flex-col flex-1">
                  <SheetHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <SheetClose asChild>
                          <Link to={`/profile/${user.id}`}>
                            <img
                              src={user.imageUrl || "/assets/icons/user.svg"}
                              alt={user.name || "creator"}
                              className="rounded-full size-12"
                              loading="lazy"
                            />
                          </Link>
                        </SheetClose>
                        <div className="flex flex-col">
                          <p className="base-medium lg:body-bold text-neutral-black">
                            {user.name}
                          </p>
                          <div className="flex-center gap-2 text-neutral-black font-light">
                            <p className="tiny-medium lg:small-regular">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <FilePen
                          className="text-primary cursor-pointer mr-10"
                          onClick={() => navigate("/update-profile")}
                        />
                      </SheetClose>
                    </div>
                    <SheetTitle>Hello, {user.name}!</SheetTitle>
                    <SheetDescription>{userAge(user.joined)}</SheetDescription>
                  </SheetHeader>
                  <div className="my-3 flex w-full border" />
                  <div className="flex-start gap-2">
                    <Coins />
                    <p className="base-medium text-[10px] lg:body-bold text-neutral-black">
                      {currentUser?.karma}
                    </p>
                    <p className="base-medium text-[10px] lg:body-bold text-neutral-black">
                      Nanobytes
                    </p>
                  </div>
                  <div className="my-3 flex w-full border" />
                  <div className="flex-start gap-2">
                    <CakeSlice />
                    <p className="base-medium text-[10px] lg:body-bold text-neutral-black">
                      {formatDate(currentUser?.$createdAt, "MMMM DD, YYYY")}
                    </p>
                  </div>
                  <div className="my-3 flex w-full border" />
                  <SheetClose asChild>
                    <div className="flex-center flex-wrap w-full gap-2">
                      <Button
                        variant="ghost"
                        className={"flex gap-2"}
                        onClick={() => navigate("/all-users")}
                      >
                        <Users /> All Users
                      </Button>
                    </div>
                  </SheetClose>
                  <div className="my-3 flex w-full border" />
                  <SheetClose asChild>
                    <div className="flex-center flex-wrap w-full gap-2">
                      <Button
                        variant="ghost"
                        className={"flex gap-2"}
                        onClick={() => navigate("/top-users")}
                      >
                        <Star /> Top Users
                      </Button>
                    </div>
                  </SheetClose>
                  <div className="my-3 flex w-full border" />
                  <div className="flex w-full justify-center gap-2">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className={"flex gap-2"}
                        onClick={handleSignOut}
                      >
                        <LogOut /> Logout
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <Button variant="outline" onClick={() => navigate("/sign-in")}>
              {isSmallScreen ? <UserPlus size={20} /> : "Sign in"}
            </Button>
          )}
        </div>
      </div>
      {isHamActive && (
        <nav
          className={
            "p-3 text-xl text-neutral-black bg-secondary bg-opacity-50 backdrop-blur-sm gap-3 flex justify-center"
          }
        >
          <div className="rounded-3xl border-neutral-black border-2 w-fit bg-neutral-white p-2">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const isCommunity = communityPaths.some((path) =>
                pathname.startsWith(path)
              );

              const isHere =
                label === "Community" ? isCommunity : pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsHamActive((prev) => !prev)}
                >
                  <div
                    className={`flex gap-3 p-3 items-center  ${
                      isHere &&
                      "bg-neutral-black text-neutral-white rounded-2xl"
                    }`}
                  >
                    <Icon />
                    {label}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </section>
  );
};

export default Navbar;

const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <nav>
      <ul
        onMouseLeave={() => {
          setPosition((pv) => ({
            ...pv,
            opacity: 0,
          }));
        }}
        className="relative mx-auto flex w-[28rem] h-[3rem] md:h-[3.75rem] rounded-full border-2 border-neutral-black bg-neutral-white p-1 shadow-md"
      >
        {NAV_ITEMS.map(({ to, label }) => (
          <Link to={to} key={to}>
            <Tab setPosition={setPosition} key={to}>
              {label}
            </Tab>
          </Link>
        ))}

        <Cursor position={position} />
      </ul>
    </nav>
  );
};

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-2 text-sm font-semibold mix-blend-difference text-neutral-white md:px-4 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-10 rounded-full bg-neutral-black border-neutral-black md:h-12"
    />
  );
};

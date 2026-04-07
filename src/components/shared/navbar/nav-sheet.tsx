import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navbarItems } from "@/constants";

import { ModeToggle } from "../theme/mode-toggle";
import UserAvatar from "../profile/user-avatar";
import { useAuthStore } from "@/store/use-auth-store";
import { useProfile } from "@/hooks/use-profile";
import { PerformanceToggle } from "../performance/performance-toggle";

const NavSheet = ({ className }: { className?: string }) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { open, setOpen } = useProfile();

  return (
    <Sheet>
      <SheetTrigger className={className}>
        <Menu className="text-primary-foreground" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Nanogram</SheetTitle>
          <SheetDescription className="sr-only">
            Nanogram Navigation
          </SheetDescription>
        </SheetHeader>
        <nav className="px-5 flex flex-col gap-5">
          {navbarItems.map((item) => (
            <Link
              to={item.to}
              key={item.to}
              className="flex items-center gap-2"
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>
        <SheetFooter>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="flex items-center gap-2">
              <PerformanceToggle />
              <span>Toggle App Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <span>Toggle Theme</span>
            </div>
          </div>
          {currentUser ? (
            <div
              className="flex items-center gap-2 bg-sidebar-accent p-2 rounded-lg cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <UserAvatar
                imageUrl={currentUser.imageUrl}
                name={currentUser.name}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                <span className="truncate text-xs text-muted-foreground group-hover/sidebar-user:text-primary-foreground">
                  {currentUser.username}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-sidebar-accent p-2 rounded-lg">
              <Link to="/login">Login</Link>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavSheet;

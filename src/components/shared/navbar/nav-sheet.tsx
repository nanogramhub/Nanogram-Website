import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

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

const NavSheet = ({ className }: { className?: string }) => {
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
            <Link to={item.to} key={item.to} className="flex items-center gap-2">
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>
        <SheetFooter>
          <div>
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavSheet;

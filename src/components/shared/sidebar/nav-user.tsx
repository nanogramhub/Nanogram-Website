import { Link } from "@tanstack/react-router";
import { ChevronsUpDown } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/store/use-auth-store";

import UserAvatar from "../profile/user-avatar";

const NavUser = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { open, setOpen } = useProfile();

  if (!currentUser)
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Link to="/login">Login</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="flex items-center"
          onClick={() => setOpen(!open)}
        >
          <UserAvatar
            imageUrl={currentUser.imageUrl}
            name={currentUser.name}
            size="sm"
          />
          <div className="flex gap-2 text-left text-xs leading-tight mt-1">
            <span className="truncate font-extralight">{currentUser.name}</span>
            <span className="truncate font-extralight text-xs text-muted-foreground">
              @{currentUser.username}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;

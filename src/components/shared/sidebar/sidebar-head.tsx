import { Link } from "@tanstack/react-router";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SidebarHead = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          variant="outline"
          render={(props) => (
            <Link to="/" {...props}>
              <img
                src="/assets/images/nanogram_logo-bg-primary.svg"
                alt="logo"
                className="aspect-square h-full"
              />
              <span className="font-bold dark:text-foreground text-primary font-blanka">
                Nanogram
              </span>
            </Link>
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarHead;

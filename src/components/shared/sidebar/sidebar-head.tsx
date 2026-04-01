import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

const SidebarHead = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={(props) => (
            <Link to="/" {...props}>
              <img
                src="/assets/images/nanogram_logo-no-bg.svg"
                alt="logo"
                className="aspect-square h-full"
              />
              <span className="font-bold font-blanka">Nanogram</span>
            </Link>
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarHead;

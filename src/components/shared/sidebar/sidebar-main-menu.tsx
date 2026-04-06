import { Link, useLocation } from "@tanstack/react-router";

import { useSidebar } from "@/components/ui/hooks/use-sidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarItems } from "@/constants";

const SidebarMainMenu = () => {
  const { pathname } = useLocation();
  const { state, isMobile } = useSidebar();

  function highlightCurrentPath(url: string) {
    if (url === "/") {
      return pathname === "/" ? "bg-primary/30" : "";
    }

    return pathname.startsWith(url) ? "bg-primary/30" : "";
  }
  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {sidebarItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <Tooltip>
              <TooltipTrigger
                render={(triggerProps) => (
                  <SidebarMenuButton
                    {...triggerProps}
                    className={highlightCurrentPath(item.to)}
                    render={(props) => {
                      return (
                        <Link to={item.to} {...props}>
                          <item.icon size="4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    }}
                  />
                )}
              />
              <TooltipContent
                align="start"
                side="right"
                sideOffset={4}
                alignOffset={4}
                hidden={state !== "collapsed" || isMobile}
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarMainMenu;

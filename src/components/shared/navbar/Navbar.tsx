import { Link } from "@tanstack/react-router";
import { NavTab, NavTabs } from "./fuild-nav-tabs";
import { navbarItems } from "@/constants";
import { useIsMobile } from "@/hooks/useMobile";
import { ModeToggle } from "../theme/mode-toggle";
import NavSheet from "./nav-sheet";
import { PerformanceToggle } from "../performance/performance-toggle";

const Navbar = () => {
  const isMobile = useIsMobile();
  return (
    <div className="bg-primary py-2 px-3">
      <div className="flex relative justify-between">
        {isMobile && <NavSheet />}
        <Link to="/" className="flex gap-1 items-center md:w-50">
          <img
            src="/assets/images/nanogram_logo-no-bg.svg"
            alt="Logo"
            className="size-10"
          />
          {!isMobile && (
            <h1 className="font-blanka uppercase text-primary-foreground text-bold text-2xl mb-2">
              Nanogram
            </h1>
          )}
        </Link>
        {isMobile ? (
          <div className="w-10" />
        ) : (
          <>
            <NavTabs className="border-2 text-sm border-primary bg-white text-primary [&_.cursor]:bg-primary [&_.active-text]:text-primary-foreground">
              {navbarItems.map((item) => (
                <NavTab key={item.to} to={item.to}>
                  {item.label}
                </NavTab>
              ))}
            </NavTabs>
            <div className="w-50 flex items-center justify-end gap-2">
              <PerformanceToggle className="bg-primary aria-pressed:bg-black/20 text-primary-foreground hover:bg-black/20 hover:text-primary-foreground" />
              <ModeToggle className="bg-primary aria-pressed:bg-black/20 text-primary-foreground hover:bg-black/20 hover:text-primary-foreground" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

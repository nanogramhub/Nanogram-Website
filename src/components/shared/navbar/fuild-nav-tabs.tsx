import { Link } from "@tanstack/react-router";
import { motion, type TargetAndTransition } from "framer-motion";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export const NavTabs = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [position, setPosition] = useState<TargetAndTransition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <nav
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className={cn("relative flex w-fit rounded-full p-1", className)}
    >
      <ul className="relative flex">
        {/* Background Tabs (Inactive Color) */}
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(
              child as ReactElement<{
                setPosition?: (position: TargetAndTransition) => void;
              }>,
              { setPosition },
            );
          }
          return child;
        })}

        {/* Moving Cursor (The Blob) */}
        <motion.div
          animate={position}
          transition={{ type: "spring", stiffness: 400, damping: 33 }}
          className="absolute top-0 bottom-0 z-10 overflow-hidden rounded-full pointer-events-none cursor"
        >
          {/* Active Tabs (Clipped Overlay) */}
          <motion.ul
            className="flex h-full items-center"
            animate={{ x: -((position.left as number) || 0) }}
            transition={{ type: "spring", stiffness: 400, damping: 33 }}
          >
            {Children.map(children, (child) => {
              if (isValidElement(child)) {
                return (
                  <li className="active-text px-2 py-1 font-semibold whitespace-nowrap">
                    {
                      (child as ReactElement<{ children?: ReactNode }>).props
                        .children
                    }
                  </li>
                );
              }
              return null;
            })}
          </motion.ul>
        </motion.div>
      </ul>
    </nav>
  );
};

export const NavTab = ({
  to,
  children,
  setPosition,
  className,
}: {
  to: string;
  children: ReactNode;
  setPosition?: (position: TargetAndTransition) => void;
  className?: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current || !setPosition) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className={cn(
        "relative z-10 cursor-pointer font-semibold px-2 py-1 transition-colors flex items-center",
        className,
      )}
    >
      <Link to={to}>{children}</Link>
    </li>
  );
};

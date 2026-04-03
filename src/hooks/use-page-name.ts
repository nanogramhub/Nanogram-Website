import { kebabCasetoTitleCase } from "@/lib/utils";
import { useLocation } from "@tanstack/react-router";

export function usePageName() {
  const location = useLocation();
  let page = kebabCasetoTitleCase(
    location.pathname.split("/").at(1) || "Community",
  );
  if (location.pathname.split("/").at(1) === "u") {
    page = location.pathname.split("/").at(2) || "Profile";
  }
  return page;
}

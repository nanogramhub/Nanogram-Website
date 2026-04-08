import { useContext } from "react";

import { MemberDialogContext } from "./edit-member-context";

export const useMemberDialog = () => {
  const context = useContext(MemberDialogContext);

  if (!context) {
    throw new Error(
      "useMemberDialog must be used within a MemberDialogProvider",
    );
  }

  return context;
};

import { useContext } from "react";

import { EventDialogContext } from "./event-dialog-context";

export const useEventDialog = () => {
  const context = useContext(EventDialogContext);

  if (!context) {
    throw new Error(
      "useEventDialog must be used within a EventDialogProvider",
    );
  }

  return context;
};

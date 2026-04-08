import { useContext } from "react";

import { NewsletterDialogContext } from "./newsletter-dialog-context";

export const useNewsletterDialog = () => {
  const context = useContext(NewsletterDialogContext);

  if (!context) {
    throw new Error(
      "useNewsletterDialog must be used within a NewsletterDialogProvider",
    );
  }

  return context;
};

import { Lock, LogOut, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/use-auth-store";

import UserIdentities from "./user-identities";
import UserProfile from "./user-profile";
import UserPassword from "./user-password";
import UserSessions from "./user-sessions";
import DeleteAccount from "./delete-account";
import UserPrefs from "./user-prefs";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserProfileProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UserProfileDialog = ({ open, setOpen }: UserProfileProps) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isMobile = useIsMobile();

  function handleLogout() {
    logout();
    setOpen(false);
    // TODO: redirect to login if private routes
  }

  if (!currentUser) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden w-full lg:min-w-3xl h-[75vh]">
        <Tabs
          defaultValue="profile"
          orientation={isMobile ? "horizontal" : "vertical"}
          className="min-w-0 overflow-hidden pt-6 lg:pt-0"
        >
          <TabsList className="bg-background flex flex-row overflow-x-auto gap-1 min-w-0 w-full lg:flex-col lg:w-auto lg:overflow-visible">
            <TabsTrigger value="profile">
              <User />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock />
              Security
            </TabsTrigger>
            <TabsTrigger value="prefs">
              <Settings />
              Preferences
            </TabsTrigger>
          </TabsList>
          <Separator orientation="vertical" className="hidden lg:block" />
          <Separator orientation="horizontal" className="lg:hidden" />

          <div className="flex-1 min-w-0">
            <TabsContent value="profile">
              <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
                <DialogDescription className="wrap-break-word">
                  Make changes to your profile here.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <ScrollArea className="md:h-[65vh] h-[57vh]">
                <UserProfile />
                <Separator />
                <UserIdentities open={open} />
                <Separator />
                <div className="py-2">
                  <Button
                    variant="destructive"
                    className="ml-auto lg:ml-0 gap-1.5 shrink-0"
                    onClick={handleLogout}
                  >
                    <LogOut /> Logout
                  </Button>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="security">
              <DialogHeader className="py-2">
                <DialogTitle>Security</DialogTitle>
                <DialogDescription className="wrap-break-word">
                  Make changes to your security settings here.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <ScrollArea className="md:h-[65vh] h-[57vh]">
                <UserPassword />
                <Separator />
                <UserSessions open={open} />
                <Separator />
                <DeleteAccount />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="prefs">
              <DialogHeader className="py-2">
                <DialogTitle>Preferences</DialogTitle>
                <DialogDescription className="wrap-break-word">
                  Make changes to your preferences here.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <UserPrefs />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;

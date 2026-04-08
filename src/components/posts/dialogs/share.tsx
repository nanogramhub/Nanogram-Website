import {
  Check,
  Copy,
  Ellipsis,
  Link,
  MessageCircleMore,
  Search,
  Share2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Facebook,
  LinkedIn,
  Mail,
  Reddit,
  Telegram,
  Whatsapp,
  X,
} from "@/components/icons/brands";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSendMessage } from "@/hooks/mutations/use-messages";
import { useGetContacts } from "@/hooks/queries/use-messages";
import { useClipboard } from "@/hooks/use-copy";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import type { ContactUser } from "@/types/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";

interface ShareDialogProps {
  url: string;
  /** Post ID for in-app sharing via nanogram:// protocol */
  postId?: string;
  title?: string;
  trigger?: React.ReactNode;
}

const ShareDialog = ({
  url,
  postId,
  title = "Check out this post on Nanogram!",
}: ShareDialogProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const currentUser = useAuthStore((state) => state.currentUser);
  const sendMessage = useSendMessage();
  const { copy, copied } = useClipboard({ resetAfter: 2000 });

  // Fetch contacts for the "Send to Message" section
  const contactsQuery = useGetContacts({
    userId: currentUser?.$id ?? "",
    enabled: !!currentUser?.$id,
  });

  // Derive unique contacts from messages
  const contacts = useMemo(() => {
    if (!contactsQuery.data?.pages || !currentUser) return [];

    const contactMap = new Map<string, ContactUser>();
    for (const page of contactsQuery.data.pages) {
      for (const message of page.rows) {
        const otherUser =
          message.sender.$id === currentUser.$id
            ? message.receiver
            : message.sender;
        if (!contactMap.has(otherUser.$id)) {
          contactMap.set(otherUser.$id, otherUser);
        }
      }
    }
    return Array.from(contactMap.values());
  }, [contactsQuery.data, currentUser]);

  // Filter contacts by search
  const filteredContacts = useMemo(() => {
    if (!searchValue) return contacts.slice(0, 5); // Show first 5 by default
    const lower = searchValue.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.username.toLowerCase().includes(lower),
    );
  }, [contacts, searchValue]);

  /** Send post as in-app message using nanogram:// protocol */
  const handleSendToUser = (userId: string) => {
    if (!currentUser || !postId) return;

    sendMessage.mutate(
      {
        senderId: currentUser.$id,
        receiverId: userId,
        content: `nanogram://${postId}`,
      },
      {
        onSuccess: () => {
          setSentTo((prev) => new Set(prev).add(userId));
          toast.success("Post sent!");
        },
        onError: () => {
          toast.error("Failed to send post");
        },
      },
    );
  };

  const shareData = {
    title: "Nanogram",
    text: title,
    url: url,
  };

  const shareToPlatform = (platform: string) => {
    let shareUrl = "";
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case "mail":
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Error sharing");
        }
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="rounded-full"
        render={(props) => (
          <Button {...props} variant="ghost" size="icon">
            <Share2 className="size-6" />
          </Button>
        )}
      ></DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Share Post
          </DialogTitle>
          <DialogDescription>
            Share this post with your friends and community.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* ==================
              In-App Message Section
              ================== */}
          {postId && currentUser && (
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-1.5">
                <MessageCircleMore className="size-3.5" />
                Send via Message
              </h4>

              {/* Contact search */}
              {contacts.length > 3 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search contacts..."
                    className="pl-8 h-8 text-xs"
                  />
                </div>
              )}

              {/* Contact list */}
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 text-center py-3">
                    {contacts.length === 0
                      ? "No contacts yet. Start a conversation first."
                      : "No matching contacts"}
                  </p>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.$id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar size="sm">
                          <AvatarImage
                            src={contact.imageUrl || "/assets/icons/user.svg"}
                            alt={contact.name}
                          />
                          <AvatarFallback>
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium truncate">
                            {contact.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            @{contact.username}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant={
                          sentTo.has(contact.$id) ? "default" : "secondary"
                        }
                        size="sm"
                        className="shrink-0 h-7 text-xs px-3"
                        disabled={
                          sentTo.has(contact.$id) || sendMessage.isPending
                        }
                        onClick={() => handleSendToUser(contact.$id)}
                      >
                        {sentTo.has(contact.$id) ? (
                          <>
                            <Check className="size-3 mr-1" />
                            Sent
                          </>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Copy Link Section */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-muted-foreground ml-1">
              Copy Link
            </h4>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  value={url}
                  readOnly
                  className="pr-10 bg-secondary/30 border-border/50 focus-visible:ring-primary/20 transition-all font-mono text-xs"
                />
                <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              </div>
              <Button
                size="icon"
                onClick={() => copy(url)}
                className="shrink-0 transition-all duration-300 active:scale-90"
                variant={copied ? "default" : "secondary"}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-muted-foreground ml-1">
              Social Platforms
            </h4>
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => shareToPlatform("whatsapp")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <Whatsapp className="w-10 h-10" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  WhatsApp
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("twitter")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <X className="w-10 h-10 fill-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Twitter
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("facebook")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <Facebook className="w-10 h-10" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Facebook
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("linkedin")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <LinkedIn className="w-10 h-10" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  LinkedIn
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("telegram")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <Telegram className="w-10 h-10" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Telegram
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("reddit")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <Reddit className="w-10 h-10" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Reddit
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("mail")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <Mail className="w-10 h-10" />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Email
                </span>
              </button>

              {typeof navigator.share !== "undefined" && (
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
                >
                  <Ellipsis strokeWidth={1.5} className="size-10" />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                    More
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;

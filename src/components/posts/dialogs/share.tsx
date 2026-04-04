import { useState } from "react";
import { Link, Copy, Check, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Whatsapp,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Telegram,
  Reddit,
} from "../../icons/brands";
import { toast } from "sonner";

interface ShareDialogProps {
  url: string;
  title?: string;
  trigger?: React.ReactNode;
}

const ShareDialog = ({
  url,
  title = "Check out this post on Nanogram!",
}: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: "Nanogram",
    text: title,
    url: url,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
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
    } else {
      // Fallback is handled by the manual platform buttons in the dialog
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="rounded-full"
        render={(props) => (
          <Button {...props} variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        )}
      ></DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Share Post
          </DialogTitle>
          <DialogDescription>
            Share this post with your friends and community.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
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
                onClick={handleCopy}
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
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors duration-300 shadow-sm group-hover:shadow-[#25D366]/20">
                  <Whatsapp className="w-6 h-6 text-[#25D366] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  WhatsApp
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("twitter")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground transition-colors duration-300 shadow-sm group-hover:shadow-foreground/20">
                  <Twitter className="w-5 h-5 text-foreground group-hover:text-background transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Twitter
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("facebook")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2] transition-colors duration-300 shadow-sm group-hover:shadow-[#1877F2]/20">
                  <Facebook className="w-6 h-6 text-[#1877F2] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Facebook
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("linkedin")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center group-hover:bg-[#0A66C2] transition-colors duration-300 shadow-sm group-hover:shadow-[#0A66C2]/20">
                  <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  LinkedIn
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("telegram")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0088CC]/10 flex items-center justify-center group-hover:bg-[#0088CC] transition-colors duration-300 shadow-sm group-hover:shadow-[#0088CC]/20">
                  <Telegram className="w-5 h-5 text-[#0088CC] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Telegram
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("reddit")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FF4500]/10 flex items-center justify-center group-hover:bg-[#FF4500] transition-colors duration-300 shadow-sm group-hover:shadow-[#FF4500]/20">
                  <Reddit className="w-5 h-5 text-[#FF4500] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Reddit
                </span>
              </button>

              <button
                onClick={() => shareToPlatform("mail")}
                className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shadow-sm group-hover:shadow-primary/20">
                  <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                  Email
                </span>
              </button>

              {typeof navigator.share !== "undefined" && (
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors duration-300 shadow-sm">
                    <Share2 className="w-5 h-5 text-foreground group-hover:text-foreground transition-colors duration-300" />
                  </div>
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

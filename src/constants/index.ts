import {
  Album,
  Calendar,
  Compass,
  FileText,
  Heart,
  House,
  Info,
  MessageCircleMore,
  Play,
  SquarePlus,
  Users,
} from "lucide-react";

import type { NavigationItems } from "@/types";

export const webappUrl = import.meta.env.VITE_WEBAPP_URL;

export const navbarItems: NavigationItems = [
  { to: "/", icon: House, label: "Home" },
  { to: "/about-us", icon: Info, label: "About Us" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/community", icon: Users, label: "Community" },
  { to: "/newsletter", icon: FileText, label: "News" },
];

export const sidebarItems: NavigationItems = [
  { to: "/community", icon: Play, label: "FYP" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/all-users", icon: Users, label: "People" },
  { to: "/liked-posts", icon: Heart, label: "Liked Posts" },
  { to: "/saved-posts", icon: Album, label: "Saved Posts" },
  { to: "/create-post", icon: SquarePlus, label: "Create Post" },
  { to: "/messages", icon: MessageCircleMore, label: "Messages" },
  { to: "/newsletter", icon: FileText, label: "News" },
];

export const images = [
  "/assets/images/home_3.jpg",
  "/assets/images/home_1.jpg",
  "/assets/images/gallery_3.jpg",
  "/assets/images/gallery_4.jpg",
  "/assets/images/gallery_5.jpg",
  "/assets/images/gallery_6.jpg",
  "/assets/images/gallery_7.jpg",
  "/assets/images/gallery_8.jpg",
  "/assets/images/gallery_9.jpg",
  "/assets/images/gallery_10.jpg",
  "/assets/images/gallery_11.jpg",
  "/assets/images/gallery_12.jpg",
  "/assets/images/gallery_13.jpg",
  "/assets/images/home_2.jpg",
  "/assets/images/gallery_15.jpg",
  "/assets/images/gallery_16.jpg",
];

export const allimages = [
  "/assets/images/gallery_1.jpg",
  "/assets/images/gallery_2.jpg",
  "/assets/images/gallery_3.jpg",
  "/assets/images/gallery_4.jpg",
  "/assets/images/gallery_5.jpg",
  "/assets/images/gallery_6.jpg",
  "/assets/images/gallery_7.jpg",
  "/assets/images/gallery_8.jpg",
  "/assets/images/gallery_9.jpg",
  "/assets/images/gallery_10.jpg",
  "/assets/images/gallery_11.jpg",
  "/assets/images/gallery_12.jpg",
  "/assets/images/gallery_13.jpg",
  "/assets/images/gallery_14.jpg",
  "/assets/images/gallery_15.jpg",
  "/assets/images/gallery_16.jpg",
  "/assets/images/home_1.jpg",
  "/assets/images/home_2.jpg",
  "/assets/images/home_3.jpg",
  "/assets/images/home_4.jpg",
  "/assets/images/nano9124.png",
  "/assets/images/nano13924.png",
  "/assets/images/nano51224.png",
];

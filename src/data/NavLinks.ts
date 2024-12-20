import {
  House,
  Compass,
  Star,
  Clock3,
  Download,
  Folder,
  Settings,
  HelpCircle,
} from "lucide-react";

const NavLinks = [
  {
    text: "Home",
    href: "/home",
    icon: House,
  },
  {
    text: "Discover",
    href: "/discover",
    icon: Compass,
  },
  {
    text: "Trending",
    href: "/trending",
    icon: Star,
  },
  {
    text: "Recent",
    href: "/recent",
    icon: Clock3,
  },
  {
    text: "Download",
    href: "/download",
    icon: Download,
  },
  {
    text: "Collection",
    href: "/collection",
    icon: Folder,
  },
  {
    text: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    text: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

export default NavLinks;

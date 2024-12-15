"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import {
  Home,
  Store,
  Users,
  Settings,
  LogOut,
  Menu,
  Heart,
  ShoppingBag,
  FileText,
  Users2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  Package,
  MessageSquare,
  Bell,
  Wallet,
  History,
  Tag,
  ShoppingCart,
  Bookmark,
  UserCircle,
  Flag,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Marketplace",
    icon: Store,
    href: "/market-place",
    submenu: [
      {
        title: "Browse Products",
        icon: ShoppingCart,
        href: "/market-place/browse",
      },
      {
        title: "My Orders",
        icon: ShoppingBag,
        href: "/market-place/orders",
      },
      {
        title: "My Favorites",
        icon: Heart,
        href: "/market-place/favorites",
      },
      {
        title: "Selling",
        icon: Tag,
        href: "/market-place/selling",
        submenu: [
          {
            title: "My Products",
            icon: Package,
            href: "/market-place/selling/products",
          },
          {
            title: "Sales History",
            icon: History,
            href: "/market-place/selling/history",
          },
        ],
      },
      {
        title: "Wallet",
        icon: Wallet,
        href: "/market-place/wallet",
      },
      {
        title: "Analytics",
        icon: TrendingUp,
        href: "/market-place/analytics",
      },
    ],
  },
  {
    title: "Community",
    icon: Users,
    href: "/community",
    submenu: [
      {
        title: "Feed",
        icon: FileText,
        href: "/community/feed",
      },
      {
        title: "My Posts",
        icon: MessageSquare,
        href: "/community/posts",
      },
      {
        title: "My Communities",
        icon: Users2,
        href: "/community/my-communities",
      },
      {
        title: "Saved Posts",
        icon: Bookmark,
        href: "/community/saved",
      },
      {
        title: "Notifications",
        icon: Bell,
        href: "/community/notifications",
      },
      {
        title: "Profile",
        icon: UserCircle,
        href: "/community/profile",
      },
    ],
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
];

const footerItems = [
   {
     title: "Help Center",
     icon: HelpCircle,
     href: "/help",
   },
   {
     title: "Report Issue",
     icon: Flag,
     href: "/report",
   },
   {
     title: "Settings",
     icon: Settings,
     href: "/settings",
   },
   {
     title: "Logout",
     icon: LogOut,
     href: "/auth",
   },
 ];
 

export const SideBar = () => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (title: string) => {
    setExpandedMenus((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  };

  const MenuItem = ({
    item,
    level = 0,
  }: {
    item: MenuItem;
    level?: number;
  }) => {
    const isExpanded = expandedMenus.includes(item.title);
    const isActive = pathname === item.href;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-secondary text-secondary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {hasSubmenu ? (
            <button
              onClick={() => toggleSubmenu(item.title)}
              className="items-center gap-3 flex flex-1"
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-start">{item.title}</span>
              <span className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            </button>
          ) : (
            <Link href={item.href} className="flex flex-1 items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )}
        </div>

        {hasSubmenu && isExpanded && (
          <div className="ml-2">
            {item.submenu?.map((subItem) => (
              <MenuItem
                key={subItem.title}
                item={subItem}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        "h-screen overflow-y-auto flex flex-col w-full bg-background",
        "transition-width duration-200 ease-in-out"
      )}
    >
      <div className="flex flex-col gap-1 p-2">
         <div className="flex items-center gap-1">
            <Image src="/logo.svg" alt="RMUTT Marketplace" width={24} height={24} />
            <h1 className="text-base font-semibold">RMUTT Marketplace</h1>
         </div>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <MenuItem key={item.title} item={item} />
          ))}
        </nav>
      </div>
      <div className="border-t p-2">
        <nav className="flex flex-col gap-2">
          {footerItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

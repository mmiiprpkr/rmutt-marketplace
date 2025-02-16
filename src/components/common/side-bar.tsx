"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
   Store,
   Users,
   Settings,
   LogOut,
   Heart,
   ShoppingBag,
   Users2,
   TrendingUp,
   Package,
   MessageSquare,
   Bell,
   History,
   Tag,
   ShoppingCart,
   Bookmark,
   UserCircle,
   UsersIcon,
} from "lucide-react";

import { SideBarMenuItem } from "./side-bar-menu-item";
import { useSideBarStore } from "@/stores/use-side-bar";

interface MenuItem {
   title: string;
   icon: any;
   href: string;
   submenu?: MenuItem[];
}

const menuItemsDefault: MenuItem[] = [
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
                  title: "Order",
                  icon: ShoppingBag,
                  href: "/market-place/selling/orders",
               },
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
      ],
   },
   {
      title: "Community",
      icon: Users,
      href: "/community",
      submenu: [
         {
            title: "My Communities",
            icon: Users2,
            href: "/community/my-communities",
         },
         {
            title: "Communities",
            icon: UsersIcon,
            href: "/community/communities",
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

type SideBarProps = {
   defaultExpandedMenus?: string[];
   menuItems?: MenuItem[];
};

export const SideBar = ({
   defaultExpandedMenus = [],
   menuItems = menuItemsDefault,
}: SideBarProps) => {
   const { onClose } = useSideBarStore();
   const [expandedMenus, setExpandedMenus] = useState<string[]>([
      "Marketplace",
      "Community",
   ]);

   const toggleSubmenu = (title: string) => {
      setExpandedMenus((current) =>
         current.includes(title)
            ? current.filter((item) => item !== title)
            : [...current, title],
      );
   };

   return (
      <div
         className={cn(
            "h-screen overflow-y-auto flex flex-col w-full bg-background",
            "transition-width duration-200 ease-in-out",
         )}
      >
         <Link
            onClick={() => onClose(false)}
            href="/"
            className="flex flex-col gap-1 p-2 hover:opacity-80"
         >
            <div className="flex items-center gap-1">
               <Image
                  src="/logo.svg"
                  alt="RMUTT Marketplace"
                  width={24}
                  height={24}
               />
               <h1 className="text-base font-semibold">RMUTT Marketplace</h1>
            </div>
         </Link>
         <div className="flex-1 overflow-auto">
            <nav className="flex flex-col gap-2 p-2">
               {menuItems?.map((item) => (
                  <SideBarMenuItem
                     key={item.title}
                     item={item}
                     expandedMenus={expandedMenus}
                     toggleSubmenu={toggleSubmenu}
                  />
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
                     onClick={() => onClose(false)}
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

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
import { useConfirm } from "@/hooks/use-confirm";
import { useAuthActions } from "@convex-dev/auth/react";

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
      href: "/marketplace",
      submenu: [
         {
            title: "Browse Products",
            icon: ShoppingCart,
            href: "/market-place/browse",
         },
         {
            title: "Favorite Items",
            icon: Heart,
            href: "/market-place/favorites",
         },
      ],
   },
   {
      title: "My Purchases",
      icon: ShoppingBag,
      href: "/buyer",
      submenu: [
         {
            title: "My Orders",
            icon: ShoppingBag,
            href: "/market-place/orders",
         },
         // {
         //    title: "Purchase History",
         //    icon: History,
         //    href: "/market-place/history",
         // },
      ],
   },
   {
      title: "My Shop",
      icon: Tag,
      href: "/selling",
      submenu: [
         {
            title: "Received Orders",
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
            title: "Explore Communities",
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
      title: "Logout",
      icon: LogOut,
   },
];

type SideBarProps = {
   defaultExpandedMenus?: string[];
   menuItems?: MenuItem[];
};

const getAllMenuTitles = (items: MenuItem[]): string[] => {
   return items.reduce((titles: string[], item) => {
      titles.push(item.title);
      if (item.submenu) {
         titles.push(...getAllMenuTitles(item.submenu));
      }
      return titles;
   }, []);
};

export const SideBar = ({
   defaultExpandedMenus = getAllMenuTitles(menuItemsDefault),
   menuItems = menuItemsDefault,
}: SideBarProps) => {
   const { onClose } = useSideBarStore();
   const [expandedMenus, setExpandedMenus] =
      useState<string[]>(defaultExpandedMenus);

   const { signOut } = useAuthActions();

   const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure you want to logout?",
      "Logout",
      "destructive",
   );

   const toggleSubmenu = (title: string) => {
      setExpandedMenus((current) =>
         current.includes(title)
            ? current.filter((item) => item !== title)
            : [...current, title],
      );
   };

   const handleLogoutConfirm = async () => {
      try {
         const ok = await confirm();

         if (!ok) return;

         await signOut();
      } catch (error) {
         console.log("[ConfirmationDialog]", error);
      }
   };

   return (
      <>
         <ConfirmationDialog />

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
                     <div
                        key={item.title}
                        className={cn(
                           "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground hover:cursor-pointer",
                        )}
                        onClick={handleLogoutConfirm}
                     >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                     </div>
                  ))}
               </nav>
            </div>
         </div>
      </>
   );
};

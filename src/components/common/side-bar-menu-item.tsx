import { cn } from "@/lib/utils";
import { useSideBarStore } from "@/stores/use-side-bar";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
   title: string;
   icon: any;
   href: string;
   submenu?: MenuItem[];
}

interface MenuItemProps {
   item: MenuItem;
   level?: number;
   expandedMenus: string[];
   toggleSubmenu: (title: string) => void;
}

export const SideBarMenuItem = ({
   item,
   level = 0,
   expandedMenus,
   toggleSubmenu,
}: MenuItemProps) => {
   const { onClose } = useSideBarStore();
   const pathname = usePathname();
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
                  : "hover:bg-accent hover:text-accent-foreground",
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
               <Link
                  href={item.href}
                  className="flex flex-1 items-center gap-3"
                  onClick={() => onClose(false)}
               >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
               </Link>
            )}
         </div>

         {hasSubmenu && isExpanded && (
            <div className="ml-4">
               {item.submenu?.map((subItem) => (
                  <SideBarMenuItem
                     key={subItem.title}
                     item={subItem}
                     level={level + 1}
                     expandedMenus={expandedMenus}
                     toggleSubmenu={toggleSubmenu}
                  />
               ))}
            </div>
         )}
      </>
   );
};

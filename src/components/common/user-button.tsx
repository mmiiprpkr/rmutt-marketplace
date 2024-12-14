"use client";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { UserAvatar } from "@/components/common/user-avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const UserButton = () => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const { signOut } = useAuthActions();

   const handleRedirect = (path: string) => {
      router.push(path);
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <UserAvatar />
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            <DropdownMenuItem
               onClick={() => handleRedirect("/profile")}
               disabled={isPending}
            >
          Profile
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={() => handleRedirect("/settings")}
               disabled={isPending}
            >
          Settings
            </DropdownMenuItem>
            <DropdownMenuItem
               onClick={() =>
                  startTransition(() => {
                     signOut();
                  })
               }
               disabled={isPending}
            >
          Sign out
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
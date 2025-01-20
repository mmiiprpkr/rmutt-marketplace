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

type UserButtonProps = {
   imageUrl: string;
   type: "profile" | "settings";
}

export const UserButton = ({
   imageUrl,
   type,
}: UserButtonProps) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const { signOut } = useAuthActions();

   const handleRedirect = (path: string) => {
      router.push(path);
   };

   console.log("User Avatar", imageUrl);

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <UserAvatar imageUrl={imageUrl} />
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            {type === "settings" && (
               <>
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
               </>
            )}

            {type === "profile" && (
               <>
                  <DropdownMenuItem
                     onClick={() => handleRedirect("/chat")}
                     disabled={isPending}
                  >
                     Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => handleRedirect("/profile")}
                     disabled={isPending}
                  >
                     Profile
                  </DropdownMenuItem>
               </>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

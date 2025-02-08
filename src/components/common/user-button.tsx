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
import { Id } from "../../../convex/_generated/dataModel";
import { useConversations } from "@/api/messages/create-conversations";

type UserButtonProps = {
   imageUrl: string;
   type: "profile" | "settings";
   userId1?: Id<"users">;
   userId2?: Id<"users">;
};

export const UserButton = ({
   imageUrl,
   type,
   userId1,
   userId2,
}: UserButtonProps) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const { signOut } = useAuthActions();
   const { mutateAsync, isPending: conversationPending } = useConversations();

   const handleRedirect = (path: string) => {
      router.push(path);
   };

   const handleConversations = async () => {
      if (!userId1 || !userId2) return;

      const conversationId = await mutateAsync({
         userId1: userId1,
         userId2: userId2,
      });

      if (!conversationId) return;

      return router.push(`/messages/${conversationId}`);
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
                     onClick={handleConversations}
                     disabled={conversationPending || isPending}
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

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
import { useConfirm } from "@/hooks/use-confirm";

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
   const { signOut } = useAuthActions();
   const { mutateAsync, isPending: conversationPending } = useConversations();

   const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure you want to sign out?",
      "You will be redirected to the sign-in page.",
      "destructive",
   );

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

   const handleLogoutConfirm = async () => {
      try {
         const ok = await confirm();

         if (!ok) return;

         await signOut();
      } catch (error) {
         console.log("[ConfirmationDialog]", error);
      }
   }

   return (
      <>
         <ConfirmationDialog />

         <DropdownMenu>
            <DropdownMenuTrigger>
               <UserAvatar imageUrl={imageUrl} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               {type === "settings" && (
                  <>
                     <DropdownMenuItem
                        onClick={() => handleRedirect("/community/profile")}
                     >
                        Profile
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={handleLogoutConfirm}
                     >
                        Sign out
                     </DropdownMenuItem>
                  </>
               )}

               {type === "profile" && (
                  <>
                     <DropdownMenuItem
                        onClick={handleConversations}
                        disabled={conversationPending}
                     >
                        Chat
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => handleRedirect("/profile")}
                     >
                        Profile
                     </DropdownMenuItem>
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

"use client";

import { useCreateMessage } from "@/api/messages/create-message";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useGetCurrentUser } from "@/api/get-current-user";
import { useState } from "react";
import { useGetMessage } from "@/api/messages/get-message";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/common/user-button";

type ConversationsIdPageProps = {
   params: {
      conversationId: string;
   };
};

const ConversationsIdPage = ({ params }: ConversationsIdPageProps) => {
   const [message, setMessage] = useState("");

   const { data: userData, isLoading: dataLoading } = useGetCurrentUser();
   const { data: messages, isLoading: messageLoading } = useGetMessage({
      conversationId: params.conversationId as Id<"conversations">,
   });
   const { mutateAsync: createMessageAsync, isPending: createMessagePending } =
      useCreateMessage();

   if (dataLoading || messageLoading) {
      return <div>Loading...</div>;
   }

   const handleSendMessage = async () => {
      if (!message) return;

      await createMessageAsync({
         conversationId: params.conversationId as Id<"conversations">,
         content: message,
         senderId: userData?._id as Id<"users">,
      });

      setMessage(""); // Clear input after sending message
   };

   return (
      <div className="h-[calc(100vh-60px)] max-w-7xl w-full mx-auto p-4 flex flex-col">
         <div className="flex-grow overflow-y-auto flex flex-col w-full space-y-3">
            {messages?.map((message, i) => {
               const isCurrentUser = userData?._id === message?.senderId;
               return (
                  <div
                     className={cn(
                        "flex gap-2 items-start",
                        isCurrentUser ? "justify-end" : "justify-start",
                     )}
                     key={i}
                  >
                     {userData?._id !== message?.senderId && (
                        <UserButton
                           imageUrl={message?.sender?.image ?? ""}
                           userId1={userData?._id}
                           userId2={message?.sender?._id}
                           type="profile"
                        />
                     )}
                     <div
                        className={cn(
                           "rounded-lg p-2 max-w-xs",
                           isCurrentUser
                              ? "bg-foreground text-white dark:text-black"
                              : "bg-primary-foreground text-foreground",
                        )}
                     >
                        {message?.content}
                     </div>
                  </div>
               );
            })}
         </div>

         <div className="flex space-x-4 py-2 bg-background border-t border-secondary">
            <Input
               type="text"
               placeholder="Type a message"
               disabled={createMessagePending}
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     handleSendMessage();
                  }
               }}
            />

            <Button disabled={createMessagePending} onClick={handleSendMessage}>
               Send
            </Button>
         </div>
      </div>
   );
};

export default ConversationsIdPage;

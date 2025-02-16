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
import { useGetOrderByConversations } from "@/api/market-place/order/use-get-order-by-conversations";
import { ConversationOrderProductDialog } from "./conversation-order-product";
import { useQueryState } from "nuqs";
import { ImageUpIcon, MessageSquareDiff, Package2Icon } from "lucide-react";
import { MessageCard } from "@/components/features/community/message-card";

type ConversationsIdPageProps = {
   params: {
      conversationId: string;
   };
};

const ConversationsIdPage = ({ params }: ConversationsIdPageProps) => {
   const [message, setMessage] = useState("");
   const [, setIsOpen] = useQueryState("order");

   const { data: userData, isLoading: dataLoading } = useGetCurrentUser();
   const { data: messages, isLoading: messageLoading } = useGetMessage({
      conversationId: params.conversationId as Id<"conversations">,
   });
   const { mutateAsync: createMessageAsync, isPending: createMessagePending } =
      useCreateMessage();
   const { data: orderData, isLoading: orderLoading } =
      useGetOrderByConversations({
         conversationId: params.conversationId as Id<"conversations">,
      });

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

   console.log({
      messages,
   });

   return (
      <div className="h-[calc(100vh-60px)] max-w-7xl w-full mx-auto p-4 flex flex-col relative">
         <ConversationOrderProductDialog order={orderData} />

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
                     <MessageCard isCurrentUser={isCurrentUser} message={message} />
                  </div>
               );
            })}
         </div>

         <div className="flex flex-col w-full border-t border-secondary">
            <div className="flex items-center space-x-5">
               {orderLoading ? (
                  <Package2Icon className="w-6 h-6" />
               ) : (
                  orderData?.[0]?.sellerId === userData?._id && (
                     <div
                        className="relative p-2 cursor-pointer hover:opacity-75 w-fit"
                        onClick={() => setIsOpen("true")}
                     >
                        <Package2Icon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1">
                           {orderData?.length}
                        </span>
                     </div>
                  )
               )}

               <ImageUpIcon className="w-6 h-6" />
            </div>
            <div className="flex space-x-4 py-2 bg-background">
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

               <Button
                  disabled={createMessagePending}
                  onClick={handleSendMessage}
               >
                  Send
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ConversationsIdPage;

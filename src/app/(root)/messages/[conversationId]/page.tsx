/* eslint-disable @next/next/no-img-element */
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
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "sonner";

type ConversationsIdPageProps = {
   params: {
      conversationId: string;
   };
};

const ConversationsIdPage = ({ params }: ConversationsIdPageProps) => {
   const [message, setMessage] = useState("");
   const [file, setFile] = useState<File | null>(null);
   const [, setIsOpen] = useQueryState("order");
   const [isLoading, setIsLoading] = useState(false);

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

   const handleFileUpload = async (file: File) => {
      try {
         const res = await uploadFiles("imageUploader", {
            files: [file],
         });

         if (!res?.[0]?.url) {
            toast.error("Failed to upload image");
            throw new Error("Failed to upload image");
         }

         return res[0].url;
      } catch (error) {
         console.error("Error uploading file:", error);
         toast.error("Failed to upload image. Please try again.");
         throw error;
      }
   };

   const handleSendMessage = async () => {
      try {
         setIsLoading(true);
         if (!message && !file) {
            toast.error("Please enter a message or select an image");
            return;
         }
         if (!userData?._id) {
            toast.error("You must be logged in to send messages");
            throw new Error("User not authenticated");
         }

         const messageData = {
            conversationId: params.conversationId as Id<"conversations">,
            senderId: userData._id,
            content: message,
         };

         if (file) {
            const imageUrl = await handleFileUpload(file);
            await createMessageAsync({ ...messageData, image: imageUrl });
            setFile(null);
            toast.success("Message with image sent successfully");
         } else {
            await createMessageAsync(messageData);
            toast.success("Message sent successfully");
         }

         setMessage("");
      } catch (error) {
         setIsLoading(false);
         console.error("Error sending message:", error);
         toast.error("Failed to send message. Please try again.");
      } finally {
         setIsLoading(false)
      }
   };

   const handleClickImage = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = false;

      fileInput.onchange = (e: Event) => {
         const target = e.target as HTMLInputElement;
         const selectedFile = target.files?.[0];

         if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
               toast.error("File size should be less than 5MB");
               return;
            }

            if (!selectedFile.type.startsWith("image/")) {
               toast.error("Please select an image file");
               return;
            }

            setFile(selectedFile);
         }
      };

      fileInput.click();
   };

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
                     <MessageCard
                        isCurrentUser={isCurrentUser}
                        message={message}
                     />
                  </div>
               );
            })}
         </div>

         <div className="flex flex-col w-full border-t border-secondary py-2">
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

               <ImageUpIcon className="w-6 h-6" onClick={handleClickImage} />

               {file && (
                  <div className="flex items-center space-x-2 relative">
                     <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded file preview"
                        className="size-36 object-cover"
                     />
                     <button
                        className="absolute top-2 right-2"
                        onClick={() => setFile(null)}
                     >
                        X
                     </button>
                  </div>
               )}
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
                  disabled={createMessagePending || isLoading}
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

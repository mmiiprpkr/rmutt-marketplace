/* eslint-disable @next/next/no-img-element */
"use client";

import { useCreateMessage } from "@/api/messages/create-message";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { useGetCurrentUser } from "@/api/get-current-user";
import { useState, useRef, useEffect } from "react";
import { useGetMessage } from "@/api/messages/get-message";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/common/user-button";
import { useGetOrderByConversations } from "@/api/market-place/order/use-get-order-by-conversations";
import { ConversationOrderProductDialog } from "./conversation-order-product";
import { useQueryState } from "nuqs";
import {
   ImageUpIcon,
   MessageSquareDiff,
   Package2Icon,
   Paperclip,
   Smile,
} from "lucide-react";
import { MessageCard } from "@/components/features/community/message-card";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
   const messagesEndRef = useRef<HTMLDivElement>(null);

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

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   if (dataLoading || messageLoading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
         </div>
      );
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
         setIsLoading(false);
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
      <div className="h-[calc(100vh-60px)] max-w-7xl w-full mx-auto flex flex-col relative bg-gradient-to-br from-background via-background/95 to-background/90">
         <ConversationOrderProductDialog order={orderData} />

         {/* Messages Container */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 transition-colors duration-200">
            <div className="max-w-4xl mx-auto w-full space-y-6">
               <AnimatePresence initial={false}>
                  {messages?.map((message, i) => {
                     const isCurrentUser = userData?._id === message?.senderId;
                     const isFirstMessage =
                        i === 0 ||
                        messages[i - 1]?.senderId !== message.senderId;

                     return (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           transition={{ duration: 0.3 }}
                           className={cn(
                              "flex gap-3 items-start group",
                              isCurrentUser ? "justify-end" : "justify-start",
                              "px-2 md:px-0",
                           )}
                        >
                           {!isCurrentUser && isFirstMessage && (
                              <div className="flex-shrink-0">
                                 <UserButton
                                    imageUrl={message?.sender?.image ?? ""}
                                    userId1={userData?._id}
                                    userId2={message?.sender?._id}
                                    type="profile"
                                 />
                              </div>
                           )}
                           <div
                              className={cn(
                                 "max-w-[85%] md:max-w-[70%]",
                                 !isCurrentUser && !isFirstMessage && "ml-10",
                              )}
                           >
                              <MessageCard
                                 isCurrentUser={isCurrentUser}
                                 message={message}
                              />
                           </div>
                        </motion.div>
                     );
                  })}
               </AnimatePresence>
               <div ref={messagesEndRef} />
            </div>
         </div>

         {/* Input Container */}
         <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
            <div className="max-w-4xl mx-auto w-full p-4">
               <div className="flex items-center gap-4 mb-4">
                  {orderLoading ? (
                     <Package2Icon className="w-6 h-6 text-muted-foreground animate-pulse" />
                  ) : (
                     orderData?.[0]?.sellerId === userData?._id && (
                        <motion.div
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           className="relative p-2 cursor-pointer w-fit"
                           onClick={() => setIsOpen("true")}
                        >
                           <Package2Icon className="w-6 h-6 text-primary" />
                           <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {orderData?.length}
                           </span>
                        </motion.div>
                     )
                  )}

                  <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     className="p-2 hover:bg-accent rounded-full transition-colors duration-300 ease-in-out"
                     onClick={handleClickImage}
                  >
                     <ImageUpIcon className="w-6 h-6 text-primary" />
                  </motion.button>

                  <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     className="p-2 hover:bg-accent rounded-full transition-colors duration-300 ease-in-out"
                  >
                     <Smile className="w-6 h-6 text-primary" />
                  </motion.button>

                  {file && (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative"
                     >
                        <img
                           src={URL.createObjectURL(file) || "/placeholder.svg"}
                           alt="Preview"
                           className="h-20 w-20 object-cover rounded-md shadow-md"
                        />
                        <button
                           className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center hover:opacity-90 transition-opacity duration-300 ease-in-out"
                           onClick={() => setFile(null)}
                        >
                           ×
                        </button>
                     </motion.div>
                  )}
               </div>

               <div className="flex gap-2 items-center">
                  <Input
                     type="text"
                     placeholder="Type a message..."
                     disabled={createMessagePending}
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                           e.preventDefault();
                           handleSendMessage();
                        }
                     }}
                     className="flex-1 bg-background/50 backdrop-blur-sm rounded-full py-6 pl-6 pr-12 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  />
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Button
                        disabled={createMessagePending || isLoading}
                        onClick={handleSendMessage}
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center"
                     >
                        <MessageSquareDiff className="h-6 w-6" />
                     </Button>
                  </motion.div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ConversationsIdPage;

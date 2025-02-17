/* eslint-disable @next/next/no-img-element */
"use client";

import { useCreateMessage } from "@/api/messages/create-message";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { useGetCurrentUser } from "@/api/get-current-user";
import { useState, useRef, useEffect } from "react";
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
import { EmojiPopover } from "@/components/common/emoji-popover";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type ConversationsIdPageProps = {
   params: {
      conversationId: string;
   };
};

const MESSAGES_PER_PAGE = 15;

const ConversationsIdPage = ({ params }: ConversationsIdPageProps) => {
   // State Management
   const [message, setMessage] = useState("");
   const [file, setFile] = useState<File | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingMore, setIsLoadingMore] = useState(false);
   const [, setIsOpen] = useQueryState("order");

   // Refs
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   // Queries and Mutations
   const { data: userData, isLoading: dataLoading } = useGetCurrentUser();
   const {
      results: messages,
      status,
      loadMore,
   } = usePaginatedQuery(
      api.messages.getMessage,
      { conversationId: params.conversationId as Id<"conversations"> },
      { initialNumItems: MESSAGES_PER_PAGE },
   );
   const { mutateAsync: createMessageAsync, isPending: createMessagePending } =
      useCreateMessage();
   const { data: orderData, isLoading: orderLoading } =
      useGetOrderByConversations({
         conversationId: params.conversationId as Id<"conversations">,
      });

   // Message Handlers
   const handleSendMessage = async () => {
      if (!message && !file) {
         toast.error("Please enter a message or select an image");
         return;
      }
      if (!userData?._id) {
         toast.error("You must be logged in to send messages");
         return;
      }

      try {
         setIsLoading(true);
         const messageData = {
            conversationId: params.conversationId as Id<"conversations">,
            senderId: userData._id,
            content: message,
         };

         if (file) {
            const imageUrl = await handleFileUpload(file);
            await createMessageAsync({ ...messageData, image: imageUrl });
            setFile(null);
         } else {
            await createMessageAsync(messageData);
         }

         setMessage("");

         // Scroll to bottom after sending message
         requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
         });

         // Focus input after sending
         setTimeout(() => {
            inputRef.current?.focus();
         }, 100);
      } catch (error) {
         console.error("Error sending message:", error);
         toast.error("Failed to send message. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   const handleLoadMore = async () => {
      if (status !== "CanLoadMore" || isLoadingMore) return;

      try {
         setIsLoadingMore(true);
         const container = document.querySelector(".messages-container");
         const oldHeight = container?.scrollHeight || 0;

         await loadMore(10);

         requestAnimationFrame(() => {
            if (container) {
               const newHeight = container.scrollHeight;
               container.scrollTop = newHeight - oldHeight;
            }
         });
      } catch (error) {
         console.error("Error loading more messages:", error);
         toast.error("Failed to load more messages");
      } finally {
         setIsLoadingMore(false);
      }
   };

   // File Handlers
   const handleFileUpload = async (file: File) => {
      const res = await uploadFiles("imageUploader", { files: [file] });
      if (!res?.[0]?.url) throw new Error("Failed to upload image");
      return res[0].url;
   };

   const handleClickImage = () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = false;
      fileInput.onchange = handleFileSelect;
      fileInput.click();
   };

   const handleFileSelect = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0];
      if (!selectedFile) return;

      if (selectedFile.size > 5 * 1024 * 1024) {
         toast.error("File size should be less than 5MB");
         return;
      }

      if (!selectedFile.type.startsWith("image/")) {
         toast.error("Please select an image file");
         return;
      }

      setFile(selectedFile);
   };

   // UI Handlers
   const handleOnEmojiSelect = (emoji: any) => {
      setMessage((prev) => prev + ` ${emoji.native} `);
      inputRef.current?.focus();
   };

   // Loading State
   if (dataLoading || status === "LoadingFirstPage") {
      return <LoadingSpinner />;
   }

   // Sort messages to show newest at bottom
   const sortedMessages = messages ? [...messages].reverse() : [];

   return (
      <div className="h-[calc(100vh-60px)] max-w-7xl w-full mx-auto flex flex-col relative bg-gradient-to-br from-background via-background/95 to-background/90">
         <ConversationOrderProductDialog order={orderData} />

         {/* Messages Container */}
         <div className="messages-container flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 transition-colors duration-200">
            <div className="max-w-4xl mx-auto w-full space-y-6">
               {/* Load More Button - At Top */}
               {status === "CanLoadMore" && (
                  <div className="flex justify-center py-4">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoadMore}
                        className="rounded-full"
                     >
                        Load More Messages
                     </Button>
                  </div>
               )}

               {status === "LoadingMore" && (
                  <div className="flex justify-center py-4">
                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary" />
                  </div>
               )}

               {status === "Exhausted" && (
                  <div className="flex justify-center py-4">
                     <p className="text-sm text-muted-foreground">
                        No more messages
                     </p>
                  </div>
               )}

               <AnimatePresence initial={false}>
                  {sortedMessages.map((message, i) => {
                     const isCurrentUser = userData?._id === message?.senderId;
                     const isFirstMessage =
                        i === sortedMessages.length - 1 ||
                        sortedMessages[i + 1]?.senderId !== message.senderId;

                     return (
                        <motion.div
                           key={message._id}
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

               {/* Scroll to Bottom Target */}
               <div ref={messagesEndRef} />
            </div>
         </div>

         {/* Input Container */}
         <div className="relative border-t border-border">
            {/* Backdrop blur container */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

            {/* Content container */}
            <div className="relative max-w-4xl mx-auto w-full p-4">
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

                  <EmojiPopover onEmojiSelect={handleOnEmojiSelect}>
                     <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-accent rounded-full transition-colors duration-300 ease-in-out"
                     >
                        <Smile className="w-6 h-6 text-primary" />
                     </motion.button>
                  </EmojiPopover>

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
                           X
                        </button>
                     </motion.div>
                  )}
               </div>

               <div className="flex gap-2 items-center">
                  <Input
                     ref={inputRef}
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
                     className="flex-1 bg-background/60 rounded-full py-6 px-6 focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-lg"
                  />
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Button
                        disabled={createMessagePending || isLoading}
                        onClick={handleSendMessage}
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
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

// Helper Components
const LoadingSpinner = () => (
   <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
   </div>
);

export default ConversationsIdPage;

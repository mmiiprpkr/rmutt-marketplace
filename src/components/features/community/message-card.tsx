import type { Doc } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/common/ui/badge";
import { Card } from "@/components/common/ui/card";
import { OrderStatusBadge } from "../market-place/orders/order-status-badge";
import { Download, MoreVertical, Trash2 } from "lucide-react";
import { useDeleteMessage } from "@/api/messages/delete-message";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { motion } from "framer-motion";

type Message = Doc<"messages"> & {
   sender: Doc<"users"> | undefined | null;
   product: Doc<"products"> | undefined | null;
   order: Doc<"orders"> | undefined | null;
};

interface MessageCardProps {
   isCurrentUser: boolean;
   message: Message | undefined;
}

export const MessageCard = ({ isCurrentUser, message }: MessageCardProps) => {
   const isMessage = message?.content;
   const isProduct = message?.product;
   const isOrder = message?.order;
   const isImage = message?.image;

   const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure you want to delete this message?",
      "This action cannot be undone.",
      "destructive",
   );

   const { mutateAsync: deleteMessage, isPending: deleteMessagePending } =
      useDeleteMessage();

   const handleDownload = async (
      content: string | object,
      fileName: string,
   ) => {
      try {
         let blob: Blob;
         if (typeof content === "string" && content.startsWith("http")) {
            // It's an image URL
            const response = await fetch(content);
            blob = await response.blob();
         } else {
            // It's text or object content
            const text =
               typeof content === "string"
                  ? content
                  : JSON.stringify(content, null, 2);
            blob = new Blob([text], { type: "text/plain" });
         }

         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
         toast.success("Download successful");
      } catch (error) {
         console.error("Error downloading content:", error);
         toast.error("Failed to download content");
      }
   };

   const handleDeleteMessage = async () => {
      try {
         const ok = await confirm();

         if (!ok || !message?._id) return;

         await deleteMessage({
            messageId: message._id,
            conversationId: message.conversationId,
         });

         toast.success("Message deleted successfully");
      } catch (error) {
         console.error("Error deleting message:", error);
         toast.error("Failed to delete message");
      }
   };

   return (
      <motion.div
         className="relative group/message"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.3 }}
      >
         <div
            className={cn(
               "flex gap-2 w-fit max-w-full",
               isCurrentUser ? "ml-auto" : "mr-auto",
            )}
         >
            <ConfirmationDialog />

            {!isCurrentUser && message?.sender?.image && (
               <Image
                  src={message.sender.image || "/placeholder.svg"}
                  alt={message.sender.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
               />
            )}

            <div className="space-y-2">
               {/* Text Message */}
               {isMessage && (
                  <div
                     className={cn(
                        "rounded-lg px-4 py-2 w-fit max-w-full shadow-sm",
                        isCurrentUser
                           ? "bg-primary text-primary-foreground"
                           : "bg-muted",
                     )}
                  >
                     <p className="break-words">{message.content}</p>
                  </div>
               )}

               {/* Image Message */}
               {isImage && (
                  <div className="relative w-[200px] md:w-[300px] aspect-video rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                     <Image
                        src={isImage || "/placeholder.svg"}
                        alt="Message attachment"
                        fill
                        className="object-cover"
                     />
                  </div>
               )}

               {/* Product Message */}
               {isProduct && (
                  <Card className="w-[250px] md:w-[300px] flex-shrink-0 overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
                     <div className="relative aspect-video">
                        <Image
                           src={isProduct.image || "/placeholder.svg"}
                           alt={isProduct.name}
                           fill
                           className="object-cover"
                        />
                     </div>
                     <div className="p-3 space-y-2">
                        <h3 className="font-semibold truncate">
                           {isProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                           <Badge variant="secondary" className="text-xs">
                              {isProduct.category}
                           </Badge>
                           <p className="font-semibold text-primary">
                              {formatPrice(isProduct.price)}
                           </p>
                        </div>
                        <Badge
                           variant={
                              isProduct.status === "available"
                                 ? "default"
                                 : "destructive"
                           }
                           className="w-full justify-center text-xs"
                        >
                           {isProduct.status}
                        </Badge>
                     </div>
                  </Card>
               )}

               {/* Order Message */}
               {isOrder && (
                  <Card className="w-[250px] md:w-[300px] flex-shrink-0 shadow-md transition-all duration-300 hover:shadow-lg">
                     <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                           <p className="text-sm text-muted-foreground">
                              Order #{isOrder._id.slice(0, 8)}
                           </p>
                           <OrderStatusBadge status={isOrder.status} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                           <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-medium">
                                 {isOrder.quantity} items
                              </p>
                           </div>
                           <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-medium text-primary">
                                 {formatPrice(isOrder.totalPrice)}
                              </p>
                           </div>
                        </div>
                     </div>
                  </Card>
               )}
            </div>
         </div>

         {/* Context Menu */}
         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="h-8 w-8 rounded-full md:opacity-0 md:group-hover/message:opacity-100 transition-all duration-200"
                  >
                     <MoreVertical className="h-4 w-4" />
                     <span className="sr-only">Open menu</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  {isCurrentUser && (
                     <DropdownMenuItem
                        onClick={handleDeleteMessage}
                        disabled={deleteMessagePending}
                     >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                     </DropdownMenuItem>
                  )}
                  {/* {isMessage && (
                     <DropdownMenuItem
                        onClick={() =>
                           handleDownload(message.content, "message.txt")
                        }
                     >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                     </DropdownMenuItem>
                  )} */}
                  {isImage && (
                     <DropdownMenuItem
                        onClick={() =>
                           handleDownload(isImage, `image-${Date.now()}.jpg`)
                        }
                     >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download Image</span>
                     </DropdownMenuItem>
                  )}
                  {/* {isProduct && (
                     <DropdownMenuItem
                        onClick={() =>
                           handleDownload(isProduct, "product.json")
                        }
                     >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download Product Info</span>
                     </DropdownMenuItem>
                  )}
                  {isOrder && (
                     <DropdownMenuItem
                        onClick={() => handleDownload(isOrder, "order.json")}
                     >
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download Order Info</span>
                     </DropdownMenuItem>
                  )} */}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </motion.div>
   );
};

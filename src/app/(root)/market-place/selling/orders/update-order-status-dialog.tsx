import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/common/ui/select";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useConversations } from "@/api/messages/create-conversations";
import { Button } from "@/components/common/ui/button";
import { ResponsiveModal } from "@/components/common/ui/responsive-modal";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useCreateMessage } from "@/api/messages/create-message";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProductStatus } from "@/api/market-place/product/use-update-status";
import { useUpdateOrderStatus } from "@/api/market-place/order/use-update-order-status";
import { toast } from "sonner";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Loader, X } from "lucide-react";
import { useUploadPayment } from "@/api/market-place/order/use-upload-payment";
import { uploadFiles } from "@/lib/uploadthing";
import { sendNotification } from "@/actions/send-notification";

interface UpdateOrderStatusDialogProps {
   open: boolean;
   onClose: (open: boolean) => void;
   orderId: Id<"orders">;
   userId1: Id<"users">;
   userId2: Id<"users">;
   productId: Id<"products">;
   status: "pending" | "accepted" | "completed" | "cancelled";
   fixedStatus?: "pending" | "accepted" | "completed" | "cancelled";
}

const statusOptions = ["pending", "accepted", "completed", "cancelled"];

const formSchema = z.object({
   message: z.string().optional(),
   status: z.enum(["pending", "accepted", "completed", "cancelled"]),
   paymentUrl: z.string().optional(),
});

export const UpdateOrderStatusDialog = ({
   open,
   onClose,
   orderId,
   userId1,
   userId2,
   status,
   fixedStatus,
}: UpdateOrderStatusDialogProps) => {
   const [imageUploading, setImageUploading] = useState(false);
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         status: fixedStatus ? fixedStatus : status,
         message: "",
         paymentUrl: undefined,
      },
   });

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

   const onDrop = async (acceptedFiles: File[]) => {
      try {
         setImageUploading(true);
         const paymentImg = await handleFileUpload(acceptedFiles[0]);
         form.setValue("paymentUrl", paymentImg);
      } catch (error) {
         setImageUploading(false);
         toast.error("Fail to upload payment image");
      } finally {
         setImageUploading(false);
      }
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
   });

   const { message, status: updateStatus, paymentUrl } = form.watch();
   const isSubmitting = form.formState.isSubmitting;

   const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
   const {
      data,
      isPending,
      mutateAsync: conversationMutate,
   } = useConversations();
   const { mutateAsync: messageMutate, isPending: messagePending } =
      useCreateMessage();

   const handleUpdateOrderStatus = async (data: z.infer<typeof formSchema>) => {
      try {
         const conversation = await conversationMutate({
            userId1: userId1,
            userId2: userId2,
         });

         await messageMutate({
            conversationId: conversation,
            senderId: userId1,
            content: message || "",
            orderId: orderId,
         });

         await updateOrderStatus({
            orderId: orderId,
            status: data.status,
            paymentImg: data.paymentUrl,
         });

         onClose(false);

         await sendNotification({
            senderId: userId1,
            recieverId: userId2,
            title: "Order Status Updated",
            message: `Your order status has been updated to ${data.status}`,
            link: `/market-place/orders`,
         });
         toast.success("Order status updated successfully");
      } catch (error) {
         console.error("Error updating order status:", error);
         toast.error("Failed to update order status");
      }
   };

   return (
      <ResponsiveModal onOpenChange={onClose} open={open}>
         <form
            onSubmit={form.handleSubmit(handleUpdateOrderStatus)}
            className="flex flex-col gap-y-3 min-h-[200px] p-4"
         >
            <h2 className="text-lg font-semibold">Update Order Status</h2>
            <Select
               value={updateStatus}
               onValueChange={(
                  value: "pending" | "accepted" | "completed" | "cancelled",
               ) => {
                  form.setValue("status", value);
               }}
               disabled={isSubmitting}
            >
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Order Status" />
               </SelectTrigger>
               <SelectContent>
                  {statusOptions
                     .filter((status) =>
                        fixedStatus ? status === fixedStatus : true,
                     )
                     .map((st) => {
                        return (
                           <SelectItem key={st} value={st}>
                              {st}
                           </SelectItem>
                        );
                     })}
               </SelectContent>
            </Select>

            <TextareaAutosize
               value={message}
               onChange={(e) => form.setValue("message", e.target.value)}
               minRows={3} // จำนวนแถวขั้นต่ำ
               maxRows={10} // จำนวนแถวสูงสุด
               placeholder="Message"
               style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
               }}
               className={cn(
                  "resize-none outline-none border border-input rounded-md",
                  false && "border-destructive focus:outline-destructive",
               )}
               disabled={isSubmitting}
            />

            {updateStatus === "completed" && (
               <>
                  {!paymentUrl && (
                     <div
                        {...getRootProps()}
                        className={cn(
                           "border-2 border-dashed p-6 text-center rounded-lg transition-colors duration-300",
                           isDragActive
                              ? "border-primary bg-primary/10 dark:border-primary dark:bg-primary/30"
                              : "border-border bg-secondary/20 dark:border-border dark:bg-secondary/30",
                        )}
                     >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                           <p className="text-primary dark:text-primary-foreground">
                              Drop the payment here ...
                           </p>
                        ) : (
                           <div className="flex flex-col items-center justify-center gap-2">
                              <p className="text-muted-foreground">
                                 Drag n drop an image here, or click to select
                                 one
                              </p>
                              <Button type="button" variant="outline">
                                 Select Image <ImageIcon className="w-4 h-4" />
                              </Button>

                              {imageUploading && (
                                 <Loader className="animate-spin size-5" />
                              )}
                           </div>
                        )}
                     </div>
                  )}
                  {!!paymentUrl && (
                     <div className="relative inline-block w-[300px] h-[200px]">
                        <Image
                           src={paymentUrl}
                           alt="Preview"
                           fill
                           className="rounded-lg object-cover"
                        />
                        <Button
                           size="icon"
                           variant="secondary"
                           className="absolute top-2 right-2"
                           onClick={() => {
                              form.setValue("paymentUrl", undefined);
                           }}
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  )}
               </>
            )}

            <div className="flex flex-col-reverse md:flex-row gap-2 md:justify-end">
               <Button
                  variant="outline"
                  onClick={() => onClose(false)}
                  type="button"
                  disabled={isSubmitting}
               >
                  Cancel
               </Button>
               <Button type="submit" disabled={isSubmitting}>
                  Update
               </Button>
            </div>
         </form>
      </ResponsiveModal>
   );
};

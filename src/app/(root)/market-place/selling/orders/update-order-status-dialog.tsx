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

interface UpdateOrderStatusDialogProps {
   open: boolean;
   onClose: (open: boolean) => void;
   orderId: Id<"orders">;
   userId1: Id<"users">;
   userId2: Id<"users">;
   productId: Id<"products">;
   status: "pending" | "accepted" | "completed" | "cancelled";
}

const statusOptions = ["pending", "accepted", "completed", "cancelled"];

const formSchema = z.object({
   message: z.string().optional(),
   status: z.enum(["pending", "accepted", "completed", "cancelled"]),
});

export const UpdateOrderStatusDialog = ({
   open,
   onClose,
   orderId,
   userId1,
   userId2,
   status,
   productId,
}: UpdateOrderStatusDialogProps) => {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         status,
         message: "",
      },
   });

   const { message, status: updateStatus } = form.watch();
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
         });

         onClose(false);
         toast.success("Order status updated successfully");
      } catch (error) {
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
                  {statusOptions.map((st) => {
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

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";

import {
   createCommunitySchema,
   CreateCommunitySchema,
} from "@/validations/create-community.validation";

import { ResponsiveDynamic } from "@/components/common/ui/responsive-dynamic";
import useIsKeyboardOpen from "@/hooks/use-keyboard";
import { ImageIcon, X } from "lucide-react";
import { Input } from "@/components/common/ui/input";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/common/ui/button";
import Image from "next/image";
import { useUploadFile } from "@/hooks/upload-file";
import { useCreateCommunity } from "@/api/communities/create-community";
import { toast } from "sonner";
import { useCreateCommunityStore } from "@/stores/use-create-community";

export const CreateCommunity = () => {
   const { isOpen, setIsOpen } = useCreateCommunityStore();
   const [image, setImage] = useState<File | null>(null);
   const isKeyboardOpen = useIsKeyboardOpen();

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
      reset,
   } = useForm<CreateCommunitySchema>({
      resolver: zodResolver(createCommunitySchema),
   });

   const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

   const { mutateAsync: createCommunity, isPending: isCreatingCommunity } =
    useCreateCommunity();

   const onDrop = (acceptedFiles: File[]) => {
      setImage(acceptedFiles[0]);
      setValue("image", URL.createObjectURL(acceptedFiles[0]));
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
   });

   const onSubmit = async (data: CreateCommunitySchema) => {
      try {
         const reformattedData = {
            ...data,
            image: null,
         };

         const url = await uploadFile({});

         if (!url) {
            throw new Error("Failed to upload image");
         }

         const result = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": image?.type || "" },
            body: image,
         });

         if (!result.ok) {
            throw new Error("Failed to upload image");
         }

         const { storageId } = await result.json();

         reformattedData.image = storageId;

         await createCommunity(
            {
               ...reformattedData,
               image: storageId,
            },
            {
               onSuccess(data, variables, context) {
                  toast.success("Community created successfully");
                  setImage(null);
                  reset();
                  setIsOpen(false);
               },
               onError(error, variables, context) {
                  toast.error("Failed to create community");
               },
            }
         );
      } catch (error) {
         console.log("[CreateCommunity] Error creating community", error);
         toast.error("Failed to create community");
      }
   };

   return (
      <ResponsiveDynamic
         open={isOpen}
         onOpenChange={setIsOpen}
         type={{
            desktop: "dialog",
            mobile: "drawer",
         }}
         drawer={{
            className: `${isKeyboardOpen && "top-3"}`,
         }}
      >
         <div className="overflow-y-auto h-[85vh] md:h-fit space-y-4 p-4 flex flex-col">
            <h3 className="text-lg font-semibold">Create Community</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
               <Input
                  placeholder="Name"
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={isCreatingCommunity || isUploading}
               />
               <TextareaAutosize
                  className={cn(
                     "w-full focus:outline-primary resize-none border border-input rounded-md p-2",
                     errors.description && "border-destructive"
                  )}
                  minRows={3}
                  placeholder="Description"
                  onChange={(e) => {
                     setValue("description", e.target.value, { shouldValidate: true });
                  }}
                  disabled={isCreatingCommunity || isUploading}
               />
               {errors.description && (
                  <p className="text-destructive text-sm">
                     {errors.description.message}
                  </p>
               )}
               {!image && (
                  <div
                     {...getRootProps()}
                     className={cn(
                        "border-2 border-dashed p-6 text-center rounded-lg transition-colors duration-300",
                        isDragActive
                           ? "border-primary bg-primary/10 dark:border-primary dark:bg-primary/30"
                           : "border-border bg-secondary/20 dark:border-border dark:bg-secondary/30",
                        errors.image && !image && "border-destructive"
                     )}
                  >
                     <input {...getInputProps()} />
                     {isDragActive ? (
                        <p className="text-primary dark:text-primary-foreground">
                  Drop the files here ...
                        </p>
                     ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                           <p className="text-muted-foreground">
                    Drag n drop an image here, or click to select one
                           </p>
                           <Button type="button" variant="outline">
                    Select Image <ImageIcon className="w-4 h-4" />
                           </Button>
                        </div>
                     )}
                  </div>
               )}
               {!!image && (
                  <div className="relative inline-block w-[300px] h-[200px]">
                     <Image
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        fill
                        className="rounded-lg object-cover"
                     />
                     <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => {
                           setImage(null);
                           setValue("image", "", { shouldValidate: true });
                        }}
                        disabled={isCreatingCommunity || isUploading}
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  </div>
               )}
               <div className="flex justify-end">
                  <Button
                     type="submit"
                     disabled={isCreatingCommunity || isUploading}
                  >
              Create Community
                  </Button>
               </div>
            </form>
         </div>
      </ResponsiveDynamic>
   );
};

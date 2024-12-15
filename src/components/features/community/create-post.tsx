"use client";

import { useState } from "react";
import Image from "next/image";

import { GiftIcon, ImageIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import {
   CreatePostValidation,
   createPostValidation
} from "@/validations/create-post.validation";

import { Button } from "@/components/common/ui/button";
import { useUploadFile } from "@/hooks/upload-file";
import { useCreatePost } from "@/api/communities/create-post";

import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useCreatePostStore } from "@/stores/use-create-post-store";
import { ResponsiveDynamic } from "@/components/common/ui/responsive-dynamic";
import { Gif } from "./gif";
import { cn } from "@/lib/utils";
import useIsKeyboardOpen from "@/hooks/use-keyboard";

enum OptionalFields {
   NONE = "NONE",
   IMAGE = "IMAGE",
   GIFT = "GIFT"
}

type CreatePostArgs = {
   title: string,
   postType: "image" | "gift" | undefined,
   image: Id<"_storage"> | undefined,
   gift: string | undefined,
}

export const CreatePost = () => {
   const { type, isOpen, onClose } = useCreatePostStore();
   const [gifOpen, setGifOpen] = useState(false);
   const [image, setImage] = useState<File | null>(null);
   const [optionalFields, setOptionalFields] = useState<OptionalFields>(OptionalFields.NONE);

   const isKeyboardOpen = useIsKeyboardOpen();

   const form = useForm<CreatePostValidation>({
      resolver: zodResolver(createPostValidation),
      shouldFocusError: true,
   });

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
   } = form;

   const [
      title,
      gift,
   ] = watch(["title", "gift"]);

   const isCreatePostOpen = type === "createPost" && isOpen;

   const {
      mutateAsync: uploadFile,
      isPending: isUploading,
   } = useUploadFile();

   const {
      mutate: createPost,
      isPending: isCreatingPost,
   } = useCreatePost();

   const onDrop = (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      setImage(acceptedFiles[0]);
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
   });

   const handleChangeOptionalFields = (field: OptionalFields) => {
      setOptionalFields(field);
   };

   const handleCreatePost = async (data: CreatePostValidation) => {
      try {
         const args: CreatePostArgs = {
            title: data.title,
            postType: optionalFields === OptionalFields.GIFT
               ? "gift"
               : optionalFields === OptionalFields.IMAGE
                  ? "image"
                  : undefined,
            image: undefined,
            gift: gift,
         };

         if (image) {
            const url = await uploadFile({});

            if (!url) {
               throw new Error("Failed to upload image");
            }

            const result = await fetch(url, {
               method: "POST",
               headers: { "Content-Type": image.type },
               body: image,
            });

            if (!result.ok) {
               throw new Error("Failed to upload image");
            }

            const { storageId } = await result.json();

            args.image = storageId;
         }

         createPost(args);
         onClose(false);
         setImage(null);
         setOptionalFields(OptionalFields.NONE);
         form.reset();
      } catch (error) {
         toast.error("Failed to create post");
         console.error(error);
      }
   };

   return (
      <FormProvider {...form}>
         <Gif
            open={gifOpen}
            onClose={(isOpen) => setGifOpen(isOpen)}
         />
         <ResponsiveDynamic
            open={isCreatePostOpen}
            onOpenChange={onClose}
            type={{
               mobile: "drawer",
               desktop: "dialog",
            }}
            drawer={{
               className: "max-h-[80vh]",
            }}
         >
            <form
               onSubmit={handleSubmit(handleCreatePost)}
               className="overflow-y-auto space-y-4 p-4 h-[80vh]"
            >
               <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                     Create Post
                  </h3>
                  <p className="text-sm text-gray-500">
                     Create a post to share with the community
                  </p>
               </div>
               <div className="flex flex-col gap-4">
                  <TextareaAutosize
                     minRows={3} // จำนวนแถวขั้นต่ำ
                     maxRows={10} // จำนวนแถวสูงสุด
                     placeholder="Type your text here..."
                     value={title}
                     style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "16px",
                     }}
                     className={cn(
                        "resize-none outline-none right-0 border-none shadow-none focus:outline-primary rounded-md focus:outline-1",
                        errors?.title && "border-destructive focus:outline-destructive"
                     )}
                     onChange={(e) => {
                        form.setValue("title", e.target.value, {
                           shouldValidate: true,
                        });
                     }}
                     disabled={isCreatingPost || isUploading}
                  />
                  {errors?.title && (
                     <p className="text-red-500">{errors?.title?.message}</p>
                  )}
                  {optionalFields === OptionalFields.IMAGE && !image && (
                     <div
                        {...getRootProps()}
                        className={`border-2 border-dashed p-6 text-center rounded-lg transition-colors duration-300 ${
                           isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
                        }`}
                     >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                           <p className="text-blue-500">Drop the files here ...</p>
                        ) : (
                           <div className="flex flex-col items-center justify-center gap-2">
                              <p className="text-gray-500">Drag n drop an image here, or click to select one</p>
                              <Button type="button" variant="outline">Select Image <ImageIcon className="w-4 h-4" /></Button>
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
                           onClick={() => setImage(null)}
                           disabled={isCreatingPost || isUploading}
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  )}

                  {optionalFields === OptionalFields.GIFT && gift && (
                     <div className="relative inline-block w-[300px] h-[200px]">
                        <Image
                           src={gift ?? ""}
                           alt="Preview"
                           fill
                           className="rounded-lg object-cover"
                        />
                        <Button
                           size="icon"
                           variant="secondary"
                           className="absolute top-2 right-2"
                           onClick={() => form.setValue("gift", undefined)}
                           disabled={isCreatingPost || isUploading}
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  )}

               </div>
               <div className="flex justify-end items-center">
                  <div className="flex gap-2">
                     <Button
                        onClick={() => handleChangeOptionalFields(OptionalFields.IMAGE)}
                        variant="ghost"
                        disabled={isCreatingPost || isUploading}
                        type="button"
                     >
                        <ImageIcon className="w-4 h-4" />
                     </Button>
                     <Button
                        onClick={() => {
                           handleChangeOptionalFields(OptionalFields.GIFT);
                           setGifOpen(true);
                        }}
                        variant="ghost"
                        disabled={isCreatingPost || isUploading}
                        type="button"
                     >
                        <GiftIcon className="w-4 h-4" />
                     </Button>
                     <Button
                        type="submit"
                        disabled={isCreatingPost || isUploading}
                     >
                        Create
                     </Button>
                  </div>
               </div>
            </form>
         </ResponsiveDynamic>
      </FormProvider>
   );
};

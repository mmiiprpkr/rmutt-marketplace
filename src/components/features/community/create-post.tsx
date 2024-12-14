"use client";

import { useState } from "react";
import Image from "next/image";

import { GiftIcon, ImageIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/common/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from "@/components/common/ui/dialog";
import { Textarea } from "@/components/common/ui/textarea";
import { useUploadFile } from "@/hooks/upload-file";
import { useCreatePost } from "@/api/communities/create-post";

import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useCreatePostStore } from "@/stores/use-create-post-store";
import { ResponsiveDynamic } from "@/components/common/ui/responsive-dynamic";

enum OptionalFields {
   NONE = "NONE",
   IMAGE = "IMAGE",
   GIFT = "GIFT"
}

type CreatePostArgs = {
   title: string,
   postType: "image" | "gift" | undefined,
   image: Id<"_storage"> | undefined,
}

export const CreatePost = () => {
   const { type, isOpen, onClose } = useCreatePostStore();
   const [title, setTitle] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [optionalFields, setOptionalFields] = useState<OptionalFields>(OptionalFields.NONE);

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

   const handleCreatePost = async () => {
      try {
         const args: CreatePostArgs = {
            title,
            postType: optionalFields === OptionalFields.GIFT
               ? "gift"
               : optionalFields === OptionalFields.IMAGE
                  ? "image"
                  : undefined,
            image: undefined,
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
      } catch (error) {
         toast.error("Failed to create post");
         console.error(error);
      }
   };

   return (
      <ResponsiveDynamic
         open={isCreatePostOpen}
         onOpenChange={onClose}
         type={{
            mobile: "drawer",
            desktop: "dialog",
         }}
      >
         <div className="max-h-[500px] space-y-4 p-4">
            <div className="space-y-2">
               <h3 className="text-lg font-semibold">
                  Create Post
               </h3>
               <p className="text-sm text-gray-500">
                  Create a post to share with the community
               </p>
            </div>
            <div className="flex flex-col gap-4">
               <Textarea
                  placeholder="What's on your mind?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="resize-none outline-none right-0 border-none shadow-none"
               />
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
                           <Button variant="outline">Select Image <ImageIcon className="w-4 h-4" /></Button>
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

            </div>
            <div className="flex justify-end items-center">
               <div className="flex gap-2">
                  <Button
                     onClick={() => handleChangeOptionalFields(OptionalFields.IMAGE)}
                     variant="ghost"
                     disabled={isCreatingPost || isUploading}
                  >
                     <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button
                     onClick={() => handleChangeOptionalFields(OptionalFields.GIFT)}
                     variant="ghost"
                     disabled={isCreatingPost || isUploading}
                  >
                     <GiftIcon className="w-4 h-4" />
                  </Button>
                  <Button
                     onClick={handleCreatePost}
                     disabled={isCreatingPost || isUploading}
                  >
                     Create
                  </Button>
               </div>
            </div>
         </div>
      </ResponsiveDynamic>
   );
};

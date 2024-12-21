import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/common/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/common/ui/dialog";
import { Input } from "@/components/common/ui/input";
import { GifFile } from "@/constant/gif";
import { CreatePostValidation } from "@/validations/create-post.validation";

type GifProps = {
   open: boolean;
   onClose: (isOpen: boolean) => void;
};

export const Gif = ({ open, onClose }: GifProps) => {
   const [searchGif, setSearchGif] = useState<string>("");
   const [gifs, setGifs] = useState<any[]>([]);
   const form = useFormContext<CreatePostValidation>();

   const handleSearchGif = async (search: string) => {
      try {
         const apiKey = "XjVJqqCc4zaj9K8hW8ZL2CwYekN8nuJQ";

         const searchEndpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${search}`;

         await fetch(searchEndpoint)
            .then((response) => response.json())
            .then((data) => setGifs(data.data))
            .catch((error) => {
               console.error(error);
               setGifs(GifFile);
            });
      } catch (error) {
         console.error(error);
         setGifs(GifFile);
      }
   };
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader className="flex justify-between">
               <DialogTitle>Search Gif</DialogTitle>
               <Input
                  value={searchGif}
                  onChange={(e) => setSearchGif(e.target.value)}
                  placeholder="Search for a gif"
               />
               <Button onClick={() => handleSearchGif(searchGif)}>
                  Search
               </Button>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[500px]">
               {gifs.map((gif) => (
                  <Image
                     src={gif.images.fixed_width.url}
                     alt={gif.title}
                     width={100}
                     height={100}
                     key={gif.id}
                     className="rounded-md cursor-pointer"
                     onClick={() => {
                        form.setValue("gift", gif.images.original.url);
                        onClose(false);
                     }}
                  />
               ))}
            </div>
         </DialogContent>
      </Dialog>
   );
};

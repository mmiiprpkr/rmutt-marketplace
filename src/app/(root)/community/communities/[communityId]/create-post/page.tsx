"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
   CreatePostValidation,
   createPostValidation,
} from "@/validations/create-post.validation"
import { CreatePostCommunityValidation } from "@/validations/create-post-community"
import TextareaAutosize from "react-textarea-autosize"
import { cn } from "@/lib/utils"
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/common/ui/tabs"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/common/ui/button"
import { ImageIcon, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Input } from "@/components/common/ui/input"
import { GifFile } from "@/constant/gif"
import { uploadFiles } from "@/lib/uploadthing"
import { toast } from "sonner"
import { useCreatePost } from "@/api/communities/create-post"
import { useRouter } from "next/navigation"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import { useCommunityId } from "@/hooks/use-communityId"

type CreatePostArgs = {
   title: string
   image: string | undefined
   gift: string | undefined
   communityId: Id<"communities"> | undefined
}

const CreatePostPage = () => {
   const communityId = useCommunityId();
   const router = useRouter()
   const [image, setImage] = useState<File | null>(null)
   const [gifs, setGifs] = useState<any[]>([])
   const [searchGif, setSearchGif] = useState<string>("")

   const { mutate: createPost, isPending } = useCreatePost()

   const form = useForm<CreatePostCommunityValidation>({
      resolver: zodResolver(createPostValidation),
      defaultValues: {
         title: "",
         communityId: communityId as Id<"communities">,
         gift: undefined,
         image: undefined,
      },
   })

   const { gift } = form.watch()

   const isSubmitting = isPending || form.formState.isSubmitting

   const onDrop = (acceptedFiles: File[]) => {
      console.log(acceptedFiles)
      setImage(acceptedFiles[0])
   }

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
   })

   const handleCreatePost = async (data: CreatePostValidation) => {
      try {
         const args: CreatePostArgs = {
            title: data.title,
            image: undefined,
            gift: gift,
            communityId: communityId as Id<"communities">,
         }

         if (image) {
            const res = await uploadFiles("imageUploader", {
               files: [image],
            })

            if (!res) {
               throw new Error("Failed to upload image")
            }

            console.log("res posts", res)

            args.image = res[0].url
         }

         createPost(args)
         setImage(null)
         router.back()
         form.reset()
      } catch (error) {
         toast.error("Failed to create post")
         console.error(error)
      }
   }

   const handleSearchGif = async (search: string) => {
      try {
         const apiKey = "XjVJqqCc4zaj9K8hW8ZL2CwYekN8nuJQ"

         const searchEndpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${search}`

         await fetch(searchEndpoint)
            .then((response) => response.json())
            .then((data) => setGifs(data.data))
            .catch((error) => {
               console.error(error)
               setGifs(GifFile)
            })
      } catch (error) {
         console.error(error)
         setGifs(GifFile)
      }
   }

   const errors = form.formState.errors

   return (
      <div className="max-w-3xl mx-auto h-[calc(100vh-60px)] p-4">
         <form
            onSubmit={form.handleSubmit(handleCreatePost)}
            className="space-y-6"
         >
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-semibold mb-6">Create post</h3>
               <Button
                  type="submit"
                  className="w-fit py-6 text-lg font-medium"
                  disabled={isSubmitting}
               >
                  Create Post˝
               </Button>
            </div>

            <Controller
               control={form.control}
               name="title"
               render={({ field }) => {
                  return (
                     <TextareaAutosize
                        {...field}
                        minRows={3}
                        maxRows={10}
                        placeholder="Type your text here..."
                        style={{
                           width: "100%",
                           padding: "12px",
                           fontSize: "16px",
                        }}
                        className={cn(
                           "resize-none outline-none right-0 border-none shadow-sm focus:outline-primary rounded-lg focus:outline-1",
                           errors?.title &&
                              "border-destructive focus:outline-destructive",
                        )}
                        disabled={isSubmitting}
                     />
                  )
               }}
            />

            <Tabs
               defaultValue="image"
               className="w-full"
               onValueChange={(value) => {
                  if (value === "image") {
                     form.setValue("gift", undefined)
                  }

                  if (value === "gif") {
                     form.setValue("image", undefined)
                     setImage(null)
                  }
               }}
            >
               <TabsList className="mb-4">
                  <TabsTrigger
                     disabled={isSubmitting}
                     value="image"
                     className="px-6"
                  >
                     Image
                  </TabsTrigger>
                  <TabsTrigger
                     disabled={isSubmitting}
                     value="gif"
                     className="px-6"
                  >
                     GIF
                  </TabsTrigger>
               </TabsList>
               <TabsContent value="image" className="mt-4 max-w-full">
                  {!!image && (
                     <div className="relative aspect-video mb-4">
                        <Image
                           src={URL.createObjectURL(image)}
                           alt="Preview"
                           fill
                           className="absolute rounded-xl object-cover"
                        />
                        <Button
                           size="icon"
                           variant="secondary"
                           className="absolute top-3 right-3"
                           onClick={() => setImage(null)}
                           disabled={false}
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  )}

                  <div
                     {...getRootProps()}
                     className={cn(
                        "border-2 border-dashed p-8 text-center rounded-xl transition-colors duration-300",
                        isDragActive
                           ? "border-blue-500 bg-blue-50"
                           : "border-gray-300 bg-gray-100",
                        !!image && "hidden",
                     )}
                  >
                     <input {...getInputProps()} />
                     {isDragActive ? (
                        <p className="text-blue-500">Drop the files here ...</p>
                     ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                           <p className="text-gray-500">
                              Drag n drop an image here, or click to select one
                           </p>
                           <Button type="button" variant="outline">
                              Select Image <ImageIcon className="w-4 h-4" />
                           </Button>
                        </div>
                     )}
                  </div>
               </TabsContent>
               <TabsContent value="gif" className="mt-4">
                  <div className="flex flex-col space-y-4">
                     <div className="flex gap-2">
                        <Input
                           value={searchGif}
                           onChange={(e) => setSearchGif(e.target.value)}
                           placeholder="Search for a gif"
                           className="flex-1"
                        />
                        <Button
                           type="button"
                           onClick={() => handleSearchGif(searchGif)}
                        >
                           Search
                        </Button>
                     </div>

                     {!!!gift && (
                        <div className="grid grid-cols-3 gap-4 h-[500px] overflow-y-auto p-2">
                           {gifs.map((gif) => (
                              <Image
                                 src={gif.images.fixed_width.url}
                                 alt={gif.title}
                                 width={180}
                                 height={180}
                                 key={gif.id}
                                 className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                 onClick={() => {
                                    form.setValue(
                                       "gift",
                                       gif.images.original.url,
                                    )
                                 }}
                              />
                           ))}
                        </div>
                     )}

                     {!!gift && (
                        <div className="mt-4 relative aspect-video">
                           <Image
                              src={gift}
                              alt="Selected GIF"
                              className="absolute object-cover rounded-xl"
                              fill
                           />
                           <Button
                              size="icon"
                              variant="secondary"
                              className="absolute top-3 right-3"
                              onClick={() => form.setValue("gift", undefined)}
                              disabled={false}
                           >
                              <X className="h-4 w-4" />
                           </Button>
                        </div>
                     )}
                  </div>
               </TabsContent>
            </Tabs>
         </form>
      </div>
   )
}

export default CreatePostPage

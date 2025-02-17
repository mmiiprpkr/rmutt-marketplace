"use client";

import { useGetCurrentUser } from "@/api/get-current-user";
import { Card, CardContent } from "@/components/common/ui/card";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/common/ui/tabs";
import { ProfileSkeleton } from "@/components/features/community/skeleton/profile-skeleton";
import { Calendar, Mail, ShoppingBag, MessageSquare } from "lucide-react";
import dayjs from "dayjs";
import { useUpdateProfileImg } from "@/api/use-update-profile-img";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "sonner";
import { MyPosts } from "@/components/features/community/my-posts";
import { BrowsMyProduct } from "@/components/features/market-place/product/my-products";
import { useUserId } from "@/hooks/use-user-id";
import { useGetUserById } from "@/api/get-user-by-id";

const ProfilePage = () => {
   const userId = useUserId();

   if (!userId) return null;

   const { data, isLoading, isError } = useGetUserById(userId);

   const { mutateAsync, isPending } = useUpdateProfileImg();

   const onDrop = async (acceptedFiles: File[]) => {
      try {
         const files = acceptedFiles[0];

         const res = await uploadFiles("imageUploader", {
            files: [files],
         });

         const imageUrl = res[0].url;
         await handleProfileImageChange(imageUrl);
         toast.success("Image uploaded successfully");
      } catch (error) {
         toast.error("Failed to upload image");
         console.error("Error uploading files:", error);
      }
   };

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
   });

   const handleProfileImageChange = async (newImage: string) => {
      try {
         await mutateAsync({
            image: newImage,
         });
      } catch (error) {
         console.error("Error updating profile image:", error);
      }
   };

   if (isError) {
      return <div>Error</div>;
   }

   return (
      <div className="max-w-7xl mx-auto p-4 space-y-8">
         {isLoading ? (
            <ProfileSkeleton />
         ) : (
            <>
               {/* Profile Header */}
               <div className="relative">
                  {/* Cover Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />

                  {/* Profile Info Card */}
                  <Card className="max-w-3xl mx-auto -mt-24 relative z-[4]">
                     <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                           {/* Avatar */}
                           <div className="relative">
                              <div
                                 {...getRootProps()}
                                 className="cursor-pointer opacity-0"
                              >
                                 <input {...getInputProps()} />
                                 <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                                    <div className="text-white text-sm">
                                       {isDragActive
                                          ? "Drop the files here"
                                          : "Drag and drop your profile image here"}
                                    </div>
                                 </div>
                              </div>
                              <img
                                 src={data?.image}
                                 className="size-32 rounded-xl ring-4 ring-background"
                                 alt="avatar"
                              />
                           </div>

                           {/* User Info */}
                           <div className="flex-1 text-center md:text-left space-y-3">
                              <h2 className="text-2xl font-bold">
                                 {data?.email?.split("@")[0]}
                              </h2>
                              <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
                                 <div className="flex items-center gap-2">
                                    <Mail className="size-4" />
                                    <span className="text-sm">
                                       {data?.email}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    <span className="text-sm">
                                       Joined{" "}
                                       {dayjs(data?._creationTime).format(
                                          "MMM YYYY",
                                       )}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           {/* Stats */}
                           <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-3 rounded-lg bg-muted">
                                 <MessageSquare className="size-5 mx-auto mb-1 text-muted-foreground" />
                                 <div className="text-2xl font-bold">24</div>
                                 <div className="text-xs text-muted-foreground">
                                    Posts
                                 </div>
                              </div>
                              <div className="p-3 rounded-lg bg-muted">
                                 <ShoppingBag className="size-5 mx-auto mb-1 text-muted-foreground" />
                                 <div className="text-2xl font-bold">12</div>
                                 <div className="text-xs text-muted-foreground">
                                    Products
                                 </div>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Tabs */}
               <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="w-full justify-start">
                     <TabsTrigger
                        value="posts"
                        className="flex items-center gap-2"
                     >
                        <MessageSquare className="size-4" />
                        Posts
                     </TabsTrigger>
                     <TabsTrigger
                        value="marketplace"
                        className="flex items-center gap-2"
                     >
                        <ShoppingBag className="size-4" />
                        Marketplace
                     </TabsTrigger>
                  </TabsList>
                  <TabsContent value="posts" className="mt-6">
                     <MyPosts />
                  </TabsContent>
                  <TabsContent value="marketplace" className="mt-6">
                     <BrowsMyProduct />
                  </TabsContent>
               </Tabs>
            </>
         )}
      </div>
   );
};

export default ProfilePage;

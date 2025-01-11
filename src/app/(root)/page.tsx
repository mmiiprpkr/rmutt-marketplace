"use client";

import { useGetFeed } from "@/api/communities/get-feed";

import { useCreatePostStore } from "@/stores/use-create-post-store";

import { CreatePost } from "@/components/features/community/create-post";
import { PostFeed } from "@/components/features/community/post-feed";
import { Comments } from "@/components/features/community/comments";

import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";

import { Button } from "@/components/common/ui/button";

const RootPage = () => {
   const { isOpen, onOpen } = useCreatePostStore();
   const { data, isLoading } = useGetFeed();

   return (
      <div className="px-4 min-h-screen">
         <CreatePost />
         <Comments />
         <div className="flex justify-end sticky top-[60px] pt-2 bg-background z-10">
            <Button
               onClick={() => onOpen("createPost")}
               disabled={isOpen}
            >
               Create Post Community
            </Button>
         </div>
         <div className="grid grid-cols-3">
            {isLoading ? (
               <div className="max-w-[600px] mx-auto col-span-2 w-full space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                     <PostFeedSkeleton key={index} />
                  ))}
               </div>
            ) : (
               <div className="max-w-[600px] mx-auto space-y-4 col-span-2 w-full">
                  {data?.map((post) => (
                     <PostFeed key={post._id} post={post} />
                  ))}
               </div>
            )}

            <div className="sticky top-[110px] max-h-[700px] bg-background p-4 rounded-lg border">
               Stats
            </div>
         </div>
      </div>
   );
};

export default RootPage;
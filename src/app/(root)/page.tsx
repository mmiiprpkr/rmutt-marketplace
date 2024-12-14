"use client";

import { useGetFeed } from "@/api/communities/get-feed";

import { useCreatePostStore } from "@/stores/use-create-post-store";

import { CreatePost } from "@/components/features/community/create-post";
import { PostFeed } from "@/components/features/community/post-feed";
import { Comments } from "@/components/features/community/comments";

import { Button } from "@/components/common/ui/button";
import { Skeleton } from "@/components/common/ui/skeleton";

const RootPage = () => {
   const { isOpen, onOpen } = useCreatePostStore();
   const { data, isLoading } = useGetFeed();

   return (
      <div className="px-4 min-h-screen">
         <CreatePost />
         <Comments />
         <Button
            onClick={() => onOpen("createPost")}
            disabled={isOpen}
         >
            Create Post Community
         </Button>
         {isLoading ? (
            <div className="max-w-[600px] mx-auto space-y-4">
               <Skeleton className="h-[200px] w-full" />
            </div>
         ) : (
            <div className="max-w-[600px] mx-auto space-y-4">
               {data?.map((post) => (
                  <PostFeed key={post._id} post={post} />
               ))}
            </div>
         )}
      </div>
   );
};

export default RootPage;
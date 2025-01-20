"use client";

import { useGetFeed } from "@/api/communities/get-feed";

import { useCreatePostStore } from "@/stores/use-create-post-store";

import { CreatePost } from "@/components/features/community/create-post";
import { PostFeed } from "@/components/features/community/post-feed";
import { Comments } from "@/components/features/community/comments";

import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";

import { Button } from "@/components/common/ui/button";
import { useGetCurrentUser } from "@/api/get-current-user";

const RootPage = () => {
   const { isOpen, onOpen } = useCreatePostStore();
   const { data, isLoading } = useGetFeed();
   const { data: userData, isLoading: userLoading } = useGetCurrentUser();

   return (
      <div className="px-4 min-h-screen max-w-7xl w-full mx-auto">
         <CreatePost />
         <Comments />
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="w-full col-span-2 space-y-4">
               <div className="sticky top-[60px] backdrop-blur-sm bg-background/80 px-6 py-4 z-10 flex items-center justify-between border-b shadow-sm transition-all duration-200">
                  <h2 className="text-xl font-semibold text-foreground/80">
                     Feed
                  </h2>
                  <Button
                     onClick={() => onOpen("createPost")}
                     disabled={isOpen}
                     size="lg"
                  >
                     Create Post
                  </Button>
               </div>
               {isLoading || userLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                     <PostFeedSkeleton key={index} />
                  ))
                  : data?.map((post) => (
                     <PostFeed key={post._id} post={post} userId={userData?._id} />
                  ))}
            </div>

            <div className="lg:block hidden">
               <div className="sticky top-[65px] max-h-[700px] bg-background p-4 rounded-lg border">
                  Stats
               </div>
            </div>
         </div>
      </div>
   );
};

export default RootPage;

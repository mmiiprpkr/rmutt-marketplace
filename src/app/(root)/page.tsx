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
      <div className="px-4 min-h-screen max-w-7xl w-full mx-auto">
         <CreatePost />
         <Comments />
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="w-full col-span-2 space-y-4">
               <div className="sticky top-[60px] backdrop-blur-sm bg-white/80 px-6 py-4 z-10 flex items-center justify-between border-b shadow-sm transition-all duration-200">
                  <h2 className="text-xl font-semibold text-foreground/80">
                     Feed
                  </h2>
                  <Button
                     onClick={() => onOpen("createPost")}
                     disabled={isOpen}
                     className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md transition-all duration-200 hover:shadow-lg"
                     size="lg"
                  >
                     Create Post
                  </Button>
               </div>
               {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                     <PostFeedSkeleton key={index} />
                  ))
                  : data?.map((post) => (
                     <PostFeed key={post._id} post={post} />
                  ))}
            </div>

            <div className="sticky top-[70px] max-h-[700px] bg-background p-4 rounded-lg border hidden lg:block">
               Stats
            </div>
         </div>
      </div>
   );
};

export default RootPage;

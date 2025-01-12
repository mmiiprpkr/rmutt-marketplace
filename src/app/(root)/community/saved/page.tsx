"use client";

import { useGetSavePost } from "@/api/communities/get-savePost";
import { Comments } from "@/components/features/community/comments";
import { PostFeed } from "@/components/features/community/post-feed";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";
import { SavePostSkeleton } from "@/components/features/community/skeleton/save-post-skeletion";

const SavedPostPage = () => {
   const { data, isLoading } = useGetSavePost();

   return (
      <div className="p-4 min-h-screen max-w-7xl w-full mx-auto">
         <Comments />
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="w-full col-span-2 space-y-4">
               <div className="sticky top-[60px] backdrop-blur-sm bg-white/80 px-6 py-4 z-10 flex items-center justify-between border-b shadow-sm transition-all duration-200">
                  <h2 className="text-xl font-semibold text-foreground/80">
                     My Saved Post
                  </h2>
               </div>
               {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                     <SavePostSkeleton key={index} />
                  ))
               ) : Array.isArray(data) && data.length === 0 ? (
                  <div>No Saved Post</div>
               ) : (
                  data?.map((post) => <PostFeed key={post._id} post={post} />)
               )}
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

export default SavedPostPage;

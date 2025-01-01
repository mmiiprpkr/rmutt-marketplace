"use client";

import { useGetSavePost } from "@/api/communities/get-savePost";
import { Comments } from "@/components/features/community/comments";
import { PostFeed } from "@/components/features/community/post-feed";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";
import { SavePostSkeleton } from "@/components/features/community/skeleton/save-post-skeletion";

const SavedPostPage = () => {
   const { data, isLoading } = useGetSavePost();

   return (
      <div className="p-4 min-h-screen space-y-4">
         <div className="text-2xl font-bold sticky top-[60px] bg-background py-2 z-10">
            My Saved Post
         </div>
         <Comments />
         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
               {Array.from({ length: 5 }).map((_, index) => (
                  <SavePostSkeleton key={index} />
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
               {Array.isArray(data) && data.length === 0 ? (
                  <div>No Saved Post</div>
               ) : (
                  data?.map((post) => <PostFeed key={post._id} post={post} />)
               )}
            </div>
         )}
      </div>
   );
};

export default SavedPostPage;

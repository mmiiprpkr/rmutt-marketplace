"use client";

import { useGetMySavePosts } from "@/api/communities/get-my-post";
import { Comments } from "@/components/features/community/comments";
import { PostFeed } from "@/components/features/community/post-feed";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";

const PostsPage = () => {
   const { data, isLoading, error } = useGetMySavePosts();

   if (error) {
      throw new Error(error.message);
   }

   return (
      <div className="p-4 min-h-screen space-y-4">
         <div className="text-2xl font-bold sticky top-[60px] bg-background py-2 z-10">
            My Saved Post
         </div>
         <Comments />
         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
               {Array.from({ length: 5 }).map((_, index) => (
                  <PostFeedSkeleton key={index} />
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
               {Array.isArray(data) && data.length === 0 ? (
                  <div>No Saved Post</div>
               ) : (
                  <div className="col-span-3 lg:grid grid-cols-3">
                     <div className="col-span-2 flex justify-center w-full">
                        <div className="max-w-[600px] w-full space-y-4">
                           {data?.map((post) => (
                              <PostFeed key={post._id} post={post} />
                           ))}
                        </div>
                     </div>
                     <div className="col-span-1 hidden lg:block">
                        <div className="sticky top-[60px]">
                           <div className="text-2xl font-bold">Trending</div>
                           <div className="text-muted-foreground">Trending post</div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default PostsPage;

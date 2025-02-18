"use client";

import { useInView } from "react-intersection-observer";
import { PostFeed } from "@/components/features/community/post-feed";
import { Comments } from "@/components/features/community/comments";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";
import { CreatePostButton } from "@/components/features/community/create-post-button";
import { ProfileStats } from "@/components/features/community/profile-stats";
import { useUserId } from "@/hooks/use-user-id";
import { useGetUserById } from "@/api/get-user-by-id";
import { Id } from "../../../../convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect } from "react";
import { CreatePost } from "./create-post";

interface MyPostsProps {
   userAccountId?: Id<"users">;
}

export const MyPosts = ({ userAccountId }: MyPostsProps) => {
   const { ref, inView } = useInView({
      threshold: 0,
      rootMargin: "100px",
   });

   const currentUserId = useUserId();
   const userId = userAccountId || currentUserId;

   const { results, loadMore, status } = usePaginatedQuery(
      api.post.getMyPosts,
      { userId },
      { initialNumItems: 10 }
   );

   const { data: userData, isLoading: userLoading } = useGetUserById(userId!);

   useEffect(() => {
      if (inView && status === "CanLoadMore") {
         loadMore(10);
      }
   }, [inView, status, loadMore]);

   return (
      <div className="px-4 min-h-screen max-w-7xl w-full mx-auto">
         <CreatePost />
         <Comments />
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="w-full col-span-2 space-y-4">
               {status === "LoadingFirstPage" || userLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                     <PostFeedSkeleton key={index} />
                  ))
               ) : results?.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                     No posts yet
                  </div>
               ) : (
                  <>
                     {results?.map((post) => (
                        <PostFeed
                           key={post._id}
                           post={post}
                           userId={userData?._id}
                        />
                     ))}

                     <div ref={ref} className="py-4">
                        {status === "LoadingMore" && (
                           <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                           </div>
                        )}
                        {status === "Exhausted" && (
                           <p className="text-center text-muted-foreground">
                              No more posts
                           </p>
                        )}
                     </div>
                  </>
               )}
            </div>

            <div className="lg:block hidden">
               <div className="sticky top-[65px] max-h-[700px] bg-background p-4 rounded-lg border overflow-y-auto">
                  <ProfileStats />
               </div>
            </div>
         </div>
      </div>
   );
};

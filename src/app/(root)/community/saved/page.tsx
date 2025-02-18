"use client";

import { useInView } from "react-intersection-observer";
import { useGetCurrentUser } from "@/api/get-current-user";
import { Comments } from "@/components/features/community/comments";
import { PostFeed } from "@/components/features/community/post-feed";
import { ProfileStats } from "@/components/features/community/profile-stats";
import { SavePostSkeleton } from "@/components/features/community/skeleton/save-post-skeletion";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useEffect } from "react";

const SavedPostPage = () => {
   const { ref, inView } = useInView({
      threshold: 0,
      rootMargin: "100px",
   });

   const { results, loadMore, status } = usePaginatedQuery(
      api.post.getSavedPosts,
      {},
      { initialNumItems: 10 },
   );

   const { data: currentUser, isLoading: currentUserLoading } =
      useGetCurrentUser();

   useEffect(() => {
      if (inView && status === "CanLoadMore") {
         loadMore(10);
      }
   }, [inView, status, loadMore]);

   return (
      <div className="p-4 min-h-screen max-w-7xl w-full mx-auto">
         <Comments />
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="w-full col-span-2 space-y-4">
               <div className="sticky top-[60px] backdrop-blur-sm bg-background/80 px-6 py-4 z-10 flex items-center justify-between border-b shadow-sm transition-all duration-200">
                  <h2 className="text-xl font-semibold text-foreground/80">
                     My Saved Post
                  </h2>
               </div>

               {status === "LoadingFirstPage" || currentUserLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                     <SavePostSkeleton key={index} />
                  ))
               ) : results?.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                     No Saved Posts
                  </div>
               ) : (
                  <>
                     {results?.map((post) => {
                        if (!post) return null;
                        return (
                           <PostFeed
                              key={post?._id}
                              post={post}
                              userId={currentUser?._id}
                           />
                        );
                     })}

                     <div ref={ref} className="py-4">
                        {status === "LoadingMore" && (
                           <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                           </div>
                        )}
                        {status === "Exhausted" && (
                           <p className="text-center text-muted-foreground">
                              No more saved posts
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

export default SavedPostPage;

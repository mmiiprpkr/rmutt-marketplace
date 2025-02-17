"use client";

import { useGetFeed } from "@/api/communities/get-feed";
import { CreatePost } from "@/components/features/community/create-post";
import { PostFeed } from "@/components/features/community/post-feed";
import { Comments } from "@/components/features/community/comments";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";
import { useGetCurrentUser } from "@/api/get-current-user";
import { CreatePostButton } from "@/components/features/community/create-post-button";
import { ProfileStats } from "@/components/features/community/profile-stats";
import { useGetMyPosts } from "@/api/communities/get-my-post";

export const MyPosts = () => {
   const { data, isLoading } = useGetMyPosts();
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
                  <CreatePostButton redirect="/create-post" />
               </div>
               {isLoading || userLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                       <PostFeedSkeleton key={index} />
                    ))
                  : data?.map((post) => (
                       <PostFeed
                          key={post._id}
                          post={post}
                          userId={userData?._id}
                       />
                    ))}
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

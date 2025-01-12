"use client";

import { useGetCommunity } from "@/api/communities/get-community";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetFeed } from "@/api/communities/get-feed";
import { CreatePost } from "@/components/features/community/create-post";
import { Comments } from "@/components/features/community/comments";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";
import { PostFeed } from "@/components/features/community/post-feed";
import { CircleHelpIcon, PlusCircleIcon } from "lucide-react";
import { useCreatePostStore } from "@/stores/use-create-post-store";
import { Button } from "@/components/common/ui/button";
import Image from "next/image";

type MyCommunityIdPageProps = {
   params: {
      communityId: string;
   };
};

const MyCommunityIdPage = ({ params }: MyCommunityIdPageProps) => {
   const { isOpen, onOpen } = useCreatePostStore();
   const {
      data: community,
      isLoading: communityLoading,
      isError: communityError,
   } = useGetCommunity(params.communityId as Id<"communities">);
   const { data: feed, isLoading: feedLoading } = useGetFeed(
      params.communityId as Id<"communities">
   );

   if (communityError) {
      return <div>Error</div>;
   }

   return (
      <div className="px-4 min-h-screen max-w-7xl mx-auto w-full">
         <CreatePost />
         <Comments />

         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 relative">
            {feedLoading ? (
               <div className="w-full col-span-2 space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                     <PostFeedSkeleton key={index} />
                  ))}
               </div>
            ) : (
               <div className="w-full col-span-2 space-y-4">
                  <div className="sticky top-[60px] backdrop-blur-sm bg-white/80 px-6 py-4 z-10 flex items-center justify-between border-b shadow-sm transition-all duration-200">
                     <div className="flex items-center gap-3">
                        <Image
                           src={community?.image ?? ""}
                           alt="CommunityImage"
                           className="rounded-lg"
                           width={60}
                           height={60}
                        />
                        <div className="flex flex-col">
                           <h1 className="text-2xl font-bold">
                              {communityLoading
                                 ? "Loading..."
                                 : community?.name}
                           </h1>
                           <p className="text-muted-foreground text-sm truncate line-clamp-1">
                              {communityLoading
                                 ? "Loading..."
                                 : community?.description}
                           </p>
                        </div>
                     </div>
                     <Button
                        onClick={() => onOpen("createPost")}
                        disabled={isOpen}
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md transition-all duration-200 hover:shadow-lg"
                        size="lg"
                     >
                        Create Post
                     </Button>
                  </div>
                  {Array.isArray(feed) && feed.length === 0 ? (
                     <div className="w-full h-[40vh] flex flex-col items-center justify-center">
                        <div className="mb-4">
                           <CircleHelpIcon className="size-10 text-primary" />
                        </div>
                        <p className="text-primary text-xl font-semibold">
                           No Post Found
                        </p>
                        <p className="text-muted-foreground text-sm text-center mt-2">
                           It seems like there are no communities available at
                           the moment. <br />
                           Please check back later or create a new community!
                        </p>
                     </div>
                  ) : (
                     feed?.map((post) => (
                        <PostFeed key={post._id} post={post} />
                     ))
                  )}
               </div>
            )}
            <div className="lg:block hidden">
               <div className="sticky top-[65px] max-h-[700px] bg-background p-4 rounded-lg border">
                  Stats
               </div>
            </div>
         </div>
      </div>
   );
};

export default MyCommunityIdPage;

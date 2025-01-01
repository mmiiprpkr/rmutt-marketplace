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
      <div className="px-4 min-h-screen">
         <CreatePost />
         <Comments />
         <div className="flex items-center justify-between sticky top-[60px] py-2 bg-background z-10">
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
                     {communityLoading ? "Loading..." : community?.name}
                  </h1>
                  <p className="text-muted-foreground text-sm truncate line-clamp-1">
                     {communityLoading ? "Loading..." : community?.description}
                  </p>
               </div>
            </div>
            <Button onClick={() => onOpen("createPost")} disabled={isOpen}>
               <p className="hidden md:block">Create Post Community</p>
               <PlusCircleIcon className="size-4 md:ml-2" />
            </Button>
         </div>
         {feedLoading ? (
            <div className="max-w-[600px] mx-auto space-y-4">
               {Array.from({ length: 5 }).map((_, index) => (
                  <PostFeedSkeleton key={index} />
               ))}
            </div>
         ) : (
            <div className="max-w-[600px] mx-auto space-y-4 pt-[40px]">
               {Array.isArray(feed) && feed.length === 0 ? (
                  <div className="w-full h-[40vh] flex flex-col items-center justify-center">
                     <div className="mb-4">
                        <CircleHelpIcon className="size-10 text-primary" />
                     </div>
                     <p className="text-primary text-xl font-semibold">
                        No Post Found
                     </p>
                     <p className="text-muted-foreground text-sm text-center mt-2">
                        It seems like there are no communities available at the
                        moment. <br />
                        Please check back later or create a new community!
                     </p>
                  </div>
               ) : (
                  feed?.map((post) => <PostFeed key={post._id} post={post} />)
               )}
            </div>
         )}
      </div>
   );
};

export default MyCommunityIdPage;

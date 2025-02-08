"use client";

import { useGetCommunity } from "@/api/communities/get-community";
import { useCommunityId } from "@/hooks/use-communityId";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { CreatePost } from "@/components/features/community/create-post";
import { Comments } from "@/components/features/community/comments";
import { useGetCurrentUser } from "@/api/get-current-user";
import { useGetFeed } from "@/api/communities/get-feed";
import { PostFeedSkeleton } from "@/components/features/community/skeleton/feed-skeleton";
import Image from "next/image";
import { CreatePostButton } from "@/components/features/community/create-post-button";
import { CircleHelpIcon, MenuIcon, MinusSquareIcon } from "lucide-react";
import { PostFeed } from "@/components/features/community/post-feed";
import { UserIcon, Users2Icon, CalendarIcon } from "lucide-react"; // Add this import
import { ImageIcon } from "lucide-react"; // Add this import
import { Button } from "@/components/common/ui/button";
import { useJoinCommunity } from "@/api/communities/join-community";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";

const CommunityIdPage = () => {
   const communityId = useCommunityId();

   const {
      data: community,
      isLoading: communityLoading,
      isError: communityError,
   } = useGetCommunity(communityId as Id<"communities">);
   const {
      data: userData,
      isLoading: userLoading,
      isError: userError,
   } = useGetCurrentUser();
   const { mutateAsync: joinCommunity, isPending: joinPending } =
      useJoinCommunity();

   const { data: feed, isLoading: feedLoading } = useGetFeed(
      communityId as Id<"communities">,
   );

   if (communityError || userError) {
      return <div>Error</div>;
   }

   return (
      <div className="min-h-screen w-full">
         <CreatePost />
         <Comments />
         {/* Banner Section */}
         <div className="h-[192px] relative bg-gradient-to-r from-primary/80 to-primary">
            {community?.image ? (
               <Image
                  src={community.image}
                  alt="Community Banner"
                  fill
                  className="object-cover opacity-50"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-background/50" />
               </div>
            )}
         </div>

         <div className="px-4 max-w-7xl mx-auto w-full">
            {/* Community Header */}
            <div className="flex items-center">
               <div className="relative -mt-[76px] mb-4 flex items-end">
                  <div className="flex items-end gap-4">
                     <div className="relative">
                        <Image
                           src={community?.image ?? ""}
                           alt="Community Avatar"
                           width={150}
                           height={150}
                           className="rounded-full border-4 border-background bg-background object-cover"
                        />
                     </div>
                     <div className="mb-4">
                        <h1 className="text-3xl font-bold">
                           {communityLoading ? "Loading..." : community?.name}
                        </h1>
                        <p className="text-sm">
                           {communityLoading
                              ? "Loading..."
                              : community?.description}
                        </p>
                     </div>
                  </div>
               </div>
               <div className="flex ml-auto gap-2">
                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <MenuIcon />
                     </DropdownMenuTrigger>

                     <DropdownMenuContent>
                        <DropdownMenuItem
                           onClick={async () => {
                              await joinCommunity({
                                 communityId: communityId as Id<"communities">,
                              });
                           }}
                           disabled={joinPending}
                        >
                           {community?.isFollowing ? "Unfollow" : "Follow"}
                        </DropdownMenuItem>

                        <DropdownMenuItem className="md:hidden">
                           About
                        </DropdownMenuItem>
                        {community?.isFollowing && (
                           <DropdownMenuItem>
                              <CreatePostButton
                                 redirect={`/community/communities/${communityId}/create-post`}
                              />
                           </DropdownMenuItem>
                        )}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 relative">
               {feedLoading || userLoading ? (
                  <div className="w-full col-span-2 space-y-4">
                     {Array.from({ length: 5 }).map((_, index) => (
                        <PostFeedSkeleton key={index} />
                     ))}
                  </div>
               ) : (
                  <div className="w-full col-span-2 space-y-4">
                     {Array.isArray(feed) && feed.length === 0 ? (
                        <div className="w-full h-[40vh] flex flex-col items-center justify-center">
                           <div className="mb-4">
                              <CircleHelpIcon className="size-10 text-primary" />
                           </div>
                           <p className="text-primary text-xl font-semibold">
                              No Post Found
                           </p>
                           <p className="text-muted-foreground text-sm text-center mt-2">
                              It seems like there are no communities available
                              at the moment. <br />
                              Please check back later or create a new community!
                           </p>
                        </div>
                     ) : (
                        feed?.map((post) => (
                           <PostFeed
                              key={post._id}
                              post={post}
                              userId={userData?._id}
                           />
                        ))
                     )}
                  </div>
               )}
               <div className="lg:block hidden">
                  <div className="sticky top-[65px] bg-background p-6 rounded-xl border space-y-6">
                     <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                           Community Stats
                        </h3>
                        <div className="h-px bg-border" />
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-primary/10 rounded-lg">
                              <Users2Icon className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Members
                              </p>
                              <p className="font-semibold">
                                 {community?.userCount || 0}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-primary/10 rounded-lg">
                              <UserIcon className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Created by
                              </p>
                              <p className="font-semibold">
                                 {community?.user?.name ||
                                    community?.user?.email ||
                                    "Anonymous"}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-primary/10 rounded-lg">
                              <CalendarIcon className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Created at
                              </p>
                              <p className="font-semibold">
                                 {new Date(
                                    community?.createdAt || "",
                                 ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                 })}
                              </p>
                           </div>
                        </div>
                     </div>

                     {community?.description && (
                        <div className="space-y-2">
                           <h4 className="font-medium">About</h4>
                           <p className="text-sm text-muted-foreground">
                              {community.description}
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CommunityIdPage;

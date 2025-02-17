"use client";

import { CircleHelpIcon, PlusCircleIcon } from "lucide-react";

import { useCreateCommunityStore } from "@/stores/use-create-community";

import { CommunityCard } from "@/components/features/community/community-card";
import { CreateCommunity } from "@/components/features/community/create-community";
import { CommunityCardSkeleton } from "@/components/features/community/skeleton/community-card-skeleton";

import { Button } from "@/components/common/ui/button";
import { useGetMyCommunities } from "@/api/communities/get-my-community";
import { Id } from "../../../../../convex/_generated/dataModel";

const MyCommunitiesPage = () => {
   const { setIsOpen } = useCreateCommunityStore();

   const { data: communities, isLoading: isLoadingCommunities } =
      useGetMyCommunities();

   return (
      <div className="min-h-screen p-4 space-y-4 max-w-7xl mx-auto w-full">
         <CreateCommunity />
         <div className="w-full bg-background flex items-center justify-between sticky py-2 top-[60px] z-10">
            <h1 className="text-2xl font-bold">Communities</h1>
            <Button onClick={() => setIsOpen(true)}>
               New Community <PlusCircleIcon className="size-4 ml-2" />
            </Button>
         </div>
         {Array.isArray(communities) &&
            communities.length === 0 &&
            !isLoadingCommunities && (
               <div className="w-full h-[40vh] flex flex-col items-center justify-center">
                  <div className="mb-4">
                     <CircleHelpIcon className="size-10 text-primary" />
                  </div>
                  <p className="text-primary text-xl font-semibold">
                     No Communities Found
                  </p>
                  <p className="text-muted-foreground text-sm text-center mt-2">
                     It seems like there are no communities available at the
                     moment. <br />
                     Please check back later or create a new community!
                  </p>
               </div>
            )}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(communities) &&
               communities.length > 0 &&
               communities.map((community) => (
                  <CommunityCard
                     community={{
                        ...community?.community,
                        _id: community.community._id as
                           | Id<"communities">
                           | undefined,
                        userCount: community?.userCount,
                        _creationTime: community?.community._creationTime ?? 0,
                        description:
                           community?.community.description ||
                           "No description available",
                        name: community?.community.name || "Unnamed Community",
                        createdAt:
                           community?.community.createdAt ||
                           new Date().toISOString(),
                        userId: community?.community.userId as Id<"users">,
                     }}
                     key={community?._id ?? "default"}
                     type="my-community"
                  />
               ))}
            {isLoadingCommunities &&
               Array.from({ length: 8 }).map((_, index) => (
                  <CommunityCardSkeleton key={index} />
               ))}
         </div>
      </div>
   );
};

export default MyCommunitiesPage;

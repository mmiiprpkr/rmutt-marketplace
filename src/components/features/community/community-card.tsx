import {
   Card,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/common/ui/card";
import { Button } from "@/components/common/ui/button";
import { UserIcon } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { useJoinCommunity } from "@/api/communities/join-community";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Community {
   image: string | null;
   userCount: number;
   _id: Id<"communities"> | undefined;
   _creationTime: number;
   description?: string;
   name: string;
   createdAt: string;
   userId: Id<"users">;
}

interface CommunityCardProps {
   community: Community;
   type: "my-community" | "community";
}

export const CommunityCard = ({ community, type }: CommunityCardProps) => {
   const router = useRouter();
   const { mutate: joinCommunity, isPending } = useJoinCommunity();

   const handleRedirectToCommunity = (communityId: Id<"communities"> | undefined) => {
      if (!communityId) {
         return;
      }
      const basePath = type === "my-community"
         ? "/community/my-communities/"
         : "/community/communities/";
      router.push(`${basePath}${communityId}`);
   };

   const handleJoinCommunity = (
      e: React.MouseEvent<HTMLButtonElement>
   ) => {
      e.stopPropagation();

      if (!community._id) {
         return;
      }
      joinCommunity(
         { communityId: community._id },
         {
            onSuccess: () => {
               toast.success("Successfully joined the community");
            },
            onError: (error) => {
               toast.error(error.message || "Failed to join community");
            },
         }
      );
   };

   return (
      <Card
         onClick={() => handleRedirectToCommunity(community._id)}
         className="group flex flex-col overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
         <div className="relative w-full pt-[56.25%] overflow-hidden">
            <Image
               src={community.image || "/placeholder.svg"}
               alt={`${community.name} community cover`}
               fill
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               priority={false}
               className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
         </div>

         <CardHeader className="flex-grow space-y-2">
            <CardTitle className="text-xl font-bold line-clamp-1">
               {community.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
               {community.description || "No description available"}
            </p>
         </CardHeader>

         <CardFooter className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
               <UserIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
               <span>{community.userCount.toLocaleString()} Members</span>
            </div>
            <Button
               variant="outline"
               size="sm"
               className="transition-colors hover:bg-primary hover:text-primary-foreground"
               onClick={handleJoinCommunity}
               disabled={isPending}
               aria-label={`${type === "my-community" ? "Leave" : "Join"} ${community.name} community`}
            >
               {isPending ? "Loading..." : (type === "my-community" ? "Leave" : "Join")}
            </Button>
         </CardFooter>
      </Card>
   );
};
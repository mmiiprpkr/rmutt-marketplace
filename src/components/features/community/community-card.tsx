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

type CommunityCardProps = {
   community: {
      image: string | null;
      userCount: number;
      _id: Id<"communities"> | undefined;
      _creationTime: number;
      description?: string | undefined;
      name: string;
      createdAt: string;
      userId: Id<"users">;
  }
};

export const CommunityCard = ({ community }: CommunityCardProps) => {
   return (
      <Card
         key={community._id}
         className="group flex flex-col overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
         <div className="relative w-full pt-[56.25%] overflow-hidden">
            <Image
               src={community.image || "/placeholder.svg?height=200&width=400"}
               alt={community.name}
               fill
               className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-white/20 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white"></div>
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
               <UserIcon className="w-4 h-4 mr-1.5" />
               <span>{community.userCount.toLocaleString()} Members</span>
            </div>
            <Button
               variant="outline"
               size="sm"
               className="transition-colors hover:bg-primary hover:text-primary-foreground"
            >
          Join
            </Button>
         </CardFooter>
      </Card>
   );
};

import { useGetStatsProfile } from "@/api/communities/get-stats-profile";
import { Card, CardContent } from "@/components/common/ui/card";
import { Skeleton } from "@/components/common/ui/skeleton";
import { Building2, MessageCircle, ThumbsUp, Users2 } from "lucide-react";

export function ProfileStats() {
   const { data: stats, isLoading } = useGetStatsProfile();

   if (isLoading) {
      return <Skeleton className="w-full h-[300px]" />;
   }

   const statItems = [
      {
         icon: Building2,
         label: "Communities",
         value: stats?.communities.total || 0,
      },
      {
         icon: MessageCircle,
         label: "Posts",
         value: stats?.engagement.posts || 0,
      },
      {
         icon: ThumbsUp,
         label: "Likes Given",
         value: stats?.engagement.likes || 0,
      },
      {
         icon: Users2,
         label: "Comments",
         value: stats?.engagement.comments || 0,
      },
   ];

   return (
      <div className="space-y-4">
         <h3 className="font-semibold text-lg">Your Activity</h3>
         <div className="grid grid-cols-2 gap-4">
            {statItems.map((item) => (
               <Card key={item.label}>
                  <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                     <item.icon className="w-5 h-5 text-muted-foreground" />
                     <p className="text-sm text-muted-foreground">
                        {item.label}
                     </p>
                     <p className="text-2xl font-bold">{item.value}</p>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Detailed Stats */}
         <Card>
            <CardContent className="p-4 space-y-4">
               <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                     Communities
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                     <div>
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-medium">
                           {stats?.communities.joined || 0}
                        </p>
                     </div>
                     <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                           {stats?.communities.created || 0}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                     Engagement
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                     <div>
                        <p className="text-muted-foreground">Total Posts</p>
                        <p className="font-medium">
                           {stats?.engagement.posts || 0}
                        </p>
                     </div>
                     <div>
                        <p className="text-muted-foreground">Comments Made</p>
                        <p className="font-medium">
                           {stats?.engagement.comments || 0}
                        </p>
                     </div>
                     <div>
                        <p className="text-muted-foreground">Posts Liked</p>
                        <p className="font-medium">
                           {stats?.engagement.likes || 0}
                        </p>
                     </div>
                     <div>
                        <p className="text-muted-foreground">Posts Saved</p>
                        <p className="font-medium">
                           {stats?.engagement.saved || 0}
                        </p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

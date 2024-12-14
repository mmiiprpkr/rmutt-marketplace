import { useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/common/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/common/ui/separator";
import { Button } from "@/components/common/ui/button";
import { HeartIcon, MessageSquareIcon, Share2Icon } from "lucide-react";
import { useQueryState } from "nuqs";

type PostFeedProps = {
   post: {
      _id: Id<"posts">;
      _creationTime: number;
      title: string;
      createdAt: string;
      userId: Id<"users">;
      image?: string | null;
      postType?: "image" | "gift";
      communityId?: Id<"communities">;
      likes?: number;
      commentCount?: number;
      user: Doc<"users"> | null;
   }
}

export const PostFeed = ({ post }: PostFeedProps) => {
   const [postId, setPostId] = useQueryState("communityPostId");

   const [showFullText, setShowFullText] = useState(false);

   return (
      <Card key={post._id} className="hover:shadow-lg transition-shadow duration-200">
         <CardContent className="p-4">
            {/* User Info Section */}
            <CardHeader className="p-0 mb-4">
               <div className="flex items-center space-x-3">
                  <Avatar>
                     <AvatarImage src={post?.user?.image} />
                     <AvatarFallback>
                        {post?.user?.email?.charAt(0).toUpperCase()}
                     </AvatarFallback>
                  </Avatar>
                  <div>
                     <CardTitle className="text-sm font-medium">
                        {post?.user?.email}
                     </CardTitle>
                     <CardDescription className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>

            {/* Post Content Section */}
            <div className="space-y-4">
               <div>
                  <p className={`text-base font-normal text-balance ${!showFullText ? "line-clamp-3" : ""}`}>
                     {post.title}
                  </p>
                  {post.title.length > 150 && (
                     <button
                        onClick={() => setShowFullText(!showFullText)}
                        className="
                        text-blue-500 hover:text-blue-700
                        text-sm mt-1
                        transition-colors duration-200
                        flex items-center gap-1
                     "
                     >
                        {showFullText ? "See less" : "See more"}
                        <svg
                           className={`w-4 h-4 transform transition-transform duration-200 ${
                              showFullText ? "rotate-180" : ""
                           }`}
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                     </button>
                  )}
               </div>
               {post.image && (
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                     <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                     />
                  </div>
               )}
            </div>

            {/* Interaction Buttons */}
            <Separator className="my-4" />
            <div className="p-0 flex justify-between">
               <div className="flex items-center space-x-4">
                  <Button
                     variant="ghost"
                     size="sm"
                     className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                  >
                     <HeartIcon className="size-5" />
                     <span className="text-sm">{post.likes || 0}</span>
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                     onClick={() => {
                        setPostId(post._id);
                     }}
                  >
                     <MessageSquareIcon className="size-5"/>
                     <span className="text-sm">{post.commentCount || 0}</span>
                  </Button>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-gray-700"
               >
                  <Share2Icon className="size-5" />
               </Button>
            </div>
         </CardContent>
      </Card>
   );
};
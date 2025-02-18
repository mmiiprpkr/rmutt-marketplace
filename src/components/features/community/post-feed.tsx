import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useSavePost } from "@/api/communities/save-post";
import { useLikePost } from "@/api/communities/like-post";
import { useDeletePost } from "@/api/communities/use-delete-post";
import { useConfirm } from "@/hooks/use-confirm";
import { sendNotification } from "@/actions/send-notification";
import { cn, formatDate } from "@/lib/utils";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/common/ui/card";
import { Button } from "@/components/common/ui/button";
import { Separator } from "@/components/common/ui/separator";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { UserButton } from "@/components/common/user-button";
import {
   BookmarkCheckIcon,
   BookmarkIcon,
   EditIcon,
   MoreVertical,
   HeartIcon,
   MessageSquareIcon,
   Trash,
} from "lucide-react";

type PostFeedProps = {
   post: {
      _id: Id<"posts">;
      _creationTime: number;
      title: string;
      createdAt: string;
      userId: Id<"users">;
      image?: string | null;
      gift?: string | null;
      postType?: "image" | "gift";
      communityId?: Id<"communities">;
      likes?: number;
      commentCount?: number;
      user: Doc<"users"> | null;
      isLiked: boolean;
      isSaved: boolean;
      likeCount: number;
      community: Doc<"communities"> | null;
   };
   userId: Id<"users"> | undefined;
};

export const PostFeed = ({ post, userId }: PostFeedProps) => {
   const router = useRouter();
   const [postId, setPostId] = useQueryState("communityPostId");
   const [showFullText, setShowFullText] = useState(false);

   const { mutate: savePost } = useSavePost();
   const { mutate: likePost } = useLikePost();
   const { mutateAsync: deletePost } = useDeletePost();

   const [Confirmation, confirm] = useConfirm(
      "Are you sure you want to delete this post?",
      "Delete",
      "destructive",
   );

   const handleLikeReactionsPost = async (type: "like" | "save") => {
      if (type === "save") {
         savePost({ postId: post._id });
         return;
      }

      likePost({ postId: post._id });

      if (post?.userId !== userId && !post?.isLiked) {
         await sendNotification({
            message: "liked your post <3",
            recieverId: post.userId,
            senderId: userId!,
            title: "New Like",
            link: "",
         });
      }
   };

   const handleDeletePost = async () => {
      try {
         const ok = await confirm();
         if (ok) {
            await deletePost({ postId: post._id });
         }
      } catch (error) {
         toast.error("Failed to delete post");
         console.error("Failed to delete post:", error);
      }
   };

   return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
         <Confirmation />
         <CardContent className="p-4">
            <CardHeader className="p-0 mb-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <UserButton
                        imageUrl={post?.user?.image ?? ""}
                        type={userId === post.userId ? "settings" : "profile"}
                        userId1={userId}
                        userId2={post.userId}
                     />
                     <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">
                           {post?.user?.email}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                           <CardDescription className="text-xs">
                              {formatDate(post.createdAt)}
                           </CardDescription>
                           {post.community && (
                              <>
                                 <span className="text-xs text-muted-foreground">
                                    •
                                 </span>
                                 <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs font-normal"
                                    onClick={() =>
                                       router.push(
                                          `/community/${post.community?._id}`,
                                       )
                                    }
                                 >
                                    <div className="flex items-center gap-2">
                                       {post.community.image && (
                                          <div className="relative size-4">
                                             <Image
                                                src={
                                                   post.community.image ||
                                                   "/placeholder.svg"
                                                }
                                                alt={post.community.name}
                                                fill
                                                className="rounded-full object-cover"
                                             />
                                          </div>
                                       )}
                                       <span>{post.community.name}</span>
                                    </div>
                                 </Button>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
                  {post?.userId === userId && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem
                              onClick={() =>
                                 router.push(`/community/post/${post._id}`)
                              }
                           >
                              <EditIcon className="size-4 mr-2" />
                              <span>Edit</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={handleDeletePost}>
                              <Trash className="size-4 mr-2" />
                              <span>Delete</span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}
               </div>
            </CardHeader>

            <div className="space-y-4">
               <div>
                  <p
                     className={`text-base font-normal text-balance ${!showFullText ? "line-clamp-3" : ""}`}
                  >
                     {post.title}
                  </p>
                  {post.title.length > 150 && (
                     <Button
                        variant="link"
                        size="sm"
                        onClick={() => setShowFullText(!showFullText)}
                        className="mt-1 p-0 h-auto font-normal"
                     >
                        {showFullText ? "See less" : "See more"}
                        <svg
                           className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                              showFullText ? "rotate-180" : ""
                           }`}
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                           />
                        </svg>
                     </Button>
                  )}
               </div>
               {(post.image || post.gift) && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                     <Image
                        src={post.image ?? post.gift ?? ""}
                        alt={post.title}
                        fill
                        className="object-cover"
                     />
                  </div>
               )}
            </div>

            <Separator className="my-4" />
            <div className="flex justify-between items-center">
               <div className="flex items-center space-x-4">
                  <Button
                     variant="ghost"
                     size="sm"
                     className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                     onClick={() => handleLikeReactionsPost("like")}
                  >
                     <HeartIcon
                        className={cn(
                           "size-5",
                           post.isLiked ? "fill-rose-500 stroke-rose-500" : "",
                        )}
                     />
                     <span className="text-sm">{post.likeCount || 0}</span>
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                     onClick={() => setPostId(post._id)}
                  >
                     <MessageSquareIcon className="size-5" />
                     <span className="text-sm">{post.commentCount || 0}</span>
                  </Button>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                  onClick={() => handleLikeReactionsPost("save")}
               >
                  {post.isSaved ? (
                     <BookmarkCheckIcon className="size-5" />
                  ) : (
                     <BookmarkIcon className="size-5" />
                  )}
               </Button>
            </div>
         </CardContent>
      </Card>
   );
};

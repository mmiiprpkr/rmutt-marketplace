import { useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/common/ui/card";
import Image from "next/image";
import { Separator } from "@/components/common/ui/separator";
import { Button } from "@/components/common/ui/button";
import {
   BookmarkCheckIcon,
   BookmarkIcon,
   EditIcon,
   Ellipsis,
   HeartIcon,
   MessageSquareIcon,
   Share2Icon,
   Trash,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useSavePost } from "@/api/communities/save-post";
import { useLikePost } from "@/api/communities/like-post";
import { cn, formatDate } from "@/lib/utils";
import { UserButton } from "@/components/common/user-button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeletePost } from "@/api/communities/use-delete-post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sendNotification } from "@/actions/send-notification";

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
   };
   userId: Id<"users"> | undefined;
};

export const PostFeed = ({ post, userId }: PostFeedProps) => {
   const router = useRouter();
   const [postId, setPostId] = useQueryState("communityPostId");

   const { mutate: savePost, isPending: savePostPending } = useSavePost();
   const { mutate: likePost, isPending: likePostPending } = useLikePost();
   const { mutateAsync: deletePost, isPending: deletePostPending } =
      useDeletePost();

   const [Confirmation, confirm] = useConfirm(
      "Are you sure you want to delete this post?",
      "Delete",
      "destructive",
   );

   const handleLikeReactionsPost = async (
      type: "like" | "save",
      postId: Id<"posts">,
   ) => {
      if (type === "save") {
         savePost({
            postId,
         });
         return;
      }

      likePost({
         postId,
      });

      if (post?.userId === userId) return;
      if (post?.isLiked) return;

      await sendNotification({
         message: "liked your post <3",
         recieverId: post.userId,
         senderId: userId!,
         title: "New Like",
         link: "",
      });
   };

   const [showFullText, setShowFullText] = useState(false);

   const handleDeletePost = async () => {
      try {
         const ok = await confirm();

         if (!ok) return;

         await deletePost({
            postId: post._id as Id<"posts">,
         });
      } catch (error) {
         toast.error("Failed to delete post");
         console.log("Failed to delete post:", error);
      }
   };

   return (
      <Card key={post._id} className="shadow-none relative">
         <Confirmation />

         {post?.userId === userId && (
            <div className="absolute top-2 right-2">
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Ellipsis className="size-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                     <DropdownMenuItem
                        onClick={() =>
                           router.push(`/community/post/${post._id}`)
                        }
                     >
                        <div className="flex items-center space-x-2">
                           <EditIcon className="size-4" />
                           <span>Edit</span>
                        </div>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={handleDeletePost}>
                        <div className="flex items-center space-x-2">
                           <Trash className="size-4" />
                           <span>Delete</span>
                        </div>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         )}

         <CardContent className="p-4">
            {/* User Info Section */}
            <CardHeader className="p-0 mb-4">
               <div className="flex items-center space-x-3">
                  <UserButton
                     imageUrl={post?.user?.image ?? ""}
                     type={userId === post.userId ? "settings" : "profile"}
                     userId1={userId}
                     userId2={post.userId}
                  />
                  <div>
                     <CardTitle className="text-sm font-medium">
                        {post?.user?.email}
                     </CardTitle>
                     <CardDescription className="text-xs">
                        {formatDate(post.createdAt)}
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>

            {/* Post Content Section */}
            <div className="space-y-4">
               <div>
                  <p
                     className={`text-base font-normal text-balance ${!showFullText ? "line-clamp-3" : ""}`}
                  >
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
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                           />
                        </svg>
                     </button>
                  )}
               </div>
               {(post.image || post.gift) && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                     <Image
                        src={post.image ?? post.gift ?? ""}
                        alt={post.title}
                        fill
                        className="object-center"
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
                     onClick={() => handleLikeReactionsPost("like", post._id)}
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
                     onClick={() => {
                        setPostId(post._id);
                     }}
                  >
                     <MessageSquareIcon className="size-5" />
                     <span className="text-sm">{post.commentCount || 0}</span>
                  </Button>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                  onClick={() => handleLikeReactionsPost("save", post._id)}
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

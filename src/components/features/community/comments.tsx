import { useRef, useState } from "react";

import dayjs from "dayjs";
import { Loader2, SendIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { Id } from "../../../../convex/_generated/dataModel";

import { useGetComments } from "@/api/communities/get-comment";
import { useCreateComment } from "@/api/communities/create-comment";

import { Input } from "@/components/common/ui/input";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import {
   Avatar,
   AvatarImage,
   AvatarFallback,
} from "@/components/common/ui/avatar";
import { Button } from "@/components/common/ui/button";
import { ResponsiveDynamic } from "@/components/common/ui/responsive-dynamic";
import useIsKeyboardOpen from "@/hooks/use-keyboard";
import { UserButton } from "@/components/common/user-button";
import { useGetCurrentUser } from "@/api/get-current-user";

const CommentItem = ({
   comment,
   level = 0,
   setReplyTo,
   imageUrl,
   userId,
   currentUserId,
}: {
   comment: any;
   level?: number;
   setReplyTo: (replyTo: string) => void;
   imageUrl?: string;
   userId: Id<"users">;
   currentUserId?: Id<"users">;
}) => {
   const [parentCommentId, setParentCommentId] =
      useQueryState("prarentCommentId");
   const [showFullText, setShowFullText] = useState(false);
   const [showReplies, setShowReplies] = useState(true);

   console.log(comment);

   return (
      <div className={`ml-${level * 1}`}>
         <div className="flex justify-between items-start">
            <div>
               <div className="flex items-start gap-2">
                  <UserButton
                     type={currentUserId === userId ? "settings" : "profile"}
                     imageUrl={imageUrl ?? ""}
                     userId1={currentUserId}
                     userId2={userId}
                  />
                  <div className="flex flex-col gap-1">
                     {comment?.user?.email}
                     <p
                        className={`text-xs md:text-base font-normal text-balance ${!showFullText ? "line-clamp-3" : ""}`}
                     >
                        {comment.content}
                     </p>
                     <p className="text-xs text-gray-500">
                        {dayjs(comment.createdAt).format("DD MMM YYYY hh:mm")}
                     </p>
                  </div>
               </div>
               {comment.content.length > 150 && (
                  <button
                     onClick={() => setShowFullText(!showFullText)}
                     className="text-blue-500 hover:text-blue-700 text-xs md:text-base mt-1 transition-colors duration-200 flex items-center gap-1"
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
            <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                  setParentCommentId(comment._id);
                  setReplyTo(comment.content);
               }}
            >
               Reply
            </Button>
         </div>

         {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-2">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
               >
                  {showReplies ? "Hide replies" : "Show replies"} (
                  {comment.replies.length})
               </Button>

               {showReplies && (
                  <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4 space-y-4">
                     {comment.replies.map((reply: any) => (
                        <CommentItem
                           key={reply._id}
                           comment={reply}
                           level={level + 1}
                           setReplyTo={setReplyTo}
                           imageUrl={reply?.user?.image}
                           userId={reply?.user?._id}
                           currentUserId={currentUserId}
                        />
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export const Comments = () => {
   const { data: userDate, isLoading: userLoading } = useGetCurrentUser();
   const [postId, setPostId] = useQueryState("communityPostId");
   const [parentCommentId, setParentCommentId] =
      useQueryState("prarentCommentId");
   const [replyTo, setReplyTo] = useState<string | null>(null);
   const [comment, setComment] = useState("");
   const inputRef = useRef<HTMLInputElement>(null);
   const isKeyboardOpen = useIsKeyboardOpen();

   const { data, isLoading } = useGetComments({
      postId: postId as Id<"posts">,
   });

   const { mutate: createComment, isPending: isCreatingComment } =
      useCreateComment();

   const handleCreateComment = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      createComment(
         {
            postId: postId as Id<"posts">,
            parentId: parentCommentId
               ? (parentCommentId as Id<"comments">)
               : null,
            content: comment,
         },
         {
            onSuccess(data, variables, context) {
               console.log("data", data);
               setComment("");
            },
            onError(error, variables, context) {
               console.log("error", error);
            },
         }
      );
   };

   const handleSetReplyTo = (replyTo: string) => {
      inputRef?.current?.focus?.();

      setReplyTo(replyTo);
   };

   const isDialogOpen = !!postId;

   const handleCloseDialog = (isOpen: boolean) => {
      setPostId(null);
      setParentCommentId(null);
   };

   return (
      <ResponsiveDynamic
         open={isDialogOpen}
         onOpenChange={handleCloseDialog}
         type={{
            mobile: "sheet",
            desktop: "sheet",
         }}
         drawer={{
            className: `min-h-[85vh] ${isKeyboardOpen && "top-3"}`,
         }}
         sheet={{
            className: "p-0 w-full md:min-w-[600px]"
         }}
      >
         <div className="overflow-y-auto h-full space-y-4 p-4 flex flex-col">
            <h3 className="text-lg font-semibold">Comments</h3>

            {isLoading ? (
               <div className="flex-1 flex justify-center items-center">
                  <Loader2 className="animate-spin" />
               </div>
            ) : (
               <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                  {Array.isArray(data) && data.length > 0 ? (
                     data.map((comment) => (
                        <CommentItem
                           key={comment._id}
                           comment={comment}
                           setReplyTo={handleSetReplyTo}
                           imageUrl={comment?.user?.image}
                           userId={comment?.user?._id}
                           currentUserId={userDate?._id}
                        />
                     ))
                  ) : (
                     <div className="flex-1 flex justify-center items-center">
                        <p>No comments found</p>
                     </div>
                  )}
               </div>
            )}

            <div className="flex flex-col">
               {parentCommentId && (
                  <div className="text-sm text-blue-500">
                     Replying to {replyTo} ...
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                           setParentCommentId(null);
                        }}
                     >
                        Cancel
                     </Button>
                  </div>
               )}
               <form
                  className="flex items-center gap-2"
                  onSubmit={handleCreateComment}
               >
                  <Input
                     ref={inputRef}
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     placeholder={
                        parentCommentId
                           ? "Write a reply..."
                           : "Write a comment..."
                     }
                     disabled={isCreatingComment || isLoading}
                  />
                  <Button
                     type="submit"
                     disabled={
                        isCreatingComment || isLoading || comment.length === 0
                     }
                  >
                     <SendIcon className="size-4" />
                  </Button>
               </form>
            </div>
         </div>
      </ResponsiveDynamic>
   );
};

import { Dispatch, SetStateAction, useState } from "react";

import dayjs from "dayjs";
import { Loader2, SendIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { Id } from "../../../../convex/_generated/dataModel";

import { useGetComments } from "@/api/communities/get-comment";
import { useCreateComment } from "@/api/communities/create-comment";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle
} from "@/components/common/ui/dialog";
import { Input } from "@/components/common/ui/input";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import {
   Avatar,
   AvatarImage,
   AvatarFallback
} from "@/components/common/ui/avatar";
import { Button } from "@/components/common/ui/button";
import { Drawer, DrawerTitle, DrawerHeader, DrawerContent } from "@/components/common/ui/drawer";
import { ResponsiveDynamic } from "@/components/common/ui/responsive-dynamic";
import { useKeyboardVisibility } from "@/hooks/use-keyboard-show-up";

const CommentItem = ({
   comment,
   level = 0,
   setReplyTo,
}: {
   comment: any;
   level?: number;
   setReplyTo: Dispatch<SetStateAction<string | null>>
}) => {
   const [parentCommentId, setParentCommentId] = useQueryState("prarentCommentId");
   const [showFullText, setShowFullText] = useState(false);
   const [showReplies, setShowReplies] = useState(true);

   return (
      <div className={`ml-${level * 1}`}>
         <div className="flex justify-between items-start">
            <div>
               <div className="flex items-start gap-2">
                  <Avatar>
                     <AvatarImage src={comment?.user?.image} />
                     <AvatarFallback>{comment?.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                     <p className={`text-base font-normal text-balance ${!showFullText ? "line-clamp-3" : ""}`}>
                        {comment.content}
                     </p>
                     <p className="text-sm text-gray-500">
                        {dayjs(comment.createdAt).format("DD MMM YYYY hh:mm")}
                     </p>
                  </div>
               </div>
               {comment.content.length > 150 && (
                  <button
                     onClick={() => setShowFullText(!showFullText)}
                     className="text-blue-500 hover:text-blue-700 text-sm mt-1 transition-colors duration-200 flex items-center gap-1"
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
                  {showReplies ? "Hide replies" : "Show replies"} ({comment.replies.length})
               </Button>

               {showReplies && (
                  <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4 space-y-4">
                     {comment.replies.map((reply: any) => (
                        <CommentItem
                           key={reply._id}
                           comment={reply}
                           level={level + 1}
                           setReplyTo={setReplyTo}
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
   const [postId, setPostId] = useQueryState("communityPostId");
   const [parentCommentId, setParentCommentId] = useQueryState("prarentCommentId");
   const [replyTo, setReplyTo] = useState<string | null>(null);
   const [comment, setComment] = useState("");

   const isKeyboardVisible = useKeyboardVisibility();

   const { data, isLoading } = useGetComments({
      postId: postId as Id<"posts">,
   });

   const {
      mutate: createComment,
      isPending: isCreatingComment,
   } = useCreateComment();

   const handleCreateComment = (content: string) => {
      createComment({
         postId: postId as Id<"posts">,
         parentId: parentCommentId ? (parentCommentId as Id<"comments">) : null,
         content,
      }, {
         onSuccess(data, variables, context) {
            console.log("data", data);
            setComment("");
         },
         onError(error, variables, context) {
            console.log("error", error);
         },
      });
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
            mobile: "drawer",
            desktop: "dialog",
         }}
         dialog={{
            className: "max-w-[600px]",
         }}
      >
         <div className="p-4 space-y-4" key={parentCommentId}>
            <h3 className="text-lg font-semibold">
               Comments
            </h3>

            {isLoading ? (
               <div className="flex justify-center items-center h-[250px]">
                  <Loader2 className="animate-spin" />
               </div>
            ) : (
               <div className="min-h-[250px]">
                  <ScrollArea className="h-[250px] md:h-[400px]">
                     {Array.isArray(data) && data.length > 0 ? (
                        data.map((comment) => (
                           <CommentItem
                              key={comment._id}
                              comment={comment}
                              setReplyTo={setReplyTo}
                           />
                        ))
                     ) : (
                        <div className="flex justify-center items-center h-[250px]">
                           <p>No comments found</p>
                        </div>
                     )}
                  </ScrollArea>
               </div>
            )}

            <div className="flex flex-col gap-4 mt-4">
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
               <div className="flex items-center gap-2">
                  <Input
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
                     disabled={isCreatingComment || isLoading}
                  />
                  <Button
                     disabled={isCreatingComment || isLoading || comment.length === 0}
                     onClick={() => handleCreateComment(comment)}
                  >
                     <SendIcon className="size-4"/>
                  </Button>
               </div>
            </div>
         </div>
      </ResponsiveDynamic>
   );
};
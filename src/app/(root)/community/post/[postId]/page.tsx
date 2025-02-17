"use client";

import { useGetPostById } from "@/api/communities/get-post-by-id";
import { useUpdatePost } from "@/api/communities/use-update-post";
import { usePostId } from "@/hooks/use-postId";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

import { z } from "zod";
import { useRouter } from "next/navigation";

export const updatePostValidation = z.object({
   title: z.string().min(1, "Title is required"),
});

export type UpdatePostValidation = z.infer<typeof updatePostValidation>;

const PostIdPage = () => {
   const postId = usePostId();
   const router = useRouter();

   const { data: post, error } = useGetPostById({
      postId: postId!,
   });

   const { mutateAsync: updatePost, isPending } = useUpdatePost();

   const form = useForm<UpdatePostValidation>({
      resolver: zodResolver(updatePostValidation),
      values: {
         title: post?.title || "",
      },
   });

   const isSubmitting = isPending || form.formState.isSubmitting;
   const errors = form.formState.errors;

   const handleUpdatePost = async (data: UpdatePostValidation) => {
      try {
         await updatePost({
            postId: postId!,
            content: data.title,
         });
         toast.success("Post updated successfully");
         router.back();
      } catch (error) {
         toast.error("Failed to update post");
         console.error(error);
      }
   };

   if (error) {
      return <div>Error loading post: {error.message}</div>;
   }

   if (!post) {
      return <div>Loading...</div>;
   }

   return (
      <div className="max-w-3xl mx-auto h-[calc(100vh-60px)] p-4">
         <form
            onSubmit={form.handleSubmit(handleUpdatePost)}
            className="space-y-6"
         >
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-semibold mb-6">Update post</h3>
               <Button
                  type="submit"
                  className="w-fit py-6 text-lg font-medium"
                  disabled={isSubmitting}
               >
                  {isSubmitting ? "Updating..." : "Update Post"}
               </Button>
            </div>

            <Controller
               control={form.control}
               name="title"
               render={({ field }) => {
                  return (
                     <TextareaAutosize
                        {...field}
                        minRows={3}
                        maxRows={10}
                        placeholder="Type your text here..."
                        style={{
                           width: "100%",
                           padding: "12px",
                           fontSize: "16px",
                        }}
                        className={cn(
                           "resize-none outline-none right-0 border-none shadow-sm focus:outline-primary rounded-lg focus:outline-1",
                           errors?.title &&
                              "border-destructive focus:outline-destructive",
                        )}
                        disabled={isSubmitting}
                     />
                  );
               }}
            />

            {/* Display existing media */}
            {post.image && (
               <div className="mt-4">
                  <img
                     src={post.image}
                     alt="Post image"
                     className="max-w-[400px] rounded-xl"
                  />
               </div>
            )}
            {post.gift && (
               <div className="mt-4">
                  <img
                     src={post.gift}
                     alt="Post gif"
                     className="max-w-[400px] rounded-xl"
                  />
               </div>
            )}
         </form>
      </div>
   );
};

export default PostIdPage;

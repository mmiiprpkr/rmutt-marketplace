"use client";

import { usePostId } from "@/hooks/use-postId";

const PostIdPage = () => {
   const postId = usePostId();

   if (!postId) {
      return null;
   }

   return (
      <div>

      </div>
   );
};

export default PostIdPage;
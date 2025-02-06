import { Button } from "@/components/common/ui/button";
import { useCreatePostStore } from "@/stores/use-create-post-store";
import { useRouter } from "next/navigation";

interface CreatePostButtonProps {
   redirect: string;
}

export const CreatePostButton = ({ redirect }:CreatePostButtonProps) => {
   const router = useRouter();
   const { isOpen, onOpen } = useCreatePostStore();

   return (
      <>
         <Button type="button" onClick={() => onOpen("createPost")} disabled={isOpen} size="lg" className="hidden md:block">
            Create Post
         </Button>
         <Button type="button" onClick={() => router.push(redirect)} size="lg" className="md:hidden">
            Create Post
         </Button>
      </>
   );
};

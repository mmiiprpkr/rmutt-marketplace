import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

type UserAvatarProps = {
   imageUrl?: string;
}

export const UserAvatar = ({
   imageUrl,
}: UserAvatarProps) => {
   return (
      <Avatar>
         <AvatarImage src={imageUrl} className="size-10 rounded-full" alt="@shadcn" />
         <AvatarFallback>
            <Skeleton className="size-6 rounded-full" />
         </AvatarFallback>
      </Avatar>
   );
};

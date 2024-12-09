import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const UserAvatar = () => {
  return (
    <Avatar>
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
    </Avatar>
  );
};
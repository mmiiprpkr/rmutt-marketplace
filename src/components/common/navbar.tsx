import { Bell, MessageSquare, Store } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";

export const Navbar = () => {
   return (
      <div className="flex justify-between items-center p-4">
         <h1 className="text-2xl font-bold">RMUTT Marketplace</h1>
         <div className="flex items-center space-x-4">
            <Button variant="ghost">
               <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost">
               <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost">
               <Store className="w-5 h-5" />
            </Button>
            <UserButton />
         </div>
      </div>
   );
};

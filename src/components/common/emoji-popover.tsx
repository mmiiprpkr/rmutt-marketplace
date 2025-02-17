import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPopoverProps {
   children: React.ReactNode;
   onEmojiSelect: (emoji: any) => void;
}

export const EmojiPopover = ({
   children,
   onEmojiSelect,
}: EmojiPopoverProps) => {
   const [open, setOpen] = useState(false);

   const onSelect = (emoji: any) => {
      onEmojiSelect(emoji);
      setOpen(false);
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>{children}</PopoverTrigger>
         <PopoverContent className="p-0 w-full border-none shadow-none">
            <Picker data={data} onEmojiSelect={onSelect} />
         </PopoverContent>
      </Popover>
   );
};

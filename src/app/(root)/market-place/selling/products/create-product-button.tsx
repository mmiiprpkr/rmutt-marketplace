import { Button } from "@/components/common/ui/button"
import Link from "next/link";

interface CreateProductButtonProps {
   redirectTo: string;
}

export const CreateProductButton = ({
   redirectTo,
}: CreateProductButtonProps) => {
   return (
      <div>
         <Button
            type="button"
            className="hidden md:block"
         >
            Create Product
         </Button>
         <Link href={redirectTo}>
            <Button
               type="button"
               className="md:hidden"
            >
               Create Product
            </Button>
         </Link>
      </div>
   )
}
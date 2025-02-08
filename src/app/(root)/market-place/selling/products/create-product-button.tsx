import { Button } from "@/components/common/ui/button"
import { useProductController } from "@/stores/use-product-controller";
import Link from "next/link";

interface CreateProductButtonProps {
   redirectTo: string;
}

export const CreateProductButton = ({
   redirectTo,
}: CreateProductButtonProps) => {
   const { onOpen } = useProductController();
   return (
      <div>
         <Button
            type="button"
            className="hidden md:block"
            onClick={() => onOpen(null, "create")}
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
import { useMediaQuery } from "usehooks-ts";

export function useIsMobile() {
   return useMediaQuery("(max-width: 768px)");
}

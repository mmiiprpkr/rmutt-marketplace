class ColorMapper {
   public getOrderStatusColor(
      status: "pending" | "accepted" | "rejected" | "completed" | "cancelled",
   ) {
      switch (status) {
         case "pending":
            return "bg-[#FFF9C4]! text-[#F9A825]!";
         case "accepted":
            return "bg-[#E3F2FD]! text-[#0057B2]!";
         case "cancelled":
            return "bg-[#FEEBEE]! text-[#B23842]!";
         case "completed":
            return "bg-[#E8F5E9]! text-[#388E3C]!";
         default:
            return "bg-[#FEEBEE]! text-[#B23842]!";
      }
   }
}

export const colorMapper = new ColorMapper();

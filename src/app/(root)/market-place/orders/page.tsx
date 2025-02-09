"use client";

import { useGetOrder } from "@/api/market-place/order/use-get-order";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const MyOrderPage = () => {
   const {
      data: orderData,
      isLoading: orderLoading,
      error: orderError,
   } = useGetOrder();

   if (orderError) {
      throw new Error(orderError?.message)
   }

   return (
      <div className="p-4">
         {orderLoading ? (
            <p>Loading...</p>
         ) : (
            <DataTable
               columns={columns}
               data={orderData || []}
            />
         )}
      </div>
   );
};

export default MyOrderPage;

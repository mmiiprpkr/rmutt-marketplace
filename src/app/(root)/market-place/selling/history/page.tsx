"use client";

import { useGetStats } from "@/api/market-place/product/use-get-stats";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/common/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/common/ui/select";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/common/ui/tabs";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";
import {
   Loader2,
   DollarSign,
   ShoppingCart,
   Package,
   Archive,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/common/ui/table";

const timeRanges = [
   { label: "This Month", value: "current" },
   { label: "Last Month", value: "last" },
   { label: "Last 3 Months", value: "last3" },
];

export default function StatsPage() {
   const [selectedRange, setSelectedRange] = useState("current");

   const getDateRange = () => {
      const now = new Date();
      switch (selectedRange) {
         case "last":
            return {
               start: startOfMonth(subMonths(now, 1)).toISOString(),
               end: endOfMonth(subMonths(now, 1)).toISOString(),
            };
         case "last3":
            return {
               start: startOfMonth(subMonths(now, 3)).toISOString(),
               end: endOfMonth(now).toISOString(),
            };
         default:
            return {
               start: startOfMonth(now).toISOString(),
               end: endOfMonth(now).toISOString(),
            };
      }
   };

   const { data, isLoading } = useGetStats(getDateRange());

   console.log(data)

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
         </div>
      );
   }

   const orderStatusData = [
      {
         name: "Pending",
         orders: data?.orders.ordersByStatus.pending || 0,
         revenue: data?.orders.revenueByStatus.pending || 0,
      },
      {
         name: "Accepted",
         orders: data?.orders.ordersByStatus.accepted || 0,
         revenue: data?.orders.revenueByStatus.accepted || 0,
      },
      {
         name: "Completed",
         orders: data?.orders.ordersByStatus.completed || 0,
         revenue: data?.orders.revenueByStatus.completed || 0,
      },
      {
         name: "Cancelled",
         orders: data?.orders.ordersByStatus.cancelled || 0,
         revenue: data?.orders.revenueByStatus.cancelled || 0,
      },
   ];

   const productTypeData = [
      { name: "Food", value: data?.products.byType.food || 0 },
      { name: "Goods", value: data?.products.byType.goods || 0 },
   ];

   return (
      <div className="container mx-auto py-10 px-4">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
               Selling History
            </h1>
            <Select value={selectedRange} onValueChange={setSelectedRange}>
               <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
               </SelectTrigger>
               <SelectContent>
                  {timeRanges.map((range) => (
                     <SelectItem key={range.value} value={range.value}>
                        {range.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     {data?.orders.totalOrders || 0}
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     ${data?.orders.totalRevenue.toFixed(2) || "0.00"}
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Active Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     {data?.products.byStatus.available || 0}
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                     Total Products
                  </CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     {data?.products.total || 0}
                  </div>
               </CardContent>
            </Card>
         </div>

         <Tabs defaultValue="orders" className="mt-8">
            <TabsList>
               <TabsTrigger value="orders">Orders</TabsTrigger>
               <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Orders by Status</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                     <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={orderStatusData}>
                           <XAxis
                              dataKey="name"
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                           />
                           <YAxis
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `$${value}`}
                           />
                           <Bar
                              dataKey="orders"
                              fill="hsl(var(--primary))"
                              radius={[4, 4, 0, 0]}
                           />
                           <Bar
                              dataKey="revenue"
                              fill="hsl(var(--secondary))"
                              radius={[4, 4, 0, 0]}
                           />
                        </BarChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>
            </TabsContent>
            <TabsContent value="products" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Product Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={productTypeData}>
                           <XAxis
                              dataKey="name"
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                           />
                           <YAxis
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                           />
                           <Bar
                              dataKey="value"
                              fill="hsl(var(--primary))"
                              radius={[4, 4, 0, 0]}
                           />
                        </BarChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>

         {data?.topProducts && data.topProducts.length > 0 && (
            <Card className="mt-8">
               <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Product</TableHead>
                           <TableHead className="text-right">Orders</TableHead>
                           <TableHead className="text-right">
                              Quantity
                           </TableHead>
                           <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {data.topProducts.map((product) => (
                           <TableRow key={product?._id}>
                              <TableCell className="font-medium">
                                 {product?.name || "unknown product"}
                              </TableCell>
                              <TableCell className="text-right">
                                 {product?.totalOrders || 0}
                              </TableCell>
                              <TableCell className="text-right">
                                 {product?.totalQuantity || 0}
                              </TableCell>
                              <TableCell className="text-right">
                                 ${product?.totalRevenue?.toFixed(2) || "0.00"}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         )}
      </div>
   );
}

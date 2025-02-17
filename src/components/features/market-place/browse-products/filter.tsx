"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import Select from "react-select";
import { Label } from "@/components/common/ui/label";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { X } from "lucide-react";
import { useGetCategory } from "@/api/market-place/category/use-get-category";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PRODUCT_TYPES = [
   { value: "food", label: "Food" },
   { value: "goods", label: "Goods" },
];

export const ProductFilter = () => {
   const [filter, setFilter] = useQueryStates({
      type: parseAsString,
      maxPrice: parseAsInteger,
      minPrice: parseAsInteger,
      category: parseAsString,
   });

   const { data: categoryData, isLoading: categoryLoading } = useGetCategory();

   // Transform category data to react-select format
   const categoryOptions =
      categoryData?.map((cat) => ({
         value: cat.name,
         label: cat.name,
      })) || [];

   const handleChange = (key: string, value: string | number | null) => {
      setFilter({
         ...filter,
         [key]: value,
      });
   };

   const handleClearFilters = () => {
      setFilter({
         type: null,
         maxPrice: null,
         minPrice: null,
         category: null,
      });
   };

   return (
      <div className="space-y-6 bg-card text-card-foreground shadow-lg rounded-lg p-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Button
               variant="ghost"
               size="sm"
               onClick={handleClearFilters}
               className="text-muted-foreground hover:text-primary transition-colors"
            >
               <X className="h-4 w-4 mr-2" />
               Clear all
            </Button>
         </div>

         <div className="space-y-6">
            {/* Product Type Filter */}
            <div className="space-y-2 relative">
               {" "}
               {/* Add relative positioning */}
               <Label className="text-sm font-medium z-10">Product Type</Label>
               <Select
                  options={PRODUCT_TYPES}
                  value={
                     PRODUCT_TYPES.find((type) => type.value === filter.type) ||
                     null
                  }
                  onChange={(option) =>
                     handleChange("type", option?.value || null)
                  }
                  isClearable
                  placeholder="Select type"
                  styles={{
                     control: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: "hsl(var(--background))",
                     }),
                     menu: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                     }),
                     option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isFocused
                           ? "hsl(var(--accent))"
                           : "hsl(var(--background))",
                        color: state.isFocused
                           ? "hsl(var(--accent-foreground))"
                           : "hsl(var(--foreground))",
                        "&:active": {
                           backgroundColor: "hsl(var(--accent))",
                        },
                     }),
                     input: (baseStyles) => ({
                        ...baseStyles,
                        color: "hsl(var(--foreground))",
                     }),
                     singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "hsl(var(--foreground))",
                     }),
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
               />
            </div>

            {/* Category Filter */}
            <div className="space-y-2 relative">
               {" "}
               {/* Add relative positioning */}
               <Label className="text-sm font-medium z-10">Category</Label>
               <Select
                  options={categoryOptions}
                  value={
                     categoryOptions.find(
                        (cat) => cat.value === filter.category,
                     ) || null
                  }
                  onChange={(option) =>
                     handleChange("category", option?.value || null)
                  }
                  isClearable
                  isSearchable
                  isLoading={categoryLoading}
                  placeholder="Select category"
                  styles={{
                     control: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: "hsl(var(--background))",
                     }),
                     menu: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                     }),
                     option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isFocused
                           ? "hsl(var(--accent))"
                           : "hsl(var(--background))",
                        color: state.isFocused
                           ? "hsl(var(--accent-foreground))"
                           : "hsl(var(--foreground))",
                        "&:active": {
                           backgroundColor: "hsl(var(--accent))",
                        },
                     }),
                     input: (baseStyles) => ({
                        ...baseStyles,
                        color: "hsl(var(--foreground))",
                     }),
                     singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "hsl(var(--foreground))",
                     }),
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
               />
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
               <Label className="text-sm font-medium z-0">Price Range</Label>
               <div className="grid grid-cols-2 gap-4">
                  <Input
                     type="number"
                     placeholder="Min"
                     value={filter.minPrice || ""}
                     onChange={(e) =>
                        handleChange(
                           "minPrice",
                           e.target.value ? parseInt(e.target.value) : null,
                        )
                     }
                     className="w-full"
                  />
                  <Input
                     type="number"
                     placeholder="Max"
                     value={filter.maxPrice || ""}
                     onChange={(e) =>
                        handleChange(
                           "maxPrice",
                           e.target.value ? parseInt(e.target.value) : null,
                        )
                     }
                     className="w-full"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

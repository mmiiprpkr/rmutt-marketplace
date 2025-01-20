import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      currencyDisplay: "code",
   }).format(price);
}

export function formatDate(date: string) {
   return dayjs(date).format("DD MMM YYYY HH:mm");
}